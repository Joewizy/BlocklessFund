export interface CampaignCardProps {
  id: bigint;
  creator: `0x${string}` | string;
  title: string;
  description: string;
  goalAmount: bigint;
  raisedAmount: string;
  startTime: bigint;
  deadline: bigint;
  completed: boolean;
  imageUrl: string;
  daysLeft: number;
  category: string;
  onDonate?: () => void;
  onWithdraw?: () => void;
}

export interface ProposalProps {
  id: bigint;
  proposer: `0x${string}`;
  title: string;
  description: string;
  goal: bigint;
  startTime: bigint;
  deadline: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  executed: boolean;
  active: boolean;
  commentCount: number;
  status: 'active' | 'approved' | 'rejected' | 'pending';
}

export interface CampaignCardMock {
  id: bigint;
  creator: `0x${string}` | string;
  title: string;
  description: string;
  goalAmount: bigint;
  raisedAmount: bigint;
  startTime: bigint;
  deadline: bigint;
  completed: boolean;
  imageUrl: string;
  daysLeft: number;
  category: string;
}