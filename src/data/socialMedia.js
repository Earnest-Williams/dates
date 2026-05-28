export const SOCIAL_MEDIA_CONTENT = [
  {
    id: 'selfie',
    name: 'Casual Selfie',
    baseFollowers: 15,
    energyCost: 5,
    statRequirements: { charisma: 0.5, style: 0.5 }
  },
  {
    id: 'gym_flex',
    name: 'Gym Flex',
    baseFollowers: 40,
    energyCost: 15,
    statRequirements: { fitness: 0.8, confidence: 0.2 }
  },
  {
    id: 'food_review',
    name: 'Food Review',
    baseFollowers: 35,
    energyCost: 10,
    statRequirements: { culinary: 0.7, charisma: 0.3 }
  },
  {
    id: 'coding_stream',
    name: 'Live Coding Stream',
    baseFollowers: 50,
    energyCost: 20,
    statRequirements: { programming: 0.8, intelligence: 0.2 }
  },
  {
    id: 'music_cover',
    name: 'Music Cover',
    baseFollowers: 60,
    energyCost: 25,
    statRequirements: { music: 0.8, creativity: 0.2 }
  },
  {
    id: 'finance_tips',
    name: 'Finance Advice Thread',
    baseFollowers: 45,
    energyCost: 15,
    statRequirements: { finance: 0.6, corporate: 0.4 }
  }
];

export const SPONSORSHIP_TIERS = {
  local_brand: {
    name: 'Local Brand Ambassador',
    followerReq: 1000,
    passiveIncome: 50 // weekly
  },
  national_brand: {
    name: 'National Brand Deal',
    followerReq: 10000,
    passiveIncome: 500 // weekly
  }
};
