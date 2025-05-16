import { readContract, writeContract } from "@wagmi/core";
import { crowdfundingAbi, crowdfundingAddress } from "@/constants";
import { toast } from "sonner";
import type { Config } from "wagmi";

// ====== WRITE FUNCTIONS ======

export const voteOnProposal = async (
    config: Config,
    proposalId: string | number,
    vote: boolean
  ) => {
    try {
      const tx = await writeContract(config, {
        abi: crowdfundingAbi,
        address: crowdfundingAddress,
        functionName: "voteOnProposal",
        args: [BigInt(proposalId), vote],
      });
      //toast.success("Vote submitted!");
      console.log("Vote proposal tx:", tx);
      return tx;
    } catch (error) {
      toast.error("Failed to vote on proposal.");
      throw error;
    }
  };

export const createProposal = async (
  config: Config,
  title: string,
  description: string,
  goal: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "createProposal",
      args: [title, description, BigInt(goal)],
    });
    toast.success("Proposal created successfully!");
    return tx;
  } catch (error) {
    toast.error("Failed to create proposal.");
    throw error;
  }
};

export const executeProposal = async (config: Config, proposalId: number) => {
  try {
    const tx = await writeContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "executeProposal",
      args: [BigInt(proposalId)],
    });
    toast.success("Proposal executed!");
    return tx;
  } catch (error) {
    toast.error("Failed to execute proposal.");
    throw error;
  }
};

export const createCampaign = async (
  config: Config,
  title: string,
  description: string,
  goal: number,
  duration: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "createCampaign",
      args: [title, description, BigInt(goal), BigInt(duration)],
    });
    toast.success("Campaign created successfully!");
    return tx;
  } catch (error) {
    toast.error("Failed to create campaign.");
    throw error;
  }
};

export const donateToCampaign = async (
  config: Config,
  campaignId: number,
  amount: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "donate",
      args: [BigInt(campaignId), BigInt(amount)],
    });
    toast.success("Donation successful!");
    return tx;
  } catch (error) {
    toast.error("Failed to donate.");
    throw error;
  }
};

export const withdrawFunds = async (
  config: Config,
  campaignId: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "withdrawFunds",
      args: [BigInt(campaignId)],
    });
    toast.success("Funds withdrawn successfully!");
    return tx;
  } catch (error) {
    toast.error("Withdrawal failed.");
    throw error;
  }
};

// ====== READ FUNCTIONS ======

export const getProposalCounts = async (config: Config) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getProposalCounts",
    });
  };
  
  export const getCampaignCounts = async (config: Config) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getCampaignCounts",
    });
  };
  
  export const getProposalById = async (config: Config, proposalId: string | number) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getProposal",
      args: [BigInt(proposalId)],
    });
  };
  
  export const getCampaignById = async (config: Config, campaignId: number) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getCampaign",
      args: [BigInt(campaignId)],
    });
  };
  
  export const getDonationAmount = async (
    config: Config,
    campaignId: number,
    donator: `0x${string}`
  ) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getDonationAmount",
      args: [BigInt(campaignId), donator],
    });
  };
  
  export const getVoteWeight = async (
    config: Config,
    address: `0x${string}`
  ) => {
    return await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "getVoteWeight",
      args: [address],
    });
  };

  export const hasVoted = async (
    config: Config,
    proposalId: number,
    voter: `0x${string}`
  ): Promise<boolean> => {
    const result = await readContract(config, {
      abi: crowdfundingAbi,
      address: crowdfundingAddress,
      functionName: "votes",
      args: [BigInt(proposalId), voter],
    });
  
    return result as boolean;
  };
  
  export const hasWhitelist = async (
    config: Config,
    user: `0x${string}`
  ): Promise<boolean> => {
    try {
      const isWhitelisted = await readContract(config, {
        abi: crowdfundingAbi,
        address: crowdfundingAddress,
        functionName: "whitelisted",
        args: [user],
      });
  
      return isWhitelisted as boolean;
    } catch (error) {
      toast.error("Failed to check whitelist status.");
      throw error;
    }
  };
  
  
  
