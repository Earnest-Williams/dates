import { ITEMS } from '../data/items.js';

export const decayNeeds = (currentNeeds, hoursPassed, activeTraits = [], stats = {}) => {
  let hungerRate = 5;
  let energyRate = 2;
  let hygieneRate = 1.5;
  let moodRate = 1.0;

  // Inherited Traits
  if (activeTraits.includes('workaholic')) {
    energyRate *= 0.8; 
    moodRate *= 1.2; 
  }

  // RPG Stat Perks
  if (stats.fitness >= 50) { // "Marathoner"
    energyRate *= 0.7; 
  }
  if (stats.confidence >= 50) { // "Iron Will"
    moodRate *= 0.5; 
  }
  if (stats.culinary >= 50) { // "Iron Stomach"
    hungerRate *= 0.8;
  }

  let newHunger = currentNeeds.hunger + (hoursPassed * hungerRate);
  let newEnergy = currentNeeds.energy - (hoursPassed * energyRate);
  let newHygiene = currentNeeds.hygiene - (hoursPassed * hygieneRate);
  let newHealth = currentNeeds.health !== undefined ? currentNeeds.health : 100;
  let newMood = currentNeeds.mood !== undefined ? currentNeeds.mood : 100;

  // Passive Mood decay
  newMood -= hoursPassed * moodRate;

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
