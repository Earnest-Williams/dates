import { FURNITURE } from './furniture';
import { VEHICLES } from './vehicles';

export const GIFTS = {
  flowers: {
    id: "flowers",
    name: "Bouquet of Roses",
    type: "gift",
    cost: 30,
    desc: "A classic romantic gift. Smells lovely.",
    effect: { relationship: 10, bonusArchetypes: ["SOCIALITE", "ARTIST", "SCHOLAR"] }
  },
  chocolates: {
    id: "chocolates",
    name: "Artisanal Chocolates",
    type: "gift",
    cost: 20,
    desc: "Sweet, rich, and beautifully packaged.",
    effect: { relationship: 8, bonusArchetypes: ["ARTIST", "GYM_RAT"] }
  },
  book: {
    id: "book",
    name: "Ancient History Volume",
    type: "gift",
    cost: 45,
    desc: "A thick leather-bound history book.",
    effect: { relationship: 15, bonusArchetypes: ["SCHOLAR"] }
  },
  supplements: {
    id: "supplements",
    name: "Premium Whey Protein",
    type: "gift",
    cost: 60,
    desc: "Double rich chocolate flavor, 25g protein per scoop.",
    effect: { relationship: 15, bonusArchetypes: ["GYM_RAT"] }
  },
  watch: {
    id: "watch",
    name: "Designer Watch",
    type: "gift",
    cost: 500,
    desc: "Gold plated. Highly impressive.",
    effect: { relationship: 40, bonusArchetypes: ["SOCIALITE", "EXECUTIVE"] }
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
  }
};

export const ITEMS = {
  ...GIFTS,
  ...VEHICLES,
  ...FURNITURE
};
