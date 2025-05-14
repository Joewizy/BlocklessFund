"use client";
import { crowdfundingAddress, crowdfundingAbi } from "@/constants";
import CampaignCard from "@/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignCardProps } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { calculateDaysLeft } from "@/utils/conversionUtils";

// Default campaign image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81";

const ViewCampaigns = () => {
    const config = useConfig();
    const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                const response = await readContract(config, {
                    abi: crowdfundingAbi,
                    address: crowdfundingAddress,
                    functionName: "getCampaign",
                    args: [1n], 
                });

                const campaignData = transformCampaignData(response);
                setCampaigns([campaignData]);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCampaigns();
    }, [config]);

    // Transform blockchain response to CampaignCardProps
    const transformCampaignData = (data: any): CampaignCardProps => {
        const daysLeft = calculateDaysLeft(Number(data.deadline));
        
        return {
            ...data,
            imageUrl: DEFAULT_IMAGE,
            daysLeft,
            category: "Technology",
            raisedAmount: data.amountRaised,
            goalAmount: data.goal,
        };
    };

    if (loading) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={Number(campaign.id)}
                            {...campaign}
                            creator={campaign.creator}
                            title={campaign.title}
                            description={campaign.description}
                            goalAmount={campaign.goalAmount}
                            raisedAmount={campaign.raisedAmount}
                            daysLeft={campaign.daysLeft}
                            category={campaign.category}
                            imageUrl={campaign.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ViewCampaigns;