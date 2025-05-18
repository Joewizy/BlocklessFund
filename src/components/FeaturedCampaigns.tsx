import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "@/components/CampaignCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedCampaigns = () => {
  const { campaigns, loading } = useCampaigns();

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Campaigns</h2>
            <Link to="/campaigns">
              <Button
                variant="ghost"
                className="text-fundngn-green hover:text-fundngn-darkgreen hover:bg-fundngn-green/10"
              >
                View all campaigns
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!campaigns.length) {
    return <div>No featured campaigns available.</div>;
  }
  
  const featuredCampaigns = campaigns.slice(0, 3);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Campaigns</h2>
          <Link to="/campaigns">
            <Button
              variant="ghost"
              className="text-fundngn-green hover:text-fundngn-darkgreen hover:bg-fundngn-green/10"
            >
              View all campaigns
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampaigns.map((campaign) => (
            <Link to="/campaigns" key={String(campaign.id)}>
              <CampaignCard
                {...campaign}
                isInteractive={false}
                onUpdate={() => {}}
              />
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/campaigns">
            <Button className="bg-fundngn-green text-white hover:bg-fundngn-darkgreen px-6 py-6 h-auto text-lg">
              Browse through innovative projects and ideas from Nigerian creators
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;