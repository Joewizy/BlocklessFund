"use client";
import { crowdfundingAddress, crowdfundingAbi } from "@/constants";
import ProposalCard from "@/components/ProposalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProposalProps } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { Button } from "@/components/ui/button";
import { transformProposalData } from "@/utils/transformers";

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
        const validProposals = proposalResults.filter(
          (proposal) =>
            proposal.title !== "" &&
            proposal.description !== "" &&
            proposal.goal !== 0 &&
            proposal.proposer !== "0x0000000000000000000000000000000000000000"
        );

        const transformedProposals = validProposals.map(transformProposalData);
        setProposals(transformedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [config]);

  const updateProposal = (updatedProposal: ProposalProps) => {
    setProposals((prevProposals) => {
      console.log("Updating proposal with ID:", updatedProposal.id);
      console.log("Previous proposals:", prevProposals);
      const newProposals = prevProposals.map((p) => {
        console.log(`Comparing p.id (${p.id}, type: ${typeof p.id}) with updatedProposal.id (${updatedProposal.id}, type: ${typeof updatedProposal.id})`);
        return String(p.id) === String(updatedProposal.id) ? updatedProposal : p;
      });
      console.log("New proposals state:", newProposals);
      return newProposals;
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Proposals</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              {...proposal}
              onUpdate={updateProposal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ViewProposals;