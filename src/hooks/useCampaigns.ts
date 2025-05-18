import { useEffect, useState } from "react";
import { useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { crowdfundingAbi, crowdfundingAddress } from "@/constants";
import { CampaignCardProps } from "@/utils/interfaces";
import { RawCampaignData } from "@/utils/transformers";
import { transformCampaignData } from "@/utils/transformers";

const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  "https://images.unsplash.com/photo-1553775927-a071d5a6a39a",
  "https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?q=80&w=2774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export const useCampaigns = () => {
  const config = useConfig();
  const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const campaignCount = await readContract(config, {
          abi: crowdfundingAbi,
          address: crowdfundingAddress,
          functionName: "getCampaignCounts",
        });

        const count = Number(campaignCount);
        if (count === 0) {
          setCampaigns([]);
          return;
        }

        const promises = [];
        for (let i = 1; i <= count; i++) {
          promises.push(
            readContract(config, {
              abi: crowdfundingAbi,
              address: crowdfundingAddress,
              functionName: "getCampaign",
              args: [BigInt(i)],
            })
          );
        }

        const results = await Promise.all(promises);
        const validCampaigns = results
          .map((data, index) => ({
            data: data as RawCampaignData,
            id: BigInt(index + 1),
          }))
          .filter(({ data }) =>
            data.title && data.description && data.goal > 0n && data.creator !== "0x0000000000000000000000000000000000000000"
          );

        const transformed = validCampaigns.map(({ data, id }) =>
          transformCampaignData(
            data,
            id,
            CAMPAIGN_IMAGES[Math.floor(Math.random() * CAMPAIGN_IMAGES.length)]
          )
        );

        setCampaigns(transformed);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [config]);

  return { campaigns, loading };
};
