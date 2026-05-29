export const gigs = {
  // --- Standard Gigs (Tier 1) ---
  data_entry: {
    id: "data_entry",
    name: "Data Entry",
    description: "Boring but steady freelance work.",
    type: "Gig",
    requirements: { stats: { intelligence: 10 } },
    durationTicks: 20,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 100, stress: 10, rep: 5 },
  },
  logo_design: {
    id: "logo_design",
    name: "Design Company Logo",
    description: "Design a logo for a local startup.",
    type: "Gig",
    requirements: { stats: { creativity: 20 }, credentials: ["Design Certificate"] },
    durationTicks: 30,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 300, stress: 15, rep: 10 },
  },

  // --- Intermediate Gigs (Tier 2, Req Rep > 50) ---
  freelance_web_dev: {
    id: "freelance_web_dev",
    name: "Build Landing Page",
    description: "Build a sleek landing page. Requires decent rep.",
    type: "Gig",
    requirements: { stats: { programming: 30 }, credentials: ["Full-Stack Certificate"], rep: 50 },
    durationTicks: 40,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 600, stress: 20, rep: 15 },
  },
  social_media_management: {
    id: "social_media_management",
    name: "Manage Campaign",
    description: "Run a short social media campaign.",
    type: "Gig",
    requirements: { stats: { marketing: 35 }, credentials: ["Marketing Certificate"], rep: 50 },
    durationTicks: 50,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 700, stress: 25, rep: 15 },
  },

  // --- VIP Gigs (Tier 3, Req Rep > 200) ---
  enterprise_architecture: {
    id: "enterprise_architecture",
    name: "VIP: Enterprise Architecture",
    description: "Design a massive backend system for a tech giant.",
    type: "Gig",
    requirements: { stats: { programming: 60 }, credentials: ["Computer Science Degree"], rep: 200 },
    durationTicks: 100,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 5000, stress: 50, rep: 50 },
  },
  branding_overhaul: {
    id: "branding_overhaul",
    name: "VIP: National Branding",
    description: "Rebrand a major national company.",
    type: "Gig",
    requirements: { stats: { creativity: 60, marketing: 50 }, credentials: ["Design Certificate", "MBA"], rep: 200 },
    durationTicks: 100,
    availableWindow: { startHour: 7, endHour: 24, requireFinish: true },
    rewards: { money: 6000, stress: 60, rep: 50 },
  }
};

export const sideHustles = {
  rideshare: {
    id: 'rideshare',
    name: 'Rideshare Driver',
    description: 'Drive people around in your spare time. Steady cash, high energy drain.',
    requirements: { vehicles: ['sports_car'] }, // Need a car
    availableWindow: { startHour: 6, endHour: 2, requireFinish: true },
    energyCostPerTick: 5,
    moneyPerTick: 15
  },
  simtube: {
    id: 'simtube',
    name: 'SimTube Streamer',
    description: 'Stream games online. High charisma needed, builds followers.',
    requirements: { stats: { gaming: 30, charisma: 30 } },
    availableWindow: { startHour: 12, endHour: 2, requireFinish: true },
    energyCostPerTick: 3,
    moneyPerTick: 20
  }
};
