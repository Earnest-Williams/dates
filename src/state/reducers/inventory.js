import { ITEMS } from '../../data/items';
import { HOUSING_TIERS } from '../../data/housing';

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

    default:
      return state;
  }
};
