export const courses = {
  coding_bootcamp: {
    id: "coding_bootcamp",
    name: "Coding Bootcamp",
    description: "Learn full-stack web development. Requires 50 Intelligence.",
    cost: 5000,
    durationTicks: 200,
    credentialEarned: "Full-Stack Certificate",
    requirements: { stats: { intelligence: 50 } },
    benefits: { stats: { programming: 20 } },
    exam: { stats: { programming: 60 } }
  },
  design_workshop: {
    id: "design_workshop",
    name: "UI/UX Design Workshop",
    description: "Master user interfaces and experiences.",
    cost: 2000,
    durationTicks: 100,
    credentialEarned: "Design Certificate",
    requirements: { stats: { creativity: 30 } },
    benefits: { stats: { creativity: 15, style: 5 } },
    exam: { stats: { creativity: 40 } }
  },
  marketing_seminar: {
    id: "marketing_seminar",
    name: "Digital Marketing Seminar",
    description: "Learn how to go viral and build brands.",
    cost: 1500,
    durationTicks: 80,
    credentialEarned: "Marketing Certificate",
    requirements: { stats: { charisma: 40 } },
    benefits: { stats: { marketing: 15, confidence: 5 } },
    exam: { stats: { marketing: 20 } }
  },
  gym_membership_advanced: {
    id: "gym_membership_advanced",
    name: "Advanced Personal Training",
    description: "Unlock your physical potential.",
    cost: 1000,
    durationTicks: 120,
    credentialEarned: "Fitness Certificate",
    requirements: { stats: { fitness: 40 } },
    benefits: { stats: { fitness: 20, confidence: 10 } },
    exam: { stats: { fitness: 50 } }
  },
  // University Degrees
  bachelors_cs: {
    id: "bachelors_cs",
    name: "B.S. in Computer Science",
    description: "A grueling 4-year degree. Unlocks senior tech roles.",
    cost: 40000,
    durationTicks: 800,
    credentialEarned: "Computer Science Degree",
    requirements: { stats: { intelligence: 60, programming: 40 } },
    benefits: { stats: { programming: 40, intelligence: 20 } },
    exam: { stats: { intelligence: 75, programming: 75 } }
  },
  mba: {
    id: "mba",
    name: "Master of Business Administration",
    description: "The fast track to corporate leadership.",
    cost: 60000,
    durationTicks: 600,
    credentialEarned: "MBA",
    requirements: { stats: { corporate: 50, finance: 50 } },
    benefits: { stats: { corporate: 30, finance: 30, negotiation: 20 } },
    exam: { stats: { corporate: 70, finance: 70, negotiation: 60 } }
  },
  culinary_arts: {
    id: "culinary_arts",
    name: "Culinary Arts Degree",
    description: "Master the kitchen.",
    cost: 25000,
    durationTicks: 400,
    credentialEarned: "Culinary Degree",
    requirements: { stats: { culinary: 40, creativity: 30 } },
    benefits: { stats: { culinary: 35, creativity: 15 } },
    exam: { stats: { culinary: 65, creativity: 50 } }
  }
};
