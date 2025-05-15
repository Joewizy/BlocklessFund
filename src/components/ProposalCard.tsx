import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, MessageSquare, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProposalProps } from "@/utils/interfaces";
import { cn } from "@/lib/utils";
import { getProposalById } from "@/utils/contracts/crowdfunding";
import { transformProposalData } from "@/utils/transformers";
import { useConfig } from "wagmi";
import { voteOnProposal } from "@/utils/contracts/crowdfunding";
import { useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { checkCngnBalance } from "@/utils/contracts/cNGN";
import { useAccount } from "wagmi";
import { hasVoted } from "@/utils/contracts/crowdfunding";

interface ProposalCardProps extends ProposalProps {
  onUpdate: (updatedProposal: ProposalProps) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  proposer,
  title,
  description,
  goal,
  startTime,
  deadline,
  votesFor,
  votesAgainst,
  executed,
  active,
  commentCount,
  status,
  onUpdate,
}) => {
  const account = useAccount();
  const config = useConfig();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const { data: txReceipt, isLoading: isWaiting, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });

  const numericGoal = Number(goal);
  const numericVotesFor = Number(votesFor);
  const numericVotesAgainst = Number(votesAgainst);
  const totalVotes = numericVotesFor + numericVotesAgainst;
  const forPercentage = totalVotes > 0 ? (numericVotesFor / totalVotes) * 100 : 50;

  // Date conversions
  const startDate = new Date(Number(startTime) * 1000);
  const endDate = new Date(Number(deadline) * 1000);
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  useEffect(() => {
    if (isSuccess) {
      console.log(`Transaction confirmed for proposal ${id}, fetching updated data`);
      toast.success("Vote submitted!");
      const fetchUpdatedProposal = async () => {
        try {
          const updatedProposalData = await getProposalById(config, Number(id));
          const updatedProposal = transformProposalData(updatedProposalData);
          onUpdate(updatedProposal);
          setTxHash(null);
        } catch (err) {
          console.error("Failed to fetch updated proposal", err);
        }
      };
      fetchUpdatedProposal();
    } else if (isError) {
      console.error(`Transaction failed for proposal ${id}`);
      toast.error("Vote failed!");
      setTxHash(null);
    }
  }, [isSuccess, isError, config, id, onUpdate]);
  
  async function handleVote(vote: boolean) {
    const voted = await hasVoted(config, Number(id), account.address)
    const balance = await checkCngnBalance(config, account.address)
    console.log("user balance:", balance)
    console.log(`${account.address} has voted =${voted}`)
    if (voted) {
      toast.warning("You have already voted for this proposal")
      return
    }
    
    if (Number(balance) == 0) {
      toast.warning("You have no cNGN tokens please fund wallet");
      return
    }
    
    try {
      console.log(`Voting on proposal ${id} with vote: ${vote}`);
      const result = await voteOnProposal(config, Number(id), vote);
      console.log("Transaction hash set:", result);
      setTxHash(result);
    } catch (err) {
      console.error("Voting failed", err);
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            <Clock className="h-3 w-3 mr-1" /> Voting Period
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <Check className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge>Unknown Status</Badge>;
    }
  };

  const timeRemaining = () => {
    if (status !== "active") return null;

    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft <= 0) return "Voting ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`;
    return `${hours} hour${hours !== 1 ? "s" : ""} left`;
  };

  // Custom vote progress bar
  const VoteProgressBar = () => (
    <div className="relative h-2 w-full mt-4 mb-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      {totalVotes === 0 ? (
        <div className="absolute top-0 left-0 h-full w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
      ) : (
        <>
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-l-full"
            style={{ width: `${forPercentage}%` }}
          />
          <div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-400 to-red-500 rounded-r-full"
            style={{ width: `${100 - forPercentage}%`, left: `${forPercentage}%` }}
          />
        </>
      )}
    </div>
  );

  return (
    <Card className="w-full overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="pt-2 flex items-center justify-between text-sm">
          <span title={proposer} className="flex items-center gap-1">
            Proposed by <span className="font-medium">{formattedProposer}</span>
          </span>
          <div className="flex items-center text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            Goal: {numericGoal.toLocaleString()} cNGN
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">{description}</p>

        {status === "active" && (
          <div className="flex items-center justify-end mt-1 text-sm font-medium text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1.5 inline" />
            {timeRemaining()}
          </div>
        )}

        <VoteProgressBar />

        <div className="flex justify-between items-center text-sm font-medium px-1">
          <div className="flex items-center">
            <ArrowUp className="h-4 w-4 mr-1.5 text-green-500" />
            <span>{numericVotesFor.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <ArrowDown className="h-4 w-4 mr-1.5 text-red-500" />
            <span>{numericVotesAgainst.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 flex flex-wrap gap-2 justify-between border-t border-gray-100 dark:border-gray-800">
        <Button variant="outline" size="sm" className="text-xs gap-1.5 text-gray-500 hover:text-gray-700">
          <MessageSquare className="h-3.5 w-3.5" /> {commentCount} Comments
        </Button>

        {status === "active" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="text-white bg-green-500 hover:bg-green-600 gap-1.5 px-4"
                onClick={() => handleVote(true)}
                disabled={isWaiting}
              >
                <ArrowUp className="h-3.5 w-3.5" /> Vote For
              </Button>
              <Button
                size="sm"
                className="text-white bg-red-500 hover:bg-red-600 gap-1.5 px-4"
                onClick={() => handleVote(false)}
                disabled={isWaiting}
              >
                <ArrowDown className="h-3.5 w-3.5" /> Vote Against
              </Button>
            </div>
            {isWaiting && <div className="text-sm text-gray-500">Waiting for transaction...</div>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;