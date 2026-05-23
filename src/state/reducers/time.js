import { HOUSING_TIERS } from '../../data/housing';
import { incrementTime } from '../../sim/time';
import { decayNeeds } from '../../sim/needs';
import { calculateStorageFee } from '../../sim/economy';

export const simulateTicks = (state, ticks) => {
  const { time: newTime, daysCrossed } = incrementTime(state.time, ticks);
  
  const hoursPassed = (ticks * 10) / 60;
  const newNeeds = decayNeeds(state.needs, hoursPassed);

  let currentMoney = state.stats.money;
  let currentHousingTier = state.stats.housingTier;
  let currentUtilitiesActive = state.living.utilitiesActive;
  let currentStorage = [...state.storage];
  let currentPlaced = [...state.placedFurniture];
  let currentPremiumActive = state.swipePremium?.active || false;
  const newLogs = [...state.logs];

  daysCrossed.forEach(dayNum => {
    // 1. Weekly Rent, Storage, Subscription and Interest
    if (dayNum % 7 === 0) {
      // Interest payment
      if (currentMoney > 0) {
        const financeLevel = state.stats.finance || 10;
        const weeklyInterest = Math.min(300, Math.floor(currentMoney * 0.002 * financeLevel));
        if (weeklyInterest > 0) {
          currentMoney += weeklyInterest;
          newLogs.unshift(`[Day ${dayNum}] Earned weekly savings interest of $${weeklyInterest} (Finance level: ${financeLevel}).`);
        }
      }

      // Rent billing
      const rentCost = HOUSING_TIERS[currentHousingTier].rent;
      if (rentCost > 0) {
        if (currentMoney >= rentCost) {
          currentMoney -= rentCost;
          newLogs.unshift(`[Day ${dayNum}] Paid weekly rent of $${rentCost}.`);
        } else {
          currentHousingTier = 0; // Evicted
          newLogs.unshift(`[Day ${dayNum}] EVICTED! You couldn't afford rent. Moved back to Parents' Couch.`);
          if (currentPlaced.length > 0) {
            currentStorage = [...currentStorage, ...currentPlaced];
            currentPlaced = [];
            newLogs.unshift(`[Day ${dayNum}] All your furniture was moved to your storage locker.`);
          }
        }
      }

      // Storage unit billing
      const storageFee = calculateStorageFee(currentStorage.length);
      if (storageFee > 0) {
        currentMoney = Math.max(0, currentMoney - storageFee);
        const extraCount = currentStorage.length - 3;
        newLogs.unshift(`[Day ${dayNum}] Charged weekly storage locker fee of $${storageFee} for ${extraCount} extra items stored.`);
      }

      // Subscription billing
      if (currentPremiumActive) {
        const premiumFee = 15;
        if (currentMoney >= premiumFee) {
          currentMoney -= premiumFee;
          newLogs.unshift(`[Day ${dayNum}] Paid weekly LinkUp Gold subscription fee of $${premiumFee}.`);
        } else {
          currentPremiumActive = false;
          newLogs.unshift(`[Day ${dayNum}] LinkUp Gold subscription cancelled due to insufficient funds.`);
        }
      }
    }

    // 2. Monthly Utilities billing
    if (dayNum % 30 === 0) {
      const billsCost = state.living.billsAmount;
      if (currentMoney >= billsCost) {
        currentMoney -= billsCost;
        newLogs.unshift(`[Day ${dayNum}] Paid monthly utility bills of $${billsCost}.`);
      } else {
        currentUtilitiesActive = false;
        newLogs.unshift(`[Day ${dayNum}] UTILITIES SHUT OFF! You couldn't pay your $${billsCost} bills.`);
      }
    }
  });

  // 3. Collapse checks
  let finalEnergy = newNeeds.energy;
  let finalMinute = newTime.minute;
  let finalHour = newTime.hour;
  let finalDay = newTime.day;
  let finalHealth = newNeeds.health;

  if (finalEnergy <= 0) {
    newLogs.unshift(`COLLAPSED! You passed out from exhaustion. Lost 8 hours, $20, and 15 Health.`);
    finalMinute += 480; // 8 hours
    while (finalMinute >= 60) {
      finalMinute -= 60;
      finalHour += 1;
    }
    while (finalHour >= 24) {
      finalHour -= 24;
      finalDay += 1;
    }
    finalEnergy = 50;
    currentMoney = Math.max(0, currentMoney - 20);
    finalHealth = Math.max(0, finalHealth - 15);
  }

  return {
    ...state,
    time: { day: finalDay, hour: finalHour, minute: finalMinute },
    stats: {
      ...state.stats,
      money: currentMoney,
      housingTier: currentHousingTier,
    },
    needs: {
      ...newNeeds,
      energy: finalEnergy,
      health: Math.min(100, Math.max(0, finalHealth))
    },
    living: {
      ...state.living,
      utilitiesActive: currentUtilitiesActive
    },
    swipePremium: {
      ...state.swipePremium,
      active: currentPremiumActive
    },
    placedFurniture: currentPlaced,
    storage: currentStorage,
    logs: newLogs
  };
};

