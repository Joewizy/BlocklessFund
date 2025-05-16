"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConfig, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import { formatUnits } from "viem";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CampaignCardProps } from "@/utils/interfaces";
import { parseTokenAmount } from "@/utils/conversionUtils";
import { checkCngnBalance } from "@/utils/contracts/cNGN";
import { crowdfundingAbi, crowdfundingAddress, cNGNAdbi, cNGNAddress } from "@/constants";
import { RawCampaignData, transformCampaignData } from "@/utils/transformers";

interface CampaignCardPropsWithUpdate extends CampaignCardProps {
  onUpdate: (updatedCampaign: CampaignCardProps) => void;
}

const CampaignCard = ({
  id,
  title,
  description,
  imageUrl,
  creator,
  raisedAmount,
  goalAmount,
  daysLeft,
  category,
  completed,
  onUpdate,
}: CampaignCardPropsWithUpdate) => {
  const navigate = useNavigate();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const { address: currentUser } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [userBalance, setUserBalance] = useState<bigint | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTxError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const numericGoal = Number(goalAmount);
  const numericRaised = Number(raisedAmount);
  const progressPercentage = Math.min((numericRaised / numericGoal) * 100, 100);
  const formattedCreator = `${creator.slice(0, 6)}...${creator.slice(-4)}`;
  const isCampaignEnded = daysLeft <= 0;
  const isCreator = currentUser?.toLowerCase() === creator.toLowerCase();

  useEffect(() => {
    if (isConfirmed) {
      handleTransactionSuccess();
    } else if (isTxError) {
      handleTransactionError();
    }
  }, [isConfirmed, isTxError]);

  const handleTransactionSuccess = async () => {
    try {
      const updatedData = await readContract(config, {
        abi: crowdfundingAbi,
        address: crowdfundingAddress,
        functionName: "getCampaign",
        args: [BigInt(id)],
      }) as RawCampaignData;

      const updatedCampaign = transformCampaignData(updatedData, BigInt(id), imageUrl);
      onUpdate(updatedCampaign);
      toast.success("Transaction confirmed!");
    } catch (error) {
      console.error("Failed to fetch updated campaign:", error);
      toast.error("Failed to refresh campaign data");
    }

    setIsModalOpen(false);
    setDonationAmount("");
    setTxHash(null);
  };

  const handleTransactionError = () => {
    toast.error("Transaction failed!");
    setTxHash(null);
  };

  const handleDonateClick = async () => {
    if (!currentUser) {
      toast.warning("Please connect your wallet.");
      return;
    }

    try {
      const balance = await checkCngnBalance(config, currentUser);
      setUserBalance(balance);

      if (balance === 0n) {
        toast.warning("You cannot donate — you have 0 cNGN.");
        return;
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch token balance:", err);
      toast.error("Could not check token balance.");
    }
  };

  const handleDonateConfirm = async () => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    const formattedAmount = parseTokenAmount(amount, 18);

    if (userBalance !== null && formattedAmount > userBalance) {
      toast.error("Insufficient cNGN balance for this donation.");
      return;
    }

    await donateToCampaign(Number(id), amount);
  };

  const handleWithdraw = async () => {
    await withdrawFromCampaign(Number(id));
  };

  const getApprovedAmount = async (): Promise<bigint> => {
    return await readContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress as `0x${string}`,
      functionName: "allowance",
      args: [currentUser, crowdfundingAddress],
    }) as bigint;
  };

  const donateToCampaign = async (campaignId: number, amount: number) => {
    try {
      const formattedAmount = parseTokenAmount(amount, 18);
      const approved = await getApprovedAmount();

      if (approved < formattedAmount) {
        const approvalHash = await writeContractAsync({
          abi: cNGNAdbi,
          address: cNGNAddress as `0x${string}`,
          functionName: "approve",
          args: [crowdfundingAddress as `0x${string}`, formattedAmount],
        });

        await waitForTransactionReceipt(config, { hash: approvalHash });
        toast.success("Token approval successful");
      }

      const hash = await writeContractAsync({
        abi: crowdfundingAbi,
        address: crowdfundingAddress as `0x${string}`,
        functionName: "donate",
        args: [BigInt(campaignId), formattedAmount],
      });

      setTxHash(hash);
    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error(`Donation failed: ${error.message}`);
    }
  };

  const withdrawFromCampaign = async (campaignId: number) => {
    try {
      const hash = await writeContractAsync({
        abi: crowdfundingAbi,
        address: crowdfundingAddress as `0x${string}`,
        functionName: "withdrawFunds",
        args: [BigInt(campaignId)],
      });

      setTxHash(hash);
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error(`Withdrawal failed: ${error.message}`);
    }
  };

  return (
    <div className="relative bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col group">

      {/* Status Banner */}
      {isCampaignEnded && (
        <div className={`absolute top-0 left-0 w-full text-white text-xs text-center py-1 z-10 ${
          completed
            ? (numericRaised >= numericGoal ? "bg-emerald-600" : "bg-red-500") 
            : (numericRaised >= numericGoal ? "bg-yellow-500" : "bg-red-500") 
        }`}>
          {completed
            ? (numericRaised >= numericGoal
                ? "🎉 Campaign Ended - Funded Successfully" 
                : "⚠️ Campaign Ended - Funded but Goal Not Met") 
            : (numericRaised >= numericGoal
                ? "⌛ Campaign Ended - Awaiting Withdrawal"
                : "⚠️ Campaign Ended - Goal Not Reached") 
          }
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden grayscale-[20%] group-hover:grayscale-0 transition">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => ((e.target as HTMLImageElement).src = "/default-campaign.jpg")}
        />
        <div className="absolute bottom-3 left-3 bg-white/80 text-gray-800 text-xs px-2 py-1 rounded shadow-sm">
          {category}
        </div>
      </div>

      {/* Progress and Metrics */}
      <div className="p-4 border-b">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-fundngn-green">{numericRaised.toLocaleString()} cNGN</span>
          <span className="text-gray-500">of {numericGoal.toLocaleString()} cNGN</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Title and Description */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>
      </div>

      {/* Creator Info */}
      <div className="px-4 pb-4 text-sm text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-fundngn-green/10 flex items-center justify-center text-xs font-bold text-fundngn-green">
            {creator[0]?.toUpperCase() || "?"}
          </div>
          <span title={creator}>{formattedCreator}</span>
        </div>
        <span className="text-xs">
          {isCampaignEnded ? "Ended" : `${daysLeft} days left`}
        </span>
      </div>

      {/* CTA Button */}
      {isCampaignEnded ? (
        isCreator && numericRaised >= numericGoal && !completed && (
          <Button
            onClick={handleWithdraw}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isConfirming}
          >
            {isConfirming ? "Processing..." : "Withdraw Funds"}
          </Button>
        )
      ) : (
        <Button
          onClick={handleDonateClick}
          className="w-full bg-fundngn-green hover:bg-fundngn-green/90"
          disabled={isConfirming}
        >
          {isConfirming ? "Processing..." : "Donate"}
        </Button>
      )}

      {/* Donation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {title}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter donation amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-between">
            <Button onClick={handleDonateConfirm} className="w-full">
              Confirm Donation
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignCard;
