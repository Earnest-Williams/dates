import { NPCS } from '../../data/npcs.js';
import { LOCATIONS } from '../../data/locations.js';
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
    rememberedChoices: updates.rememberedChoice
      ? addUnique(currentMemory.rememberedChoices, updates.rememberedChoice)
      : currentMemory.rememberedChoices,
    sharedActivities: updates.sharedActivity
      ? addUnique(currentMemory.sharedActivities, updates.sharedActivity)
      : currentMemory.sharedActivities,
    promises: {
      ...currentMemory.promises,
      ...(updates.promises || {})
    },
    importantMoments: updates.importantMoment
      ? addUnique(currentMemory.importantMoments, updates.importantMoment)
      : currentMemory.importantMoments,
    comfortKnown: updates.comfortKnown
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

      if (direction === 'left') {
        const logMsg = `Passed on ${npc.name}. (${isPremium ? 'Unlimited' : `Swipes left today: ${5 - nextSwipeStats.dailySwipesCount}`})`;
        return {
          ...state,
          swipeStats: nextSwipeStats,
          logs: [logMsg, ...state.logs].slice(0, 20)
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
        ...state,
        matches: updatedMatches,
        swipeStats: nextSwipeStats,
        logs: [logMsg, ...state.logs].slice(0, 20)
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
      const newMood = Math.min(100, currentMood + moodIncrease);

      const logMsg = `[${npc.name}] ${logText} (Rel: ${newRel}/100, Chem: ${newChem}/100${moodIncrease ? `, +${moodIncrease} Mood` : ''})`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      const memoryUpdates = {
        rememberedChoice: choice.memoryKey || `dialogue_${npcId}_${optionIndex}`,
        lastMeaningfulInteractionDay: nextState.time.day
      };
      if (relChange > 0) {
        memoryUpdates.comfortKnown = choice.checkStat ? 'attentive_support' : 'easy_conversation';
      }

      return {
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
    }

    case 'GO_ON_DATE': {
      const { npcId, locationKey } = action.payload;
      const location = LOCATIONS[locationKey];
      const npc = NPCS.find(n => n.id === npcId);

      const destinationSettlement = {
        library: 'Brockleigh',
        office: 'Brockleigh',
        mall: 'Brockleigh',
        club: 'Stagborough',
        gym: 'Stagborough',
        park: 'Bramblewick',
        home: 'Endleigh'
      }[locationKey] || 'Brockleigh';

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

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }
      
      const totalCost = travelEnergy + 10;
      const finalEnergy = Math.max(0, nextState.needs.energy - totalCost);

      const logMsg = `Arrived at ${destinationSettlement} (${location.name}) via ${vehicleUsedName} for a date with ${npc.name}. (Took ${travelTicks * 10} mins, -${travelEnergy} Travel Energy, -10 Date Energy)`;

      return {
        ...nextState,
        gamePhase: 'date',
        activeLocation: destinationSettlement,
        activeDateEvent: { 
          npcId, 
          locationKey, 
          currentPhaseIndex: 0,
          vibe: 30,
          memoryContext: state.relationshipMemory?.[npcId] || createEmptyMemory()
        },
        stats: newStats,
        needs: {
          ...nextState.needs,
          energy: finalEnergy
        },
        logs: [logMsg, ...nextState.logs].slice(0, 20)
      };
    }

    case 'RESOLVE_DATE_EVENT': {
      const { finalVibe, logText } = action.payload;
      if (!state.activeDateEvent) return state;
      const { npcId } = state.activeDateEvent;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;
      const npcCompatibility = state.compatibility?.npcTraits?.[npcId] || generateCompatibilityTraits(npcId);
      const playerCompatibility = inferPlayerCompatibilityTraits(state.stats, state.compatibility?.playerTraits);
      const compatibilityScore = calculateCompatibilityScore(playerCompatibility, npcCompatibility);
      const compatibilityBand = getCompatibilityBand(compatibilityScore);

      let nextState = simulateTicks(state, 3); // Time spent on date

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, chemistry: 10, dateCount: 0, storyTier: 0 };
      
      // Calculate gains based on Vibe
      let relGain;
      let chemChange;
      
      if (finalVibe >= 80) {
        relGain = 20;
        chemChange = 15;
      } else if (finalVibe >= 50) {
        relGain = 10;
        chemChange = 5;
      } else if (finalVibe >= 30) {
        relGain = 5;
        chemChange = 0;
      } else {
        relGain = -10;
        chemChange = -10;
      }

      if (compatibilityBand === 'strong' && finalVibe < 50) {
        relGain += 4;
        chemChange += 4;
      } else if (compatibilityBand === 'fragile' && finalVibe >= 80) {
        relGain -= 5;
        chemChange -= 3;
      }

      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 10) + chemChange));

      // Chemistry multiplier
      let finalRelGain = relGain;
      if (relGain > 0) {
        if (newChem >= 70) finalRelGain = Math.floor(relGain * 1.5);
        else if (newChem < 30) finalRelGain = Math.floor(relGain * 0.5);
      }

      const newRel = applyRelationshipCap(currentMatch.relationship, finalRelGain, currentMatch.storyTier, nextState.stats);
      
      let moodIncrease = finalVibe >= 50 ? Math.floor(finalVibe / 5) : 0;
      const currentMood = nextState.needs.mood !== undefined ? nextState.needs.mood : 100;
      const newMood = Math.min(100, currentMood + moodIncrease);

      const logMsg = `Date Over: ${logText} (Rel: ${newRel}/100, Chem: ${newChem}/100, +${moodIncrease} Mood)`;
      const compatibilityLog = `You noticed ${npc.name}'s deeper patterns over time. (${compatibilityBand} long-term fit)`;

      return {
        ...nextState,
        gamePhase: 'living',
        activeDateEvent: null,
        relationshipMemory: updateRelationshipMemory(nextState, npcId, {
          sharedActivity: `date_${state.activeDateEvent.locationKey}`,
          importantMoment: finalVibe >= 80 ? 'memorable_date' : null,
          lastMeaningfulInteractionDay: nextState.time.day
        }),
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem,
            dateCount: (currentMatch.dateCount || 0) + 1,
            compatibilityScore
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
          mood: newMood
        },
        logs: [compatibilityLog, logMsg, ...nextState.logs].slice(0, 20)
      };
    }

    case 'RESOLVE_STORY_EVENT': {
      const { npcId, success } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      const currentMatch = state.matches[npcId];
      if (!currentMatch) return state;

      const storyTier = currentMatch.storyTier || 0;
      
      let nextState = simulateTicks(state, 4); // Takes time to do story event

      if (success) {
        // Unlock next tier and boost relationship
        const nextTier = storyTier + 1;
        const newRel = applyRelationshipCap(currentMatch.relationship, 20, nextTier, nextState.stats);
        
        const isFirstNight = storyTier === 3; // 100 relationship milestone

        let finalNeeds = { ...nextState.needs };
        let logMsg = `You successfully completed ${npc.name}'s story event! Relationship Cap increased to ${nextTier * 25 + 25}.`;

        if (isFirstNight) {
          finalNeeds.mood = 100;
          finalNeeds.energy = 100;
          logMsg = `You experienced an unforgettable First Night with ${npc.name}. You feel a lasting Afterglow! (+100 Mood, +100 Energy)`;
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
          logs: [`You failed ${npc.name}'s story event. Try again tomorrow.`, ...nextState.logs].slice(0, 20)
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
      const logMsg = `🏠 ${npc.name.toUpperCase()} moved in with you! (${fitLabel} cohab fit)`;
      return {
        ...state,
        relationshipMemory: updateRelationshipMemory(state, npcId, {
          importantMoment: 'cohabitation_step',
          promises: { share_home_routine: 'pending' },
          lastMeaningfulInteractionDay: state.time.day
        }),
        living: {
          ...state.living,
          roommateId: npcId,
        },
        matches: {
          ...state.matches,
          [npcId]: {
            ...matchData,
            relationship: adjustedRelationship
          }
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
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
        return {
          ...state,
          logs: [`💔 ${npc.name.toUpperCase()} asked for more time before marriage. Build deeper long-term fit first.`, ...state.logs].slice(0, 20)
        };
      }
      const logMsg = `💍 YOU PROPOSED TO ${npc.name.toUpperCase()} AND THEY SAID YES! Marriage event triggered.`;
      return {
        ...state,
        gamePhase: 'marriage',
        relationshipMemory: updateRelationshipMemory(state, npcId, {
          importantMoment: 'proposal_accepted',
          promises: { marriage_commitment: 'pending' },
          lastMeaningfulInteractionDay: state.time.day
        }),
        family: {
          ...state.family,
          spouseId: npcId,
          spouseName: npc.name,
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
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

      const newMoney = Math.max(0, state.stats.money - fee);
      const newMood = Math.min(100, state.needs.mood + moodBonus);

      return {
        ...state,
        gamePhase: 'parenting',
        stats: {
          ...state.stats,
          money: newMoney,
        },
        needs: {
          ...state.needs,
          mood: newMood,
        },
        family: {
          ...state.family,
          married: true,
          childName: childName || 'Alex Jr',
        },
        parentingGame: {
          currentStep: 0,
          stress: 0,
          heirStats: initialHeirStats,
        },
        logs: [parentLog, ...state.logs].slice(0, 20)
      };
    }

    case 'SELECT_PARENTING_CHOICE': {
      const { cost, statGains, stressIncrease } = action.payload;
      const newMoney = Math.max(0, state.stats.money - cost);
      
      const newHeirStats = { ...state.parentingGame.heirStats };
      Object.entries(statGains).forEach(([statKey, value]) => {
        if (newHeirStats[statKey] !== undefined) {
          newHeirStats[statKey] = Math.min(100, newHeirStats[statKey] + value);
        }
      });

      const newStress = Math.min(100, (state.parentingGame.stress || 0) + (stressIncrease || 20));

      return {
        ...state,
        stats: {
          ...state.stats,
          money: newMoney,
        },
        parentingGame: {
          ...state.parentingGame,
          currentStep: state.parentingGame.currentStep + 1,
          heirStats: newHeirStats,
          stress: newStress
        },
        logs: [`Parenting: Made choice for child's development. Child Stress is now ${newStress}%.`, ...state.logs].slice(0, 20)
      };
    }

    case 'REDUCE_CHILD_STRESS': {
      const { energyCost, stressReduction } = action.payload;
      const newEnergy = Math.max(0, state.needs.energy - energyCost);
      const newStress = Math.max(0, state.parentingGame.stress - stressReduction);

      return {
        ...state,
        needs: {
          ...state.needs,
          energy: newEnergy
        },
        parentingGame: {
          ...state.parentingGame,
          stress: newStress
        },
        logs: [`Spent time with child to reduce stress. Stress is now ${newStress}%.`, ...state.logs].slice(0, 20)
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
        return {
          ...state,
          logs: ["LinkUp Gold subscription failed: Insufficient funds. ($15 required)", ...state.logs].slice(0, 20)
        };
      }
      return {
        ...state,
        stats: {
          ...state.stats,
          money: state.stats.money - fee
        },
        swipePremium: {
          ...state.swipePremium,
          active: true
        },
        logs: ["✨ Subscribed to LinkUp Gold! $15 deducted. Welcome to premium services!", ...state.logs].slice(0, 20)
      };
    }

    case 'CANCEL_PREMIUM': {
      return {
        ...state,
        swipePremium: {
          ...state.swipePremium,
          active: false
        },
        logs: ["Cancelled LinkUp Gold subscription. You will retain premium until weekly billing cycle.", ...state.logs].slice(0, 20)
      };
    }

    case 'UPDATE_SWIPE_PREFERENCES': {
      const { preferredStat, sexPreference } = action.payload;
      return {
        ...state,
        swipePreferences: {
          ...state.swipePreferences,
          ...(preferredStat !== undefined && { preferredStat }),
          ...(sexPreference !== undefined && { sexPreference })
        },
        logs: [`Updated dating preferences.`, ...state.logs].slice(0, 20)
      };
    }

    case 'INSTANT_MATCH': {
      const { npcId } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      if (!npc) return state;

      const newMatches = {
        ...state.matches,
        [npcId]: { met: true, relationship: 15, dateCount: 0 }
      };

      return {
        ...state,
        matches: newMatches,
        logs: [`✨ Gold Instant Match! You matched with ${npc.name} via Secret Admirers.`, ...state.logs].slice(0, 20)
      };
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

      const currentMatch = state.matches[npcId] || { met: true, relationship: 10, chemistry: 10, dateCount: 0 };
      const newRel = Math.min(100, Math.max(0, currentMatch.relationship + relGain));
      const newChem = Math.min(100, Math.max(0, (currentMatch.chemistry || 10) + chemGain));
      
      const newStats = {
        ...state.stats,
        money: Math.max(0, state.stats.money - moneyCost)
      };
      const newEnergy = Math.max(0, state.needs.energy - energyCost);

      const logMsg = `Alert Resolved: ${logText} (Rel: ${newRel}/100, Chem: ${newChem}/100)`;

      return {
        ...state,
        gamePhase: 'living',
        activeNpcAlert: null,
        stats: newStats,
        needs: {
          ...state.needs,
          energy: newEnergy
        },
        matches: {
          ...state.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            chemistry: newChem
          }
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
