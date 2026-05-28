import { timeReducer } from './time.js';
import { inventoryReducer } from './inventory.js';
import { socialReducer } from './social.js';
import { actionReducer } from './action.js';
import { socialMediaReducer } from './socialMedia.js';
import { careerReducer } from './career.js';

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
    stress: 0,
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
    credentials: [], // RPG Expansion: stores earned certificates
    equippedItem: null,
    money: 500,
    debt: 0,
    taxOwed: 0,
  },
  activeTraits: [],
  activeAbilities: [],
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
    roommateId: null,
    hasHealthInsurance: false,
  },
  placedFurniture: ['twin_bed', 'hot_plate'],
  storage: [],
  inventory: {}, // Format: { [itemKey]: quantity }
  properties: {
    vehicles: [], // list of vehicleKeys
  },
  matches: {}, // Format: { [npcId]: { met: boolean, relationship: number, chemistry: number, dateCount: number } }
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
  activeLocation: 'Endleigh',
  activeDateEvent: null,
  activeWorkEvent: null,
  activeNpcAlert: null,
  portfolio: {
    omni: { quantity: 0, avgPrice: 0 },
    gym: { quantity: 0, avgPrice: 0 },
    lnup: { quantity: 0, avgPrice: 0 },
    shib: { quantity: 0, avgPrice: 0 },
    eths: { quantity: 0, avgPrice: 0 }
  },
  assetPrices: {
    omni: 100,
    gym: 25,
    lnup: 40,
    shib: 0.50,
    eths: 15.00
  },
  priceHistories: {
    omni: [100, 100, 100, 100, 100],
    gym: [25, 25, 25, 25, 25],
    lnup: [40, 40, 40, 40, 40],
    shib: [0.50, 0.50, 0.50, 0.50, 0.50],
    eths: [15, 15, 15, 15, 15]
  },
  simstagram: {
    followers: 0,
    posts: [],
    activeBuffs: [],
    sponsorships: []
  },
  career: {
    currentProject: null,
    projectProgress: 0,
    promotionPoints: 0,
    titleLevel: 1,
    activeTrack: 'corporate',
    activeGig: null,
    gigProgress: 0,
    gigReputation: 0,
    activeSideHustle: null,
  },
  education: {
    activeCourse: null,
    courseProgress: 0,
    studentLoans: 0,
  },
  logs: ["Welcome to Life Sim! Start by studying, working out, or looking for a date."],
};

const isDevelopment = import.meta.env?.MODE !== 'production';

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'ADVANCE_TIME':
    case 'DECAY_NEEDS':
    case 'PROCESS_WEEKLY_BILLS':
    case 'PROCESS_MONTHLY_BILLS':
    case 'CHECK_COLLAPSE':
    case 'CHECK_EVICTION':
      return timeReducer(state, action);

    case 'BUY_ITEM':
    case 'PLACE_FURNITURE':
    case 'STORE_FURNITURE':
    case 'TAKE_SUPPLEMENTS':
    case 'UPGRADE_HOUSING':
    case 'BUY_ASSET':
    case 'SELL_ASSET':
    case 'PAY_TAXES':
      return inventoryReducer(state, action);

    case 'CHANGE_RELATIONSHIP':
    case 'SWIPE_NPC':
    case 'GIVE_GIFT':
    case 'ANSWER_DIALOGUE':
    case 'GO_ON_DATE':
    case 'RESOLVE_DATE_EVENT':
    case 'RESOLVE_STORY_EVENT':
    case 'PROPOSE_MARRIAGE':
    case 'ASK_TO_MOVE_IN':
    case 'COMPLETE_WEDDING':
    case 'SELECT_PARENTING_CHOICE':
    case 'REDUCE_CHILD_STRESS':
    case 'BEGIN_LEGACY':
    case 'SUBSCRIBE_PREMIUM':
    case 'CANCEL_PREMIUM':
    case 'UPDATE_SWIPE_PREFERENCES':
    case 'INSTANT_MATCH':
    case 'RESOLVE_NPC_ALERT':
      return socialReducer(state, action);

    case 'PERFORM_ACTION':
    case 'SLEEP':
    case 'COOK_MEAL':
    case 'DINE_OUT':
    case 'SHOWER':
    case 'PAY_BILLS':
    case 'TOGGLE_HEALTH_INSURANCE':
    case 'WATCH_TV':
    case 'VISIT_HOSPITAL':
    case 'TRAVEL':
    case 'DO_ROUTINE':
      return actionReducer(state, action);

    case 'ADD_LOG': {
      const { message } = action.payload;
      return {
        ...state,
        logs: [message, ...state.logs].slice(0, 20)
      };
    }

    case 'POST_SIMSTAGRAM':
    case 'ADD_SIMSTAGRAM_BUFF':
      return socialMediaReducer(state, action);

    case 'START_PROJECT':
    case 'WORK_ON_PROJECT':
    case 'RESOLVE_WORK_EVENT':
    case 'ENROLL_COURSE':
    case 'STUDY_COURSE':
    case 'TAKE_GIG':
    case 'WORK_SIDE_HUSTLE':
    case 'SWITCH_TRACK':
    case 'USE_ABILITY':
      return careerReducer(state, action);

    default:
      if (isDevelopment) {
        console.warn(`[gameReducer] Unknown action type: ${action.type}`);
      }
      return state;
  }
};
