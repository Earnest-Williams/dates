import { checkActionFeasibility } from '../selectors';
import { getGroceriesCost } from '../../sim/economy';
import { LOCATIONS } from '../../data/locations';
import { calculateTravelStats, SETTLEMENTS } from '../../data/geography';

export const performAction = (state, dispatch, actionName, timeIncrements, statChanges = {}, energyCost = 10, moneyChange = 0) => {
  const feasibility = checkActionFeasibility(state, actionName, energyCost, moneyChange < 0 ? -moneyChange : 0);
  if (!feasibility.feasible) {
    dispatch({
      type: 'BUY_ITEM',
      payload: { itemKey: null } // no-op logger trigger or warning
    });
    return false;
  }

  dispatch({
    type: 'PERFORM_ACTION',
    payload: {
      actionName,
      ticks: timeIncrements,
      statChanges,
      energyCost,
      moneyChange
    }
  });

  return true;
};

export const sleep = (state, dispatch, hours) => {
  dispatch({ type: 'SLEEP', payload: { hours } });
};

export const eat = (state, dispatch, type) => {
  if (type === 'cook') {
    if (!state.living.utilitiesActive) return false;

    const hasGasRange = (state.placedFurniture || []).includes('gas_range');
    const hasHotPlate = (state.placedFurniture || []).includes('hot_plate');
    const hasSmartFridge = (state.placedFurniture || []).includes('smart_fridge');

    if (!hasGasRange && !hasHotPlate) return false;

    const cost = getGroceriesCost(hasGasRange, hasSmartFridge);
    if (state.stats.money < cost) return false;

    dispatch({ type: 'COOK_MEAL' });
  } else if (type === 'restaurant') {
    if (state.stats.money < 30) return false;
    dispatch({ type: 'DINE_OUT' });
  }
  return true;
};

export const shower = (state, dispatch) => {
  if (!state.living.utilitiesActive) return false;
  dispatch({ type: 'SHOWER' });
  return true;
};

export const payBills = (state, dispatch) => {
  const cost = state.living.billsAmount;
  if (state.stats.money < cost) return false;
  dispatch({ type: 'PAY_BILLS' });
  return true;
};

export const toggleHealthInsurance = (state, dispatch) => {
  dispatch({ type: 'TOGGLE_HEALTH_INSURANCE' });
  return true;
};

export const watchTv = (state, dispatch) => {
  const hasTv = (state.placedFurniture || []).includes('smart_tv');
  if (!hasTv || !state.living.utilitiesActive || state.needs.energy < 5) return false;

  dispatch({ type: 'WATCH_TV' });
  return true;
};

export const visitHospital = (state, dispatch) => {
  if (state.stats.money < 100) return false;

  dispatch({ type: 'VISIT_HOSPITAL' });
  return true;
};

export const travelToLocation = (state, dispatch, locationKey) => {
  if (!SETTLEMENTS[locationKey]) return false;

  const travelStats = calculateTravelStats(state.activeLocation, locationKey, state.properties.vehicles);
  if (!travelStats) return false;

  if (state.needs.energy < travelStats.energyCost) return false;

  dispatch({ type: 'TRAVEL', payload: { locationKey } });
  return true;
};

export const resolveWorkEvent = (state, dispatch, optionIndex) => {
  dispatch({ type: 'RESOLVE_WORK_EVENT', payload: { optionIndex } });
  return true;
};
