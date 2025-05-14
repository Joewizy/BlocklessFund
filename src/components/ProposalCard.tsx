import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, MessageSquare, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProposalProps } from '@/utils/interfaces';

const ProposalCard: React.FC<ProposalProps> = ({
  id,
  proposer,
  title,
  description,
  goal,
  startTime,
  deadline,
  votesFor,
  votesAgainst,
  executed,
  active,
  commentCount,
  status,
}) => {
  const numericGoal = Number(goal); 
  const numericVotesFor = Number(votesFor);
  const numericVotesAgainst = Number(votesAgainst);
  const totalVotes = numericVotesFor + numericVotesAgainst;
  const forPercentage = totalVotes > 0 ? (numericVotesFor / totalVotes) * 100 : 0;

  // Date conversions
  const startDate = new Date(Number(startTime) * 1000);
  const endDate = new Date(Number(deadline) * 1000);
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" /> Voting Period</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge>Unknown Status</Badge>;
    }
  };

  const timeRemaining = () => {
    if (status !== 'active') return null;
    
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) return "Voting ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} left`;
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="pt-1 flex items-center justify-between">
          <span title={proposer}>Proposed by {formattedProposer}</span>
          <span className="text-sm text-muted-foreground">
            Goal: {numericGoal.toLocaleString()} cNGN
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-4">{description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-green-500" /> 
              {numericVotesFor.toLocaleString()} For
            </span>
            <span className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-1 text-red-500" /> 
              {numericVotesAgainst.toLocaleString()} Against
            </span>
            <span>{timeRemaining()}</span>
          </div>
          <Progress value={forPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {commentCount} Comments
        </Button>
        {status === 'active' && (
          <div className="space-x-2">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <ArrowUp className="h-3.5 w-3.5" /> Vote For
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <ArrowDown className="h-3.5 w-3.5" /> Vote Against
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;