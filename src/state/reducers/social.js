import { NPCS } from '../../data/npcs';
import { ITEMS } from '../../data/items';
import { LOCATIONS } from '../../data/locations';
import { calculateMatchProbability } from '../../sim/matching';
import { simulateTicks } from './time';

export const socialReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_RELATIONSHIP': {
      const { npcId, delta } = action.payload;
      const currentData = state.matches[npcId] || { met: true, relationship: 10, dateCount: 0 };
      const newRel = Math.min(100, Math.max(0, currentData.relationship + delta));
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
        updatedMatches[npcId] = { met: true, relationship: 10, dateCount: 0 };
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

    case 'GIVE_GIFT': {
      const { npcId, itemKey } = action.payload;
      const item = ITEMS[itemKey];
      const npc = NPCS.find(n => n.id === npcId);

      const updatedInventory = { ...state.inventory };
      updatedInventory[itemKey] -= 1;
      if (updatedInventory[itemKey] === 0) delete updatedInventory[itemKey];

      let gain = item.effect.relationship;
      if (item.effect.bonusArchetypes.includes(npc.archetype)) {
        gain = Math.floor(gain * 1.5);
      }

      const currentMatch = state.matches[npcId] || { met: true, relationship: 10, dateCount: 0 };
      const newRel = Math.min(100, currentMatch.relationship + gain);
      const logMsg = `Gave ${item.name} to ${npc.name}. Relationship: ${newRel}/100 (+${gain})`;

      return {
        ...state,
        inventory: updatedInventory,
        matches: {
          ...state.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel
          }
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    case 'ANSWER_DIALOGUE': {
      const { npcId, optionIndex } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      const choice = npc.dialogue.choices[optionIndex];

      let relChange = choice.successRelation || 0;
      let logText = choice.successText;

      if (choice.checkStat) {
        const success = state.stats[choice.checkStat] >= choice.threshold;
        relChange = success ? choice.successRelation : choice.failRelation;
        logText = success ? choice.successText : choice.failText;
      }

      // Advances 30 mins (3 ticks)
      let nextState = simulateTicks(state, 3);

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, dateCount: 0 };
      const newRel = Math.min(100, Math.max(0, currentMatch.relationship + relChange));

      let moodIncrease = 0;
      if (relChange > 0) {
        moodIncrease = Math.min(10, Math.max(1, Math.floor(relChange * 0.5)));
      }
      const currentMood = nextState.needs.mood !== undefined ? nextState.needs.mood : 100;
      const newMood = Math.min(100, currentMood + moodIncrease);

      const logMsg = `[${npc.name}] ${logText} (Relationship: ${newRel}/100${moodIncrease ? `, +${moodIncrease} Mood` : ''})`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel
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

      let timeIncrements = 6;
      let fitnessBonus = 0;
      const vehicles = state.properties.vehicles;

      if (vehicles.includes('sports_car') || vehicles.includes('sedan')) {
        timeIncrements = 2;
      } else if (vehicles.includes('scooter')) {
        timeIncrements = 3;
      } else if (vehicles.includes('bicycle')) {
        timeIncrements = 4;
        fitnessBonus = 1;
      }

      // Travel ticks + 3 ticks date activity
      let nextState = simulateTicks(state, timeIncrements + 3);

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }

      let relGain = 10;
      const comments = npc.dialogue.dateLines || {};
      const comment = comments[locationKey] || "It's nice to spend time with you.";

      if (locationKey === 'gym' && npc.archetype === 'GYM_RAT') relGain += 15;
      else if (locationKey === 'library' && npc.archetype === 'SCHOLAR') relGain += 15;
      else if (locationKey === 'club' && npc.archetype === 'SOCIALITE') relGain += 15;
      else if (locationKey === 'office' && npc.archetype === 'EXECUTIVE') relGain += 15;
      else if (locationKey === 'park' && npc.archetype === 'ARTIST') relGain += 15;

      const currentMatch = nextState.matches[npcId] || { met: true, relationship: 10, dateCount: 0 };
      const newRel = Math.min(100, currentMatch.relationship + relGain);

      const currentMood = nextState.needs.mood !== undefined ? nextState.needs.mood : 100;
      const newMood = Math.min(100, currentMood + 15);

      const totalCost = location.energyCost + 10;
      const finalEnergy = Math.max(0, nextState.needs.energy - totalCost);

      const logMsg = `Date with ${npc.name} at ${location.name}: "${comment}" (+${relGain} Rel, +15 Mood, -${totalCost} Energy)`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        activeLocation: locationKey,
        stats: newStats,
        matches: {
          ...nextState.matches,
          [npcId]: {
            ...currentMatch,
            relationship: newRel,
            dateCount: (currentMatch.dateCount || 0) + 1
          }
        },
        needs: {
          ...nextState.needs,
          energy: finalEnergy,
          mood: newMood
        },
        logs: finalLogs
      };
    }

    case 'PROPOSE_MARRIAGE': {
      const { npcId } = action.payload;
      const npc = NPCS.find(n => n.id === npcId);
      const logMsg = `💍 YOU PROPOSED TO ${npc.name.toUpperCase()} AND THEY SAID YES! Marriage event triggered.`;
      return {
        ...state,
        gamePhase: 'marriage',
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
          heirStats: initialHeirStats,
        },
        logs: [parentLog, ...state.logs].slice(0, 20)
      };
    }

    case 'SELECT_PARENTING_CHOICE': {
      const { cost, statGains } = action.payload;
      const newMoney = Math.max(0, state.stats.money - cost);
      
      const newHeirStats = { ...state.parentingGame.heirStats };
      Object.entries(statGains).forEach(([statKey, value]) => {
        if (newHeirStats[statKey] !== undefined) {
          newHeirStats[statKey] = Math.min(100, newHeirStats[statKey] + value);
        }
      });

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
        },
        logs: [`Parenting: Made choice for child's development.`, ...state.logs].slice(0, 20)
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

      const welcomeLog = `[Generation ${state.family.generation + 1}] Welcome to your new life as ${childName.toUpperCase()}! You inherited $${inheritedCash} (50% of parent's money) and all their vehicles. You start with legacy stat bonuses! Ready to live your own life?`;

      return {
        ...state,
        gamePhase: 'living',
        time: {
          day: 1,
          hour: 8,
          minute: 0,
        },
        stats: childStats,
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
        activeLocation: 'home',
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

    default:
      return state;
  }
};
