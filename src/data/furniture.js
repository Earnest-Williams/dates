export const FURNITURE = {
  twin_bed: {
    id: "twin_bed",
    name: "Twin Bed",
    type: "furniture",
    category: "bed",
    cost: 150,
    slots: 1,
    desc: "A small basic mattress. Restores +10% energy/hr sleep.",
    energyMultiplier: 1.10
  },
  queen_bed: {
    id: "queen_bed",
    name: "Queen Bed",
    type: "furniture",
    category: "bed",
    cost: 500,
    slots: 1,
    desc: "Spacious enough for two. Restores +25% energy/hr sleep.",
    energyMultiplier: 1.25
  },
  king_bed: {
    id: "king_bed",
    name: "King Bed",
    type: "furniture",
    category: "bed",
    cost: 1500,
    slots: 2,
    desc: "Pure luxury. Restores +50% energy/hr sleep.",
    energyMultiplier: 1.50
  },
  hot_plate: {
    id: "hot_plate",
    name: "Electric Hot Plate",
    type: "furniture",
    category: "kitchen",
    cost: 60,
    slots: 1,
    desc: "Allows basic cooking at home (recovers 30 hunger).",
    hungerRecover: 30
  },
  gas_range: {
    id: "gas_range",
    name: "Gas Range Stove",
    type: "furniture",
    category: "kitchen",
    cost: 450,
    slots: 2,
    desc: "Allows premium cooking (recovers 60 hunger, +15 mood).",
    hungerRecover: 60,
    moodBonus: 15
  },
  smart_fridge: {
    id: "smart_fridge",
    name: "Smart Fridge",
    type: "furniture",
    category: "kitchen",
    cost: 1200,
    slots: 2,
    desc: "Halves weekly grocery bills and stores fresh ingredients.",
    groceryDiscount: 0.5
  },
  bookshelf: {
    id: "bookshelf",
    name: "Wooden Bookshelf",
    type: "furniture",
    category: "decor",
    cost: 200,
    slots: 1,
    desc: "Organizes books. Boosts study gains by +25%.",
    studyMultiplier: 1.25
  },
  smart_tv: {
    id: "smart_tv",
    name: "55\" Smart TV",
    type: "furniture",
    category: "decor",
    cost: 600,
    slots: 1,
    desc: "Enables 'Watch TV' action to restore +30 Mood.",
    unlocksAction: "watch_tv"
  },
  luxury_painting: {
    id: "luxury_painting",
    name: "Abstract Canvas",
    type: "furniture",
    category: "decor",
    cost: 1000,
    slots: 1,
    desc: "Brings style and charm to your room (+5 Style, +5 Charm).",
    statBoost: { style: 5, charm: 5 }
  }
};
