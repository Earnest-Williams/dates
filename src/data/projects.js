export const CAREER_TRACKS = {
  corporate: {
    id: "corporate",
    name: "Corporate Management",
    description: "Climb the corporate ladder, manage teams, and maximize profits.",
    levels: [
      { level: 1, title: 'Intern', reqPoints: 0, salary: 0 },
      { level: 2, title: 'Junior Associate', reqPoints: 100, salary: 50 },
      { level: 3, title: 'Senior Associate', reqPoints: 300, salary: 100 },
      { level: 4, title: 'Manager', reqPoints: 600, salary: 200 },
      { level: 5, title: 'Director', reqPoints: 1000, salary: 400 },
      { level: 6, title: 'Executive', reqPoints: 1500, salary: 800 }
    ],
  },
  tech: {
    id: "tech",
    name: "Software Engineering",
    description: "Write code, build systems, and create the future.",
    levels: [
      { level: 1, title: 'Junior Developer', reqPoints: 0, salary: 60 },
      { level: 2, title: 'Mid-Level Developer', reqPoints: 150, salary: 120 },
      { level: 3, title: 'Senior Developer', reqPoints: 400, salary: 250 },
      { level: 4, title: 'Tech Lead', reqPoints: 800, salary: 400 },
      { level: 5, title: 'Staff Engineer', reqPoints: 1200, salary: 600 },
      { level: 6, title: 'Principal Engineer', reqPoints: 1800, salary: 1000 }
    ],
  },
  creative: {
    id: "creative",
    name: "Digital Arts & Design",
    description: "Design beautiful interfaces and craft compelling stories.",
    levels: [
      { level: 1, title: 'Design Intern', reqPoints: 0, salary: 0 },
      { level: 2, title: 'Junior Designer', reqPoints: 120, salary: 40 },
      { level: 3, title: 'UI/UX Designer', reqPoints: 350, salary: 150 },
      { level: 4, title: 'Art Director', reqPoints: 700, salary: 300 },
      { level: 5, title: 'Creative Director', reqPoints: 1100, salary: 500 },
      { level: 6, title: 'Chief Creative Officer', reqPoints: 1600, salary: 900 }
    ]
  },
  service: {
    id: "service",
    name: "Service & Retail",
    description: "Work counters, shop floors, and late shifts while building people skills.",
    levels: [
      { level: 1, title: 'Crew Member', reqPoints: 0, salary: 35 },
      { level: 2, title: 'Shift Lead', reqPoints: 90, salary: 70 },
      { level: 3, title: 'Assistant Manager', reqPoints: 240, salary: 120 },
      { level: 4, title: 'Store Manager', reqPoints: 520, salary: 220 },
      { level: 5, title: 'Area Manager', reqPoints: 900, salary: 380 },
      { level: 6, title: 'Operations Director', reqPoints: 1400, salary: 700 }
    ]
  }
};

export const CAREER_ACTIVITY_WINDOWS = {
  projectWork: { startHour: 6, endHour: 24, requireFinish: true },
  interview: { startHour: 9, endHour: 17 },
};

export const JOB_SEARCH_OPTIONS = {
  job_center: {
    id: 'job_center',
    name: 'Visit the Job Centre',
    description: 'Queue up, scan the notice boards, and let an adviser point you at starter roles.',
    durationTicks: 12,
    energyCost: 12,
    moodCost: 4,
    targetTrack: 'service',
    primaryStat: 'socialIq',
    secondaryStat: 'confidence',
    scoreBonus: 14,
    minimumScore: 25,
    availableWindow: { startHour: 8, endHour: 17, requireFinish: true },
    successLog: 'The Job Centre adviser lined up a Service & Retail interview. You got hired as a Crew Member.',
    failLog: 'The Job Centre had leads, but nothing stuck today. You leave with a few names to try later.',
    activityText: 'visited the Job Centre',
  },
  beat_pavement: {
    id: 'beat_pavement',
    name: 'Beat the Pavement',
    description: 'Walk Endleigh with printed CVs and ask managers if they need anyone this week.',
    durationTicks: 36,
    energyCost: 20,
    hygieneCost: 10,
    targetTrack: 'service',
    primaryStat: 'confidence',
    secondaryStat: 'style',
    scoreBonus: 10,
    minimumScore: 28,
    availableWindow: { startHour: 8, endHour: 18, requireFinish: true },
    successLog: 'A tired manager liked that you showed up in person. You got hired into Service & Retail.',
    failLog: ({ durationLabel }) => `You handed out CVs for ${durationLabel}, but every manager said to apply online.`,
    activityText: 'beat the pavement around Endleigh',
  },
  job_websites: {
    id: 'job_websites',
    name: 'Check Job Websites',
    description: 'Use your basic phone to trawl listings, fill forms, and send awkward first CVs.',
    durationTicks: 8,
    energyCost: 8,
    moodCost: 2,
    requiresItem: 'basic_phone',
    targetTrack: 'tech',
    primaryStat: 'programming',
    secondaryStat: 'intelligence',
    scoreBonus: 8,
    minimumScore: 24,
    availableWindow: { startHour: 7, endHour: 24 },
    successLog: 'A small support desk replied to your online application. You got hired into Software Engineering.',
    failLog: ({ durationLabel }) => `The job sites ate ${durationLabel}. You bookmarked a few listings, but no interview yet.`,
    activityText: 'checked job websites on your basic phone',
  }
};

