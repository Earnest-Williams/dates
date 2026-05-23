import { ITEMS } from '../data/items';

export const decayNeeds = (currentNeeds, hoursPassed) => {
  let newHunger = currentNeeds.hunger + (hoursPassed * 5);
  let newEnergy = currentNeeds.energy - (hoursPassed * 2);
  let newHygiene = currentNeeds.hygiene - (hoursPassed * 1.5);
  let newHealth = currentNeeds.health !== undefined ? currentNeeds.health : 100;
  let newMood = currentNeeds.mood !== undefined ? currentNeeds.mood : 100;

  // Passive Mood decay
  newMood -= hoursPassed * 1.0;

  // Starvation Health decay
  if (newHunger > 90) {
    newHealth -= hoursPassed * 3.0;
  }

  return {
    hunger: Math.min(100, Math.max(0, newHunger)),
    energy: Math.min(100, Math.max(0, newEnergy)),
    hygiene: Math.min(100, Math.max(0, newHygiene)),
    health: Math.min(100, Math.max(0, newHealth)),
    mood: Math.min(100, Math.max(0, newMood))
  };
};

export const getSleepMultiplier = (placedFurniture) => {
  const placedBed = (placedFurniture || []).find(id => ITEMS[id]?.category === 'bed');
  if (placedBed && ITEMS[placedBed]) {
    return ITEMS[placedBed].energyMultiplier || 1.0;
  }
  return 1.0;
};
