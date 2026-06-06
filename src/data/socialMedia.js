export const SOCIAL_MEDIA_CONTENT = [
  {
    id: 'selfie',
    name: 'Casual Selfie',
    baseFollowers: 15,
    energyCost: 5,
    statRequirements: { charisma: 0.5, style: 0.5 },
    category: 'lifestyle',
    viralChance: 0.1
  },
  {
    id: 'gym_flex',
    name: 'Gym Flex',
    baseFollowers: 40,
    energyCost: 15,
    statRequirements: { fitness: 0.8, confidence: 0.2 },
    category: 'fitness',
    viralChance: 0.2
  },
  {
    id: 'food_review',
    name: 'Food Review',
    baseFollowers: 35,
    energyCost: 10,
    statRequirements: { culinary: 0.7, charisma: 0.3 },
    category: 'lifestyle',
    viralChance: 0.15
  },
  {
    id: 'coding_stream',
    name: 'Live Coding Stream',
    baseFollowers: 50,
    energyCost: 20,
    statRequirements: { programming: 0.8, intelligence: 0.2 },
    category: 'tech',
    viralChance: 0.25
  },
  {
    id: 'music_cover',
    name: 'Music Cover',
    baseFollowers: 60,
    energyCost: 25,
    statRequirements: { music: 0.8, creativity: 0.2 },
    category: 'creative',
    viralChance: 0.3
  },
  {
    id: 'finance_tips',
    name: 'Finance Advice Thread',
    baseFollowers: 45,
    energyCost: 15,
    statRequirements: { finance: 0.6, corporate: 0.4 },
    category: 'business',
    viralChance: 0.2
  },
  // Phase 2 - Enhanced Social Media Content
  {
    id: 'fashion_haul',
    name: 'Fashion Haul',
    baseFollowers: 55,
    energyCost: 20,
    statRequirements: { style: 0.9, charisma: 0.1 },
    category: 'lifestyle',
    viralChance: 0.25
  },
  {
    id: 'travel_vlog',
    name: 'Travel Vlog',
    baseFollowers: 70,
    energyCost: 30,
    statRequirements: { charisma: 0.6, style: 0.4 },
    category: 'lifestyle',
    viralChance: 0.35
  },
  {
    id: 'art_tutorial',
    name: 'Art Tutorial',
    baseFollowers: 45,
    energyCost: 18,
    statRequirements: { creativity: 0.8, intelligence: 0.2 },
    category: 'creative',
    viralChance: 0.2
  },
  {
    id: 'book_review',
    name: 'Book Review',
    baseFollowers: 30,
    energyCost: 12,
    statRequirements: { intelligence: 0.7, charisma: 0.3 },
    category: 'academic',
    viralChance: 0.15
  },
  {
    id: 'gaming_stream',
    name: 'Gaming Stream',
    baseFollowers: 50,
    energyCost: 25,
    statRequirements: { gaming: 0.8, charisma: 0.2 },
    category: 'tech',
    viralChance: 0.3
  },
  {
    id: 'business_insights',
    name: 'Business Insights',
    baseFollowers: 65,
    energyCost: 20,
    statRequirements: { corporate: 0.7, negotiation: 0.3 },
    category: 'business',
    viralChance: 0.25
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
  },
  luxury_brand: {
    name: 'Luxury Brand Partnership',
    followerReq: 50000,
    passiveIncome: 2500 // weekly
  }
};

export const SOCIAL_MEDIA_CHALLENGES = [
  {
    id: '7_day_streak',
    name: '7-Day Posting Streak',
    description: 'Post every day for 7 days',
    reward: { followers: 500, mood: 20 },
    durationDays: 7
  },
  {
    id: 'viral_week',
    name: 'Viral Week Challenge',
    description: 'Get 3 viral posts in one week',
    reward: { followers: 2000, money: 1000 },
    durationDays: 7
  },
  {
    id: 'category_master',
    name: 'Category Master',
    description: 'Post in 5 different categories',
    reward: { followers: 1000, mood: 30 },
    durationDays: 30
  }
];