const ALL_PROJECTS = [
  // Corporate
  { id: 'coffee_run', track: 'corporate', name: 'Organize Office Coffee Run', tier: 1, durationTicks: 10, requirements: { stats: { cha: 10 } }, rewardPoints: 10 },
  { id: 'pitch_deck', track: 'corporate', name: 'Draft Pitch Deck', tier: 2, durationTicks: 20, requirements: { stats: { int: 20, cha: 20 } }, rewardPoints: 30 },
  { id: 'client_meeting', track: 'corporate', name: 'Lead Client Meeting', tier: 3, durationTicks: 30, requirements: { stats: { cha: 40, int: 30 } }, rewardPoints: 50 },
  { id: 'budget_proposal', track: 'corporate', name: 'Annual Budget Proposal', tier: 4, durationTicks: 40, requirements: { stats: { int: 60 } }, rewardPoints: 100 },
  { id: 'merger_acquisition', track: 'corporate', name: 'M&A Due Diligence', tier: 5, durationTicks: 60, requirements: { stats: { int: 80, cha: 60 } }, rewardPoints: 200 },
  
  // Tech
  { id: 'bug_fixes', track: 'tech', name: 'Fix Minor Bugs', tier: 1, durationTicks: 10, requirements: { stats: { int: 20 } }, rewardPoints: 15 },
  { id: 'feature_dev', track: 'tech', name: 'Develop Feature X', tier: 2, durationTicks: 25, requirements: { stats: { int: 40 } }, rewardPoints: 35 },
  { id: 'system_arch', track: 'tech', name: 'Design System Architecture', tier: 3, durationTicks: 40, requirements: { stats: { int: 60, str: 10 } }, rewardPoints: 70 },
  { id: 'mentor_juniors', track: 'tech', name: 'Mentor Junior Devs', tier: 4, durationTicks: 30, requirements: { stats: { int: 70, cha: 40 } }, rewardPoints: 90 },
  { id: 'lead_rewrite', track: 'tech', name: 'Lead Platform Rewrite', tier: 5, durationTicks: 70, requirements: { stats: { int: 90, str: 30 } }, rewardPoints: 250 },

  // Creative
  { id: 'social_assets', track: 'creative', name: 'Create Social Media Assets', tier: 1, durationTicks: 15, requirements: { stats: { cha: 20 } }, rewardPoints: 20 },
  { id: 'wireframing', track: 'creative', name: 'Wireframe New App', tier: 2, durationTicks: 25, requirements: { stats: { cha: 30, int: 20 } }, rewardPoints: 40 },
  { id: 'brand_guidelines', track: 'creative', name: 'Develop Brand Guidelines', tier: 3, durationTicks: 35, requirements: { stats: { cha: 50, int: 30 } }, rewardPoints: 60 },
  { id: 'ad_campaign', track: 'creative', name: 'Direct Ad Campaign', tier: 4, durationTicks: 45, requirements: { stats: { cha: 70 } }, rewardPoints: 110 },
  { id: 'rebrand_company', track: 'creative', name: 'Full Company Rebrand', tier: 5, durationTicks: 65, requirements: { stats: { cha: 90, int: 50 } }, rewardPoints: 220 },

  // Service & Retail
  { id: 'cover_counter', track: 'service', name: 'Cover the Counter Rush', tier: 1, durationTicks: 10, requirements: { stats: { socialIq: 10 } }, rewardPoints: 12 },
  { id: 'restock_shift', track: 'service', name: 'Restock the Shop Floor', tier: 1, durationTicks: 12, requirements: { stats: { fitness: 10 } }, rewardPoints: 12 },
  { id: 'handle_complaints', track: 'service', name: 'Handle Customer Complaints', tier: 2, durationTicks: 20, requirements: { stats: { confidence: 20, socialIq: 20 } }, rewardPoints: 30 },
  { id: 'train_new_hires', track: 'service', name: 'Train New Hires', tier: 3, durationTicks: 30, requirements: { stats: { socialIq: 35, empathy: 25 } }, rewardPoints: 55 },
  { id: 'weekly_rota', track: 'service', name: 'Build the Weekly Rota', tier: 4, durationTicks: 36, requirements: { stats: { negotiation: 45, socialIq: 40 } }, rewardPoints: 90 },
  { id: 'regional_launch', track: 'service', name: 'Open a New Regional Store', tier: 5, durationTicks: 60, requirements: { stats: { negotiation: 65, confidence: 60 } }, rewardPoints: 180 },
];

export const getProjectsForTrackAndTier = (trackId, tier) => {
  return ALL_PROJECTS.filter(p => p.track === trackId && p.tier <= tier && p.tier >= tier - 1);
};
