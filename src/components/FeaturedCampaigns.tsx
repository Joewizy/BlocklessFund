
import React from 'react';
import { Button } from '@/components/ui/button';
import CampaignCard from './CampaignCard';
import { ArrowRight } from 'lucide-react';

const FeaturedCampaigns = () => {
  // Sample campaign data
  const campaigns = [
    {
      id: 1,
      title: "Lagos Tech Hub Expansion",
      description: "Help us expand our tech hub to support more Nigerian startups and entrepreneurs.",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      creator: "TechFounders NG",
      raisedAmount: 1250000,
      goalAmount: 2000000,
      daysLeft: 12,
      category: "Technology"
    },
    {
      id: 2,
      title: "Clean Water Initiative in Rural Communities",
      description: "Providing clean water access to 5 rural communities in Northern Nigeria.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      creator: "WaterAccess NGO",
      raisedAmount: 850000,
      goalAmount: 1000000,
      daysLeft: 5,
      category: "Social Impact"
    },
    {
      id: 3,
      title: "Digital Skills for Youth",
      description: "Training program to equip 500 young Nigerians with in-demand tech skills.",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      creator: "CodeAfrica",
      raisedAmount: 650000,
      goalAmount: 1500000,
      daysLeft: 22,
      category: "Education"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Discover Campaigns</h2>
          <Button variant="ghost" className="text-fundngn-green hover:text-fundngn-darkgreen hover:bg-fundngn-green/10">
            View all campaigns
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              title={campaign.title}
              description={campaign.description}
              imageUrl={campaign.imageUrl}
              creator={campaign.creator}
              raisedAmount={campaign.raisedAmount}
              goalAmount={campaign.goalAmount}
              daysLeft={campaign.daysLeft}
              category={campaign.category}
            />
          ))}
        </div> */}
        
        <div className="text-center mt-12">
          <Button className="bg-fundngn-green text-white hover:bg-fundngn-darkgreen px-6 py-6 h-auto text-lg">
            Browse through innovative projects and ideas from Nigerian creators
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
