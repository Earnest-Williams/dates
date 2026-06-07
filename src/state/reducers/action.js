import { HOUSING_TIERS } from '../../data/housing.js';
import { getSleepMultiplier } from '../../sim/needs.js';
import { getGroceriesCost } from '../../sim/economy.js';
import { calculateTravelStats, SETTLEMENTS } from '../../data/geography.js';
import { simulateTicks } from './time.js';
import { WORK_EVENTS } from '../../data/careers.js';
import { courses } from '../../data/education.js';
import { abilities } from '../../data/abilities.js';
import { ROUTINES, isRoutineAvailable } from '../../data/routines.js';
import { describeTimePassage, getTimeWindowStatus } from '../../sim/time.js';

const clampRoutineValue = (value) => Math.min(100, Math.max(0, value));
const ADMIN_WINDOW = { startHour: 7, endHour: 22, requireFinish: true };
const COURSE_ENROLL_WINDOW = { startHour: 8, endHour: 20, requireFinish: true };
const WISDOM_BONUS_STATS = new Set([
  'intelligence',
  'charisma',
  'corporate',
  'programming',
  'marketing',
  'finance',
  'negotiation',
  'culinary',
  'creativity',
  'music',
  'gaming',
  'confidence',
  'socialIq',
  'empathy',
]);

const applyWisdomBonus = (state, key, change) => {
  if ((state.family?.age ?? 18) <= 30) return change;
  if (change <= 0 || !WISDOM_BONUS_STATS.has(key)) return change;
  return change * 1.1;
};

export const applyRoutineEffects = (nextState, routine) => {
  const updatedStats = { ...nextState.stats };
  const updatedNeeds = { ...nextState.needs };

  Object.entries(routine.effects || {}).forEach(([key, value]) => {
    if (typeof updatedNeeds[key] === 'number') {
      updatedNeeds[key] = clampRoutineValue(updatedNeeds[key] + value);
    } else if (typeof updatedStats[key] === 'number') {
      updatedStats[key] = clampRoutineValue(updatedStats[key] + value);
    }
  });

  updatedNeeds.energy = Math.max(0, updatedNeeds.energy - (routine.energyCost || 0));

  return { updatedStats, updatedNeeds };
};

