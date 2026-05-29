// Item/economy catalog note: purchasable items support the player's stats,
// needs, home, travel, or authored one-off scene props. Items must not grant
// repeatable romance progress, define gift multipliers, or act as affection
// currency for NPC routes.

import { FURNITURE } from './furniture.js';
import { VEHICLES } from './vehicles.js';

export const PERSONAL_ITEMS = {
  basic_phone: {
    id: "basic_phone",
    name: "Basic Phone",
    type: "tool",
    cost: 0,
    desc: "Calls, texts, maps, and slow job websites. Nothing fancy, but it works.",
  },
  clothes: {
    id: "clothes",
    name: "Designer Outfit",
    type: "upgrade",
    cost: 150,
    desc: "Instantly boosts your Style stat by +15.",
    effect: { stat: "style", value: 15 }
  },
  cologne: {
    id: "cologne",
    name: "Luxury Fragrance",
    type: "upgrade",
    cost: 80,
    desc: "Instantly boosts your Charm stat by +10.",
    effect: { stat: "charm", value: 10 }
  },
  supplements: {
    id: "supplements",
    name: "Premium Supplements",
    type: "consumable",
    cost: 60,
    desc: "A personal health item. Supports energy and recovery when used by you.",
    effect: { health: 20, energy: 10 }
  }
};

export const ITEMS = {
  ...PERSONAL_ITEMS,
  ...VEHICLES,
  ...FURNITURE
};
