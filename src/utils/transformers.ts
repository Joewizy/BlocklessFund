import { ProposalProps } from '@/utils/interfaces';

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
    id: data.id.toString(), // Convert BigInt to string
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
    commentCount: 0, // Or fetch if available
    status,
  };
};