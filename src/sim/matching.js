import { ARCHETYPES } from '../data/npcs.js';

export const calculateMatchProbability = (stats, npc, preferences = {}, isPremium = false) => {
  const baseChance = 25;
  const styleBonus = (stats.style || 0) / 4;
  const charismaBonus = (stats.charisma || 0) / 4;
  const confidenceBonus = (stats.confidence || 0) / 4;
  const socialIqBonus = (stats.socialIq || 0) / 4;
  const marketingBonus = (stats.marketing || 0) / 4;

  const arch = ARCHETYPES[npc.archetype];
  if (!arch) {
    return Math.min(95, Math.max(5, baseChance + styleBonus + charismaBonus + confidenceBonus + socialIqBonus + marketingBonus));
  }

  let matchBonus = 0;
  
  // Primary preference
  if (stats[arch.primaryStat] >= 40) matchBonus += 20;
  if (stats[arch.primaryStat] >= 70) matchBonus += 15;
  // Secondary preference
  if (stats[arch.secondaryStat] >= 40) matchBonus += 10;
  if (stats[arch.secondaryStat] >= 70) matchBonus += 10;
  // Tertiary preference
  if (stats[arch.tertiaryStat] >= 40) matchBonus += 5;

  // Preference matching
  if (preferences?.preferredStat === arch.primaryStat) {
    matchBonus += 20;
  } else if (preferences?.preferredStat) {
    matchBonus -= 10;
  }

  // Premium boost
  if (isPremium) {
    matchBonus += 20;
  }

  // RPG Perks
  if (stats.charisma >= 50) matchBonus += 10; // Charmer
  if (stats.style >= 50) matchBonus += 10; // Fashionista
  if (stats.socialIq >= 50) matchBonus += 10; // Socialite

  return Math.min(95, Math.max(5, baseChance + styleBonus + charismaBonus + confidenceBonus + socialIqBonus + marketingBonus + matchBonus));
};
