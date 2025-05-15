"use client";
import { crowdfundingAddress, crowdfundingAbi } from "@/constants";
import CampaignCard from "@/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignCardProps } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { transformCampaignData } from "@/utils/transformers";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RawCampaignData } from "@/utils/transformers";

// Random campaign images
const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  "https://images.unsplash.com/photo-1553775927-a071d5a6a39a",
  "https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?q=80&w=2774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const ViewCampaigns = () => {
  const config = useConfig();
  const navigate = useNavigate();
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
          setLoading(false);
          return;
        }

        const campaignPromises = [];
        for (let i = 1; i <= count; i++) {
          campaignPromises.push(
            readContract(config, {
              abi: crowdfundingAbi,
              address: crowdfundingAddress,
              functionName: "getCampaign",
              args: [BigInt(i)],
            })
          );
        }

        const campaignResults = await Promise.all(campaignPromises);
        const validCampaigns = campaignResults.filter(
          (campaign) =>
            (campaign as RawCampaignData).title !== "" &&
            (campaign as RawCampaignData).description !== "" &&
            (campaign as RawCampaignData).goal !== 0n &&
            (campaign as RawCampaignData).creator !== "0x0000000000000000000000000000000000000000"
        );

        const transformedCampaigns = validCampaigns.map((data, index) => 
          transformCampaignData(
            data as RawCampaignData,
            BigInt(index + 1),
            CAMPAIGN_IMAGES[Math.floor(Math.random() * CAMPAIGN_IMAGES.length)]
          )
        );

        setCampaigns(transformedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [config]);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Campaigns</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Campaigns</h1>
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
            <p className="text-muted-foreground">
              Be the first to create a campaign for the community!
            </p>
            <Button
              className="gap-5 m-10"
              onClick={() => navigate("/create-campaign")}
            >
              New Campaign
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Community Campaigns</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={Number(campaign.id)}
              {...campaign}
              onUpdate={(updatedCampaign) => {
                setCampaigns(prev => prev.map(c => 
                  Number(c.id) === Number(updatedCampaign.id) ? updatedCampaign : c
                ));
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ViewCampaigns;