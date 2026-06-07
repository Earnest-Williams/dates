export const FURNITURE = {
  twin_bed: {
    id: "twin_bed",
    name: "Twin Bed",
    type: "furniture",
    category: "bed",
    cost: 150,
    slots: 1,
    desc: "A small basic mattress. Restores +10% energy/hr sleep.",
    energyMultiplier: 1.10,
    tags: ['functional', 'cozy']
  },
  queen_bed: {
    id: "queen_bed",
    name: "Queen Bed",
    type: "furniture",
    category: "bed",
    cost: 500,
    slots: 1,
    desc: "Spacious enough for two. Restores +25% energy/hr sleep.",
    energyMultiplier: 1.25,
    tags: ['cozy', 'modern']
  },
  king_bed: {
    id: "king_bed",
    name: "King Bed",
    type: "furniture",
    category: "bed",
    cost: 1500,
    slots: 2,
    desc: "Pure luxury. Restores +50% energy/hr sleep.",
    energyMultiplier: 1.50,
    tags: ['luxury', 'modern']
  },
  hot_plate: {
    id: "hot_plate",
    name: "Electric Hot Plate",
    type: "furniture",
    category: "kitchen",
    cost: 60,
    slots: 1,
    desc: "Allows basic cooking at home (recovers 30 hunger).",
    hungerRecover: 30,
    tags: ['functional']
  },
  gas_range: {
    id: "gas_range",
    name: "Gas Range Stove",
    type: "furniture",
    category: "kitchen",
    cost: 450,
    slots: 2,
    desc: "Allows premium cooking (recovers 60 hunger, +15 mood).",
    hungerRecover: 60,
    moodBonus: 15,
    tags: ['modern', 'functional']
  },
  smart_fridge: {
    id: "smart_fridge",
    name: "Smart Fridge",
    type: "furniture",
    category: "kitchen",
    cost: 1200,
    slots: 2,
    desc: "Halves weekly grocery bills and stores fresh ingredients.",
    groceryDiscount: 0.5,
    tags: ['modern', 'organized']
  },
  bookshelf: {
    id: "bookshelf",
    name: "Wooden Bookshelf",
    type: "furniture",
    category: "decor",
    cost: 200,
    slots: 1,
    desc: "Organizes books. Boosts study gains by +25%.",
    studyMultiplier: 1.25,
    tags: ['literary', 'cozy']
  },
  smart_tv: {
    id: "smart_tv",
    name: "55\" Smart TV",
    type: "furniture",
    category: "decor",
    cost: 600,
    slots: 1,
    desc: "Enables 'Watch TV' action to restore +30 Mood.",
    unlocksAction: "watch_tv",
    tags: ['modern', 'cozy']
  },
  yoga_mat: {
    id: "yoga_mat",
    name: "Foldout Yoga Mat",
    type: "furniture",
    category: "decor",
    cost: 120,
    slots: 1,
    desc: "Creates space for stretching, breath work, and home workouts.",
    tags: ['fitness', 'functional']
  },
  luxury_painting: {
    id: "luxury_painting",
    name: "Abstract Canvas",
    type: "furniture",
    category: "decor",
    cost: 1000,
    slots: 1,
    desc: "Brings style and charm to your room (+5 Style, +5 Charm).",
    statBoost: { style: 5, charm: 5 },
    tags: ['artistic', 'luxury']
  }
};


export const HOME_STYLE_TAGS = [
  'cozy',
  'literary',
  'modern',
  'fitness',
  'artistic',
  'luxury',
  'functional',
  'organized',
];

export const NPC_HOME_STYLE_REACTIONS = {
  elena: ['literary', 'cozy'],
  sophia: ['luxury', 'modern'],
  chloe: ['artistic', 'cozy'],
  rina: ['luxury', 'modern'],
  maya: ['artistic', 'literary'],
  nora: ['organized', 'modern'],
};

export const HOME_ACTIVITIES = {
  host_dinner: { tags: ['cozy', 'modern'], dateType: 'home_dinner' },
  movie_night: { tags: ['cozy', 'modern', 'artistic'], dateType: 'movie_night' },
  study_together: { tags: ['literary', 'organized'], dateType: 'study_date' },
  cook_together: { tags: ['functional', 'cozy'], dateType: 'home_dinner' },
  quiet_reading_evening: { tags: ['literary', 'cozy'], dateType: 'quiet_evening_in' },
  workout_together: { tags: ['fitness', 'functional'], dateType: 'workout_date' },
  decorate_together: { tags: ['artistic', 'cozy'], dateType: 'quiet_evening_in' },
  decompress_after_work: { tags: ['cozy', 'organized'], dateType: 'quiet_evening_in' },
  help_with_personal_project: { tags: ['literary', 'artistic', 'organized'], dateType: 'study_date' },
};

export const calculateHomeStyleProfile = (placedFurniture) => {
  const profile = Object.fromEntries(HOME_STYLE_TAGS.map((tag) => [tag, 0]));
  for (const furnitureId of placedFurniture || []) {
    const furniture = FURNITURE[furnitureId];
    if (!furniture) continue;
    for (const tag of furniture.tags || []) {
      profile[tag] = (profile[tag] || 0) + 1;
    }
  }
  return profile;
};

export const getDominantHomeStyles = (placedFurniture) => {
  const profile = calculateHomeStyleProfile(placedFurniture);
  return Object.entries(profile)
    .filter(([, count]) => count > 0)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([tag]) => tag);
};

export const getNpcHomeStyleReaction = (npcId, placedFurniture) => {
  const dominantStyles = getDominantHomeStyles(placedFurniture);
  const preferredStyles = NPC_HOME_STYLE_REACTIONS[npcId] || [];
  const matchingStyles = dominantStyles.filter((tag) => preferredStyles.includes(tag));
  if (matchingStyles.length > 0) {
    return {
      fit: 'comfortable',
      tags: matchingStyles,
      text: `They notice the ${matchingStyles.join('/')} feel of your home.`,
    };
  }
  if (dominantStyles.length === 0) {
    return { fit: 'blank', tags: [], text: 'Your home still feels like a blank slate.' };
  }
  return {
    fit: 'curious',
    tags: dominantStyles,
    text: `They learn something about your ${dominantStyles.join('/')} style.`,
  };
};
