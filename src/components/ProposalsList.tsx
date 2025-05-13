
import React, { useState } from 'react';
import ProposalCard, { ProposalProps } from './ProposalCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { List, ChevronDown } from 'lucide-react';

// Sample proposal data (this would come from your API in a real app)
const sampleProposals: ProposalProps[] = [
  {
    id: '1',
    title: 'Fund School Building in Lagos',
    description: 'This proposal aims to raise funds for building a new primary school in the underserved area of Lagos. The school will provide education to approximately 500 children.',
    creator: 'Adebayo Ogunlesi',
    createdAt: new Date(2025, 4, 5),
    endDate: new Date(2025, 4, 15),
    votesFor: 230,
    votesAgainst: 45,
    status: 'active',
    commentCount: 32
  },
  {
    id: '2',
    title: 'Clean Water Initiative for Rural Communities',
    description: 'A project to install water purification systems in 15 villages across northern Nigeria, providing clean drinking water to over 10,000 people.',
    creator: 'Ngozi Okonjo',
    createdAt: new Date(2025, 3, 22),
    endDate: new Date(2025, 4, 6), 
    votesFor: 340,
    votesAgainst: 20,
    status: 'approved',
    commentCount: 47
  },
  {
    id: '3',
    title: 'Solar Power for Community Center',
    description: 'Install solar panels on the roof of the community center to reduce electricity costs and provide sustainable energy.',
    creator: 'Chinua Achebe',
    createdAt: new Date(2025, 3, 18),
    endDate: new Date(2025, 3, 28),
    votesFor: 120,
    votesAgainst: 135,
    status: 'rejected',
    commentCount: 29
  },
  {
    id: '4',
    title: 'Mobile Health Clinic for Rural Areas',
    description: 'Fund a mobile health clinic that will travel to rural areas, providing basic healthcare services to communities without access to medical facilities.',
    creator: 'Amina Mohammed',
    createdAt: new Date(2025, 4, 10),
    endDate: new Date(2025, 4, 24),
    votesFor: 189,
    votesAgainst: 32,
    status: 'active',
    commentCount: 26
  },
];

type StatusFilter = 'all' | 'active' | 'approved' | 'rejected' | 'pending';

const ProposalsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredProposals = sampleProposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <List className="h-5 w-5 text-fundngn-green" />
          <h2 className="text-2xl font-semibold">Community Proposals</h2>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute mt-1 right-0 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-10 hidden">
              {(['all', 'active', 'approved', 'rejected', 'pending'] as const).map((status) => (
                <button
                  key={status}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} {...proposal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No proposals found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProposalsList;
