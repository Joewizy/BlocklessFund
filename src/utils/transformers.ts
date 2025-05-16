import { ProposalProps } from '@/utils/interfaces';
import { CampaignCardProps } from '@/utils/interfaces';
import { calculateDaysLeft } from './conversionUtils';

export const transformProposalData = (data: any): ProposalProps => {
  let status: 'active' | 'approved' | 'rejected' | 'pending';

  if (data.executed) {
    status = 'approved';
  } else if (!data.active) {
    status = 'rejected';
  } else {
    const now = Math.floor(Date.now() / 1000);
    if (Number(data.deadline) < now) {
      status = Number(data.votesFor) > Number(data.votesAgainst) ? 'approved' : 'rejected';
    } else {
      status = 'active';
    }
  }

  return {
    id: data.id.toString(), 
    proposer: data.proposer,
    title: data.title,
    description: data.description,
    goal: data.goal.toString(),
    startTime: data.startTime.toString(),
    deadline: data.deadline.toString(),
    votesFor: data.votesFor.toString(),
    votesAgainst: data.votesAgainst.toString(),
    executed: data.executed,
    active: data.active,
    commentCount: 0, 
    status,
  };
};

export interface RawCampaignData {
  creator: string;
  title: string;
  description: string;
  goal: bigint;
  amountRaised: bigint;
  startTime: bigint;
  deadline: bigint;
  completed: boolean;
  category: string;
}

export const transformCampaignData = (
  data: RawCampaignData,
  id: bigint,
  imageUrl: string
): CampaignCardProps => {
  const weiToEther = (wei: bigint): string => {
    const ether = wei / BigInt(10 ** 18); 
    return ether.toString(); 
  };

  return {
    id,
    creator: data.creator,
    title: data.title,
    description: data.description,
    goalAmount: data.goal, 
    raisedAmount: weiToEther(data.amountRaised), 
    startTime: data.startTime,
    deadline: data.deadline,
    completed: data.completed,
    imageUrl,
    daysLeft: calculateDaysLeft(Number(data.deadline)),
    category: data.category || 'other',
  };
};