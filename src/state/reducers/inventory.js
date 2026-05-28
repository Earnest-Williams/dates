import { ITEMS } from '../../data/items.js';
import { HOUSING_TIERS } from '../../data/housing.js';
import { ASSETS } from '../../data/investments.js';

export const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'UPGRADE_HOUSING': {
      const currentHousingTier = state.stats.housingTier;
      const nextTier = currentHousingTier + 1;
      const moveInCost = HOUSING_TIERS[nextTier].rent * 2;
      return {
        ...state,
        stats: {
          ...state.stats,
          money: Math.max(0, state.stats.money - moveInCost),
          housingTier: nextTier
        },
        logs: [`Moved into a ${HOUSING_TIERS[nextTier].name}! (-$${moveInCost})`, ...state.logs].slice(0, 20)
      };
    }

    case 'BUY_ITEM': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];
      
      const negotiationLevel = state.stats.negotiation || 10;
      const discountPercent = Math.min(0.20, negotiationLevel * 0.002);
      const finalCost = Math.floor(item.cost * (1 - discountPercent));

      const updatedStats = { ...state.stats, money: Math.max(0, state.stats.money - finalCost) };
      const updatedInventory = { ...state.inventory };
      const updatedProperties = { ...state.properties };
      let updatedPlaced = [...(state.placedFurniture || [])];
      let updatedStorage = [...(state.storage || [])];
      let logMsg;

      const discountSuffix = discountPercent > 0 ? ` (includes ${Math.round(discountPercent * 100)}% negotiation discount)` : '';

      if (item.type === 'vehicle') {
        updatedProperties.vehicles = [...updatedProperties.vehicles, itemKey];
        logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}).`;
      } else if (item.type === 'upgrade') {
        updatedStats[item.effect.stat] = Math.min(100, updatedStats[item.effect.stat] + item.effect.value);
        logMsg = `Purchased ${item.name} (-$${finalCost}${discountSuffix}).`;
      } else if (item.type === 'furniture') {
        const currentTier = state.stats.housingTier;
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
        ...state,
        stats: updatedStats,
        inventory: updatedInventory,
        properties: updatedProperties,
        placedFurniture: updatedPlaced,
        storage: updatedStorage,
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    case 'PLACE_FURNITURE': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];

      const isBed = item.category === 'bed';
      let bedToReplace = null;
      if (isBed) {
        const placedBed = (state.placedFurniture || []).find(id => ITEMS[id]?.category === 'bed');
        if (placedBed) {
          bedToReplace = placedBed;
        }
      }

      let updatedStorage = [...state.storage];
      let updatedPlaced = [...(state.placedFurniture || [])];
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
        ...state,
        storage: updatedStorage,
        placedFurniture: updatedPlaced,
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    case 'STORE_FURNITURE': {
      const { itemKey } = action.payload;
      const item = ITEMS[itemKey];

      const updatedPlaced = (state.placedFurniture || []).filter(id => id !== itemKey);
      const updatedStorage = [...(state.storage || []), itemKey];
      const logMsg = `Moved ${item.name} to storage.`;

      return {
        ...state,
        placedFurniture: updatedPlaced,
        storage: updatedStorage,
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    case 'TAKE_SUPPLEMENTS': {
      const updatedInventory = { ...state.inventory };
      updatedInventory.supplements -= 1;
      if (updatedInventory.supplements === 0) delete updatedInventory.supplements;

      return {
        ...state,
        inventory: updatedInventory,
        needs: {
          ...state.needs,
          health: Math.min(100, (state.needs.health || 0) + 20),
          energy: Math.min(100, state.needs.energy + 10)
        },
        logs: ["Took premium supplements. (+20 Health, +10 Energy)", ...state.logs].slice(0, 20)
      };
    }

    case 'BUY_ASSET': {
      const { assetId, quantity } = action.payload;
      const price = state.assetPrices[assetId];
      const cost = price * quantity;

      if (state.stats.money < cost) {
        return {
          ...state,
          logs: ["⚠️ Insufficient funds to buy asset.", ...state.logs].slice(0, 20)
        };
      }

      const current = state.portfolio[assetId] || { quantity: 0, avgPrice: 0 };
      const newQty = current.quantity + quantity;
      const newAvg = ((current.quantity * current.avgPrice) + cost) / newQty;

      return {
        ...state,
        stats: {
          ...state.stats,
          money: Math.max(0, state.stats.money - cost)
        },
        portfolio: {
          ...state.portfolio,
          [assetId]: { quantity: newQty, avgPrice: newAvg }
        },
        logs: [`Bought ${quantity} ${ASSETS[assetId].ticker} for $${cost.toFixed(2)} (Avg: $${newAvg.toFixed(2)}).`, ...state.logs].slice(0, 20)
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
      const revenue = price * quantity;
      const costBasis = current.avgPrice * quantity;
      const profit = revenue - costBasis;
      const newQty = current.quantity - quantity;
      const newAvg = newQty === 0 ? 0 : current.avgPrice;

      return {
        ...state,
        stats: {
          ...state.stats,
          money: state.stats.money + revenue
        },
        portfolio: {
          ...state.portfolio,
          [assetId]: { quantity: newQty, avgPrice: newAvg }
        },
        logs: [`Sold ${quantity} ${ASSETS[assetId].ticker} for $${revenue.toFixed(2)}. Profit: $${profit.toFixed(2)}.`, ...state.logs].slice(0, 20)
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

      return {
        ...state,
        stats: {
          ...state.stats,
          money: newMoney,
          taxOwed: newTaxOwed
        },
        logs: [logMsg, ...state.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
