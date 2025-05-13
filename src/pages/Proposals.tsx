
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProposalsList from '@/components/ProposalsList';
import CreateProposalForm from '@/components/CreateProposalForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const Proposals = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Governance Proposals</h1>
          <p className="text-muted-foreground mt-1">
            Community members propose new campaigns and vote with cNGN tokens
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <CreateProposalForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Proposals</TabsTrigger>
          <TabsTrigger value="my-votes">My Votes</TabsTrigger>
          <TabsTrigger value="my-proposals">My Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-8">
          <ProposalsList />
        </TabsContent>

        <TabsContent value="my-votes">
          <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium mb-2">No Votes Yet</h3>
            <p className="text-muted-foreground mb-4">You haven't voted on any proposals yet.</p>
            <Button variant="outline" onClick={() => setActiveTab("browse")}>
              Browse Proposals
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="my-proposals">
          <div className="border border-dashed rounded-lg py-16 flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium mb-2">No Proposals Created</h3>
            <p className="text-muted-foreground mb-4">You haven't created any proposals yet.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Proposals;
