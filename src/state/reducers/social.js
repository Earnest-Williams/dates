import { NPCS } from '../../data/npcs.js';
import { LOCATIONS } from '../../data/locations.js';
import { getDateTemplate } from '../../data/dates.js';
import { getNpcHomeStyleReaction } from '../../data/furniture.js';
import { calculateMatchProbability } from '../../sim/matching.js';
import { calculateTravelStats } from '../../data/geography.js';
import { simulateTicks } from './time.js';
import { calculateTraits } from '../../data/traits.js';
import {
  calculateCompatibilityScore,
  generateCompatibilityTraits,
  getCompatibilityBand,
  inferPlayerCompatibilityTraits,
} from '../../sim/compatibility.js';
import { scoreDatePhaseChoice } from '../../sim/dateScoring.js';
import { applyDateDiminishingReturns, recordDateInHistory } from '../../sim/dateDiminishingReturns.js';
import { appendRelationshipEvent } from '../../sim/relationshipEvents.js';
import { evaluateRepairAction } from '../../sim/relationshipRepair.js';
import { checkDateConflictTrigger } from '../../sim/relationshipConflicts.js';
import {
  adjustReputationForOrganicEncounter,
  adjustReputationForPublicDate,
  calculateGossipRisk,
  selectRelevantReputationCircle,
} from '../../sim/reputation.js';
import { describeTimePassage, getTimeWindowStatus } from '../../sim/time.js';

const createEmptyMemory = () => ({
  rememberedChoices: [],
  sharedActivities: [],
  promises: {},
  importantMoments: [],
  comfortKnown: [],
  lastMeaningfulInteractionDay: null
});

const addUnique = (items, value) => {
  if (!value) return items || [];
  const currentItems = items || [];
  if (currentItems.includes(value)) return currentItems;
  return [...currentItems, value];
};

const updateRelationshipMemory = (state, npcId, updates = {}) => {
  const currentMemory = {
    ...createEmptyMemory(),
    ...(state.relationshipMemory?.[npcId] || {})
  };
  const nextMemory = {
    rememberedChoices: updates.rememberedChoices
      ? updates.rememberedChoices.reduce((items, v) => addUnique(items, v), currentMemory.rememberedChoices)
      : updates.rememberedChoice
        ? addUnique(currentMemory.rememberedChoices, updates.rememberedChoice)
        : currentMemory.rememberedChoices,
    sharedActivities: updates.sharedActivities
      ? [...currentMemory.sharedActivities, ...updates.sharedActivities]
      : updates.sharedActivity
        ? [...currentMemory.sharedActivities, updates.sharedActivity]
        : currentMemory.sharedActivities,
    promises: {
      ...currentMemory.promises,
      ...(updates.promises || {})
    },
    importantMoments: updates.importantMoment
      ? addUnique(currentMemory.importantMoments, updates.importantMoment)
      : currentMemory.importantMoments,
    comfortKnown: updates.comfortKnowns
      ? updates.comfortKnowns.reduce((items, v) => addUnique(items, v), currentMemory.comfortKnown)
      : updates.comfortKnown
        ? addUnique(currentMemory.comfortKnown, updates.comfortKnown)
        : currentMemory.comfortKnown,
    lastMeaningfulInteractionDay: updates.lastMeaningfulInteractionDay
      ?? currentMemory.lastMeaningfulInteractionDay
  };

  return {
    ...(state.relationshipMemory || {}),
    [npcId]: nextMemory
  };
};

const countRelationshipMemorySignals = (memory = createEmptyMemory()) => {
  return (memory.rememberedChoices?.length || 0)
    + (memory.sharedActivities?.length || 0)
    + Object.keys(memory.promises || {}).length
    + (memory.importantMoments?.length || 0)
    + (memory.comfortKnown?.length || 0);
};


const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const getReputationChange = (before = {}, after = {}, circle) => {
  if (!circle) return 0;
  return (after?.[circle] || 0) - (before?.[circle] || 0);
};

const describeReputationChange = (circle, delta, context) => {
  if (!circle || delta === 0) return null;
  const sign = delta > 0 ? '+' : '';
  return `Reputation in your ${circle} circle ${context} (${sign}${delta}).`;
};

const isPublicLocation = (locationKey) => locationKey && locationKey !== 'home';

const calculateGossipPenalty = (state, npcId, qualityScore, hasConflict) => {
  if (qualityScore >= 30 && !hasConflict) return 0;
  const gossipRisk = calculateGossipRisk(state, npcId);
  return gossipRisk > 0 ? Math.max(1, Math.ceil(gossipRisk * 4)) : 0;
};

const summarizeHomeStyle = (state, npcId) => {
  const reaction = getNpcHomeStyleReaction(npcId, state.placedFurniture || []);
  return {
    reaction,
    connectionBonus: reaction.fit === 'comfortable' ? 8 : reaction.fit === 'curious' ? 3 : 0,
    logText: reaction.text,
  };
};

const applyRelationshipCap = (currentRel, delta, storyTier = 0, stats = {}) => {
  let finalDelta = delta;
  if (finalDelta > 0 && stats.charisma >= 50) {
    finalDelta = Math.ceil(finalDelta * 1.2); // "Charmer" Perk: +20% relationship gains
  }
  const newRel = currentRel + finalDelta;
  let cap = 25;
  if (storyTier >= 1) cap = 50;
  if (storyTier >= 2) cap = 75;
  if (storyTier >= 3) cap = 100;
  
  if (currentRel >= cap && delta > 0) return currentRel;
  return Math.max(0, Math.min(newRel, cap));
};

