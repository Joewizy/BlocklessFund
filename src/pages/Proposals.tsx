import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ViewProposals from "@/components/ProposalsList";
import CreateProposalForm from "@/components/CreateProposalForm";
import { ProposalProps } from "@/utils/interfaces";
import { useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { crowdfundingAddress, crowdfundingAbi } from "@/constants";
import { transformProposalData } from "@/utils/transformers";
import { useAccount } from "wagmi";
import ProposalCard from "@/components/ProposalCard";
import { hasVoted, executeProposal } from "@/utils/contracts/crowdfunding";
import { useWaitForTransactionReceipt } from "wagmi";

interface MyVotesProps {
  proposals: ProposalProps[];
  setActiveTab: (tab: string) => void; 
}

const MyVotes: React.FC<MyVotesProps> = ({ proposals, setActiveTab }) => {
  const { address } = useAccount();
  const config = useConfig();
  const [userVotes, setUserVotes] = useState<ProposalProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserVotes() {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        const votedProposals = await Promise.all(
          proposals.map(async (proposal) => {
            const hasVotedOnThis = await hasVoted(config, Number(proposal.id), address);
            return hasVotedOnThis ? proposal : null;
          })
        );
        setUserVotes(votedProposals.filter((p): p is ProposalProps => p !== null));
      } catch (error) {
        console.error("Error fetching user votes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserVotes();
  }, [proposals, address, config]);

  if (loading) {
    return (
      <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
        <h3 className="text-xl font-medium mb-2">Loading...</h3>
      </div>
    );
  }

  if (!address || userVotes.length === 0) {
    return (
      <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
        <h3 className="text-xl font-medium mb-2">No Votes Yet</h3>
        <p className="text-muted-foreground mb-4">You haven't voted on any proposals yet.</p>
        <Button variant="outline" onClick={() => setActiveTab("browse")}>
          Browse Proposals
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {userVotes.map((proposal) => (
        <ProposalCard key={proposal.id} {...proposal} onUpdate={() => {}} />
      ))}
    </div>
  );
};

interface MyProposalsProps {
  proposals: ProposalProps[];
  setIsDialogOpen: (open: boolean) => void; // Prop to open dialog
}

const MyProposals: React.FC<MyProposalsProps> = ({ proposals, setIsDialogOpen }) => {
  const { address } = useAccount();
  const config = useConfig();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const { data: txReceipt, isLoading: isWaiting } = useWaitForTransactionReceipt({ hash: txHash });

  const filteredProposals = proposals.filter((p) => p.proposer.toLowerCase() === address?.toLowerCase());

  useEffect(() => {
    if (txReceipt && txReceipt.status === 1) {
      const fetchUpdatedProposal = async () => {
        try {
          const updatedProposalData = await readContract(config, {
            abi: crowdfundingAbi,
            address: crowdfundingAddress,
            functionName: "getProposal",
            args: [BigInt(txReceipt.logs[0]?.topics[1])], // Assuming ProposalExecuted event emits proposalId
          });
          const updatedProposal = transformProposalData(updatedProposalData);
          setTxHash(null);
        } catch (err) {
          console.error("Failed to fetch updated proposal", err);
        }
      };
      fetchUpdatedProposal();
    } else if (txReceipt && txReceipt.status === 0) {
      console.error("Execution failed");
      setTxHash(null);
    }
  }, [txReceipt, config]);

  const handleExecute = async (proposalId: number) => {
    try {
      const result = await executeProposal(config, proposalId);
      setTxHash(result);
    } catch (err) {
      console.error("Execution failed", err);
    }
  };

  if (!address || filteredProposals.length === 0) {
    return (
      <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
        <h3 className="text-xl font-medium mb-2">No Proposals Created</h3>
        <p className="text-muted-foreground mb-4">You haven't created any proposals yet.</p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {filteredProposals.map((proposal) => (
        <div key={proposal.id}>
          <ProposalCard {...proposal} onUpdate={() => {}} />
          {!proposal.executed && new Date().getTime() > Number(proposal.deadline) * 1000 && (
            <Button
              size="sm"
              className="text-white bg-blue-500 hover:bg-blue-600 gap-1.5 px-4 mt-2"
              onClick={() => handleExecute(Number(proposal.id))}
              disabled={isWaiting}
            >
              Execute
            </Button>
          )}
        </div>
      ))}
      {isWaiting && <div className="text-sm text-gray-500">Waiting for execution transaction...</div>}
    </div>
  );
};

// Proposals Component
const Proposals = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Governance Proposals</h1>
          <p className="text-muted-foreground mt-1">
            Community members propose new campaigns and vote with cNGN tokens
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <CreateProposalForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Proposals</TabsTrigger>
          <TabsTrigger value="my-votes">My Votes</TabsTrigger>
          <TabsTrigger value="my-proposals">My Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-8">
          <ViewProposals setIsDialogOpen={setIsDialogOpen} />
        </TabsContent>

        <TabsContent value="my-votes">
          <MyVotes proposals={proposals} setActiveTab={setActiveTab} />
        </TabsContent>

        <TabsContent value="my-proposals">
          <MyProposals proposals={proposals} setIsDialogOpen={setIsDialogOpen} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Proposals;