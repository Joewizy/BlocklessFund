import { readContract, writeContract } from "@wagmi/core";
import { toast } from "sonner";
import type { Config } from "wagmi";
import { cNGNAdbi, cNGNAddress } from "@/constants";

// ====== READ FUNCTIONS ======

export const checkCngnBalance = async (
  config: Config,
  address: `0x${string}` | string
) => {
  try {
    const balance = await readContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress,
      functionName: "balanceOf",
      args: [address],
    });
    return balance as bigint;
  } catch (error) {
    toast.error("Failed to fetch cNGN balance.");
    throw error;
  }
};

export const checkAllowance = async (
  config: Config,
  owner: `0x${string}`,
  spender: `0x${string}`
) => {
  try {
    const allowance = await readContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress,
      functionName: "allowance",
      args: [owner, spender],
    });
    return allowance;
  } catch (error) {
    toast.error("Failed to fetch allowance.");
    throw error;
  }
};

// ====== WRITE FUNCTIONS ======

export const approveSpender = async (
  config: Config,
  spender: `0x${string}`,
  amount: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress,
      functionName: "approve",
      args: [spender, BigInt(amount)],
    });
    toast.success("Spender approved successfully!");
    return tx;
  } catch (error) {
    toast.error("Failed to approve spender.");
    throw error;
  }
};

export const transferCngn = async (
  config: Config,
  to: `0x${string}`,
  amount: number
) => {
  try {
    const tx = await writeContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress,
      functionName: "transfer",
      args: [to, BigInt(amount)],
    });
    toast.success("Transfer successful!");
    return tx;
  } catch (error) {
    toast.error("Transfer failed.");
    throw error;
  }
};

export const mintCngn = async (
  config: Config,
  amount: number,
  address: `0x${string}`
) => {
  try {
    const tx = await writeContract(config, {
      abi: cNGNAdbi,
      address: cNGNAddress,
      functionName: "mint",
      args: [address, BigInt(amount)],
    });
    return tx;
  } catch (error) {
    toast.error("Mint failed.");
    throw error;
  }
};

