import { HOUSING_TIERS } from '../../data/housing.js';
import { incrementTime } from '../../sim/time.js';
import { decayNeeds } from '../../sim/needs.js';
import { calculateStorageFee } from '../../sim/economy.js';
import { NPCS } from '../../data/npcs.js';
import { NPC_ALERTS, JEALOUSY_CONFRONTATION } from '../../data/npcAlerts.js';
import { applyMarketNews } from '../../sim/markets.js';

export const simulateTicks = (state, ticks) => {
  const { time: newTime, daysCrossed } = incrementTime(state.time, ticks);
  
  const hoursPassed = (ticks * 10) / 60;
  const newNeeds = decayNeeds(state.needs, hoursPassed, state.activeTraits, state.stats);

  let currentMoney = state.stats.money;
  let currentHousingTier = state.stats.housingTier;
  let currentUtilitiesActive = state.living.utilitiesActive;
  let currentStorage = state.storage;
  let currentPlaced = state.placedFurniture;
  let currentPremiumActive = state.swipePremium?.active || false;
  let tempLogs = [];
  
  // Deep clone histories once before the loop
  let currentPrices = { ...state.assetPrices };
  let currentHistories = {};
  for (let asset in state.priceHistories) {
    currentHistories[asset] = [...(state.priceHistories[asset] || [])];
  }

  daysCrossed.forEach(dayNum => {
    // 1. Weekly Rent, Storage, Subscription and Interest
    if (dayNum % 7 === 0) {
      // Interest payment and Loan Interest
      if (currentMoney > 0) {
        const financeLevel = state.stats.finance || 10;
        const weeklyInterest = Math.min(300, Math.floor(currentMoney * 0.002 * financeLevel));
        if (weeklyInterest > 0) {
          currentMoney += weeklyInterest;
          tempLogs.push(`[Day ${dayNum}] Earned weekly savings interest of $${weeklyInterest} (Finance level: ${financeLevel}).`);
        }
      }

      if (state.education?.studentLoans > 0) {
        const loanInterest = Math.floor(state.education.studentLoans * 0.05); // 5% weekly interest
        state.education.studentLoans += loanInterest;
        tempLogs.push(`[Day ${dayNum}] Added $${loanInterest} interest to Student Loans. Total Debt: $${state.education.studentLoans}.`);
      }

      // Rent billing
      let rentCost = HOUSING_TIERS[currentHousingTier].rent;
      if (state.living.roommateId) {
        rentCost = Math.floor(rentCost / 2);
      }
      
      if (rentCost > 0) {
        const rentIsWaived = state.living.rentWaivedUntilDay >= dayNum
          && state.living.rentWaivedHousingTier === currentHousingTier;

        if (rentIsWaived) {
          tempLogs.push(`[Day ${dayNum}] Rent is prepaid by your parents through Day ${state.living.rentWaivedUntilDay}.`);
        } else if (currentMoney >= rentCost) {
          currentMoney -= rentCost;
          tempLogs.push(`[Day ${dayNum}] Paid weekly rent of $${rentCost}${state.living.roommateId ? ' (Split with roommate)' : ''}.`);
        } else {
          currentHousingTier = 0; // Evicted
          tempLogs.push(`[Day ${dayNum}] EVICTED! You couldn't afford rent. Moved back to Parents' Couch.`);
          if (currentPlaced.length > 0) {
            currentStorage = [...currentStorage, ...currentPlaced];
            currentPlaced = [];
            tempLogs.push(`[Day ${dayNum}] All your furniture was moved to your storage locker.`);
          }
        }
      }

      // Storage unit billing
      const storageFee = calculateStorageFee(currentStorage.length);
      if (storageFee > 0) {
        currentMoney = Math.max(0, currentMoney - storageFee);
        const extraCount = currentStorage.length - 3;
        tempLogs.push(`[Day ${dayNum}] Charged weekly storage locker fee of $${storageFee} for ${extraCount} extra items stored.`);
      }

      // Subscription billing
      if (currentPremiumActive) {
        const premiumFee = 15;
        if (currentMoney >= premiumFee) {
          currentMoney -= premiumFee;
          tempLogs.push(`[Day ${dayNum}] Paid weekly LinkUp Gold subscription fee of $${premiumFee}.`);
        } else {
          currentPremiumActive = false;
          tempLogs.push(`[Day ${dayNum}] LinkUp Gold subscription cancelled due to insufficient funds.`);
        }
      }
    }

    // 2. Monthly Utilities & Health Insurance billing
    if (dayNum % 30 === 0) {
      let billsCost = state.living.billsAmount;
      if (state.living.roommateId) {
        billsCost = Math.floor(billsCost / 2);
      }
      
      if (currentMoney >= billsCost) {
        currentMoney -= billsCost;
        tempLogs.push(`[Day ${dayNum}] Paid monthly utility bills of $${billsCost}${state.living.roommateId ? ' (Split with roommate)' : ''}.`);
      } else {
        currentUtilitiesActive = false;
        tempLogs.push(`[Day ${dayNum}] UTILITIES SHUT OFF! You couldn't pay your $${billsCost} bills.`);
      }

      // Health Insurance Premium
      if (state.living.hasHealthInsurance) {
        const premiumCost = 150;
        if (currentMoney >= premiumCost) {
          currentMoney -= premiumCost;
          tempLogs.push(`[Day ${dayNum}] Paid monthly health insurance premium of $${premiumCost}.`);
        } else {
          state.living.hasHealthInsurance = false;
          tempLogs.push(`[Day ${dayNum}] HEALTH INSURANCE CANCELLED! You couldn't pay your $${premiumCost} premium.`);
        }
      }
    }

    // 3. Investment Daily Price Fluctuations & News
    const marketNews = [
      { assetId: 'omni', title: 'OmniCorp targets record earnings in Q3!', change: 0.15, text: `📈 [Day ${dayNum}] [MARKET NEWS] OmniCorp targets record earnings in Q3, stock surges!` },
      { assetId: 'omni', title: 'Regulatory investigation announced into OmniCorp divisions.', change: -0.15, text: `📉 [Day ${dayNum}] [MARKET NEWS] Regulatory investigation into OmniCorp divisions triggers sell-off.` },
      { assetId: 'gym', title: 'Peak Gyms expansion goes viral on fit-tok.', change: 0.20, text: `📈 [Day ${dayNum}] [MARKET NEWS] Peak Gyms expansion goes viral on fit-tok, FIT stock jumps!` },
      { assetId: 'gym', title: 'Leak reveals Peak Fitness sanitation reports below standard.', change: -0.20, text: `📉 [Day ${dayNum}] [MARKET NEWS] Peak Fitness sanitation leak leads to member concerns.` },
      { assetId: 'lnup', title: 'LinkUp Gold subscription numbers exceed targets.', change: 0.25, text: `📈 [Day ${dayNum}] [MARKET NEWS] LinkUp social Gold tier numbers exceed targets, stock rises.` },
      { assetId: 'lnup', title: 'LinkUp database experiences minor server leak.', change: -0.20, text: `📉 [Day ${dayNum}] [MARKET NEWS] LinkUp server outage sparks security concerns.` },
      { assetId: 'shib', title: 'Sim Elon tweets a picture of a dog in a suit.', change: 0.60, text: `🚀 [Day ${dayNum}] [CRYPTO NEWS] Sim Elon tweets a dog picture! SHIB coin skyrocketing!` },
      { assetId: 'shib', title: 'Crypto whale dumps millions of SHIB tokens.', change: -0.50, text: `💥 [Day ${dayNum}] [CRYPTO NEWS] ShibaSim Whale dumps holdings, panic selling active!` },
      { assetId: 'eths', title: 'EtherSim network upgrade successfully deployed.', change: 0.30, text: `📈 [Day ${dayNum}] [CRYPTO NEWS] EtherSim upgrade successfully deployed, token rallies.` },
      { assetId: 'eths', title: 'Security exploit discovered in digital alt-coin bridge.', change: -0.25, text: `📉 [Day ${dayNum}] [CRYPTO NEWS] Security exploit on cross-chain bridge drags EtherSim down.` }
    ];

    let newsEvent = null;
    if (Math.random() < 0.15) {
      newsEvent = marketNews[Math.floor(Math.random() * marketNews.length)];
      tempLogs.push(newsEvent.text);
    }

    currentPrices = applyMarketNews(currentPrices, newsEvent);

    Object.keys(currentPrices).forEach(assetId => {
      const nextPrice = currentPrices[assetId];
      const history = currentHistories[assetId] || [];
      history.push(nextPrice);
      if (history.length > 10) history.shift();
      currentHistories[assetId] = history;
    });

    // 4. Daily Roommate Events
    if (state.living.roommateId && Math.random() < 0.25) {
      const roommate = NPCS.find(n => n.id === state.living.roommateId);
      const isGoodEvent = Math.random() < 0.7;
      
      if (isGoodEvent) {
        tempLogs.push(`[Day ${dayNum}] 🏠 ${roommate.name} cooked dinner and cleaned up! (+20 Energy, +10 Mood)`);
        newNeeds.energy = Math.min(100, newNeeds.energy + 20);
        newNeeds.mood = Math.min(100, (newNeeds.mood || 100) + 10);
      } else {
        tempLogs.push(`[Day ${dayNum}] 🏠 ${roommate.name} had loud friends over late at night. (-10 Energy, -10 Mood)`);
        newNeeds.energy = Math.max(0, newNeeds.energy - 10);
        newNeeds.mood = Math.max(0, (newNeeds.mood || 100) - 10);
      }
    }

    // 5. Tax Season (Every 120 Days)
    if (dayNum % 120 === 0) {
      const careerLevel = state.stats.corporate || 10;
      const baseTax = 500;
      const incomeTax = careerLevel * 50;
      const totalTax = baseTax + incomeTax;
      
      state.stats.taxOwed = (state.stats.taxOwed || 0) + totalTax;
      tempLogs.push(`[Day ${dayNum}] 🏛️ TAX SEASON: The IRS has assessed $${totalTax} in taxes. You now owe $${state.stats.taxOwed} total.`);
    }

    // 6. Wage Garnishment Check
    if (state.stats.taxOwed > 0 && dayNum % 7 === 0) { // Check weekly
      const garnishmentAmount = Math.min(Math.floor(state.stats.taxOwed * 0.1), currentMoney);
      if (garnishmentAmount > 0) {
        currentMoney -= garnishmentAmount;
        state.stats.taxOwed -= garnishmentAmount;
        tempLogs.push(`[Day ${dayNum}] ⚖️ The IRS garnished $${garnishmentAmount} from your accounts to pay your tax debt. Remaining: $${state.stats.taxOwed}.`);
      }
    }

    // 7. Medical Emergencies
    if (Math.random() < 0.05) { // 5% chance daily
      const hasInsurance = state.living.hasHealthInsurance;
      const cost = hasInsurance ? 500 : 5000;
      const condition = Math.random() > 0.5 ? "a severe accident" : "an unexpected medical illness";
      
      if (currentMoney >= cost) {
        currentMoney -= cost;
        tempLogs.push(`[Day ${dayNum}] 🚑 MEDICAL EMERGENCY: You suffered ${condition}. Paid $${cost} out of pocket${hasInsurance ? ' (Insurance covered the rest)' : ''}.`);
      } else {
        state.stats.debt = (state.stats.debt || 0) + cost;
        tempLogs.push(`[Day ${dayNum}] 🚑 MEDICAL EMERGENCY: You suffered ${condition}. Billed $${cost}${hasInsurance ? ' (Insurance covered the rest)' : ''}, adding to your debt.`);
      }
      newNeeds.health = Math.max(0, newNeeds.health - 40);
      newNeeds.energy = Math.max(0, newNeeds.energy - 50);
    }
  });

  // Since tempLogs pushed sequentially, we want the newest at the top
  const newLogs = [...tempLogs.reverse(), ...state.logs].slice(0, 20);

  // 4. Collapse checks
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

  // 4b. Burnout Check
  let updatedTraits = [...state.activeTraits];
  if (finalEnergy < 15 && !updatedTraits.includes('burned_out')) {
    updatedTraits.push('burned_out');
    newLogs.unshift(`⚠️ WARNING: Your energy is critically low. You are now Burned Out! Stat gains are halved and mood decays faster.`);
  } else if (finalEnergy >= 80 && updatedTraits.includes('burned_out')) {
    updatedTraits = updatedTraits.filter(t => t !== 'burned_out');
    newLogs.unshift(`✨ You recovered from Burnout by resting!`);
  }

  const baseNextState = {
    ...state,
    time: { day: finalDay, hour: finalHour, minute: finalMinute },
    activeTraits: updatedTraits,
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
    assetPrices: currentPrices,
    priceHistories: currentHistories,
    logs: newLogs
  };

  // 4. Alert & Jealousy check
  const matchesKeys = Object.keys(baseNextState.matches).filter(key => baseNextState.matches[key].met);
  if (baseNextState.gamePhase === 'living' && !baseNextState.activeDateEvent && !baseNextState.activeWorkEvent && !baseNextState.activeNpcAlert && matchesKeys.length > 0) {
    const localNpcs = {
      Brockleigh: ['elena', 'marcus'],
      Stagborough: ['sophia', 'brad'],
      Bramblewick: ['chloe']
    }[baseNextState.activeLocation] || [];
    
    const locationLocalNpc = localNpcs.find(npcId => baseNextState.matches[npcId] && baseNextState.matches[npcId].met);

    if (locationLocalNpc && baseNextState.matches[locationLocalNpc] && matchesKeys.length > 1 && Math.random() < 0.15) {
      const residentNpc = NPCS.find(n => n.id === locationLocalNpc);
      const jealousyEvent = {
        ...JEALOUSY_CONFRONTATION,
        npcId: locationLocalNpc,
        message: JEALOUSY_CONFRONTATION.message.replace('{NPC_NAME}', residentNpc.name),
      };
      
      return {
        ...baseNextState,
        gamePhase: 'npc_alert',
        activeNpcAlert: jealousyEvent,
        logs: [`⚠️ Confrontation! ${residentNpc.name} spotted you with others!`, ...baseNextState.logs].slice(0, 20)
      };
    } else if (Math.random() < 0.08) {
      const randomNpcId = matchesKeys[Math.floor(Math.random() * matchesKeys.length)];
      const alerts = NPC_ALERTS[randomNpcId];
      if (alerts && alerts.length > 0) {
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        return {
          ...baseNextState,
          gamePhase: 'npc_alert',
          activeNpcAlert: alert,
          logs: [`📩 New message from ${NPCS.find(n => n.id === randomNpcId).name}!`, ...baseNextState.logs].slice(0, 20)
        };
      }
    }
  }

  return baseNextState;
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
      const newNeeds = decayNeeds(state.needs, hoursPassed, state.activeTraits, state.stats);
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
        const rentIsWaived = state.living.rentWaivedUntilDay >= state.time.day
          && state.living.rentWaivedHousingTier === currentHousingTier;

        if (rentIsWaived) {
          newLogs.unshift(`Rent is prepaid by your parents through Day ${state.living.rentWaivedUntilDay}.`);
        } else if (currentMoney >= rentCost) {
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
      const newNeeds = decayNeeds(state.needs, 8, state.activeTraits, state.stats);

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
      const rentIsWaived = state.living.rentWaivedUntilDay >= state.time.day
        && state.living.rentWaivedHousingTier === currentHousingTier;
      if (rentCost > 0 && !rentIsWaived && state.stats.money < rentCost) {
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
