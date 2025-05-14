import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CampaignCardProps } from '@/utils/interfaces';

const CampaignCard = ({ title, description, imageUrl, creator, raisedAmount, goalAmount, daysLeft, category}: CampaignCardProps) => {
  const numericGoal = Number(goalAmount) / 100;
  const numericRaised = Number(raisedAmount) / 100;
  const progressPercentage = Math.min((numericRaised / numericGoal) * 100, 100);
  const formattedCreator = `${creator.slice(0, 6)}...${creator.slice(-4)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col card-hover">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-campaign.jpg';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-fundngn-green/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">
              {numericRaised.toLocaleString('en-US')} cNGN
            </span>
            <span className="text-gray-600">
              of {numericGoal.toLocaleString('en-US')} cNGN
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-4" />
          
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-fundngn-green/10 flex items-center justify-center mr-1">
                <span className="text-xs font-semibold text-fundngn-green">
                  {creator[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <span title={creator}>{formattedCreator}</span>
            </div>
            <span>{daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;