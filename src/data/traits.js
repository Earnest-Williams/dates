export const TRAITS = {
  workaholic: {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Earn +20% money from jobs, but Energy decays 10% faster.',
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Relationships grow 20% faster, but Mood drops faster when alone.',
  },
  burnout: {
    id: 'burnout',
    name: 'Burned Out',
    description: 'Starting Energy is capped at 80, but requires less sleep.',
  },
  prodigy: {
    id: 'prodigy',
    name: 'Prodigy',
    description: 'Gain +25% more stats when studying or working out.',
  },
  trust_fund: {
    id: 'trust_fund',
    name: 'Trust Fund Baby',
    description: 'Start with an extra $5000, but jobs pay 10% less.',
  }
};

export const calculateTraits = (finalStats, stress) => {
  const traits = [];
  
  if (stress >= 80) {
    traits.push('burnout');
  }

  const highestStat = Object.keys(finalStats).reduce((a, b) => finalStats[a] > finalStats[b] ? a : b);
  const highestValue = finalStats[highestStat];

  if (highestValue > 40 && stress < 50) {
    traits.push('prodigy');
  }

  if (finalStats.corporate > 30) {
    traits.push('workaholic');
  }

  if (finalStats.charisma > 30 || finalStats.socialIq > 30) {
    traits.push('social_butterfly');
  }

  if (finalStats.money > 10000) {
    traits.push('trust_fund');
  }

  // Keep max 2 traits
  return traits.slice(0, 2);
};
