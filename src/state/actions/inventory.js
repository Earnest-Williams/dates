import { ITEMS } from '../../data/items';
import { HOUSING_TIERS } from '../../data/housing';

export const buyItem = (state, dispatch, itemKey) => {
  const item = ITEMS[itemKey];
  if (!item) return false;
  if (state.stats.money < item.cost) return false;
  if (item.type === 'vehicle' && state.properties.vehicles.includes(itemKey)) return false;

  dispatch({ type: 'BUY_ITEM', payload: { itemKey } });
  return true;
};

export const placeFurniture = (state, dispatch, itemKey) => {
  const item = ITEMS[itemKey];
  if (!item) return false;

  const inStorageCount = state.storage.filter(id => id === itemKey).length;
  if (inStorageCount === 0) return false;

  const currentTier = state.stats.housingTier;
  const maxSlots = HOUSING_TIERS[currentTier].slots;
  let occupiedSlots = (state.placedFurniture || []).reduce((sum, id) => sum + (ITEMS[id]?.slots || 0), 0);

  const isBed = item.category === 'bed';
  if (isBed) {
    const placedBed = (state.placedFurniture || []).find(id => ITEMS[id]?.category === 'bed');
    if (placedBed) occupiedSlots -= ITEMS[placedBed].slots;
  }

  if (occupiedSlots + item.slots > maxSlots) return false;

  dispatch({ type: 'PLACE_FURNITURE', payload: { itemKey } });
  return true;
};

export const storeFurniture = (state, dispatch, itemKey) => {
  const inPlaced = (state.placedFurniture || []).includes(itemKey);
  if (!inPlaced) return false;

  dispatch({ type: 'STORE_FURNITURE', payload: { itemKey } });
  return true;
};

export const takeSupplements = (state, dispatch) => {
  if ((state.inventory.supplements || 0) <= 0) return false;

  dispatch({ type: 'TAKE_SUPPLEMENTS' });
  return true;
};

export const upgradeHousing = (state, dispatch) => {
  const currentTier = state.stats.housingTier;
  const nextTier = currentTier + 1;
  if (!HOUSING_TIERS[nextTier]) return false;
  const moveInCost = HOUSING_TIERS[nextTier].rent * 2;
  if (state.stats.money < moveInCost) return false;

  dispatch({ type: 'UPGRADE_HOUSING' });
  return true;
};
