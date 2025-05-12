
import React from 'react';

const StatsCard = ({ title, value, description }: { title: string; value: string; description?: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
      <h3 className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-2">{title}</h3>
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{value}</div>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 stats-gradient">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Growing the Nigerian Innovation Ecosystem</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Through decentralized finance, we're connecting creators with supporters and building a stronger future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatsCard 
            title="Total Value Locked" 
            value="25.5M cNGN" 
            description="Growing 15% month over month"
          />
          <StatsCard 
            title="Successful Campaigns" 
            value="250+" 
            description="87% success rate"
          />
          <StatsCard 
            title="Community Members" 
            value="15,000+" 
            description="Active participants in the ecosystem"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
