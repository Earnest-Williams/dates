# 💞 Life Sim: Dating & Legacy Simulator

Welcome to **Life Sim**, an immersive dating-centric life simulation game built with React, Vite, and custom CSS. In this game, you navigate the delicate balance of self-improvement, career progression, relationship-building, and generational planning. Your ultimate goal is to find a compatible partner, raise an outstanding heir, and build a lasting family legacy across generations.

---

## 🎮 Game Premise & Core Loop

You begin your journey in **Generation 1** as **Alex**, renting a basic Studio Apartment with just a twin bed, a hot plate, and $500 in pocket money. Your daily life revolves around:

1. **Managing Needs**: Keeping your core needs (Energy, Hunger, Hygiene, Health, and Mood) stable.
2. **Improving Stats**: Studying, working out, working at OmniCorp, and practicing charm to level up your attributes.
3. **Dating & Socializing**: Swiping on the dating app to match with NPCs, chatting with them, giving gifts, and going on romantic dates.
4. **Customizing Your Home**: Upgrading your apartment tier to place furniture and appliances that grant powerful passive bonuses.
5. **Generational Legacy**: Proposing marriage, celebrating a wedding, raising a child through 5 developmental stages, and retiring to play as your child with inherited stats, cash, and vehicles.

---

## ✨ Key Gameplay Systems

### 1. Needs, Stats, & Gates
* **Need Decay**: Hunger (+5.0%/hr), Energy (-2.0%/hr), Hygiene (-1.5%/hr), and Mood (-1.0%/hr) decay in real-time as you perform actions or travel.
* **Exertion**: Working and gym sessions incur immediate hygiene drops (-15% and -25% respectively).
* **Stat Gates**:
  * **Sickness / Depression**: If Health drops below 20 or Mood below 30, you are locked out of working and studying.
  * **Malaise**: If Health is below 50, your career wages and fitness training gains are halved.
  * **High Mood Focus**: Keeping Mood at 70+ grants a $+50\%$ bonus to study and charm gains.
* **Collapse**: If Energy hits 0%, you pass out, losing 8 hours of time, $20, and 15 Health.

### 2. Housing, Storage, & Customization
* **Apartment Upgrades**: Upgrade from Parents' Couch (Tier 0, Free) to Studio Apartment (Tier 1, $150/wk), 1-Bedroom Flat (Tier 2, $300/wk), or Modern Condo (Tier 3, $600/wk).
* **Furniture Slots**: Better apartments have more slots (up to 10) to place items bought at the Mall. Placed furniture provides passive benefits:
  * **Beds** (Twin, Queen, King): Boost sleep energy recovery by up to $+50\%$.
  * **Kitchen** (Hot Plate, Gas Range Stove, Smart Fridge): Unlocks home cooking (saving money/hunger) and halves grocery bills.
  * **Decor** (Bookshelf, Smart TV, Abstract Canvas): Boosts study gains by $+25\%$, unlocks the "Watch TV" action, or grants instant style/charm stats.
* **Storage Unit**: Extra furniture is sent to storage. Storing up to 3 items is free in *Mom & Dad's Garage*, but 4+ items cost **$10/item/week**.

### 3. Travel & Map Navigator
* **Locations**: Navigate between **Home**, **Peak Fitness Gym**, **Grand Library**, **OmniCorp Headquarters**, **Avenue Shopping Mall**, **Greenwood Park**, and **Neon Beats Nightclub**.
* **Transport**: Your travel speed and energy costs depend on your active vehicle:
  * **Walking**: 60 mins per travel.
  * **City Bicycle**: 40 mins (grants +1 Fitness and gym boosts).
  * **Electric Scooter**: 30 mins.
  * **Used Sedan**: 20 mins.
  * **Luxury Sports Car**: 20 mins (required to bypass bouncers at the Neon Beats Nightclub unless you have 50+ Style).