export const actionReducer = (state, action) => {
  switch (action.type) {
    case 'PERFORM_ACTION': {
      const { actionName, ticks, statChanges, energyCost, moneyChange, availableWindow, durationTicks } = action.payload;

      if (availableWindow) {
        const timeStatus = getTimeWindowStatus(state.time, availableWindow, durationTicks || ticks);
        if (!timeStatus.available) {
          return {
            ...state,
            logs: [`${actionName} is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20),
          };
        }
      }
      
      // 1. Unified state simulation (time increments, passive needs decay, collapse checks, billing cycles)
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, `finished ${actionName}`);

      const currentHealth = state.needs.health;
      const currentMood = state.needs.mood;
      const healthPenalty = currentHealth < 50;
      const moodHigh = currentMood >= 70;
      const hasBookshelf = state.placedFurniture.includes('bookshelf');
      const isBurnedOut = state.activeTraits?.includes('burned_out');

      // 2. Process gains / modifiers (bookshelf, high mood, low health)
      const finalStatChanges = { ...statChanges };
      Object.keys(finalStatChanges).forEach(key => {
        let change = finalStatChanges[key];
        
        if (isBurnedOut && change > 0 && key !== 'mood' && key !== 'health') {
           change = change * 0.5;
        }
        
        // Health penalty on fitness
        if (key === 'fitness' && healthPenalty && change > 0) {
          change = change * 0.5;
        }

        // High Mood bonus (+50%)
        if (moodHigh && change > 0) {
          if (actionName.toLowerCase().includes('study') && key === 'intelligence') {
            change = change * 1.5;
          } else if (actionName.toLowerCase().includes('charm') && key === 'charisma') {
            change = change * 1.5;
          }
        }

        // Bookshelf study boost
        if (actionName.toLowerCase().includes('study') && key === 'intelligence' && hasBookshelf) {
          change = change * 1.25;
        }

        change = applyWisdomBonus(nextState, key, change);

        finalStatChanges[key] = change;
      });

      // Work earnings penalty
      let finalMoneyChange = moneyChange;
      if (moneyChange > 0 && actionName.toLowerCase().includes('work') && healthPenalty) {
        finalMoneyChange = Math.floor(moneyChange * 0.5);
      }

      // Exertion hygiene costs
      let hygieneCost = 0;
      if (actionName.toLowerCase().includes('workout') || actionName.toLowerCase().includes('gym')) hygieneCost = 25;
      else if (actionName.toLowerCase().includes('work')) hygieneCost = 15;

      const updatedStats = { ...nextState.stats };
      Object.keys(finalStatChanges).forEach(key => {
        if (key !== 'mood' && key !== 'health' && updatedStats[key] !== undefined) {
          updatedStats[key] = Math.min(100, Math.max(0, updatedStats[key] + finalStatChanges[key]));
        }
      });

      updatedStats.money = Math.max(0, updatedStats.money + finalMoneyChange);

      const finalEnergy = Math.max(0, nextState.needs.energy - energyCost);
      const finalHygiene = Math.max(0, nextState.needs.hygiene - hygieneCost);
      
      let finalMood = nextState.needs.mood;
      if (finalStatChanges.mood !== undefined) {
        finalMood = Math.min(100, Math.max(0, finalMood + finalStatChanges.mood));
      }
      let finalHealth = nextState.needs.health;
      if (finalStatChanges.health !== undefined) {
        finalHealth = Math.min(100, Math.max(0, finalHealth + finalStatChanges.health));
      }

      const statGains = Object.entries(finalStatChanges)
        .filter(([k]) => k !== 'mood' && k !== 'health')
        .map(([k, v]) => `+${v.toFixed(1)} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
        .join(', ');
      
      const moodDiff = finalStatChanges.mood !== undefined ? `${finalStatChanges.mood > 0 ? '+' : ''}${finalStatChanges.mood} Mood` : '';
      const healthDiff = finalStatChanges.health !== undefined ? `${finalStatChanges.health > 0 ? '+' : ''}${finalStatChanges.health} Health` : '';
      const moneyDiff = finalMoneyChange !== 0 ? `${finalMoneyChange > 0 ? '+$' : '-$'}${Math.abs(finalMoneyChange)}` : '';
      const parts = [statGains, moodDiff, healthDiff, moneyDiff].filter(Boolean).join(', ');
      
      const logMsg = `${timePassage}${parts ? ` (${parts})` : ''}`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      let newState = {
        ...nextState,
        stats: updatedStats,
        needs: {
          ...nextState.needs,
          energy: finalEnergy,
          hygiene: finalHygiene,
          mood: finalMood,
          health: finalHealth
        },
        logs: finalLogs
      };

      // 3. Random Work Event trigger (20% chance if working)
      if (actionName.toLowerCase().includes('work') && Math.random() < 0.20) {
        const randomEvent = WORK_EVENTS[Math.floor(Math.random() * WORK_EVENTS.length)];
        newState.gamePhase = 'work_event';
        newState.activeWorkEvent = randomEvent;
        newState.logs = [`An unexpected situation arose at work!`, ...newState.logs].slice(0, 20);
      }

      return newState;
    }

    case 'RESOLVE_WORK_EVENT': {
      const { optionIndex } = action.payload;
      const event = state.activeWorkEvent;
      const choice = event.choices[optionIndex];

      const success = state.stats[choice.checkStat] >= choice.threshold;
      const logText = success ? choice.successText : choice.failText;

      const bonusMoney = success ? choice.bonusMoney : 0;
      const finalEnergy = Math.max(0, state.needs.energy - choice.energyCost);
      let finalMood = Math.max(0, Math.min(100, state.needs.mood + choice.moodCost));
      let finalMoney = state.stats.money + bonusMoney;

      const moneyStr = bonusMoney > 0 ? ` (+$${bonusMoney})` : '';
      const logMsg = `Work event: ${logText}${moneyStr}`;

      return {
        ...state,
        gamePhase: 'living',
        activeWorkEvent: null,
        stats: {
          ...state.stats,
          money: finalMoney
        },
        needs: {
          ...state.needs,
          energy: finalEnergy,
          mood: finalMood
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    case 'SLEEP': {
      const { hours } = action.payload;
      const ticks = hours * 6;
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, `slept for ${hours} hours`);

      const rate = HOUSING_TIERS[state.stats.housingTier].energyRate;
      const multiplier = getSleepMultiplier(state.placedFurniture);
      const energyGain = hours * rate * multiplier;
      const moodGain = hours;

      const logMsg = `${timePassage} ${HOUSING_TIERS[state.stats.housingTier].name} bed multiplier: x${multiplier.toFixed(2)}. Restores energy and mood.`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        needs: {
          ...nextState.needs,
          energy: Math.min(100, nextState.needs.energy + energyGain),
          mood: Math.min(100, nextState.needs.mood + moodGain)
        },
        logs: finalLogs
      };
    }

    case 'COOK_MEAL': {
      const ticks = 3; // 30 mins
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, `cooked a ${state.placedFurniture.includes('gas_range') ? 'premium meal' : 'basic meal'}`);

      const hasGasRange = state.placedFurniture.includes('gas_range');
      const hasSmartFridge = state.placedFurniture.includes('smart_fridge');
      const cost = getGroceriesCost(hasGasRange, hasSmartFridge);

      const culinaryLevel = state.stats.culinary || 10;
      const skillBonus = culinaryLevel >= 50;

      const hungerRecovery = (hasGasRange ? 60 : 30) + (skillBonus ? 10 : 0);
      const moodBonus = (hasGasRange ? 15 : 0) + (skillBonus ? 5 : 0);
      const hygieneCost = skillBonus ? 2 : 5;

      const newCulinary = Math.min(100, culinaryLevel + 2);
      const mealName = hasGasRange ? "premium meal on your Gas Range" : "basic meal on your Hot Plate";

      const logMsg = `${timePassage} ${mealName}. (-$${cost}, -${hygieneCost} Hygiene, -${hungerRecovery} Hunger${moodBonus ? `, +${moodBonus} Mood` : ''}, +2.0 Culinary Skill)`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: Math.max(0, nextState.stats.money - cost),
          culinary: newCulinary
        },
        needs: {
          ...nextState.needs,
          hunger: Math.max(0, nextState.needs.hunger - hungerRecovery),
          hygiene: Math.max(0, nextState.needs.hygiene - hygieneCost),
          mood: Math.min(100, nextState.needs.mood + moodBonus)
        },
        logs: finalLogs
      };
    }

    case 'DINE_OUT': {
      const ticks = 6; // 1 hour
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, 'had dinner at a nice restaurant');
      const cost = 30;

      const logMsg = `${timePassage} (-$30, -80 Hunger, +20 Mood)`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: Math.max(0, nextState.stats.money - cost)
        },
        needs: {
          ...nextState.needs,
          hunger: Math.max(0, nextState.needs.hunger - 80),
          mood: Math.min(100, nextState.needs.mood + 20)
        },
        logs: finalLogs
      };
    }

    case 'SHOWER': {
      const ticks = 3;
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, 'took a hot shower');
      const finalLogs = [`${timePassage} Feeling fresh and clean!`, ...nextState.logs].slice(0, 20);
      
      return {
        ...nextState,
        needs: {
          ...nextState.needs,
          hygiene: 100
        },
        logs: finalLogs
      };
    }

    case 'PAY_BILLS': {
      const timeStatus = getTimeWindowStatus(state.time, ADMIN_WINDOW, 2);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Paying bills is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, 'worked through utility and rent payments');
      const currentHousingTier = state.stats.housingTier;
      const rentCost = HOUSING_TIERS[currentHousingTier].rent;
      const billsCost = nextState.living.billsAmount;

      const totalOwed = rentCost + billsCost;
      if (nextState.stats.money >= totalOwed) {
        return {
          ...nextState,
          stats: {
            ...nextState.stats,
            money: nextState.stats.money - totalOwed
          },
          living: {
            ...nextState.living,
            utilitiesActive: true
          },
          logs: [`${timePassage} Paid $${totalOwed} to restore utilities and catch up on rent.`, ...nextState.logs].slice(0, 20)
        };
      }
      return {
        ...nextState,
        logs: [`${timePassage} Not enough money to pay bills ($${totalOwed} needed).`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'TOGGLE_HEALTH_INSURANCE': {
      const timeStatus = getTimeWindowStatus(state.time, ADMIN_WINDOW, 1);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Insurance services are closed right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, 'handled health insurance paperwork');
      const currentState = nextState.living.hasHealthInsurance;
      const newStatus = !currentState;
      const logMsg = newStatus 
        ? `${timePassage} Subscribed to health insurance. You will be billed $150/month.` 
        : `${timePassage} Cancelled health insurance. You are no longer protected from medical debt.`;
        
      return {
        ...nextState,
        living: {
          ...nextState.living,
          hasHealthInsurance: newStatus
        },
        logs: [logMsg, ...nextState.logs].slice(0, 20)
      };
    }


    case 'DO_ROUTINE': {
      const { routineId } = action.payload;
      const routine = ROUTINES.find((item) => item.id === routineId);
      if (!routine) return state;
      if (!isRoutineAvailable(routine, state)) {
        return {
          ...state,
          logs: [`Cannot do "${routine.label}" right now.`, ...state.logs].slice(0, 20),
        };
      }

      const nextState = simulateTicks(state, routine.durationTicks);
      const timePassage = describeTimePassage(state.time, nextState.time, `completed ${routine.label}`);
      const { updatedStats, updatedNeeds } = applyRoutineEffects(nextState, routine);

      const memoryRoll = routine.memoryChance && Math.random() < routine.memoryChance;
      const memoryLog = memoryRoll ? ' A memory of someone close surfaced.' : '';
      const msgLog = memoryRoll && routine.id === 'call_family_friend'
        ? ' A friend texted right after your call.'
        : '';
      const prevTracker = nextState.routineTracker || {};
      const isNewDay = prevTracker.day !== nextState.time.day;
      const completedToday = isNewDay ? [routine.id] : [...(prevTracker.completedToday || []), routine.id];
      const prevDay = prevTracker.day || nextState.time.day;
      const isNewWeek = Math.floor((nextState.time.day - 1) / 7) > Math.floor((prevDay - 1) / 7);
      const weeklyCounts = isNewWeek ? {} : { ...(prevTracker.weeklyCounts || {}) };
      weeklyCounts[routine.id] = (weeklyCounts[routine.id] || 0) + 1;
      const uniqueTags = new Set();
      completedToday.forEach((rid) => {
        const doneRoutine = ROUTINES.find((item) => item.id === rid);
        (doneRoutine?.tags || []).forEach((tag) => uniqueTags.add(tag));
      });
      const balancedBonus = uniqueTags.size >= 5 ? 4 : 0;
      updatedNeeds.mood = Math.min(100, updatedNeeds.mood + balancedBonus);
      const logMsg = `${timePassage} ${routine.logTemplate || `Completed routine: ${routine.label}.`}${memoryLog}${msgLog}${balancedBonus ? ` Balanced day bonus: +${balancedBonus} Mood.` : ''}`;

      return {
        ...nextState,
        stats: updatedStats,
        needs: updatedNeeds,
        routineTracker: { day: nextState.time.day, completedToday, weeklyCounts },
        logs: [logMsg, ...nextState.logs].slice(0, 20),
      };
    }

    case 'WATCH_TV': {
      const ticks = 6;
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, 'watched TV');
      const finalLogs = [`${timePassage} (+30 Mood, -5 Energy)`, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        needs: {
          ...nextState.needs,
          energy: Math.max(0, nextState.needs.energy - 5),
          mood: Math.min(100, nextState.needs.mood + 30)
        },
        logs: finalLogs
      };
    }

    case 'VISIT_HOSPITAL': {
      const ticks = 6;
      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, 'visited the Hospital clinic');
      const finalLogs = [`${timePassage} (-$100, +40 Health)`, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: Math.max(0, nextState.stats.money - 100)
        },
        needs: {
          ...nextState.needs,
          health: Math.min(100, nextState.needs.health + 40)
        },
        logs: finalLogs
      };
    }

    case 'TRAVEL': {
      const { locationKey } = action.payload;
      const travelStats = calculateTravelStats(state.activeLocation, locationKey, state.properties.vehicles);
      
      let ticks = 6;
      let energyCost = 10;
      let fitnessBonus = 0;
      let vehicleUsed = 'foot';
      let distance = 0;
      let pathChain = '';

      if (travelStats) {
        ticks = travelStats.ticks;
        energyCost = travelStats.energyCost;
        fitnessBonus = travelStats.fitnessBonus;
        vehicleUsed = travelStats.vehicleUsed;
        distance = travelStats.distance;
        pathChain = travelStats.path.join(" ➔ ");
      }

      let nextState = simulateTicks(state, ticks);
      const timePassage = describeTimePassage(state.time, nextState.time, `traveled to ${SETTLEMENTS[locationKey]?.name || locationKey}`);

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }

      const routeMsg = pathChain ? ` (Route: ${pathChain}, ${distance.toFixed(1)} km)` : ` (${distance.toFixed(1)} km)`;
      const logMsg = `${timePassage} Via ${vehicleUsed}.${routeMsg} (-${energyCost} Energy)`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        activeLocation: locationKey,
        stats: newStats,
        needs: {
          ...nextState.needs,
          energy: Math.max(0, nextState.needs.energy - energyCost)
        },
        logs: finalLogs
      };
    }

    case 'ENROLL_COURSE': {
      const { courseId, useLoan } = action.payload;
      const course = courses[courseId];
      if (!course) return state;

      const timeStatus = getTimeWindowStatus(state.time, COURSE_ENROLL_WINDOW, 3);
      if (!timeStatus.available) {
        return {
          ...state,
          logs: [`Course registration is not practical right now. ${timeStatus.reason}`, ...state.logs].slice(0, 20)
        };
      }

      if (!useLoan && state.stats.money < course.cost) {
        return {
          ...state,
          logs: [`Not enough money to enroll in ${course.name}. Consider taking a student loan.`, ...state.logs].slice(0, 20)
        };
      }

      // Check requirements
      if (course.requirements && course.requirements.stats) {
        for (const [stat, reqVal] of Object.entries(course.requirements.stats)) {
          if ((state.stats[stat] || 0) < reqVal) {
             return {
               ...state,
               logs: [`Missing requirement: ${stat} >= ${reqVal} for ${course.name}`, ...state.logs].slice(0, 20)
             };
          }
        }
      }

      const nextState = simulateTicks(state, 3);
      const timePassage = describeTimePassage(state.time, nextState.time, `handled registration for ${course.name}`);
      let newMoney = nextState.stats.money;
      let newLoans = nextState.education.studentLoans || 0;

      if (useLoan) {
        newLoans += course.cost;
      } else {
        newMoney -= course.cost;
      }

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: newMoney
        },
        education: {
          ...nextState.education,
          activeCourse: courseId,
          courseProgress: 0,
          studentLoans: newLoans
        },
        logs: [`${timePassage} Enrolled in ${course.name} ${useLoan ? '(paid with student loan)' : 'for $' + course.cost}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'STUDY_COURSE': {
      if (!state.education || !state.education.activeCourse) return state;
      
      const course = courses[state.education.activeCourse];
      if (!course) return state;

      // Study session takes 20 ticks (approx 3 hours)
      const sessionTicks = 20;
      let nextState = simulateTicks(state, sessionTicks);
      const timePassage = describeTimePassage(state.time, nextState.time, `studied for ${course.name}`);

      nextState.needs.energy = Math.max(0, nextState.needs.energy - 25);
      nextState.needs.mood = Math.max(0, nextState.needs.mood - 10);

      const newProgress = state.education.courseProgress + sessionTicks;
      
      if (newProgress >= course.durationTicks) {
         // Final Exam Check!
         let passed = true;
         if (course.exam && course.exam.stats) {
            for (const [stat, reqVal] of Object.entries(course.exam.stats)) {
               if ((state.stats[stat] || 0) < reqVal) {
                  passed = false;
                  break;
               }
            }
         }

         if (passed) {
           const newStats = { ...nextState.stats };
           const newCredentials = [...(newStats.credentials || [])];
           if (!newCredentials.includes(course.credentialEarned)) {
               newCredentials.push(course.credentialEarned);
           }
           newStats.credentials = newCredentials;

           // Apply benefits
           if (course.benefits && course.benefits.stats) {
              for (const [stat, val] of Object.entries(course.benefits.stats)) {
                 newStats[stat] = Math.min(100, (newStats[stat] || 0) + val);
              }
           }

           return {
             ...nextState,
             stats: newStats,
             education: {
               ...state.education,
               activeCourse: null,
               courseProgress: 0
             },
             logs: [`${timePassage} Passed the final exam and earned ${course.credentialEarned}.`, ...nextState.logs].slice(0, 20)
           };
         } else {
           // Failed Exam
           return {
             ...nextState,
             education: {
               ...state.education,
               courseProgress: Math.floor(course.durationTicks * 0.5) // Set back to 50%
             },
             logs: [`${timePassage} Failed the final exam. Your stats weren't high enough. Keep studying!`, ...nextState.logs].slice(0, 20)
           };
         }
      }

      // Not complete yet
      return {
         ...nextState,
         education: {
           ...state.education,
           courseProgress: newProgress
         },
         logs: [`${timePassage} Progress: ${Math.floor((newProgress / course.durationTicks) * 100)}%`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'USE_ABILITY': {
      const { abilityId } = action.payload;
      const ability = abilities[abilityId];
      if (!ability || state.needs.energy < ability.energyCost) return state;

      let nextState = simulateTicks(state, 4); // Take ~1 hour
      const timePassage = describeTimePassage(state.time, nextState.time, `used ${ability.name}`);
      nextState.needs.energy = Math.max(0, nextState.needs.energy - ability.energyCost);
      
      let logMsg = `${timePassage}`;
      if (ability.riskChance && Math.random() < ability.riskChance) {
        logMsg = `Ability failed! ${ability.name} triggered a penalty.`;
        if (ability.effectType === 'money') {
           nextState.stats.money = Math.max(0, nextState.stats.money - ability.riskPenalty);
           logMsg += ` Lost $${ability.riskPenalty}.`;
        } else if (ability.effectType === 'simstagram_followers') {
           nextState.simstagram.followers = Math.max(0, nextState.simstagram.followers + ability.riskPenalty);
           logMsg += ` Lost ${Math.abs(ability.riskPenalty)} followers.`;
        }
      } else {
        if (ability.effectType === 'money') {
           nextState.stats.money += ability.effectValue;
           logMsg += ` Gained $${ability.effectValue}.`;
        } else if (ability.effectType === 'simstagram_followers') {
           nextState.simstagram.followers += ability.effectValue;
           logMsg += ` Gained ${ability.effectValue} followers.`;
        } else if (ability.effectType === 'date_vibe' && nextState.activeDateEvent) {
           logMsg += ` Date vibe boosted!`;
           // Handled in UI layer or needs specialized date reducer interception,
           // but for simple flat state changes we can apply it.
        }
      }

      return {
        ...nextState,
        logs: [logMsg, ...nextState.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
