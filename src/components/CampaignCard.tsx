"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { toast } from "sonner";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { CampaignCardProps } from "@/utils/interfaces";
import { parseTokenAmount } from "@/utils/conversionUtils";
import { crowdfundingAbi, crowdfundingAddress, cNGNAdbi, cNGNAddress } from "@/constants";

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
  onDonate,
  onWithdraw,
}: CampaignCardProps) => {
  const navigate = useNavigate();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const { address: currentUser } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const numericGoal = Number(goalAmount);
  const numericRaised = Number(raisedAmount) / 10 ** 18;
  const progressPercentage = Math.min((numericRaised / numericGoal) * 100, 100);
  const formattedCreator = `${creator.slice(0, 6)}...${creator.slice(-4)}`;

  const handleDonateClick = () => setIsModalOpen(true);

  const handleDonateConfirm = async () => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    await donateToCampaign(Number(id), amount);
    setIsModalOpen(false);
    setDonationAmount("");
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

      const txHash = await writeContractAsync({
        abi: crowdfundingAbi,
        address: crowdfundingAddress as `0x${string}`,
        functionName: "donate",
        args: [BigInt(campaignId), formattedAmount],
      });

      await waitForTransactionReceipt(config, { hash: txHash });
      toast.success("Donation successful!");
      onDonate?.();
      setTimeout(() => {
        navigate("/campaigns");
      }, 4000);
    } catch (error: any) {
      console.error("Donation error:", error);
      toast.error(`Donation failed: ${error.message}`);
    }
  };

  const withdrawFromCampaign = async (campaignId: number) => {
    try {
      const txHash = await writeContractAsync({
        abi: crowdfundingAbi,
        address: crowdfundingAddress as `0x${string}`,
        functionName: "withdrawFunds",
        args: [BigInt(campaignId)],
      });

      await waitForTransactionReceipt(config, { hash: txHash });
      toast.success("Funds withdrawn successfully!");
      onWithdraw?.();
      setTimeout(() => {
        navigate("/campaigns");
      }, 4000);
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error(`Withdrawal failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-campaign.jpg";
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-fundngn-green/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>

        {/* Goal Reached badge */}
        {numericRaised >= numericGoal && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Goal Reached
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">{numericRaised.toLocaleString("en-US")} cNGN</span>
            <span className="text-gray-600">of {numericGoal.toLocaleString("en-US")} cNGN</span>
          </div>

          <Progress value={progressPercentage} className="h-2 mb-3" />

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-fundngn-green/10 flex items-center justify-center mr-1">
                <span className="text-xs font-semibold text-fundngn-green">
                  {creator[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <span title={creator}>{formattedCreator}</span>
            </div>
            <span>
              {daysLeft} day{daysLeft === 1 ? "" : "s"} left
            </span>
          </div>

          <div className="flex gap-2">
            {!completed ? (
              <Button
                onClick={handleDonateClick}
                className="w-full bg-fundngn-green hover:bg-fundngn-green/90"
              >
                Donate
              </Button>
            ) : currentUser === creator ? (
              <Button
                onClick={handleWithdraw}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Withdraw Funds
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Donation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Amount in cNGN"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <Button onClick={handleDonateConfirm}>Confirm Donation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignCard;
