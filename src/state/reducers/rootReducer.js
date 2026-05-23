import { timeReducer } from './time';
import { inventoryReducer } from './inventory';
import { socialReducer } from './social';
import { actionReducer } from './action';

export const initialState = {
  gamePhase: 'living', // 'living', 'marriage', 'parenting'
  family: {
    spouseId: null,
    spouseName: '',
    married: false,
    childName: '',
    generation: 1,
    parentHistory: [],
    playerName: 'Alex',
  },
  parentingGame: {
    currentStep: 0,
    heirStats: {
      fitness: 10,
      intelligence: 10,
      charisma: 10,
      style: 10,
      corporate: 10,
      programming: 10,
      marketing: 10,
      finance: 10,
      negotiation: 10,
      culinary: 10,
      creativity: 10,
      music: 10,
      gaming: 10,
      confidence: 10,
      socialIq: 10,
      empathy: 10,
    },
  },
  time: {
    day: 1,
    hour: 8,
    minute: 0,
  },
  stats: {
    money: 500,
    fitness: 10,
    intelligence: 10,
    charisma: 10,
    style: 10,
    corporate: 10,
    programming: 10,
    marketing: 10,
    finance: 10,
    negotiation: 10,
    culinary: 10,
    creativity: 10,
    music: 10,
    gaming: 10,
    confidence: 10,
    socialIq: 10,
    empathy: 10,
    housingTier: 1,
  },
  needs: {
    energy: 100,
    hunger: 20,
    hygiene: 100,
    health: 100,
    mood: 100,
  },
  living: {
    utilitiesActive: true,
    billsAmount: 50,
  },
  placedFurniture: ['twin_bed', 'hot_plate'],
  storage: [],
  inventory: {}, // Format: { [itemKey]: quantity }
  properties: {
    vehicles: [], // list of vehicleKeys
  },
  matches: {}, // Format: { [npcId]: { met: boolean, relationship: number, dateCount: number } }
  swipePreferences: {
    preferredStat: '', // e.g. 'intelligence', 'fitness', etc.
    sexPreference: 'anyone', // 'male', 'female', 'anyone'
  },
  swipePremium: {
    active: false,
  },
  swipeStats: {
    dailySwipesCount: 0,
    lastSwipedDay: 1,
  },
  activeLocation: 'home',
  logs: ["Welcome to Life Sim! Start by studying, working out, or looking for a date."],
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    // Time & Needs
    case 'ADVANCE_TIME':
    case 'DECAY_NEEDS':
    case 'PROCESS_WEEKLY_BILLS':
    case 'PROCESS_MONTHLY_BILLS':
    case 'CHECK_COLLAPSE':
    case 'CHECK_EVICTION':
      return timeReducer(state, action);

    // Inventory & Housing Customization
    case 'BUY_ITEM':
    case 'PLACE_FURNITURE':
    case 'STORE_FURNITURE':
    case 'TAKE_SUPPLEMENTS':
    case 'UPGRADE_HOUSING':
      return inventoryReducer(state, action);

    // Dating, Dialogue, and Legacies
    case 'CHANGE_RELATIONSHIP':
    case 'SWIPE_NPC':
    case 'GIVE_GIFT':
    case 'ANSWER_DIALOGUE':
    case 'GO_ON_DATE':
    case 'PROPOSE_MARRIAGE':
    case 'COMPLETE_WEDDING':
    case 'SELECT_PARENTING_CHOICE':
    case 'BEGIN_LEGACY':
    case 'SUBSCRIBE_PREMIUM':
    case 'CANCEL_PREMIUM':
    case 'UPDATE_SWIPE_PREFERENCES':
    case 'INSTANT_MATCH':
      return socialReducer(state, action);

    // General Actions & Relocating
    case 'PERFORM_ACTION':
    case 'SLEEP':
    case 'COOK_MEAL':
    case 'DINE_OUT':
    case 'SHOWER':
    case 'PAY_BILLS':
    case 'WATCH_TV':
    case 'VISIT_HOSPITAL':
    case 'TRAVEL':
      return actionReducer(state, action);

    case 'ADD_LOG': {
      const { message } = action.payload;
      return {
        ...state,
        logs: [message, ...state.logs].slice(0, 20)
      };
    }

    default:
      return state;
  }
};
