import React, { useState, useEffect } from "react";
import { useAccount, useConfig } from "wagmi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProposalCard from "@/components/ProposalCard";
import { ProposalProps } from "@/utils/interfaces";
import { hasVoted } from "@/utils/contracts/crowdfunding";

interface MyVotesProps {
  proposals: ProposalProps[];
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const MyVotes: React.FC<MyVotesProps> = ({ proposals, setActiveTab }) => {
  const { address } = useAccount();
  const config = useConfig();
  const [votedProposals, setVotedProposals] = useState<ProposalProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVotedProposals() {
      if (!address || proposals.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const votedProposalPromises = proposals.map(async (proposal) => {
          const hasUserVoted = await hasVoted(config, Number(proposal.id), address);
          return { ...proposal, hasVoted: hasUserVoted };
        });

        const results = await Promise.all(votedProposalPromises);
        const filteredResults = results.filter((proposal) => proposal.hasVoted);
        
        setVotedProposals(filteredResults);
      } catch (error) {
        console.error("Error fetching voted proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVotedProposals();
  }, [address, proposals, config]);

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading your votes...</p>
      </div>
    );
  }

  // Show message when no votes are found
  if (!address || votedProposals.length === 0) {
    return (
      <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
        <h3 className="text-xl font-medium mb-2">No Votes Cast</h3>
        <p className="text-muted-foreground mb-4">You haven't voted on any proposals yet.</p>
        <Button onClick={() => setActiveTab("browse")}>
          <Plus className="h-4 w-4 mr-2" />
          Browse Proposals
        </Button>
      </div>
    );
  }

  // Show voted proposals
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {votedProposals.map((proposal) => (
        <ProposalCard key={proposal.id} {...proposal} onUpdate={() => {}} />
      ))}
    </div>
  );
};

export default MyVotes;