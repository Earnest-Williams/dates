export const ROUTINES = [
  {
    id: 'read_fiction',
    label: 'Read for Pleasure',
    location: 'home',
    allowedTimes: ['morning', 'afternoon', 'evening'],
    durationTicks: 3,
    energyCost: 4,
    effects: { mood: 8, intelligence: 1 },
    tags: ['quiet', 'literary', 'cozy'],
    furnitureReqs: ['bookshelf'],
    logTemplate: 'Read a few cozy chapters and relaxed. (+8 Mood, +1 Intelligence)',
  },
  {
    id: 'reread_favorite',
    label: 'Re-read a Favorite Book',
    location: 'home',
    allowedTimes: ['evening'],
    durationTicks: 2,
    energyCost: 2,
    effects: { mood: 10, empathy: 1 },
    tags: ['quiet', 'nostalgic'],
    logTemplate: 'Re-read a favorite book and felt grounded. (+10 Mood, +1 Empathy)',
    memoryChance: 0.35,
  },
  {
    id: 'play_computer_game',
    label: 'Play a Computer Game',
    location: 'home',
    allowedTimes: ['afternoon', 'evening'],
    durationTicks: 4,
    energyCost: 6,
    effects: { mood: 9, gaming: 1 },
    tags: ['fun', 'digital'],
    furnitureReqs: ['gaming_pc'],
    logTemplate: 'Played games for a while and unwound. (+9 Mood, +1 Gaming)',
  },
  {
    id: 'cook_simple_meal',
    label: 'Cook a Simple Meal',
    location: 'home',
    allowedTimes: ['morning', 'afternoon', 'evening'],
    durationTicks: 3,
    energyCost: 5,
    effects: { hunger: -35, mood: 4, culinary: 1, hygiene: -4 },
    tags: ['food', 'cozy'],
    furnitureReqs: ['hot_plate', 'gas_range'],
    anyFurniture: true,
    logTemplate: 'Cooked a simple homemade meal. (-35 Hunger, +4 Mood, +1 Culinary)',
  },
  {
    id: 'make_tea_coffee', label: 'Make Tea or Coffee', location: 'home', allowedTimes: ['morning', 'afternoon'], durationTicks: 1, energyCost: 0,
    effects: { mood: 5, energy: 8, hunger: 3 }, tags: ['cozy', 'drink'], furnitureReqs: ['smart_fridge'],
    logTemplate: 'Made tea/coffee and took a breather. (+8 Energy, +5 Mood)',
  },
  { id: 'journal', label: 'Journal', location: 'home', allowedTimes: ['evening'], durationTicks: 2, energyCost: 2, effects: { mood: 7, confidence: 1 }, tags: ['quiet', 'reflective'], logTemplate: 'Journaling helped clear your head. (+7 Mood, +1 Confidence)' },
  { id: 'take_walk', label: 'Take a Walk', location: 'city', allowedTimes: ['morning', 'afternoon'], durationTicks: 3, energyCost: 6, effects: { mood: 6, fitness: 1, hygiene: -2 }, tags: ['outdoor', 'light'], logTemplate: 'Took a light walk and got some fresh air. (+6 Mood, +1 Fitness)' },
  { id: 'tidy_apartment', label: 'Tidy the Apartment', location: 'home', allowedTimes: ['morning', 'afternoon'], durationTicks: 2, energyCost: 4, effects: { hygiene: 12, mood: 4 }, tags: ['chores', 'home'], logTemplate: 'Tidied up the apartment. (+12 Hygiene, +4 Mood)' },
  { id: 'call_family_friend', label: 'Call a Parent or Friend', location: 'any', allowedTimes: ['evening'], durationTicks: 2, energyCost: 1, effects: { mood: 8, socialIq: 1 }, tags: ['social', 'support'], logTemplate: 'Had a warm call with family/friends. (+8 Mood, +1 Social IQ)', memoryChance: 0.45 },
  { id: 'browse_library', label: 'Browse the Library', location: 'city', allowedTimes: ['afternoon'], durationTicks: 3, energyCost: 5, effects: { mood: 5, intelligence: 1 }, tags: ['literary', 'public'], logTemplate: 'Browsed the library stacks. (+5 Mood, +1 Intelligence)' },
  { id: 'light_workout', label: 'Do a Light Workout', location: 'home', allowedTimes: ['morning', 'afternoon'], durationTicks: 3, energyCost: 10, effects: { mood: 5, fitness: 1, hygiene: -8 }, tags: ['fitness', 'light'], furnitureReqs: ['yoga_mat'], logTemplate: 'Finished a gentle workout session. (+5 Mood, +1 Fitness)' },
  { id: 'comfort_tv', label: 'Watch Comfort TV', location: 'home', allowedTimes: ['evening'], durationTicks: 4, energyCost: 3, effects: { mood: 11 }, tags: ['cozy', 'media'], furnitureReqs: ['smart_tv'], logTemplate: 'Watched comfort TV and decompressed. (+11 Mood)' },
];

export const getRoutineTimeBucket = (hour) => {
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const HOME_SETTLEMENTS = {
  0: 'Endleigh',
  1: 'Bramblewick',
  2: 'Stagborough',
  3: 'Brockleigh',
};

export const isRoutineAvailable = (routine, state) => {
  const hour = state?.time?.hour ?? 0;
  const timeBucket = getRoutineTimeBucket(hour);
  const housingTier = state?.stats?.housingTier ?? 0;
  const atHome = state?.activeLocation === (HOME_SETTLEMENTS[housingTier] || 'Endleigh');

  const timeOk = (routine.allowedTimes || []).includes(timeBucket);
  const energy = state?.needs?.energy ?? 0;
  const energyOk = energy >= (routine.energyCost || 0);
  const locationOk =
    routine.location === 'any' ||
    (routine.location === 'home' ? atHome : !atHome);

  const hunger = state?.needs?.hunger ?? 0;
  const needsOk = !(routine.id === 'cook_simple_meal' && hunger < 30);
  const relationshipOk =
    routine.id !== 'call_family_friend' || Object.keys(state?.matches || {}).length > 0;

  const reqs = routine.furnitureReqs || [];
  const placedFurniture = state?.placedFurniture || [];
  const furnitureOk = routine.anyFurniture
    ? reqs.some((id) => placedFurniture.includes(id))
    : reqs.every((id) => placedFurniture.includes(id));

  return timeOk && energyOk && locationOk && needsOk && relationshipOk && furnitureOk;
};
