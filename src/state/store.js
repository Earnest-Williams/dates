import { create } from 'zustand';
import { initialState, gameReducer } from './reducers/rootReducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { getSaveMetadata, loadGameState, saveGameState } from './persistence';

const AUTOSAVE_ACTIONS = new Set([
  'ADVANCE_TIME',
  'PERFORM_ACTION',
  'SLEEP',
  'GO_ON_DATE',
  'RESOLVE_DATE_EVENT',
  'WORK_ON_PROJECT',
  'BEGIN_LEGACY',
]);

export const useGameStore = create((set, get) => ({
  gameState: initialState,
  saveMetadata: null,

  dispatch: (action) => {
    set((state) => {
      const gameState = gameReducer(state.gameState, action);
      if (AUTOSAVE_ACTIONS.has(action.type)) {
        saveGameState(gameState);
      }
      return { gameState, saveMetadata: getSaveMetadata() };
    });
  },

  manualSave: () => {
    const ok = saveGameState(get().gameState);
    set({ saveMetadata: getSaveMetadata() });
    return ok;
  },

  manualLoad: () => {
    const result = loadGameState();
    if (!result.ok) return result;
    set({ gameState: result.gameState, saveMetadata: getSaveMetadata() });
    return result;
  },

  getSaveMetadata: () => getSaveMetadata(),

  advanceTime: (ticks) => actions.advanceTime(get().gameState, get().dispatch, ticks),
  applyNeedsDecay: (ticks) => actions.applyNeedsDecay(get().gameState, get().dispatch, ticks),
  processWeeklyBills: () => actions.processWeeklyBills(get().gameState, get().dispatch),
  processMonthlyBills: () => actions.processMonthlyBills(get().gameState, get().dispatch),
  checkCollapse: () => actions.checkCollapse(get().gameState, get().dispatch),
  checkEviction: () => actions.checkEviction(get().gameState, get().dispatch),
  changeRelationship: (npcId, delta) => actions.changeRelationship(get().gameState, get().dispatch, npcId, delta),
  calculateMatchChance: (npcId) => selectors.calculateMatchChance(get().gameState, npcId),
  getFormattedTime: () => selectors.getFormattedTime(get().gameState),
  addLog: (message) => actions.addLog(get().gameState, get().dispatch, message),
  performAction: (actionName, timeIncrements, statChanges, energyCost, moneyChange) =>
    actions.performAction(get().gameState, get().dispatch, actionName, timeIncrements, statChanges, energyCost, moneyChange),
  sleep: (hours) => actions.sleep(get().gameState, get().dispatch, hours),
  eat: (type) => actions.eat(get().gameState, get().dispatch, type),
  shower: () => actions.shower(get().gameState, get().dispatch),
  payBills: () => actions.payBills(get().gameState, get().dispatch),
  toggleHealthInsurance: () => actions.toggleHealthInsurance(get().gameState, get().dispatch),
  visitHospital: () => actions.visitHospital(get().gameState, get().dispatch),
  upgradeHousing: () => actions.upgradeHousing(get().gameState, get().dispatch),
  buyItem: (itemKey) => actions.buyItem(get().gameState, get().dispatch, itemKey),
  travelToLocation: (locationKey) => actions.travelToLocation(get().gameState, get().dispatch, locationKey),
  resolveWorkEvent: (optionIndex) => actions.resolveWorkEvent(get().gameState, get().dispatch, optionIndex),
  swipeNpc: (npcId, direction) => actions.swipeNpc(get().gameState, get().dispatch, npcId, direction),
  giveGift: (npcId, itemKey) => actions.giveGift(get().gameState, get().dispatch, npcId, itemKey),
  answerDialogue: (npcId, optionIndex) => actions.answerDialogue(get().gameState, get().dispatch, npcId, optionIndex),
  goOnDate: (npcId, locationKey) => actions.goOnDate(get().gameState, get().dispatch, npcId, locationKey),
  resolveDateEvent: (finalVibe, logText) => actions.resolveDateEvent(get().gameState, get().dispatch, finalVibe, logText),
  resolveStoryEvent: (npcId, success) => actions.resolveStoryEvent(get().gameState, get().dispatch, npcId, success),
  proposeMarriage: (npcId) => actions.proposeMarriage(get().gameState, get().dispatch, npcId),
  askToMoveIn: (npcId) => actions.askToMoveIn(get().gameState, get().dispatch, npcId),
  placeFurniture: (itemKey) => actions.placeFurniture(get().gameState, get().dispatch, itemKey),
  storeFurniture: (itemKey) => actions.storeFurniture(get().gameState, get().dispatch, itemKey),
  watchTv: () => actions.watchTv(get().gameState, get().dispatch),
  takeSupplements: () => actions.takeSupplements(get().gameState, get().dispatch),
  completeWedding: (style, childName) => actions.completeWedding(get().gameState, get().dispatch, style, childName),
  selectParentingChoice: (cost, statGains, stressIncrease) => actions.selectParentingChoice(get().gameState, get().dispatch, cost, statGains, stressIncrease),
  reduceChildStress: (energyCost, stressReduction) => actions.reduceChildStress(get().gameState, get().dispatch, energyCost, stressReduction),
  beginLegacy: () => actions.beginLegacy(get().gameState, get().dispatch),
  subscribePremium: () => actions.subscribePremium(get().gameState, get().dispatch),
  cancelPremium: () => actions.cancelPremium(get().gameState, get().dispatch),
  updateSwipePreferences: (preferredStat) => actions.updateSwipePreferences(get().gameState, get().dispatch, preferredStat),
  instantMatch: (npcId) => actions.instantMatch(get().gameState, get().dispatch, npcId),
  resolveNpcAlert: (optionIndex) => actions.resolveNpcAlert(get().gameState, get().dispatch, optionIndex),
  buyAsset: (assetId, quantity) => actions.buyAsset(get().gameState, get().dispatch, assetId, quantity),
  sellAsset: (assetId, quantity) => actions.sellAsset(get().gameState, get().dispatch, assetId, quantity),
  payTaxes: () => actions.payTaxes(get().gameState, get().dispatch),
  postSimstagram: (contentType, statRequirements, baseFollowers, energyCost) =>
    actions.postSimstagram(get().gameState, get().dispatch, contentType, statRequirements, baseFollowers, energyCost),
  addSimstagramBuff: (buffName) => actions.addSimstagramBuff(get().gameState, get().dispatch, buffName),

  startProject: (projectId) => get().dispatch({ type: 'START_PROJECT', payload: { projectId } }),
  workOnProject: (energyCost) => get().dispatch({ type: 'WORK_ON_PROJECT', payload: { energyCost } }),
  enrollCourse: (courseId) => get().dispatch({ type: 'ENROLL_COURSE', payload: { courseId, useLoan: false } }),
  enrollCourseWithLoan: (courseId) => get().dispatch({ type: 'ENROLL_COURSE', payload: { courseId, useLoan: true } }),
  studyCourse: () => get().dispatch({ type: 'STUDY_COURSE' }),
  takeGig: (gigId) => get().dispatch({ type: 'TAKE_GIG', payload: { gigId } }),
  workSideHustle: (hustleId) => get().dispatch({ type: 'WORK_SIDE_HUSTLE', payload: { hustleId } }),
  switchTrack: (trackId) => get().dispatch({ type: 'SWITCH_TRACK', payload: { trackId } }),
  useAbility: (abilityId) => get().dispatch({ type: 'USE_ABILITY', payload: { abilityId } }),
}));
