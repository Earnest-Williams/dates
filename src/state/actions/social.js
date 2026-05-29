import { NPCS } from '../../data/npcs.js';
import { LOCATIONS } from '../../data/locations.js';
import { getTimeWindowStatus } from '../../sim/time.js';

export const swipeNpc = (state, dispatch, npcId, direction) => {
  if (!state.living.utilitiesActive || state.needs.hygiene < 30) return false;

  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return false;

  const isPremium = state.swipePremium?.active || false;

  if (direction === 'right' && npc.gatedBy && !isPremium) {
    if (npc.gatedBy.type === 'stat') {
      if (state.stats[npc.gatedBy.stat] < npc.gatedBy.value) return false;
    } else if (npc.gatedBy.type === 'asset') {
      const hasAsset = npc.gatedBy.assets.some(asset => state.properties.vehicles.includes(asset));
      if (!hasAsset) return false;
    }
  }

  dispatch({ type: 'SWIPE_NPC', payload: { npcId, direction } });
  return true;
};

export const giveGift = () => {
  return false;
};

export const answerDialogue = (state, dispatch, npcId, optionIndex) => {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return false;
  const choice = npc.dialogue.choices[optionIndex];
  if (!choice) return false;

  dispatch({ type: 'ANSWER_DIALOGUE', payload: { npcId, optionIndex } });
  return true;
};

export const goOnDate = (state, dispatch, npcId, locationKey, dateType = null) => {
  const location = LOCATIONS[locationKey];
  const npc = NPCS.find(n => n.id === npcId);
  if (!location || !npc) return false;

  const timeStatus = getTimeWindowStatus(state.time, location.availableWindow, 6);
  if (!timeStatus.available) {
    dispatch({ type: 'ADD_LOG', payload: { message: `Date at ${location.name} is not practical right now. ${timeStatus.reason}` } });
    return false;
  }

  const totalCost = location.energyCost + 10;
  if (state.needs.energy < totalCost) return false;

  // Check travel feasibility
  if (location.gated) {
    const ownsSportsCar = state.properties.vehicles.includes('sports_car');
    const hasStyle = state.stats.style >= location.reqStyle;
    if (!ownsSportsCar && !hasStyle) return false;
  }

  dispatch({ type: 'GO_ON_DATE', payload: { npcId, locationKey, dateType } });
  return true;
};

export const resolveDateEvent = (state, dispatch, finalVibe, logText, dateOutcome = {}) => {
  dispatch({ type: 'RESOLVE_DATE_EVENT', payload: { finalVibe, logText, dateOutcome } });
};

export const resolveStoryEvent = (state, dispatch, npcId, success) => {
  dispatch({ type: 'RESOLVE_STORY_EVENT', payload: { npcId, success } });
  return true;
};

export const proposeMarriage = (state, dispatch, npcId) => {
  const rel = state.matches[npcId]?.relationship || 0;
  const chem = state.matches[npcId]?.chemistry || 10;
  if (rel < 80 || state.stats.housingTier < 2 || chem < 60) return false;

  dispatch({ type: 'PROPOSE_MARRIAGE', payload: { npcId } });
  return true;
};

export const completeWedding = (state, dispatch, style, childName) => {
  dispatch({ type: 'COMPLETE_WEDDING', payload: { style, childName } });
};

export const selectParentingChoice = (state, dispatch, cost, statGains, stressIncrease) => {
  dispatch({ type: 'SELECT_PARENTING_CHOICE', payload: { cost, statGains, stressIncrease } });
  return true;
};

export const beginLegacy = (state, dispatch) => {
  dispatch({ type: 'BEGIN_LEGACY' });
};

export const subscribePremium = (state, dispatch) => {
  const fee = 15;
  if (state.stats.money < fee) return false;
  dispatch({ type: 'SUBSCRIBE_PREMIUM' });
  return true;
};

export const cancelPremium = (state, dispatch) => {
  dispatch({ type: 'CANCEL_PREMIUM' });
  return true;
};

export const updateSwipePreferences = (state, dispatch, preferredStat) => {
  dispatch({ type: 'UPDATE_SWIPE_PREFERENCES', payload: { preferredStat } });
  return true;
};

export const changeRelationship = (state, dispatch, npcId, delta) => {
  dispatch({ type: 'CHANGE_RELATIONSHIP', payload: { npcId, delta } });
};

export const reduceChildStress = (state, dispatch, energyCost, stressReduction) => {
  dispatch({ type: 'REDUCE_CHILD_STRESS', payload: { energyCost, stressReduction } });
  return true;
};

export const askToMoveIn = (state, dispatch, npcId) => {
  dispatch({ type: 'ASK_TO_MOVE_IN', payload: { npcId } });
  return true;
};

export const instantMatch = (state, dispatch, npcId) => {
  dispatch({ type: 'INSTANT_MATCH', payload: { npcId } });
  return true;
};

export const resolveNpcAlert = (state, dispatch, optionIndex) => {
  dispatch({ type: 'RESOLVE_NPC_ALERT', payload: { optionIndex } });
  return true;
};
