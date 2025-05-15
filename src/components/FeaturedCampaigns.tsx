
import React from 'react';
import { Button } from '@/components/ui/button';
import CampaignCard from './CampaignCard';
import { ArrowRight } from 'lucide-react';
import { CampaignCardMock } from '@/utils/interfaces';
import { Link } from 'react-router-dom';

const FeaturedCampaigns = () => {
  const weiToEther = (wei: bigint): string => {
    const ether = wei / BigInt(10 ** 18); 
    return ether.toString(); 
  };
  const campaigns: CampaignCardMock[] = [
    {
      id: BigInt(1),
      title: "Lagos Tech Hub Expansion",
      description: "Help us expand our tech hub to support more Nigerian startups and entrepreneurs.",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      creator: "TechFounders NG",
      raisedAmount: BigInt(1250000),
      goalAmount: BigInt(2000000),
      startTime: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      deadline: BigInt(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days left
      completed: false,
      daysLeft: 12,
      category: "Technology"
    },
    {
      id: BigInt(2),
      title: "Clean Water Initiative in Rural Communities",
      description: "Providing clean water access to 5 rural communities in Northern Nigeria.",
      imageUrl: "https://images.unsplash.com/photo-1553775927-a071d5a6a39a?q=80&w=2774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      creator: "WaterAccess NGO",
      raisedAmount: BigInt(850000),
      goalAmount: BigInt(1000000),
      startTime: BigInt(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      deadline: BigInt(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days left
      completed: false,
      daysLeft: 5,
      category: "Social Impact"
    },
    {
      id: BigInt(3),
      title: "Digital Skills for Youth",
      description: "Training program to equip 500 young Nigerians with in-demand tech skills.",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      creator: "CodeAfrica",
      raisedAmount: BigInt(650000),
      goalAmount: BigInt(1500000),
      startTime: BigInt(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      deadline: BigInt(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days left
      completed: false,
      daysLeft: 22,
      category: "Education"
    }
  ];
  

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Discover Campaigns</h2>
          <Link to="/campaigns">
          <Button variant="ghost" className="text-fundngn-green hover:text-fundngn-darkgreen hover:bg-fundngn-green/10">
            View all campaigns
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id.toString()} // React needs a unique key
            id={campaign.id}
            title={campaign.title}
            description={campaign.description}
            imageUrl={campaign.imageUrl}
            creator={campaign.creator}
            raisedAmount={weiToEther(campaign.raisedAmount)}
            goalAmount={campaign.goalAmount}
            startTime={campaign.startTime}
            deadline={campaign.deadline}
            completed={campaign.completed}
            daysLeft={campaign.daysLeft}
            category={campaign.category}
          />
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