export const timeReducer = (state, action) => {
  switch (action.type) {
    case 'ADVANCE_TIME': {
      const { ticks } = action.payload;
      return simulateTicks(state, ticks);
    }

    case 'DECAY_NEEDS': {
      const { ticks } = action.payload;
      const hoursPassed = (ticks * 10) / 60;
      const newNeeds = decayNeeds(state.needs, hoursPassed);
      return {
        ...state,
        needs: newNeeds
      };
    }

    case 'PROCESS_WEEKLY_BILLS': {
      const newLogs = [...state.logs];
      const currentHousingTier = state.stats.housingTier;
      let currentMoney = state.stats.money;
      let currentStorage = [...state.storage];
      let currentPlaced = [...state.placedFurniture];
      let nextHousingTier = currentHousingTier;
      let currentPremiumActive = state.swipePremium?.active || false;

      // Interest payment
      if (currentMoney > 0) {
        const financeLevel = state.stats.finance || 10;
        const weeklyInterest = Math.min(300, Math.floor(currentMoney * 0.002 * financeLevel));
        if (weeklyInterest > 0) {
          currentMoney += weeklyInterest;
          newLogs.unshift(`Earned weekly savings interest of $${weeklyInterest} (Finance level: ${financeLevel}).`);
        }
      }

      // Rent billing
      const rentCost = HOUSING_TIERS[currentHousingTier].rent;
      if (rentCost > 0) {
        if (currentMoney >= rentCost) {
          currentMoney -= rentCost;
          newLogs.unshift(`Paid rent bills of $${rentCost}.`);
        } else {
          nextHousingTier = 0; // Evicted
          newLogs.unshift(`EVICTED! You couldn't afford rent. Moved back to Parents' Couch.`);
          if (currentPlaced.length > 0) {
            currentStorage = [...currentStorage, ...currentPlaced];
            currentPlaced = [];
            newLogs.unshift(`All your furniture was moved to your storage unit.`);
          }
        }
      }

      const storageFee = calculateStorageFee(currentStorage.length);
      if (storageFee > 0) {
        currentMoney = Math.max(0, currentMoney - storageFee);
        const extraCount = currentStorage.length - 3;
        newLogs.unshift(`Charged weekly storage locker fee of $${storageFee} for ${extraCount} extra items stored.`);
      }

      // Subscription billing
      if (currentPremiumActive) {
        const premiumFee = 15;
        if (currentMoney >= premiumFee) {
          currentMoney -= premiumFee;
          newLogs.unshift(`Paid weekly LinkUp Gold subscription fee of $${premiumFee}.`);
        } else {
          currentPremiumActive = false;
          newLogs.unshift(`LinkUp Gold subscription cancelled due to insufficient funds.`);
        }
      }

      return {
        ...state,
        stats: {
          ...state.stats,
          money: currentMoney,
          housingTier: nextHousingTier
        },
        swipePremium: {
          ...state.swipePremium,
          active: currentPremiumActive
        },
        storage: currentStorage,
        placedFurniture: currentPlaced,
        logs: newLogs.slice(0, 20)
      };
    }

    case 'PROCESS_MONTHLY_BILLS': {
      const newLogs = [...state.logs];
      const billsCost = state.living.billsAmount;
      let currentMoney = state.stats.money;
      let currentUtilitiesActive = state.living.utilitiesActive;

      if (currentMoney >= billsCost) {
        currentMoney -= billsCost;
        newLogs.unshift(`Paid monthly utility bills of $${billsCost}.`);
      } else {
        currentUtilitiesActive = false;
        newLogs.unshift(`UTILITIES SHUT OFF! You couldn't pay your $${billsCost} bills.`);
      }

      return {
        ...state,
        stats: {
          ...state.stats,
          money: currentMoney
        },
        living: {
          ...state.living,
          utilitiesActive: currentUtilitiesActive
        },
        logs: newLogs.slice(0, 20)
      };
    }

    case 'CHECK_COLLAPSE': {
      if (state.needs.energy > 0) return state;
      
      const newLogs = [...state.logs];
      newLogs.unshift(`COLLAPSED! Passed out from exhaustion. Lost 8 hours, $20, and 15 Health.`);
      const { time: newTime } = incrementTime(state.time, 48); // 8 hours
      const newNeeds = decayNeeds(state.needs, 8);

      return {
        ...state,
        time: newTime,
        stats: {
          ...state.stats,
          money: Math.max(0, state.stats.money - 20)
        },
        needs: {
          ...newNeeds,
          energy: 50,
          health: Math.min(100, Math.max(0, newNeeds.health - 15))
        },
        logs: newLogs.slice(0, 20)
      };
    }

    case 'CHECK_EVICTION': {
      const currentHousingTier = state.stats.housingTier;
      const rentCost = HOUSING_TIERS[currentHousingTier].rent;
      if (rentCost > 0 && state.stats.money < rentCost) {
        return {
          ...state,
          logs: [`[Eviction Warning] You cannot afford rent! Rent is $${rentCost}.`, ...state.logs].slice(0, 20)
        };
      }
      return state;
    }

    default:
      return state;
  }
};
