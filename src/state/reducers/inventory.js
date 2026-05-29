import { ITEMS } from '../../data/items.js';
import { HOUSING_TIERS } from '../../data/housing.js';
import { ASSETS } from '../../data/investments.js';
import { calculateTransactionFriction } from '../../sim/markets.js';
import { describeTimePassage } from '../../sim/time.js';
import { simulateTicks } from './time.js';

export const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'UPGRADE_HOUSING': {
      const currentHousingTier = state.stats.housingTier;
      const nextTier = currentHousingTier + 1;
      const moveInCost = HOUSING_TIERS[nextTier].rent * 2;
      const nextState = simulateTicks(state, 36);
      const timePassage = describeTimePassage(state.time, nextState.time, `moved into ${HOUSING_TIERS[nextTier].name}`);
      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: Math.max(0, nextState.stats.money - moveInCost),
          housingTier: nextTier
        },
        living: {
          ...nextState.living,
          rentWaivedUntilDay: nextTier === nextState.living.rentWaivedHousingTier
            ? nextState.living.rentWaivedUntilDay
            : 0,
        },
        logs: [`${timePassage} (-$${moveInCost})`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'BUY_ITEM': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];
      const nextState = simulateTicks(state, 3);
      const timePassage = describeTimePassage(state.time, nextState.time, `shopped for ${item.name}`);
      
      const negotiationLevel = nextState.stats.negotiation || 10;
      const discountPercent = Math.min(0.20, negotiationLevel * 0.002);
      const finalCost = Math.floor(item.cost * (1 - discountPercent));

      const updatedStats = { ...nextState.stats, money: Math.max(0, nextState.stats.money - finalCost) };
      const updatedInventory = { ...nextState.inventory };
      const updatedProperties = { ...nextState.properties };
      let updatedPlaced = [...(nextState.placedFurniture || [])];
      let updatedStorage = [...(nextState.storage || [])];
      let logMsg;

      const discountSuffix = discountPercent > 0 ? ` (includes ${Math.round(discountPercent * 100)}% negotiation discount)` : '';

      if (item.type === 'vehicle') {
        updatedProperties.vehicles = [...updatedProperties.vehicles, itemKey];
        logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}).`;
      } else if (item.type === 'upgrade') {
        updatedStats[item.effect.stat] = Math.min(100, updatedStats[item.effect.stat] + item.effect.value);
        logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}).`;
      } else if (item.type === 'furniture') {
        const currentTier = nextState.stats.housingTier;
        const maxSlots = HOUSING_TIERS[currentTier].slots;
        let occupiedSlots = updatedPlaced.reduce((sum, id) => sum + (ITEMS[id]?.slots || 0), 0);

        const isBed = item.category === 'bed';
        let bedToReplace = null;
        if (isBed) {
          const placedBed = updatedPlaced.find(id => ITEMS[id]?.category === 'bed');
          if (placedBed) {
            bedToReplace = placedBed;
            occupiedSlots -= ITEMS[placedBed].slots;
          }
        }

        if (occupiedSlots + item.slots <= maxSlots) {
          if (bedToReplace) {
            updatedPlaced = updatedPlaced.filter(id => id !== bedToReplace);
            updatedStorage.push(bedToReplace);
            logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}) and placed it at home. Replaced ${ITEMS[bedToReplace].name} was moved to storage.`;
          } else {
            logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}) and placed it at home.`;
          }
          updatedPlaced.push(itemKey);
        } else {
          updatedStorage.push(itemKey);
          logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}) and sent to storage unit (Home is full).`;
        }
      } else {
        updatedInventory[itemKey] = (updatedInventory[itemKey] || 0) + 1;
        logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}).`;
      }

      return {
        ...nextState,
        stats: updatedStats,
        inventory: updatedInventory,
        properties: updatedProperties,
        placedFurniture: updatedPlaced,
        storage: updatedStorage,
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'PLACE_FURNITURE': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];
      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, `placed ${item.name}`);

      const isBed = item.category === 'bed';
      let bedToReplace = null;
      if (isBed) {
        const placedBed = (nextState.placedFurniture || []).find(id => ITEMS[id]?.category === 'bed');
        if (placedBed) {
          bedToReplace = placedBed;
        }
      }

      let updatedStorage = [...nextState.storage];
      let updatedPlaced = [...(nextState.placedFurniture || [])];
      let logMsg;

      const index = updatedStorage.indexOf(itemKey);
      if (index > -1) {
        updatedStorage.splice(index, 1);
      }

      if (bedToReplace) {
        updatedPlaced = updatedPlaced.filter(id => id !== bedToReplace);
        updatedStorage.push(bedToReplace);
        logMsg = `Replaced placed bed. Moved ${ITEMS[bedToReplace].name} to storage. Placed ${item.name} in your home.`;
      } else {
        logMsg = `Placed ${item.name} in your home.`;
      }
      updatedPlaced.push(itemKey);

      return {
        ...nextState,
        storage: updatedStorage,
        placedFurniture: updatedPlaced,
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'STORE_FURNITURE': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `moved ${item.name} to storage`);

      const updatedPlaced = (nextState.placedFurniture || []).filter(id => id !== itemKey);
      const updatedStorage = [...(nextState.storage || []), itemKey];
      const logMsg = `Moved ${item.name} to storage.`;

      return {
        ...nextState,
        placedFurniture: updatedPlaced,
        storage: updatedStorage,
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'TAKE_SUPPLEMENTS': {
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, 'took premium supplements');
      const updatedInventory = { ...nextState.inventory };
      updatedInventory.supplements -= 1;
      if (updatedInventory.supplements === 0) delete updatedInventory.supplements;

      return {
        ...nextState,
        inventory: updatedInventory,
        needs: {
          ...nextState.needs,
          health: Math.min(100, (nextState.needs.health || 0) + 20),
          energy: Math.min(100, nextState.needs.energy + 10)
        },
        logs: [`${timePassage} (+20 Health, +10 Energy)`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'BUY_ASSET': {
      const { assetId, quantity } = action.payload;
      const price = state.assetPrices[assetId];
      const cost = calculateTransactionFriction(assetId, quantity, price, 'buy');

      if (state.stats.money < cost) {
        return {
          ...state,
          logs: ["⚠️ Insufficient funds to buy asset.", ...state.logs].slice(0, 20)
        };
      }

      const current = state.portfolio[assetId] || { quantity: 0, avgPrice: 0 };
      const newQty = current.quantity + quantity;
      const newAvg = ((current.quantity * current.avgPrice) + cost) / newQty;
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `bought ${ASSETS[assetId].ticker}`);

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: Math.max(0, nextState.stats.money - cost)
        },
        portfolio: {
          ...nextState.portfolio,
          [assetId]: { quantity: newQty, avgPrice: newAvg }
        },
        logs: [`${timePassage} Bought ${quantity} ${ASSETS[assetId].ticker} for $${cost.toFixed(2)} (Avg: $${newAvg.toFixed(2)}).`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'SELL_ASSET': {
      const { assetId, quantity } = action.payload;
      const current = state.portfolio[assetId] || { quantity: 0, avgPrice: 0 };

      if (current.quantity < quantity) {
        return {
          ...state,
          logs: ["⚠️ You do not own enough of this asset to sell.", ...state.logs].slice(0, 20)
        };
      }

      const price = state.assetPrices[assetId];
      const revenue = calculateTransactionFriction(assetId, quantity, price, 'sell');
      const costBasis = current.avgPrice * quantity;
      const profit = revenue - costBasis;
      const newQty = current.quantity - quantity;
      const newAvg = newQty === 0 ? 0 : current.avgPrice;
      const nextState = simulateTicks(state, 1);
      const timePassage = describeTimePassage(state.time, nextState.time, `sold ${ASSETS[assetId].ticker}`);

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: nextState.stats.money + revenue
        },
        portfolio: {
          ...nextState.portfolio,
          [assetId]: { quantity: newQty, avgPrice: newAvg }
        },
        logs: [`${timePassage} Sold ${quantity} ${ASSETS[assetId].ticker} for $${revenue.toFixed(2)}. Profit: $${profit.toFixed(2)}.`, ...nextState.logs].slice(0, 20)
      };
    }

    case 'PAY_TAXES': {
      let logMsg;
      let newMoney = state.stats.money;
      let newTaxOwed = state.stats.taxOwed || 0;

      if (newTaxOwed <= 0) {
        return {
          ...state,
          logs: ["⚠️ You do not owe any taxes.", ...state.logs].slice(0, 20)
        };
      }

      if (newMoney >= newTaxOwed) {
        newMoney -= newTaxOwed;
        logMsg = `Paid $${newTaxOwed} to the IRS. You are completely debt-free!`;
        newTaxOwed = 0;
      } else {
        newTaxOwed -= newMoney;
        logMsg = `Paid $${newMoney} to the IRS. You still owe $${newTaxOwed}.`;
        newMoney = 0;
      }
      const nextState = simulateTicks(state, 2);
      const timePassage = describeTimePassage(state.time, nextState.time, 'handled tax payments');

      return {
        ...nextState,
        stats: {
          ...nextState.stats,
          money: newMoney,
          taxOwed: newTaxOwed
        },
        logs: [`${timePassage} ${logMsg}`, ...nextState.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
