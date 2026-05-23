import { createContext, useContext, useReducer } from 'react';
import { initialState, gameReducer } from './reducers/rootReducer';
import * as selectors from './selectors';
import * as actions from './actions';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Expose semantic wrapper functions matching requested interfaces by calling actions with state and dispatch:
  const advanceTime = (ticks) => actions.advanceTime(state, dispatch, ticks);
  
  const applyNeedsDecay = (ticks) => actions.applyNeedsDecay(state, dispatch, ticks);
  
  const processWeeklyBills = () => actions.processWeeklyBills(state, dispatch);
  
  const processMonthlyBills = () => actions.processMonthlyBills(state, dispatch);
  
  const checkCollapse = () => actions.checkCollapse(state, dispatch);
  
  const checkEviction = () => actions.checkEviction(state, dispatch);
  
  const changeRelationship = (npcId, delta) => actions.changeRelationship(state, dispatch, npcId, delta);
  
  const calculateMatchChance = (npcId) => selectors.calculateMatchChance(state, npcId);
  
  const getFormattedTime = () => selectors.getFormattedTime(state);
  
  const addLog = (message) => actions.addLog(state, dispatch, message);
  
  const performAction = (actionName, timeIncrements, statChanges, energyCost, moneyChange) => 
    actions.performAction(state, dispatch, actionName, timeIncrements, statChanges, energyCost, moneyChange);
  
  const sleep = (hours) => actions.sleep(state, dispatch, hours);
  
  const eat = (type) => actions.eat(state, dispatch, type);
  
  const shower = () => actions.shower(state, dispatch);
  
  const payBills = () => actions.payBills(state, dispatch);
  
  const upgradeHousing = () => actions.upgradeHousing(state, dispatch);
  
  const buyItem = (itemKey) => actions.buyItem(state, dispatch, itemKey);
  
  const travelToLocation = (locationKey) => actions.travelToLocation(state, dispatch, locationKey);
  
  const swipeNpc = (npcId, direction) => actions.swipeNpc(state, dispatch, npcId, direction);
  
  const giveGift = (npcId, itemKey) => actions.giveGift(state, dispatch, npcId, itemKey);
  
  const answerDialogue = (npcId, optionIndex) => actions.answerDialogue(state, dispatch, npcId, optionIndex);
  
  const goOnDate = (npcId, locationKey) => actions.goOnDate(state, dispatch, npcId, locationKey);
  
  const proposeMarriage = (npcId) => actions.proposeMarriage(state, dispatch, npcId);
  
  const placeFurniture = (itemKey) => actions.placeFurniture(state, dispatch, itemKey);
  
  const storeFurniture = (itemKey) => actions.storeFurniture(state, dispatch, itemKey);
  
  const watchTv = () => actions.watchTv(state, dispatch);
  
  const visitHospital = () => actions.visitHospital(state, dispatch);
  
  const takeSupplements = () => actions.takeSupplements(state, dispatch);
  
  const completeWedding = (style, childName) => actions.completeWedding(state, dispatch, style, childName);
  
  const selectParentingChoice = (cost, statGains) => actions.selectParentingChoice(state, dispatch, cost, statGains);
  
  const beginLegacy = () => actions.beginLegacy(state, dispatch);

  const subscribePremium = () => actions.subscribePremium(state, dispatch);

  const cancelPremium = () => actions.cancelPremium(state, dispatch);

  const updateSwipePreferences = (preferredStat) => actions.updateSwipePreferences(state, dispatch, preferredStat);

  const instantMatch = (npcId) => actions.instantMatch(state, dispatch, npcId);

  return (
    <GameContext.Provider value={{ 
      gameState: state, 
      advanceTime, 
      applyNeedsDecay,
      processWeeklyBills,
      processMonthlyBills,
      checkCollapse,
      checkEviction,
      calculateMatchChance,
      changeRelationship,
      getFormattedTime,
      addLog,
      performAction,
      sleep,
      eat,
      shower,
      payBills,
      upgradeHousing,
      buyItem,
      travelToLocation,
      swipeNpc,
      giveGift,
      answerDialogue,
      goOnDate,
      proposeMarriage,
      placeFurniture,
      storeFurniture,
      watchTv,
      visitHospital,
      takeSupplements,
      completeWedding,
      selectParentingChoice,
      beginLegacy,
      subscribePremium,
      cancelPremium,
      updateSwipePreferences,
      instantMatch
    }}>
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => useContext(GameContext);
