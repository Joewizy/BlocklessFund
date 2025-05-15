import React from 'react';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Features from '@/components/Features';
import FeaturedCampaigns from '@/components/FeaturedCampaigns';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <FeaturedCampaigns />
      </main>
    </div>
  );
};

export default Index;
