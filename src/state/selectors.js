import { calculateMatchProbability } from '../sim/matching.js';
import { NPCS } from '../data/npcs.js';

export const getFormattedTime = (state) => {
  const { hour, minute } = state.time;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
};

export const calculateMatchChance = (state, npcId) => {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return 0;
  return calculateMatchProbability(state.stats, npc, state.swipePreferences, state.swipePremium?.active);
};

export const checkActionFeasibility = (state, actionName, energyCost, moneyCost = 0) => {
  if (state.needs.energy < energyCost) {
    return { feasible: false, reason: "Too exhausted! You need sleep." };
  }
  if (state.stats.money < moneyCost) {
    return { feasible: false, reason: "Not enough money!" };
  }
  if (state.needs.hunger >= 95) {
    return { feasible: false, reason: "Starving! You must eat first." };
  }
  if (state.needs.health !== undefined && state.needs.health < 20) {
    return { feasible: false, reason: "Too sick! Visit the hospital first." };
  }

  const isWorkOrStudy = actionName.toLowerCase().includes('work') || actionName.toLowerCase().includes('study');
  if (isWorkOrStudy && state.needs.mood !== undefined && state.needs.mood < 30) {
    return { feasible: false, reason: "Too depressed! Do something fun first." };
  }

  return { feasible: true };
};