### 4. Dating, Matching, & Gift Giving
* **Swipe App**: Swipe on NPCs like **Elena** (Scholar), **Brad** (Gym Rat), **Sophia** (Socialite), **Marcus** (Executive), and **Chloe** (Artist). Matching chance depends on your Style, Charm, and how well you meet their archetype stat requirements.
* **Socializing**: Chat with matches, check dialogues, and give custom gifts (e.g. roses, chocolates, books, supplements, designer watches). NPC-archetype matches yield $1.5\times$ relationship gains.
* **Dates**: Meet NPCs at locations. Going to their preferred venue (e.g., library for Elena, gym for Brad) gives massive relationship and mood boosts.

### 5. Marriage & Generational Legacy Shift
* **Proposal**: Reaching 80+ relationship points and renting at least a 1-Bedroom Flat unlocks the proposal option.
* **Wedding**: Choose a wedding ceremony tier (Registry Office, Traditional, or Lavish Gala) that deducts money but seeds starting heir stats.
* **Parenting Stages**: Raise your heir through milestones at Ages 3, 8, 12, 15, and 18. Each stage offers developmental choices with varying costs and heir stat yields.
* **Legacy Reset**: Start a new life as the heir:
  * Inherit **50%** of the parent's cash and **all vehicles**.
  * Consolidate all parent furniture into storage.
  * Seed heir starting stats: $\text{Childhood Gains} + 10\% \text{ of Parent's Final Stats}$.
  * The parent's final life achievements are saved and displayed in the **Lineage Ledger**!

---

## 🛠️ Codebase Architecture

The project is built with modularity and clean separation of concerns in mind:

```
src/
├── data/                  # Static game databases & configurations
│   ├── housing.js         # Apartment levels and sleep recovery rates
│   ├── furniture.js       # Slot sizes and recovery multipliers for items
│   ├── vehicles.js        # Speed ratings and travel coefficients
│   ├── locations.js       # Venue directory and entrance gates
│   ├── npcs.js            # Profiles, archetypes, and dialogues
│   └── items.js           # Unified ITEMS dictionary aggregator
├── sim/                   # Pure mathematical simulation logic
│   ├── time.js            # Time increments and AM/PM formatters
│   ├── needs.js           # Need decay rates and sleep multipliers
│   ├── matching.js        # Swipe app probability matching chance
│   └── economy.js         # Salaries, storage billing, and groceries
├── state/                 # Global React Context layer
│   ├── actions/           # Domain action dispatch actions
│   │   ├── action.js      # Actions for self-care, sleep, work, etc.
│   │   ├── index.js       # Aggregator export
│   │   ├── inventory.js   # Buying and managing properties/furniture
│   │   ├── social.js      # Dating, swipe, dialogue, parenting, legacy
│   │   └── time.js        # Time, billing, checks
│   ├── reducers/          # Reducer handlers
│   │   ├── action.js      # Self-care actions, sleep, travel, tv, hospital
│   │   ├── inventory.js   # Items, furniture placement, housing upgrades
│   │   ├── rootReducer.js # Root state layout & reducer router
│   │   ├── social.js      # Swipe matching, gifts, dialogue, dating, legacy
│   │   └── time.js        # Time simulation, rent, bills, collapses
│   ├── GameContext.jsx     # Context provider setup, exports useGame
│   ├── ItemDatabase.js    # Data connector for items
│   ├── NpcDatabase.js     # Data connector for npcs
│   └── selectors.js       # Selectors (match calculations, time displays)
└── components/            # UI components and layout views
```

---

## 🚀 How to Install & Run the Project

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install Dependencies
Navigate to the root directory of the project in your terminal and run:
```bash
npm install
```

### 2. Start the Development Server
Launch the project locally with hot module replacement (HMR):
```bash
npm run dev
```
Open the local URL (usually `http://localhost:5173`) in your browser to play!

### 3. Build for Production
To build static assets for production deployment:
```bash
npm run build
```

### 4. Code Quality & Linting
Verify code correctness and format standards:
```bash
npm run lint
```
*(The project enforces zero warnings/errors in the ESLint profile.)*
