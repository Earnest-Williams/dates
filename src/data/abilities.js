export const abilities = {
  smooth_talker: {
    id: 'smooth_talker',
    name: 'Smooth Talker',
    description: 'Use your charm to guarantee a successful flirt.',
    statRequirement: { charisma: 70 },
    energyCost: 15,
    effectType: 'date_vibe',
    effectValue: 15
  },
  hack_mainframe: {
    id: 'hack_mainframe',
    name: 'Hack Mainframe',
    description: 'Use your programming skills to siphon funds. High risk!',
    statRequirement: { programming: 70 },
    energyCost: 30,
    effectType: 'money',
    effectValue: 500, // Flat gain
    riskChance: 0.3, // 30% chance to fail and get fined
    riskPenalty: 1000
  },
  insider_trading: {
    id: 'insider_trading',
    name: 'Insider Trading',
    description: 'Use your corporate connections to get stock tips.',
    statRequirement: { corporate: 70 },
    energyCost: 20,
    effectType: 'stock_tip',
    effectValue: true
  },
  viral_stunt: {
    id: 'viral_stunt',
    name: 'Viral Stunt',
    description: 'Perform a crazy stunt for massive followers.',
    statRequirement: { style: 70 },
    energyCost: 25,
    effectType: 'simstagram_followers',
    effectValue: 5000,
    riskChance: 0.2, // 20% chance to lose followers instead
    riskPenalty: -2000
  }
};
