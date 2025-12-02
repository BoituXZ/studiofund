import type { User, Group, Activity, Business } from './types';

export const mockUser: User = {
  id: 'user-1',
  firstName: 'Tafadzwa',
  lastName: 'Moyo',
  phone: '+263 77 123 4567',
  email: 'tafadzwa.moyo@example.com',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
  memberSince: 'Mar 2023',
};

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Mbare Vendors United',
    description: 'A savings group for vendors operating in the Mbare Musika market.',
    poolBalance: 12540.75,
    members: 25,
    role: 'Admin',
    yourContribution: { paid: 20, total: 20 },
  },
  {
    id: 'group-2',
    name: 'Harare Techies',
    description: 'Investing in the future of Zimbabwean tech.',
    poolBalance: 78210.00,
    members: 15,
    role: 'Member',
    yourContribution: { paid: 100, total: 100 },
  },
  {
    id: 'group-3',
    name: 'Chitungwiza Family Fund',
    description: 'Family and friends building together.',
    poolBalance: 5300.50,
    members: 42,
    role: 'Member',
    yourContribution: { paid: 10, total: 10 },
  },
];

export const mockActivities: Activity[] = [
  { id: 'act-1', description: 'Grace contributed $20 to Mbare Vendors', timestamp: '2 hours ago' },
  { id: 'act-2', description: 'Investment in Chivhu Hardware completed', timestamp: '1 day ago' },
  { id: 'act-3', description: 'Your claim for $150 was approved', timestamp: '2 days ago' },
  { id: 'act-4', description: 'New member, John Doe, joined Harare Techies', timestamp: '4 days ago' },
  { id: 'act-5', description: 'Vote started for investment in Gweru Agro', timestamp: '5 days ago' },
];

export const mockBusinesses: Business[] = [
    {
        id: 'biz-1',
        name: 'Chivhu Hardware',
        sector: 'Hardware',
        location: 'Chivhu',
        imageUrl: 'https://picsum.photos/seed/biz-chivhu/400/300',
        imageHint: 'hardware store',
        riskScore: 8.5,
        capitalNeeded: 5000,
        interestRate: 15,
        repaymentDays: 90,
    },
    {
        id: 'biz-2',
        name: 'Gweru Agro Supplies',
        sector: 'Agro Dealer',
        location: 'Gweru',
        imageUrl: 'https://picsum.photos/seed/biz-gweru/400/300',
        imageHint: 'farm supplies',
        riskScore: 7.2,
        capitalNeeded: 12000,
        interestRate: 18,
        repaymentDays: 120,
    },
    {
        id: 'biz-3',
        name: 'Kuwadzana Style Salon',
        sector: 'Salon',
        location: 'Harare',
        imageUrl: 'https://picsum.photos/seed/biz-salon/400/300',
        imageHint: 'hair salon',
        riskScore: 6.8,
        capitalNeeded: 2500,
        interestRate: 20,
        repaymentDays: 60,
    },
    {
        id: 'biz-4',
        name: 'Byo-Fresh Retail',
        sector: 'Retail',
        location: 'Bulawayo',
        imageUrl: 'https://picsum.photos/seed/biz-retail/400/300',
        imageHint: 'grocery store',
        riskScore: 9.1,
        capitalNeeded: 8000,
        interestRate: 12,
        repaymentDays: 90,
    }
];

export const mockDiscounts = [
    {
        id: 'disc-1',
        businessName: 'Chivhu Hardware',
        businessLogoUrl: 'https://picsum.photos/seed/biz1/100/100',
        discount: '15% OFF',
        description: 'On all building materials',
        minPurchase: 50,
        validUntil: '31 Dec 2024',
        uses: '2 more times',
    },
    {
        id: 'disc-2',
        businessName: 'Kuwadzana Style Salon',
        businessLogoUrl: 'https://picsum.photos/seed/biz-salon-logo/100/100',
        discount: '10% OFF',
        description: 'On all hairstyles',
        minPurchase: 0,
        validUntil: '30 Nov 2024',
        uses: 'Unlimited',
    }
]
