import { HOUSING_TIERS } from '../../data/housing.js';
import { LOCATIONS } from '../../data/locations.js';
import { getSleepMultiplier } from '../../sim/needs.js';
import { getGroceriesCost } from '../../sim/economy.js';
import { calculateTravelStats, SETTLEMENTS } from '../../data/geography.js';
import { simulateTicks } from './time.js';
import { WORK_EVENTS, getCurrentCareer } from '../../data/careers.js';
import { courses } from '../../data/education.js';
import { abilities } from '../../data/abilities.js';
import { ROUTINES } from '../../data/routines.js';

export const actionReducer = (state, action) => {
  switch (action.type) {
    case 'PERFORM_ACTION': {
      const { actionName, ticks, statChanges, energyCost, moneyChange } = action.payload;
      
      // 1. Unified state simulation (time increments, passive needs decay, collapse checks, billing cycles)
      let nextState = simulateTicks(state, ticks);

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
      
      const logMsg = `Finished: ${actionName} (${parts})`;
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
      let relGain = success ? choice.successRelation : choice.failRelation;
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

      const rate = HOUSING_TIERS[state.stats.housingTier].energyRate;
      const multiplier = getSleepMultiplier(state.placedFurniture);
      const energyGain = hours * rate * multiplier;
      const moodGain = hours;

      const logMsg = `Slept for ${hours} hours in ${HOUSING_TIERS[state.stats.housingTier].name} (Bed multiplier: x${multiplier.toFixed(2)}). Restores energy and mood.`;
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

      const logMsg = `Cooked a ${mealName}. (-$${cost}, -${hygieneCost} Hygiene, -${hungerRecovery} Hunger${moodBonus ? `, +${moodBonus} Mood` : ''}, +2.0 Culinary Skill)`;
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
      const cost = 30;

      const logMsg = "Had dinner at a nice restaurant. (-$30, -80 Hunger, +20 Mood)";
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
      const finalLogs = ["Took a hot shower. Feeling fresh and clean!", ...nextState.logs].slice(0, 20);
      
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
      const currentHousingTier = state.stats.housingTier;
      const rentCost = HOUSING_TIERS[currentHousingTier].rent;
      const billsCost = state.living.billsAmount;

      const totalOwed = rentCost + billsCost;
      if (state.stats.money >= totalOwed) {
        return {
          ...state,
          stats: {
            ...state.stats,
            money: state.stats.money - totalOwed
          },
          living: {
            ...state.living,
            utilitiesActive: true
          },
          logs: [`Paid $${totalOwed} to restore utilities and catch up on rent.`, ...state.logs].slice(0, 20)
        };
      }
      return {
        ...state,
        logs: [`⚠️ Not enough money to pay bills ($${totalOwed} needed).`, ...state.logs].slice(0, 20)
      };
    }

    case 'TOGGLE_HEALTH_INSURANCE': {
      const currentState = state.living.hasHealthInsurance;
      const newStatus = !currentState;
      const logMsg = newStatus 
        ? `Subscribed to Health Insurance. You will be billed $150/month.` 
        : `Cancelled Health Insurance. You are no longer protected from medical debt.`;
        
      return {
        ...state,
        living: {
          ...state.living,
          hasHealthInsurance: newStatus
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }


    case 'DO_ROUTINE': {
      const { routineId } = action.payload;
      const routine = ROUTINES.find((item) => item.id === routineId);
      if (!routine) return state;

      const nextState = simulateTicks(state, routine.durationTicks);
      const updatedStats = { ...nextState.stats };
      const updatedNeeds = { ...nextState.needs };

      Object.entries(routine.effects || {}).forEach(([key, value]) => {
        if (typeof updatedNeeds[key] === 'number') {
          updatedNeeds[key] = Math.min(100, Math.max(0, updatedNeeds[key] + value));
        } else if (typeof updatedStats[key] === 'number') {
          updatedStats[key] = Math.min(100, Math.max(0, updatedStats[key] + value));
        }
      });

      updatedNeeds.energy = Math.max(0, updatedNeeds.energy - (routine.energyCost || 0));

      const memoryRoll = routine.memoryChance && Math.random() < routine.memoryChance;
      const memoryLog = memoryRoll ? ' A memory of someone close surfaced.' : '';
      const msgLog = memoryRoll && routine.id === 'call_family_friend'
        ? ' A friend texted right after your call.'
        : '';
      const logMsg = `${routine.logTemplate || `Completed routine: ${routine.label}.`}${memoryLog}${msgLog}`;

      return {
        ...nextState,
        stats: updatedStats,
        needs: updatedNeeds,
        logs: [logMsg, ...nextState.logs].slice(0, 20),
      };
    }

    case 'WATCH_TV': {
      const ticks = 6;
      let nextState = simulateTicks(state, ticks);
      const finalLogs = ["Watched TV for 1 hour. (+30 Mood, -5 Energy)", ...nextState.logs].slice(0, 20);

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
      const finalLogs = ["Visited the Hospital clinic for treatment. (-$100, +40 Health)", ...nextState.logs].slice(0, 20);

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

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }

      const destName = SETTLEMENTS[locationKey]?.name || locationKey;
      const routeMsg = pathChain ? ` (Route: ${pathChain}, ${distance.toFixed(1)} km)` : ` (${distance.toFixed(1)} km)`;
      const logMsg = `Traveled to ${destName} via ${vehicleUsed}.${routeMsg} (Took ${ticks * 10} mins, -${energyCost} Energy)`;
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

      let newMoney = state.stats.money;
      let newLoans = state.education.studentLoans || 0;

      if (!useLoan && state.stats.money < course.cost) {
        return {
          ...state,
          logs: [`Not enough money to enroll in ${course.name}. Consider taking a student loan.`, ...state.logs].slice(0, 20)
        };
      }

      if (useLoan) {
        newLoans += course.cost;
      } else {
        newMoney -= course.cost;
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

      return {
        ...state,
        stats: {
          ...state.stats,
          money: newMoney
        },
        education: {
          ...state.education,
          activeCourse: courseId,
          courseProgress: 0,
          studentLoans: newLoans
        },
        logs: [`Enrolled in ${course.name} ${useLoan ? '(Paid with Student Loan)' : 'for $' + course.cost}!`, ...state.logs].slice(0, 20)
      };
    }

    case 'STUDY_COURSE': {
      if (!state.education || !state.education.activeCourse) return state;
      
      const course = courses[state.education.activeCourse];
      if (!course) return state;

      // Study session takes 20 ticks (approx 3 hours)
      const sessionTicks = 20;
      let nextState = simulateTicks(state, sessionTicks);

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
             logs: [`Passed the final exam! Completed ${course.name}! Earned ${course.credentialEarned}.`, ...nextState.logs].slice(0, 20)
           };
         } else {
           // Failed Exam
           return {
             ...nextState,
             education: {
               ...state.education,
               courseProgress: Math.floor(course.durationTicks * 0.5) // Set back to 50%
             },
             logs: [`Failed the final exam for ${course.name}. Your stats weren't high enough. Keep studying!`, ...nextState.logs].slice(0, 20)
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
         logs: [`Studied for ${course.name}. Progress: ${Math.floor((newProgress / course.durationTicks) * 100)}%`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'USE_ABILITY': {
      const { abilityId } = action.payload;
      const ability = abilities[abilityId];
      if (!ability || state.needs.energy < ability.energyCost) return state;

      let nextState = simulateTicks(state, 4); // Take ~1 hour
      nextState.needs.energy = Math.max(0, nextState.needs.energy - ability.energyCost);
      
      let logMsg = `Used ability: ${ability.name}.`;
      let isRiskTriggered = false;

      if (ability.riskChance && Math.random() < ability.riskChance) {
        isRiskTriggered = true;
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
