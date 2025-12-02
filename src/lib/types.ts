export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  memberSince: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  poolBalance: number;
  members: number;
  role: 'Admin' | 'Member';
  yourContribution: {
    paid: number;
    total: number;
  };
};

export type Activity = {
  id: string;
  description: string;
  timestamp: string;
};

export type Business = {
  id: string;
  name: string;
  sector: string;
  location: string;
  imageUrl: string;
  imageHint: string;
  riskScore: number;
  capitalNeeded: number;
  interestRate: number;
  repaymentDays: number;
};
