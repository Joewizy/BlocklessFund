"use client";
import { crowdfundingAddress, crowdfundingAbi } from "@/constants";
import ProposalCard from "@/components/ProposalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProposalProps } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { Button } from '@/components/ui/button';

interface ViewProposalsProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewProposals = ({ setIsDialogOpen }: ViewProposalsProps) => {
  const config = useConfig();
  const [proposals, setProposals] = useState<ProposalProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const proposalCount = await readContract(config, {
          abi: crowdfundingAbi,
          address: crowdfundingAddress,
          functionName: "getProposalCounts",
        });

        const count = Number(proposalCount);
        
        if (count === 0) {
          setLoading(false);
          return;
        }

        // Fetch all proposals
        const proposalPromises = [];
        for (let i = 1; i <= count; i++) {
          proposalPromises.push(
            readContract(config, {
              abi: crowdfundingAbi,
              address: crowdfundingAddress,
              functionName: "getProposal",
              args: [BigInt(i)],
            })
          );
        }

        const proposalResults = await Promise.all(proposalPromises);
        const transformedProposals = proposalResults.map(transformProposalData);
        setProposals(transformedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [config]);

  // Transform blockchain response to ProposalProps
  const transformProposalData = (data: any): ProposalProps => {
    let status: 'active' | 'approved' | 'rejected' | 'pending';
    
    if (data.executed) {
      status = 'approved';
    } else if (!data.active) {
      status = 'rejected';
    } else {
      const now = Math.floor(Date.now() / 1000);
      if (Number(data.deadline) < now) {
        status = Number(data.votesFor) > Number(data.votesAgainst) ? 'approved' : 'rejected';
      } else {
        status = 'active';
      }
    }
    
    return {
      id: data.id,
      proposer: data.proposer,
      title: data.title,
      description: data.description,
      goal: data.goal,
      startTime: data.startTime,
      deadline: data.deadline,
      votesFor: data.votesFor,
      votesAgainst: data.votesAgainst,
      executed: data.executed,
      active: data.active,
      commentCount: 0, 
      status,
    };
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Proposals</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (proposals.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Proposals</h1>
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No proposals found</h3>
            <p className="text-muted-foreground">Be the first to create a proposal for the community!</p>
            <Button className="gap-5 m-10" onClick={() => setIsDialogOpen(true)}>
              New Proposal
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Community Proposals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proposals.map((proposal) => (
            <ProposalCard
              key={Number(proposal.id)}
              {...proposal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ViewProposals;