export const socialReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_RELATIONSHIP': {
      const { npcId, delta } = action.payload;
      const currentData = state.matches[npcId] || { met: true, relationship: 10, dateCount: 0, storyTier: 0 };
      const newRel = applyRelationshipCap(currentData.relationship, delta, currentData.storyTier, state.stats);
      return {
        ...state,
        matches: {
          ...state.matches,
          [npcId]: {
            ...currentData,
            relationship: newRel
          }
        }
      };
    }

    case 'SWIPE_NPC': {
      const { npcId, direction } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;

      const isPremium = state.swipePremium?.active || false;
      const currentDay = state.time.day;
      let lastDay = state.swipeStats?.lastSwipedDay || 1;
      let swipeCount = state.swipeStats?.dailySwipesCount || 0;

      if (currentDay !== lastDay) {
        swipeCount = 0;
        lastDay = currentDay;
      }

      if (!isPremium && swipeCount >= 5) {
        return {
          ...state,
          logs: ["⚠️ Daily limit reached! Upgrade to LinkUp Gold for unlimited swipes, or wait until tomorrow.", ...state.logs].slice(0, 20)
        };
      }

      const nextSwipeStats = {
        dailySwipesCount: isPremium ? swipeCount : swipeCount + 1,
        lastSwipedDay: lastDay
      };
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `used LinkUp on ${npc.name}`);

      if (direction === 'left') {
        const logMsg = `Passed on ${npc.name}. (${isPremium ? 'Unlimited' : `Swipes left today: ${5 - nextSwipeStats.dailySwipesCount}`})`;
        return {
          ...nextState,
          swipeStats: nextSwipeStats,
          logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
        };
      }

      const matchChance = calculateMatchProbability(
        state.stats, 
        npc, 
        state.swipePreferences, 
        isPremium
      );
      const roll = Math.random() * 100;
      const matched = roll <= matchChance;

      let logMsg;
      let updatedMatches = { ...state.matches };
      if (matched) {
        updatedMatches[npcId] = { met: true, relationship: 10, chemistry: 10, dateCount: 0, storyTier: 0 };
        logMsg = `Matched with ${npc.name}! (Match chance: ${matchChance.toFixed(0)}%)`;
      } else {
        logMsg = `Swiped on ${npc.name} but no match. (Match chance: ${matchChance.toFixed(0)}%)`;
      }

      return {
        ...nextState,
        matches: updatedMatches,
        swipeStats: nextSwipeStats,
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'ANSWER_DIALOGUE': {
      const { npcId, optionIndex } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;
      const choice = npc.dialogue?.choices?.[optionIndex];
      if (!choice) return state;

      let relChange = choice.successRelation || 0;
      let logText = choice.successText;

      if (choice.checkStat) {
        const success = state.stats[choice.checkStat] >= choice.threshold;
        relChange = success ? choice.successRelation : choice.failRelation;
        logText = success ? choice.successText : choice.failText;
      }

      // Advances 30 mins (3 ticks)
      let nextState = simulateTicks(state, 3);
      const timePassage = describeTimePassage(state.time, nextState.time, `talked with ${npc.name}`);

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, chemistry: 10, dateCount: 0, storyTier: 0 };
      
      let chemChange = 0;
      if (relChange > 0) {
        chemChange = choice.checkStat ? 10 : 5;
      } else if (relChange < 0) {
        chemChange = -5;
      }
      
      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 10) + chemChange));
      const newRel = applyRelationshipCap(currentMatch.relationship, relChange, currentMatch.storyTier, nextState.stats);

      let moodIncrease = 0;
      if (relChange > 0) {
        moodIncrease = Math.min(10, Math.max(1, Math.floor(relChange * 0.5)));
      }
      const currentMood = nextState.needs.mood !== undefined ? nextState.needs.mood : 100;
      const newMood = clamp(currentMood + moodIncrease);

      const logMsg = `${timePassage} [${npc.name}] ${logText} (Rel: ${newRel}/100, Chem: ${newChem}/100${moodIncrease ? `, +${moodIncrease} Mood` : ''})`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      const memoryUpdates = {
        rememberedChoice: choice.memoryKey || `dialogue_${npcId}_${optionIndex}`,
        lastMeaningfulInteractionDay: nextState.time.day
      };
      if (relChange > 0) {
        memoryUpdates.comfortKnown = choice.checkStat ? 'attentive_support' : 'easy_conversation';
      }

      let nextStateAfterEvent = {
        ...nextState,
        relationshipMemory: updateRelationshipMemory(nextState, npcId, memoryUpdates),
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem
          }
        },
        needs: {
          ...nextState.needs,
          mood: newMood
        },
        logs: finalLogs
      };
      
      return appendRelationshipEvent(nextStateAfterEvent, npcId, {
        source: 'dialogue',
        type: relChange > 0 ? 'positive' : 'negative',
        relationshipDelta: relChange,
        chemistryDelta: chemChange,
        memoryKey: memoryUpdates.rememberedChoice,
        summary: logText
      });
    }

    case 'GO_ON_DATE': {
      const { npcId, locationKey, dateType } = action.payload;
      const dateTemplate = getDateTemplate(dateType, locationKey);
      const location = LOCATIONS[locationKey || dateTemplate.venueKey];
      const npc = NPCS.find(n => n.id === npcId);
      const timeStatus = getTimeWindowStatus(state.time, location.availableWindow, 6);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Date at ${location.name} is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20),
        };
      }

      const destinationSettlement = {
        library: 'Brockleigh',
        office: 'Brockleigh',
        mall: 'Brockleigh',
        club: 'Stagborough',
        gym: 'Stagborough',
        park: 'Bramblewick',
        home: 'Endleigh'
      }[locationKey || dateTemplate.venueKey] || 'Brockleigh';

      const travelStats = calculateTravelStats(state.activeLocation, destinationSettlement, state.properties.vehicles);
      
      let travelTicks = 6;
      let travelEnergy = 0;
      let fitnessBonus = 0;
      let vehicleUsedName = 'foot';

      if (travelStats) {
        travelTicks = travelStats.ticks;
        travelEnergy = travelStats.energyCost;
        fitnessBonus = travelStats.fitnessBonus;
        vehicleUsedName = travelStats.vehicleUsed;
      }

      let nextState = simulateTicks(state, travelTicks);
      const timePassage = describeTimePassage(state.time, nextState.time, `traveled to ${destinationSettlement}`);

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }
      
      const totalCost = travelEnergy + 10;
      const finalEnergy = Math.max(0, nextState.needs.energy - totalCost);

      const dateLocationKey = locationKey || dateTemplate.venueKey;
      const reputationCircle = selectRelevantReputationCircle(npcId);
      const reputationAfterPublicDate = isPublicLocation(dateLocationKey)
        ? adjustReputationForPublicDate(nextState, npcId, dateLocationKey)
        : nextState.reputation;
      const reputationDelta = getReputationChange(
        nextState.reputation,
        reputationAfterPublicDate,
        reputationCircle
      );
      const reputationLog = describeReputationChange(
        reputationCircle,
        reputationDelta,
        'noticed the public date'
      );
      const logMsg = `${timePassage} Arrived at ${location.name} via ${vehicleUsedName} for a date with ${npc.name}. (-${travelEnergy} Travel Energy, -10 Date Energy)`;

      return {
        ...nextState,
        gamePhase: 'date',
        activeLocation: destinationSettlement,
        activeDateEvent: { 
          npcId, 
          locationKey: dateLocationKey,
          dateType: dateTemplate.id,
          currentPhaseIndex: 0,
          connectionScore: dateTemplate.venueKey === 'home'
            ? 30 + summarizeHomeStyle(state, npcId).connectionBonus
            : 30,
          vibe: 30,
          memoryContext: state.relationshipMemory?.[npcId] || createEmptyMemory()
        },
        stats: newStats,
        reputation: reputationAfterPublicDate,
        needs: {
          ...nextState.needs,
          energy: finalEnergy
        },
        logs: [
          ...(reputationLog ? [reputationLog] : []),
          ...(dateTemplate.venueKey === 'home' ? [summarizeHomeStyle(state, npcId).logText] : []),
          logMsg,
          ...nextState.logs
        ].slice(0, 20)
      };
    }

    case 'CHOOSE_DATE_PHASE_OPTION': {
      if (!state.activeDateEvent) return state;
      const { optionIndex } = action.payload;
      const { npcId, dateType, locationKey, currentPhaseIndex } = state.activeDateEvent;
      const dateTemplate = getDateTemplate(dateType, locationKey);
      const phases = dateTemplate.phases || [];
      const currentPhase = phases[currentPhaseIndex];
      if (!currentPhase) return state;
      const choice = currentPhase.choices[optionIndex];
      if (!choice) return state;

      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `spent a moment on the date with ${npcId}`);
      const scored = scoreDatePhaseChoice(nextState, nextState.activeDateEvent, choice);

      const nextPhaseIndex = currentPhaseIndex + 1;
      const nextVibe = Math.min(100, Math.max(0, nextState.activeDateEvent.vibe + scored.connectionChange));
      const nextConnection = Math.min(100, Math.max(0, nextState.activeDateEvent.connectionScore + scored.connectionChange));

      const memoryUpdates = {
        rememberedChoices: [],
        sharedActivities: [],
        promises: {},
        importantMoments: [],
        comfortKnowns: [],
      };
      if (scored.memory) memoryUpdates.rememberedChoices.push(scored.memory);
      if (scored.discovery) memoryUpdates.comfortKnowns.push(scored.discovery);
      if (scored.callback) memoryUpdates.promises[scored.callback] = 'pending';
      if (scored.repairScene) memoryUpdates.promises[scored.repairScene] = 'pending';
      if (scored.conflict) memoryUpdates.importantMoments.push(scored.conflict);

      const updatedMemory = updateRelationshipMemory(nextState, npcId, memoryUpdates);

      const currentDateOutcome = nextState.activeDateEvent.dateOutcome || {};
      const nextDateEvent = {
        ...nextState.activeDateEvent,
        vibe: nextVibe,
        connectionScore: nextConnection,
        currentPhaseIndex: nextPhaseIndex,
        memoryContext: updatedMemory[npcId],
        dateOutcome: {
          ...currentDateOutcome,
          relationship: (currentDateOutcome.relationship || 0) + scored.relationshipChange,
          chemistry: (currentDateOutcome.chemistry || 0) + scored.chemistryChange,
          mood: (currentDateOutcome.mood || 0) + scored.moodChange,
          energy: (currentDateOutcome.energy || 0) + scored.energyChange,
          discoveries: addUnique(currentDateOutcome.discoveries, scored.discovery),
          memories: addUnique(currentDateOutcome.memories, scored.memory),
          callbacks: addUnique(currentDateOutcome.callbacks, scored.callback),
          repairScene: scored.repairScene || currentDateOutcome.repairScene,
          conflict: scored.conflict || currentDateOutcome.conflict,
        }
      };

      if (nextPhaseIndex >= phases.length) {
        return socialReducer(
          {
            ...nextState,
            activeDateEvent: nextDateEvent,
            relationshipMemory: updatedMemory,
            logs: [`${timePassage} Chose: ${choice.text}`, ...nextState.logs].slice(0, 20),
          },
          { type: 'RESOLVE_DATE_EVENT', payload: { finalVibe: nextVibe, logText: `Completed ${dateTemplate.title}`, dateOutcome: nextDateEvent.dateOutcome } }
        );
      }

      return {
        ...nextState,
        activeDateEvent: nextDateEvent,
        relationshipMemory: updatedMemory,
        logs: [`${timePassage} Chose: ${choice.text}`, ...nextState.logs].slice(0, 20),
      };
    }

    case 'RESOLVE_DATE_EVENT': {
      const { finalVibe, logText, dateOutcome = {} } = action.payload;
      if (!state.activeDateEvent) return state;
      const { npcId, dateType } = state.activeDateEvent;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;
      const npcCompatibility = state.compatibility?.npcTraits?.[npcId] || generateCompatibilityTraits(npcId);
      const playerCompatibility = inferPlayerCompatibilityTraits(state.stats, state.compatibility?.playerTraits);
      const compatibilityScore = calculateCompatibilityScore(playerCompatibility, npcCompatibility);
      const compatibilityBand = getCompatibilityBand(compatibilityScore);

      let nextState = simulateTicks(state, 3); // Time spent on date
      const timePassage = describeTimePassage(state.time, nextState.time, `wrapped up the date with ${npc.name}`);

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, chemistry: 10, dateCount: 0, storyTier: 0 };
      
      // Calculate gains based on Vibe
      let relGain;
      let chemChange;
      
      const qualityScore = finalVibe;

      if (qualityScore >= 80) {
        relGain = 20;
        chemChange = 15;
      } else if (qualityScore >= 50) {
        relGain = 10;
        chemChange = 5;
      } else if (qualityScore >= 30) {
        relGain = 5;
        chemChange = 0;
      } else {
        relGain = -10;
        chemChange = -10;
      }

      relGain += dateOutcome.relationship || 0;
      chemChange += dateOutcome.chemistry || 0;

      if (compatibilityBand === 'strong' && qualityScore < 50) {
        relGain += 4;
        chemChange += 4;
      } else if (compatibilityBand === 'fragile' && qualityScore >= 80) {
        relGain -= 5;
        chemChange -= 3;
      }

      // Check if this is a callback date or repair date
      const isCallbackDate = Boolean(dateOutcome.callbacks && dateOutcome.callbacks.length > 0);
      const isRepairDate = Boolean(dateOutcome.repairScene || currentMatch.activeConflictId);
      
      // Apply enhanced diminishing returns with all parameters
      const diminished = applyDateDiminishingReturns(
        relGain,
        chemChange,
        npcId,
        dateType,
        state.relationshipMemory,
        currentMatch,
        finalVibe,
        isCallbackDate,
        isRepairDate,
        currentMatch.compatibilityScore
      );
      relGain = diminished.relGain;
      chemChange = diminished.chemChange;
      
      // Record this date in history for future diminishing returns calculations
      const updatedMatchWithHistory = recordDateInHistory(currentMatch, dateType, nextState.time.day);

      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 10) + chemChange));

      // Chemistry multiplier
      let finalRelGain = relGain;
      if (relGain > 0) {
        if (newChem >= 70) finalRelGain = Math.floor(relGain * 1.5);
        else if (newChem < 30) finalRelGain = Math.floor(relGain * 0.5);
      }

      const dateLocationKey = state.activeDateEvent.locationKey;
      const gossipPenalty = isPublicLocation(dateLocationKey)
        ? calculateGossipPenalty(nextState, npcId, qualityScore, Boolean(dateOutcome.conflict))
        : 0;
      finalRelGain -= gossipPenalty;

      const newRel = applyRelationshipCap(currentMatch.relationship, finalRelGain, currentMatch.storyTier, nextState.stats);
      
      // Check for conflict triggers based on date outcome
      const conflictTrigger = checkDateConflictTrigger(nextState, npcId, {
        qualityScore,
        finalVibe,
        conflict: dateOutcome.conflict,
        repairScene: dateOutcome.repairScene
      });
      
      // If conflict should trigger and there's no active conflict, start one
      const hasActiveConflict = Boolean(currentMatch.activeConflictId);
      let finalActiveConflictId = updatedMatchWithHistory.activeConflictId || currentMatch.activeConflictId || null;
      let finalPendingRepairScene = updatedMatchWithHistory.pendingRepairScene || currentMatch.pendingRepairScene || null;
      let finalConflictStartedDay = updatedMatchWithHistory.conflictStartedDay || currentMatch.conflictStartedDay || null;
      let finalRepairOpenedDay = updatedMatchWithHistory.repairOpenedDay || currentMatch.repairOpenedDay || null;
      
      if (conflictTrigger.shouldTrigger && !hasActiveConflict) {
        finalActiveConflictId = conflictTrigger.conflictId;
        finalPendingRepairScene = conflictTrigger.repairScene || finalPendingRepairScene;
        finalConflictStartedDay = nextState.time.day;
        finalRepairOpenedDay = nextState.time.day;
      } else if (dateOutcome.repairScene && !hasActiveConflict) {
        finalActiveConflictId = dateOutcome.repairScene;
        finalPendingRepairScene = dateOutcome.repairScene;
        finalConflictStartedDay = nextState.time.day;
        finalRepairOpenedDay = nextState.time.day;
      }
      
      let moodIncrease = qualityScore >= 50 ? Math.floor(qualityScore / 5) : 0;
      moodIncrease += dateOutcome.mood || 0;
      const currentMood = nextState.needs.mood !== undefined ? nextState.needs.mood : 100;
      const newMood = clamp(currentMood + moodIncrease);
      const newEnergy = clamp((nextState.needs.energy ?? 100) + (dateOutcome.energy || 0));

      const repairText = dateOutcome.repairScene
        ? ` A repair opportunity opened: ${dateOutcome.repairScene}.`
        : '';
      const gossipText = gossipPenalty > 0
        ? ` Public gossip added pressure (-${gossipPenalty} Rel).`
        : '';
      const logMsg = `${timePassage} Date over: ${logText}${repairText}${gossipText} (Rel: ${newRel}/100, Chem: ${newChem}/100, Mood ${moodIncrease >= 0 ? '+' : ''}${moodIncrease})`;
      const compatibilityLog = `You noticed ${npc.name}'s deeper patterns over time. (${compatibilityBand} long-term fit)`;

      let stateToReturn = {
        ...nextState,
        gamePhase: 'date_recap',
        activeDateEvent: null,
        lastDateRecap: {
          npcId,
          npcName: npc.name,
          qualityScore,
          logText,
          relationshipChange: finalRelGain,
          chemistryChange: chemChange,
          gossipPenalty,
          memoriesGained: dateOutcome.memories || [],
          promisesCreated: dateOutcome.callbacks || [],
          conflictRisk: dateOutcome.conflict,
          repairOpportunity: dateOutcome.repairScene,
          compatibilityBand
        },
        relationshipMemory: updateRelationshipMemory(nextState, npcId, {
          sharedActivities: [
            `date_${state.activeDateEvent.locationKey}`,
            ...(dateType ? [`date_${dateType}`] : [])
          ],
          rememberedChoices: dateOutcome.memories || [],
          importantMoment: qualityScore >= 80 || finalVibe >= 80
            ? 'memorable_date'
            : dateOutcome.repairScene || dateOutcome.conflict || null,
          comfortKnowns: [
            ...(dateOutcome.discoveries || []),
            ...(qualityScore >= 30 ? ['learned_from_mediocre_date'] : [])
          ],
          promises: {
            ...Object.fromEntries((dateOutcome.callbacks || []).map((cb) => [cb, 'pending'])),
            ...(dateOutcome.repairScene ? { [dateOutcome.repairScene]: 'pending' } : {})
          },
          lastMeaningfulInteractionDay: nextState.time.day
        }),
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...updatedMatchWithHistory,
            relationship: newRel,
            chemistry: newChem,
            dateCount: (updatedMatchWithHistory.dateCount || currentMatch.dateCount || 0) + 1,
            compatibilityScore,
            lastDateQuality: qualityScore,
            activeConflictId: finalActiveConflictId,
            conflictStartedDay: finalConflictStartedDay,
            pendingRepairScene: finalPendingRepairScene,
            repairOpenedDay: finalRepairOpenedDay
          }
        },
        compatibility: {
          playerTraits: playerCompatibility,
          npcTraits: {
            ...(state.compatibility?.npcTraits || {}),
            [npcId]: npcCompatibility
          }
        },
        needs: {
          ...nextState.needs,
          mood: newMood,
          energy: newEnergy
        },
        logs: [compatibilityLog, logMsg, ...nextState.logs].slice(0, 20)
      };
      
      let eventType = qualityScore >= 50 ? 'positive' : 'negative';
      if (dateOutcome.conflict) eventType = 'conflict';
      else if (dateOutcome.repairScene) eventType = 'repair';

      return appendRelationshipEvent(stateToReturn, npcId, {
        source: 'date',
        type: eventType,
        relationshipDelta: finalRelGain,
        chemistryDelta: chemChange,
        conflictId: dateOutcome.conflict || null,
        repairScene: dateOutcome.repairScene || null,
        summary: `Date at ${dateType}: Vibe ${qualityScore}`
      });
    }

    case 'RESOLVE_STORY_EVENT': {
      const { npcId, success } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      const currentMatch = state.matches[npcId];
      if (!currentMatch) return state;

      const storyTier = currentMatch.storyTier || 0;
      
      let nextState = simulateTicks(state, 4); // Takes time to do story event
      const timePassage = describeTimePassage(state.time, nextState.time, `spent time on ${npc.name}'s story`);

      if (success) {
        // Unlock next tier and boost relationship
        const nextTier = storyTier + 1;
        const newRel = applyRelationshipCap(currentMatch.relationship, 20, nextTier, nextState.stats);
        
        const isFirstNight = storyTier === 3; // 100 relationship milestone

        let finalNeeds = { ...nextState.needs };
        let logMsg = `${timePassage} You successfully completed ${npc.name}'s story event! Relationship Cap increased to ${nextTier * 25 + 25}.`;

        if (isFirstNight) {
          finalNeeds.mood = 100;
          finalNeeds.energy = 100;
          logMsg = `${timePassage} You experienced an unforgettable First Night with ${npc.name}. You feel a lasting Afterglow! (+100 Mood, +100 Energy)`;
        }
        
        return {
          ...nextState,
          needs: finalNeeds,
          relationshipMemory: updateRelationshipMemory(nextState, npcId, {
            importantMoment: `story_tier_${nextTier}`,
            promises: isFirstNight ? { long_term_commitment: 'kept' } : {},
            lastMeaningfulInteractionDay: nextState.time.day
          }),
          matches: {
            ...nextState.matches,
            [npcId]: {
              ...currentMatch,
              relationship: newRel,
              storyTier: nextTier,
              afterglow: isFirstNight ? true : currentMatch.afterglow
            }
          },
          logs: [logMsg, ...nextState.logs].slice(0, 20)
        };
      } else {
        // Fail: no tier unlock, just small relationship penalty
        const newRel = applyRelationshipCap(currentMatch.relationship, -5, storyTier, nextState.stats);
        return {
          ...nextState,
          matches: {
            ...nextState.matches,
            [npcId]: {
              ...currentMatch,
              relationship: newRel
            }
          },
          logs: [`${timePassage} You failed ${npc.name}'s story event. Try again tomorrow.`, ...nextState.logs].slice(0, 20)
        };
      }
    }

    case 'ASK_TO_MOVE_IN': {
      const { npcId } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;
      const matchData = state.matches[npcId] || {};
      const npcCompatibility = state.compatibility?.npcTraits?.[npcId] || generateCompatibilityTraits(npcId);
      const playerCompatibility = inferPlayerCompatibilityTraits(state.stats, state.compatibility?.playerTraits);
      const score = matchData.compatibilityScore !== undefined
        ? matchData.compatibilityScore
        : calculateCompatibilityScore(playerCompatibility, npcCompatibility);
      const fitLabel = getCompatibilityBand(score);
      const moveInBonus = fitLabel === 'strong' ? 5 : fitLabel === 'fragile' ? -5 : 0;
      const adjustedRelationship = applyRelationshipCap(matchData.relationship || 10, moveInBonus, matchData.storyTier || 0, state.stats);
      const nextState = simulateTicks(state, 12);
      const timePassage = describeTimePassage(state.time, nextState.time, `helped ${npc.name} move in`);
      const logMsg = `${timePassage} ${npc.name.toUpperCase()} moved in with you! (${fitLabel} cohab fit)`;
      return {
        ...nextState,
        relationshipMemory: updateRelationshipMemory(nextState, npcId, {
          importantMoment: 'cohabitation_step',
          promises: { share_home_routine: 'pending' },
          lastMeaningfulInteractionDay: nextState.time.day
        }),
        living: {
          ...nextState.living,
          roommateId: npcId,
          homeLog: [
            `${npc.name} moved in and started sharing home routines.`,
            ...(nextState.living.homeLog || [])
          ].slice(0, 10),
          availableHomeActivities: [
            ...new Set([
              ...(nextState.living.availableHomeActivities || []),
              'decompress_after_work',
              'decorate_together'
            ])
          ]
        },
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...matchData,
            relationship: adjustedRelationship
          }
        },
        logs: [logMsg, ...nextState.logs].slice(0, 20)
      };
    }

    case 'PROPOSE_MARRIAGE': {
      const { npcId } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;
      const matchData = state.matches[npcId] || {};
      const npcCompatibility = state.compatibility?.npcTraits?.[npcId] || generateCompatibilityTraits(npcId);
      const playerCompatibility = inferPlayerCompatibilityTraits(state.stats, state.compatibility?.playerTraits);
      const score = matchData.compatibilityScore !== undefined
        ? matchData.compatibilityScore
        : calculateCompatibilityScore(playerCompatibility, npcCompatibility);
      const memory = state.relationshipMemory?.[npcId] || createEmptyMemory();
      const memoryReadiness = Math.min(10, countRelationshipMemorySignals(memory) * 2);
      const readiness = (matchData.relationship || 0) + (score * 0.4) + memoryReadiness;
      if (readiness < 85) {
        const nextState = simulateTicks(state, 2);
        const timePassage = describeTimePassage(state.time, nextState.time, `talked with ${npc.name} about marriage`);
        return {
          ...nextState,
          logs: [`${timePassage} ${npc.name.toUpperCase()} asked for more time before marriage. Build deeper long-term fit first.`, ...nextState.logs].slice(0, 20)
        };
      }
      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, `proposed to ${npc.name}`);
      const logMsg = `${timePassage} YOU PROPOSED TO ${npc.name.toUpperCase()} AND THEY SAID YES! Marriage event triggered.`;
      return {
        ...nextState,
        gamePhase: 'marriage',
        relationshipMemory: updateRelationshipMemory(nextState, npcId, {
          importantMoment: 'proposal_accepted',
          promises: { marriage_commitment: 'pending' },
          lastMeaningfulInteractionDay: nextState.time.day
        }),
        family: {
          ...nextState.family,
          spouseId: npcId,
          spouseName: npc.name,
        },
        living: {
          ...nextState.living,
          homeLog: [
            `${npc.name} began planning married life in your shared home.`,
            ...(nextState.living.homeLog || [])
          ].slice(0, 10),
          availableHomeActivities: [
            ...new Set([
              ...(nextState.living.availableHomeActivities || []),
              'host_dinner',
              'help_with_personal_project'
            ])
          ]
        },
        logs: [logMsg, ...nextState.logs].slice(0, 20)
      };
    }

    case 'COMPLETE_WEDDING': {
      const { style, childName } = action.payload;
      let fee = 200;
      let moodBonus = 0;
      let parentLog;
      let initialHeirStats = {
        fitness: 10,
        intelligence: 10,
        charisma: 10,
        style: 10,
        corporate: 10,
        programming: 10,
        marketing: 10,
        finance: 10,
        negotiation: 10,
        culinary: 10,
        creativity: 10,
        music: 10,
        gaming: 10,
        confidence: 10,
        socialIq: 10,
        empathy: 10,
      };

      if (style === 'traditional') {
        fee = 1000;
        moodBonus = 15;
        parentLog = `A beautiful traditional wedding ceremony! Friends and family celebrated your union.`;
      } else if (style === 'lavish') {
        fee = 4000;
        moodBonus = 30;
        initialHeirStats = {
          fitness: 10,
          intelligence: 10,
          charisma: 15,
          style: 10,
          corporate: 15,
          programming: 10,
          marketing: 10,
          finance: 10,
          negotiation: 10,
          culinary: 10,
          creativity: 10,
          music: 10,
          gaming: 10,
          confidence: 15,
          socialIq: 15,
          empathy: 10,
        };
        parentLog = `An absolute fairytale wedding! The talk of the town. (+5 starting Corporate, Charisma, Confidence & Social IQ on heir)`;
      } else {
        parentLog = `Married at the registry office! Simple and sweet.`;
      }

      const nextState = simulateTicks(state, 24);
      const timePassage = describeTimePassage(state.time, nextState.time, 'held the wedding');
      const newMoney = Math.max(0, nextState.stats.money - fee);
      const newMood = Math.min(100, nextState.needs.mood + moodBonus);

      return {
        ...nextState,
        gamePhase: 'parenting',
        stats: {
          ...nextState.stats,
          money: newMoney,
        },
        needs: {
          ...nextState.needs,
          mood: newMood,
        },
        family: {
          ...nextState.family,
          married: true,
          childName: childName || 'Alex Jr',
        },
        parentingGame: {
          currentStep: 0,
          stress: 0,
          heirStats: initialHeirStats,
        },
        logs: [`${timePassage} ${parentLog}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'SELECT_PARENTING_CHOICE': {
      const { cost, statGains, stressIncrease } = action.payload;
      const nextState = simulateTicks(state, 6);
      const timePassage = describeTimePassage(state.time, nextState.time, "made a parenting choice");
      const newMoney = Math.max(0, nextState.stats.money - cost);
      
      const newHeirStats = { ...nextState.parentingGame.heirStats };
      Object.entries(statGains).forEach(([statKey, value]) => {
        if (newHeirStats[statKey] !== undefined) {
          newHeirStats[statKey] = Math.min(100, newHeirStats[statKey] + value);
        }
      });

      const newStress = Math.min(100, (nextState.parentingGame.stress || 0) + (stressIncrease || 20));

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: newMoney,
        },
        parentingGame: {
          ...nextState.parentingGame,
          currentStep: nextState.parentingGame.currentStep + 1,
          heirStats: newHeirStats,
          stress: newStress
        },
        logs: [`${timePassage} Parenting: made choice for child's development. Child Stress is now ${newStress}%.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'REDUCE_CHILD_STRESS': {
      const { energyCost, stressReduction } = action.payload;
      const nextState = simulateTicks(state, 3);
      const timePassage = describeTimePassage(state.time, nextState.time, 'spent time with your child');
      const newEnergy = Math.max(0, nextState.needs.energy - energyCost);
      const newStress = Math.max(0, nextState.parentingGame.stress - stressReduction);

      return {
        ...nextState,
        needs: {
          ...nextState.needs,
          energy: newEnergy
        },
        parentingGame: {
          ...nextState.parentingGame,
          stress: newStress
        },
        logs: [`${timePassage} Stress is now ${newStress}%.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'BEGIN_LEGACY': {
      const childName = state.family.childName;
      const inheritedCash = Math.floor(state.stats.money * 0.5);

      const childStats = {
        money: inheritedCash,
        fitness: Math.min(100, (state.parentingGame.heirStats.fitness || 10) + Math.floor((state.stats.fitness || 0) * 0.1)),
        intelligence: Math.min(100, (state.parentingGame.heirStats.intelligence || 10) + Math.floor((state.stats.intelligence || 0) * 0.1)),
        charisma: Math.min(100, (state.parentingGame.heirStats.charisma || 10) + Math.floor((state.stats.charisma || 0) * 0.1)),
        style: Math.min(100, (state.parentingGame.heirStats.style || 10) + Math.floor((state.stats.style || 0) * 0.1)),
        corporate: Math.min(100, (state.parentingGame.heirStats.corporate || 10) + Math.floor((state.stats.corporate || 0) * 0.1)),
        programming: Math.min(100, (state.parentingGame.heirStats.programming || 10) + Math.floor((state.stats.programming || 0) * 0.1)),
        marketing: Math.min(100, (state.parentingGame.heirStats.marketing || 10) + Math.floor((state.stats.marketing || 0) * 0.1)),
        finance: Math.min(100, (state.parentingGame.heirStats.finance || 10) + Math.floor((state.stats.finance || 0) * 0.1)),
        negotiation: Math.min(100, (state.parentingGame.heirStats.negotiation || 10) + Math.floor((state.stats.negotiation || 0) * 0.1)),
        culinary: Math.min(100, (state.parentingGame.heirStats.culinary || 10) + Math.floor((state.stats.culinary || 0) * 0.1)),
        creativity: Math.min(100, (state.parentingGame.heirStats.creativity || 10) + Math.floor((state.stats.creativity || 0) * 0.1)),
        music: Math.min(100, (state.parentingGame.heirStats.music || 10) + Math.floor((state.stats.music || 0) * 0.1)),
        gaming: Math.min(100, (state.parentingGame.heirStats.gaming || 10) + Math.floor((state.stats.gaming || 0) * 0.1)),
        confidence: Math.min(100, (state.parentingGame.heirStats.confidence || 10) + Math.floor((state.stats.confidence || 0) * 0.1)),
        socialIq: Math.min(100, (state.parentingGame.heirStats.socialIq || 10) + Math.floor((state.stats.socialIq || 0) * 0.1)),
        empathy: Math.min(100, (state.parentingGame.heirStats.empathy || 10) + Math.floor((state.stats.empathy || 0) * 0.1)),
        housingTier: 0,
      };

      const parentRecord = {
        generation: state.family.generation,
        parentName: state.family.playerName || 'Alex',
        spouseName: state.family.spouseName,
        corporate: state.stats.corporate,
        intelligence: state.stats.intelligence,
        money: state.stats.money,
        dayReached: state.time.day,
      };
      const newParentHistory = [...(state.family.parentHistory || []), parentRecord];

      const newStorage = [...state.storage, ...state.placedFurniture];

      const newTraits = calculateTraits(childStats, state.parentingGame.stress || 0);

      const welcomeLog = `[Generation ${state.family.generation + 1}] Welcome to your new life as ${childName.toUpperCase()}! You inherited $${inheritedCash} and traits: ${newTraits.join(', ') || 'None'}.`;

      return {
        ...state,
        gamePhase: 'living',
        time: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        stats: childStats,
        activeTraits: newTraits,
        needs: {
          energy: 100,
          hunger: 20,
          hygiene: 100,
          health: 100,
          mood: 100,
        },
        living: {
          utilitiesActive: true,
          billsAmount: 50,
        },
        placedFurniture: [],
        storage: newStorage,
        inventory: {},
        matches: {},
        compatibility: {
          playerTraits: {
            ambition: 'balanced',
            socialStyle: 'quiet',
            affectionStyle: 'quality_time',
            conflictStyle: 'collaborative',
            familyGoal: 'undecided',
            spendingStyle: 'balanced',
            emotionalOpenness: 'slow_burn',
          },
          npcTraits: {},
        },
        swipePreferences: {
          preferredStat: '',
          sexPreference: 'anyone',
        },
        swipePremium: {
          active: false,
        },
        swipeStats: {
          dailySwipesCount: 0,
          lastSwipedDay: 1,
        },
        activeLocation: 'Endleigh',
        family: {
          spouseId: null,
          spouseName: '',
          married: false,
          childName: '',
          generation: state.family.generation + 1,
          parentHistory: newParentHistory,
          playerName: childName,
        },
        parentingGame: {
          currentStep: 0,
          heirStats: {
            fitness: 10,
            intelligence: 10,
            charisma: 10,
            style: 10,
            corporate: 10,
            programming: 10,
            marketing: 10,
            finance: 10,
            negotiation: 10,
            culinary: 10,
            creativity: 10,
            music: 10,
            gaming: 10,
            confidence: 10,
            socialIq: 10,
            empathy: 10,
          },
        },
        logs: [welcomeLog, `Retired: Generation ${state.family.generation} is now historic.`, ...state.logs].slice(0, 20),
      };
    }

    case 'SUBSCRIBE_PREMIUM': {
      const fee = 15;
      if (state.stats.money < fee) {
        const nextState = simulateTicks(state, 1);
        const timePassage = describeTimePassage(state.time, nextState.time, 'checked LinkUp Gold');
        return {
          ...nextState,
          logs: [`${timePassage} LinkUp Gold subscription failed: insufficient funds. ($15 required)`, ...nextState.logs].slice(0, 20)
        };
      }
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, 'subscribed to LinkUp Gold');
      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: nextState.stats.money - fee
        },
        swipePremium: {
          ...nextState.swipePremium,
          active: true
        },
        logs: [`${timePassage} $15 deducted. Welcome to premium services!`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'CANCEL_PREMIUM': {
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, 'cancelled LinkUp Gold');
      return {
        ...nextState,
        swipePremium: {
          ...nextState.swipePremium,
          active: false
        },
        logs: [`${timePassage} You will retain premium until weekly billing cycle.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'UPDATE_SWIPE_PREFERENCES': {
      const { preferredStat, sexPreference } = action.payload;
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, 'updated dating preferences');
      return {
        ...nextState,
        swipePreferences: {
          ...nextState.swipePreferences,
          ...(preferredStat !== undefined && { preferredStat }),
          ...(sexPreference !== undefined && { sexPreference })
        },
        logs: [`${timePassage}`, ...nextState.logs].slice(0, 20)
      };
    }
    case 'DISCOVER_NPC_AT_LOCATION': {
      const { npcId, locationKey } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;

      let currentMatch = state.matches[npcId];
      if (currentMatch && currentMatch.met) {
        return state; // Already met
      }

      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `met ${npc.name} around ${locationKey}`);

      return {
        ...nextState,
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            met: true,
            discoveredVia: 'organic',
            relationship: 5,
            chemistry: 5,
            dateCount: 0,
            storyTier: 0,
            relationshipStage: 'acquaintance',
          }
        },
        logs: [`${timePassage}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'START_ORGANIC_ENCOUNTER': {
      const { encounter } = action.payload; // from townTexture.js
      return {
        ...state,
        gamePhase: 'encounter',
        activeEncounterEvent: {
          ...encounter
        }
      };
    }

    case 'RESOLVE_ORGANIC_ENCOUNTER': {
      const { choiceIndex } = action.payload;
      const encounter = state.activeEncounterEvent;
      if (!encounter) return state;
      const choice = encounter.choices ? encounter.choices[choiceIndex] : { text: 'Continued the encounter', relationship: 1, chemistry: 0, mood: 0 };
      const npcId = encounter.npcId;

      let nextState = simulateTicks(state, 2); // Takes 20 minutes
      const timePassage = describeTimePassage(state.time, nextState.time, `handled an encounter at ${encounter.location}`);

      let relGain = choice.relationship || 0;
      let chemChange = choice.chemistry || 0;
      let moodChange = choice.mood || 0;

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 5, chemistry: 5, dateCount: 0, storyTier: 0, relationshipStage: 'acquaintance' };
      const newRel = applyRelationshipCap(currentMatch.relationship, relGain, currentMatch.storyTier, nextState.stats);
      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 5) + chemChange));
      const newMood = Math.min(100, Math.max(0, (nextState.needs.mood || 100) + moodChange));

      const memoryUpdates = {};
      if (choice.discovery) memoryUpdates.comfortKnowns = [choice.discovery];
      if (choice.memory) memoryUpdates.rememberedChoices = [choice.memory];
      if (choice.callback) memoryUpdates.promises = { [choice.callback]: 'pending' };

      const updatedMemory = updateRelationshipMemory(nextState, npcId, memoryUpdates);
      const reputationCircle = selectRelevantReputationCircle(npcId);
      const updatedReputation = adjustReputationForOrganicEncounter(
        nextState,
        npcId,
        relGain,
        chemChange
      );
      const reputationDelta = getReputationChange(
        nextState.reputation,
        updatedReputation,
        reputationCircle
      );
      const reputationLog = describeReputationChange(
        reputationCircle,
        reputationDelta,
        'reacted to the encounter'
      );

      let stateToReturn = {
        ...nextState,
        gamePhase: 'living',
        activeEncounterEvent: null,
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem
          }
        },
        relationshipMemory: updatedMemory,
        reputation: updatedReputation,
        needs: {
          ...nextState.needs,
          mood: newMood
        },
        logs: [
          ...(reputationLog ? [reputationLog] : []),
          `${timePassage} Encounter finished: ${choice.text}`,
          ...nextState.logs
        ].slice(0, 20)
      };

      return appendRelationshipEvent(stateToReturn, npcId, {
        source: 'organic_encounter',
        type: choice.relationship > 0 ? 'positive' : 'info',
        relationshipDelta: relGain,
        chemistryDelta: chemChange,
        summary: `Encounter at ${encounter.location}: ${choice.text}`
      });
    }


    case 'INSTANT_MATCH': {
      const { npcId } = action.payload;
      const npc = NPCS.find((n) => n.id === npcId);
      if (!npc) return state;

      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `used instant match with ${npc.name}`);

      if (!state.features?.instantMatchRebalance) {
        // Legacy behavior
        const memoryContext = createEmptyMemory();
        memoryContext.comfortKnown.push('preferred_chat_hours');
        return {
          ...nextState,
          matches: {
            ...nextState.matches,
            [npcId]: {
              met: true,
              relationship: 35,
              chemistry: 20,
              dateCount: 1,
              storyTier: 1,
            },
          },
          relationshipMemory: {
            ...nextState.relationshipMemory,
            [npcId]: memoryContext,
          },
          logs: [`${timePassage} Premium match confirmed.`, ...nextState.logs].slice(0, 20),
        };
      }

      // New Rebalanced Behavior
      let currentMatch = state.matches[npcId];
      if (currentMatch && currentMatch.met) return state;

      let stateToReturn = {
        ...nextState,
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            met: true,
            discoveredVia: 'instant_match',
            relationship: 10,
            chemistry: 10,
            dateCount: 0,
            storyTier: 0,
            relationshipStage: 'matched',
          },
        },
        logs: [`${timePassage} Premium match confirmed.`, ...nextState.logs].slice(0, 20),
      };
      
      return appendRelationshipEvent(stateToReturn, npcId, {
        source: 'instant_match',
        type: 'info',
        relationshipDelta: 10,
        chemistryDelta: 10,
        summary: 'Matched instantly via Premium.'
      });
    }

    case 'RESOLVE_NPC_ALERT': {
      const { optionIndex } = action.payload;
      const event = state.activeNpcAlert;
      const npcId = event.npcId;
      const choice = event.choices[optionIndex];

      let success = true;
      if (choice.checkStat) {
        success = state.stats[choice.checkStat] >= choice.threshold;
      }

      const relGain = success ? (choice.successRelation || 0) : (choice.failRelation || 0);
      const chemGain = success ? (choice.successChemistry || 0) : (choice.failChemistry || 0);
      const moneyCost = choice.moneyCost || 0;
      const energyCost = choice.energyCost || 0;
      const logText = success ? choice.successText : choice.failText;

      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, 'handled an urgent message');

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, chemistry: 10, dateCount: 0 };
      const newRel = Math.min(100, Math.max(0, currentMatch.relationship + relGain));
      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 10) + chemGain));
      
      const newStats = {
        ...nextState.stats,
        money: Math.max(0, nextState.stats.money - moneyCost)
      };
      const newEnergy = Math.max(0, nextState.needs.energy - energyCost);

      const logMsg = `Alert Resolved: ${logText} (Rel: ${newRel}/100, Chem: ${newChem}/100)`;

      return {
        ...nextState,
        gamePhase: 'living',
        activeNpcAlert: null,
        stats: newStats,
        needs: {
          ...nextState.needs,
          energy: newEnergy
        },
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem
          }
        },
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'CLOSE_DATE_RECAP': {
      return {
        ...state,
        gamePhase: 'living',
        lastDateRecap: null
      };
    }

    case 'ATTEMPT_REPAIR': {
      const { npcId, repairActionId } = action.payload;
      const currentMatch = state.matches[npcId];
      if (!currentMatch) return state;

      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, `tried to repair things with ${npcId}`);
      const evaluation = evaluateRepairAction(nextState, npcId, currentMatch, repairActionId);
      const currentChemistry = currentMatch.chemistry ?? 10;
      const newRel = applyRelationshipCap(
        currentMatch.relationship ?? 10,
        evaluation.relationshipDelta,
        currentMatch.storyTier,
        nextState.stats
      );
      const newChem = clamp(currentChemistry + evaluation.chemistryDelta);
      const repairHistory = [
        {
          day: nextState.time.day,
          actionId: repairActionId,
          resolvedActionId: evaluation.resolvedActionId || repairActionId,
          success: evaluation.success,
          score: evaluation.score,
          repairScene: evaluation.repairScene,
        },
        ...(currentMatch.repairHistory || []),
      ].slice(0, 10);
      const newConflictId = evaluation.success ? null : currentMatch.activeConflictId;
      const newRepairScene = evaluation.success ? null : currentMatch.pendingRepairScene;
      const repairedPromise = currentMatch.pendingRepairScene || evaluation.repairScene;
      const logMsg = evaluation.success
        ? `Repair with ${npcId} succeeded (${evaluation.title}, score ${evaluation.score}). ${evaluation.reason}.`
        : `Repair with ${npcId} did not land (${evaluation.title}, score ${evaluation.score}). ${evaluation.reason}.`;
      const updatedState = {
        ...nextState,
        relationshipMemory: updateRelationshipMemory(nextState, npcId, {
          importantMoment: evaluation.success
            ? `repaired_${repairedPromise || currentMatch.activeConflictId || 'conflict'}`
            : `attempted_repair_${repairedPromise || currentMatch.activeConflictId || 'conflict'}`,
          promises: repairedPromise
            ? { [repairedPromise]: evaluation.success ? 'kept' : 'pending' }
            : {},
          comfortKnown: evaluation.success ? 'repair_follow_through' : null,
          lastMeaningfulInteractionDay: nextState.time.day,
        }),
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem,
            activeConflictId: newConflictId,
            pendingRepairScene: newRepairScene,
            repairHistory,
          }
        },
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };

      return appendRelationshipEvent(updatedState, npcId, {
        source: 'repair',
        type: evaluation.success ? 'repair' : 'conflict',
        relationshipDelta: evaluation.relationshipDelta,
        chemistryDelta: evaluation.chemistryDelta,
        conflictId: currentMatch.activeConflictId || null,
        repairScene: evaluation.repairScene,
        summary: logMsg,
      });
    }

    default:
      return state;
  }
};
