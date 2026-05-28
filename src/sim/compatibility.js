const COMPATIBILITY_TRAIT_KEYS = [
  'ambition',
  'socialStyle',
  'affectionStyle',
  'conflictStyle',
  'familyGoal',
  'spendingStyle',
  'emotionalOpenness',
];

const PLAYER_TRAIT_INFERENCE_MAP = {
  intelligence: { ambition: 'high', emotionalOpenness: 'slow_burn' },
  corporate: { ambition: 'high', spendingStyle: 'careful' },
  creativity: { socialStyle: 'expressive', emotionalOpenness: 'open_book' },
  confidence: { conflictStyle: 'direct', socialStyle: 'expressive' },
  empathy: { affectionStyle: 'acts_of_service', conflictStyle: 'collaborative' },
  finance: { spendingStyle: 'careful', familyGoal: 'stable_home' },
};

const DEFAULT_PLAYER_TRAITS = {
  ambition: 'balanced',
  socialStyle: 'quiet',
  affectionStyle: 'quality_time',
  conflictStyle: 'collaborative',
  familyGoal: 'undecided',
  spendingStyle: 'balanced',
  emotionalOpenness: 'slow_burn',
};

export const generateCompatibilityTraits = (seed) => {
  const variants = {
    ambition: ['high', 'balanced', 'steady'],
    socialStyle: ['quiet', 'expressive', 'mixed'],
    affectionStyle: ['acts_of_service', 'quality_time', 'words'],
    conflictStyle: ['withdraws', 'collaborative', 'direct'],
    familyGoal: ['wants_children', 'undecided', 'stable_home'],
    spendingStyle: ['careful', 'balanced', 'generous'],
    emotionalOpenness: ['slow_burn', 'open_book', 'guarded'],
  };

  const safeSeed = typeof seed === 'string' ? seed : String(seed || '');
  const suffix = [...safeSeed].reduce((total, char) => total + char.charCodeAt(0), 0);
  const traits = {};

  COMPATIBILITY_TRAIT_KEYS.forEach((key, index) => {
    const options = variants[key];
    traits[key] = options[(suffix + index) % options.length];
  });

  return traits;
};

export const inferPlayerCompatibilityTraits = (stats = {}, currentTraits = DEFAULT_PLAYER_TRAITS) => {
  const nextTraits = { ...currentTraits };

  Object.entries(PLAYER_TRAIT_INFERENCE_MAP).forEach(([statKey, inferredTraits]) => {
    const statValue = stats[statKey] || 0;
    if (statValue >= 60) {
      Object.assign(nextTraits, inferredTraits);
    }
  });

  return nextTraits;
};

export const calculateCompatibilityScore = (playerTraits, npcTraits) => {
  const total = COMPATIBILITY_TRAIT_KEYS.length;
  let matches = 0;

  COMPATIBILITY_TRAIT_KEYS.forEach((key) => {
    if (playerTraits?.[key] && npcTraits?.[key] && playerTraits[key] === npcTraits[key]) {
      matches += 1;
    }
  });

  return Math.round((matches / total) * 100);
};

export const getCompatibilityBand = (score) => {
  if (score >= 70) return 'strong';
  if (score >= 40) return 'mixed';
  return 'fragile';
};
