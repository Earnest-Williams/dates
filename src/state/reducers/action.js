import { HOUSING_TIERS } from '../../data/housing';
import { LOCATIONS } from '../../data/locations';
import { getSleepMultiplier } from '../../sim/needs';
import { getGroceriesCost } from '../../sim/economy';
import { simulateTicks } from './time';

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

      // 2. Process gains / modifiers (bookshelf, high mood, low health)
      const finalStatChanges = { ...statChanges };
      Object.keys(finalStatChanges).forEach(key => {
        let change = finalStatChanges[key];
        
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

      return {
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
      const cost = state.living.billsAmount;
      return {
        ...state,
        stats: {
          ...state.stats,
          money: Math.max(0, state.stats.money - cost)
        },
        living: {
          ...state.living,
          utilitiesActive: true
        },
        logs: [`Paid outstanding utility bills of $${cost}. Power and internet restored!`, ...state.logs].slice(0, 20)
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
      const location = LOCATIONS[locationKey];
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

      let nextState = simulateTicks(state, timeIncrements);

      const newStats = { ...nextState.stats };
      if (fitnessBonus > 0) {
        newStats.fitness = Math.min(100, newStats.fitness + fitnessBonus);
      }

      const vehicleUsed = vehicles.includes('sports_car') ? 'Sports Car' : 
                          vehicles.includes('sedan') ? 'Sedan' : 
                          vehicles.includes('scooter') ? 'Electric Scooter' : 
                          vehicles.includes('bicycle') ? 'Bicycle' : 'foot';

      const logMsg = `Traveled to ${location.name} via ${vehicleUsed}. (Took ${timeIncrements * 10} mins, -${location.energyCost} Energy)`;
      const finalLogs = [logMsg, ...nextState.logs].slice(0, 20);

      return {
        ...nextState,
        activeLocation: locationKey,
        stats: newStats,
        needs: {
          ...nextState.needs,
          energy: Math.max(0, nextState.needs.energy - location.energyCost)
        },
        logs: finalLogs
      };
    }

    default:
      return state;
  }
};
