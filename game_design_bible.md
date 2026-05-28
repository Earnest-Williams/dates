# Dating-Centered Life Simulation Game: Design Bible

Welcome to the official Game Design Document ("Bible") for the Dating-Centered Life Simulation. This document details the core mechanics, system rules, databases, and structural architecture of the project.

---

## 1. Project Architecture & State Loop

The game operates on a reactive tick system (10-minute increments) where actions advance time, decay needs, process rent/utility billing cycles, and recalculate relationships. All core systems are decoupled into pure data and simulation modules, coordinated by a modular, reducer-driven Zustand store (`useGameStore`).

### A. Directory Structure
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
├── state/                 # Global Zustand store layer
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
│   │   ├── social.js      # Swipe matching, relationship memory, dialogue, dating, legacy
│   │   └── time.js        # Time simulation, rent, bills, collapses
│   ├── store.js             # Zustand store, actions, dispatch bridge
│   ├── ItemDatabase.js    # Data connector for items
│   ├── NpcDatabase.js     # Data connector for npcs
│   └── selectors.js       # Selectors (match calculations, time displays)
└── components/            # UI components and layout views
```

### B. Game State Reducer Actions
All state changes flow through `gameReducer(state, action)` in [rootReducer.js](file:///home/earnest/code_projects/dates/src/state/reducers/rootReducer.js) via explicit dispatches:
- `ADVANCE_TIME`: Increments the clock and triggers decay calculations.
- `DECAY_NEEDS`: Passive decay of hunger, hygiene, energy, and mood.
- `PERFORM_ACTION`: Handles study, gym, work, charm practice, and browsing fashion. Deducts energy, updates stats, handles exertion hygiene drops, and logs results.
- `SLEEP`: Sleep for hours to recover energy and mood, affected by bed multiplier.
- `COOK_MEAL`: Cook meal at home using a placed hot plate or gas range.
- `DINE_OUT`: Restores hunger and mood for cash at a restaurant.
- `SHOWER`: Restores hygiene to 100%.
- `PAY_BILLS`: Pays outstanding utility bills.
- `WATCH_TV`: Restores mood at the cost of energy (requires smart TV).
- `VISIT_HOSPITAL`: Recovers health for cash at the hospital.
- `TRAVEL`: Relocates player to a map venue, advancing time based on active vehicle speed.
- `BUY_ITEM`: Purchases an appliance, vehicle, furniture item, consumable, or personal upgrade.
- `PLACE_FURNITURE` / `STORE_FURNITURE`: Manages active home slots or storage units.
- `TAKE_SUPPLEMENTS`: Consumes supplements to gain health and energy.
- `UPGRADE_HOUSING`: Moves into a higher tier apartment.
- `SWIPE_NPC`: Swipes right or left on the dating app. Success rate uses style, charm, and preference matches.
- `ANSWER_DIALOGUE`: Answers introduction prompts, checking stats for positive relationships and mood boosts.
- `GO_ON_DATE`: Take a matched NPC out to a venue. Enhances relationships through shared time, date tone, compatibility, and remembered context.
- `PROPOSE_MARRIAGE`: Proposes marriage to a matched NPC (requires 80+ relationship and Tier 2+ housing).
- `COMPLETE_WEDDING`: Complete wedding phase with a wedding style, naming the heir.
- `SELECT_PARENTING_CHOICE`: Choose child-rearing path at developmental milestones.
- `BEGIN_LEGACY`: Transitions to the next generation, calculating legacy starting stats, cash inheritances, vehicle transfer, and saving history records.
- `ADD_LOG`: Appends a log entry to the dashboard log feed.
- `PROCESS_WEEKLY_BILLS`: Billed on Day 7 boundaries. Deducts rent and storage fees. Triggers eviction if unpaid.
- `PROCESS_MONTHLY_BILLS`: Billed on Day 30 boundaries. Deducts utility bills, shuts off power if unpaid.
- `CHECK_COLLAPSE`: Faints player if Energy hits 0 (recovers 50 energy, drops 15 health, loses 8 hours and \$20).
- `CHECK_EVICTION`: Checks if money falls below housing tier rent constraints.
- `CHANGE_RELATIONSHIP`: Modifies relationship scores with NPC.

---

## 2. Character Needs, Stats & Skills

Player status is divided into **Needs** (which decay passively over time and limit actions), **Core Attributes** (representing baseline capability), and **Specialized Skills** (offering distinct gameplay benefits).

### A. Needs Passive Decay Formulas (Passive Hourly Decay)
- **Energy**: $-2.0\%$ per hour. If it hits $0\%$, the player collapses, losing 8 hours, \$20, and 15 Health.
- **Hunger**: $+5.0\%$ per hour. Starvation kicks in when hunger exceeds $90\%$, draining Health at $-3.0\%$ per hour.
- **Hygiene**: $-1.5\%$ per hour. Heavy exertion adds immediate drops: $-25\%$ for Workout, $-15\%$ for Work.
- **Mood**: $-1.0\%$ per hour. Recovered by dates, dialogue choices, dining out, and entertainment.
- **Health**: Stable unless starving or collapsing. Recovered by supplements (+20) or visiting the hospital clinic (+40).

### B. Core Attributes & Specialized Skills
* **Core Attributes**:
  - **Fitness**: Trained at Gym.
  - **Career**: Trained at Work (OmniCorp shift or Freelance contracts).
  - **Education**: Trained at Library.
  - **Charm**: Trained via Charm Practice.
  - **Style**: Trained via Fashion Browsing or Designer purchases.
  - **Confidence**: Trained via *Mirror Pep Talk* (1 hr, -5 Energy). Boosts swipe app matching probability.
* **Specialized Skills**:
  - **Creativity**: Trained via *Sketch & Write* (2 hrs, -10 Energy). Boosts connection rates.
  - **Social IQ**: Trained via *Socialize & Network* (2 hrs, -15 Energy, -$15). Boosts matchmaking probability.
  - **Culinary Skill**: Trained via *Cook Meal* (+2.0 skill/meal) and *Study Cookbooks* (1 hr, -5 Energy). At 50+ skill, cooked meal hunger recovery is boosted by $+10$ and mood by $+5$.
  - **Programming**: Trained via *Practice Coding* (2 hrs, -10 Energy). Unlocks the **Freelance Coding** contract (`2 hrs • -15 Energy • Earns $30 + 1.2 * Programming`).
  - **Negotiation**: Trained via *Study Negotiation* (1 hr, -5 Energy). Boosts standard OmniCorp salary by $+1\%$ per level and grants up to $20\%$ off purchases at the Shopping Mall.
  - **Marketing**: Trained via *Brand Yourself* (1 hr, -5 Energy). Boosts Swipe App matchmaking and unlocks the **Freelance Marketing** contract (`1 hr • -10 Energy • Earns $15 + 0.6 * Marketing`).
  - **Finance**: Trained via *Market Research* (1 hr, -5 Energy). Automatically pays a weekly interest of $0.2\%$ per level of cash savings on Day 7 boundaries (capped at \$300/week).

### C. Buffs & Debuffs (Stat Gate Rules)
- **Depression**: Active if Mood $< 30$. Disables the **Work** and **Study** actions.
- **Sickness**: Active if Health $< 20$. Disables **Work** and **Study** actions.
- **Malaise**: Active if Health $< 50$. Halves work pay and gym fitness gains.
- **High Mood Focus**: Active if Mood $\ge 70$. Grants a $+50\%$ bonus to study gains (Education) and charm practice (Charm).

---

## 3. Housing Customization & Capacity System

Players rent and upgrade apartments. Larger apartments offer more physical slot capacity, allowing players to place furniture that provides passive stat recovery bonuses.

| Tier | Housing Name | Rent / Week | Sleep Quality | Slot Capacity | Starting Furniture (Studio) | Gating Rules |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| **0** | Parents' Couch | \$0 | 6% Energy/hr | 0 | None | Free, defaults on eviction. |
| **1** | Studio Apartment | \$150 | 8% Energy/hr | 3 | Twin Bed, Hot Plate | First week rent + deposit (\$300) |
| **2** | 1-Bedroom Flat | \$300 | 12% Energy/hr | 6 | None | Required to propose marriage |
| **3** | Modern Condo | \$600 | 15% Energy/hr | 10 | None | Max luxury tier |

### Storage Unit Rules (Mom & Dad's Garage)
- If a player buys furniture when their apartment slots are full, or is evicted, furniture is sent to the storage unit.
- **Mom & Dad's Garage**: Up to 3 items can be stored completely free.
- **Storage Locker**: Storing 4 or more items incurs a **\$10/item/week** storage fee, billed during weekly events.

---

## 4. Appliance & Furniture Database

Furniture is purchased at the Mall and placed at home. Only **one bed** can be placed at a time (replacing a placed bed moves the old one back to storage).

| Item Key | Item Name | Category | Cost | Slots | Passive Effects / Actions Unlocked |
|:---|:---|:---:|:---:|:---:|:---|
| `twin_bed` | Twin Bed | Bed | \$150 | 1 | Sleep recovers $+10\%$ energy/hr |
| `queen_bed` | Queen Bed | Bed | \$500 | 1 | Sleep recovers $+25\%$ energy/hr |
| `king_bed` | King Bed | Bed | \$1500 | 2 | Sleep recovers $+50\%$ energy/hr |
| `hot_plate` | Electric Hot Plate | Kitchen | \$60 | 1 | Unlocks "Cook Basic Meal" (-\$5, -30 hunger) |
| `gas_range` | Gas Range Stove | Kitchen | \$450 | 2 | Unlocks "Cook Premium Meal" (-\$10, -60 hunger, +15 mood) |
| `smart_fridge` | Smart Fridge | Kitchen | \$1200 | 2 | Halves home cooking grocery bills (-50%) |
| `bookshelf` | Wooden Bookshelf | Decor | \$200 | 1 | Boosts Study gains by $+25\%$ |
| `smart_tv` | 55" Smart TV | Decor | \$600 | 1 | Unlocks "Watch TV" action (+30 Mood, -5 Energy) |
| `luxury_painting`| Abstract Canvas | Decor | \$1000 | 1 | Instantly gives $+5$ Style, $+5$ Charm |

### Personal Upgrades & Consumables

Mall inventory supports self-improvement, home utility, mobility, and personal upkeep. It must not include a repeatable romance-gift loop: no purchasable item grants relationship points, no item has archetype romance bonuses, and no shopping path bypasses shared time or authored relationship scenes.

| Item Key | Item Name | Category | Cost | Type | Effects |
|:---|:---|:---:|:---:|:---:|:---|
| `clothes` | Designer Outfit | Personal | \$150 | Upgrade | Instantly gives $+15$ Style |
| `cologne` | Luxury Fragrance | Personal | \$80 | Upgrade | Instantly gives $+10$ Charm |
| `supplements` | Premium Supplements | Personal | \$60 | Consumable | Supports the player's recovery when consumed ($+20$ Health, $+10$ Energy); never functions as NPC affection currency |

---

## 5. Travel & Transportation

Travel speed and energy costs depend on the vehicle currently active in the player's garage.

| Vehicle Key | Vehicle Name | Cost | Speed (Ticks/Travel) | Passive Stats & Gating |
|:---|:---|:---:|:---:|:---|
| `foot` | Walking (Default) | \$0 | 6 (60 mins) | Normal speed |
| `bicycle` | City Bicycle | \$100 | 4 (40 mins) | $+1$ Fitness per travel, $+10\%$ gym gains |
| `scooter` | Electric Scooter | \$400 | 3 (30 mins) | Medium speed |
| `sedan` | Used Sedan | \$2000 | 2 (20 mins) | Fast speed |
| `sports_car` | Luxury Sports Car | \$15000 | 2 (20 mins) | Unlocks access to Neon Beats Nightclub |

### Location Directory
- **Home**: Main hub. Sleep, eat, and manage furniture.
- **Peak Fitness Gym**: Train Fitness stat (⚡ -20 Energy). Pin located at `top: 38%, left: 38%`.
- **Grand Library**: Train Education stat (⚡ -15 Energy). Pin located at `top: 62%, left: 65%`.
- **OmniCorp Headquarters**: Work shifts to earn cash (⚡ -35 Energy). Pin located at `top: 20%, left: 79%`.
- **Avenue Shopping Mall**: Purchase appliances, furniture, vehicles, consumables, and personal upgrades. Pin located at `top: 42%, left: 47%`. Mall items are not a generic shortcut for romance progression.
- **Greenwood Park**: Serenely walks with nature (⚡ -3 Energy). Pin located at `top: 55%, left: 11%`. Meeting point for Chloe.
- **Neon Beats Nightclub**: Party and socialize. Pin located at `top: 80%, left: 46%`. *Gated: Requires 50+ Style OR a Sports Car.*

---

## 6. Social, Swipe, and Dialogue Database

### A. Matching Formula (Swipe App)
Swiping right has a success rate based on Style, Charm, Confidence, Social IQ, Marketing, matching Archetype traits, dating preferences, and premium status:
$$\text{Match Chance \%} = 25\% + \frac{\text{Style}}{4} + \frac{\text{Charm}}{4} + \frac{\text{Confidence}}{4} + \frac{\text{Social IQ}}{4} + \frac{\text{Marketing}}{4} + \text{Archetype Match} + \text{Preference Match} + \text{Premium Boost}$$

- **Archetype Match**:
  - Primary Preference stat $\ge 40$: $+20\%$ chance, $\ge 70$: $+15\%$ extra.
  - Secondary Preference stat $\ge 40$: $+10\%$ chance, $\ge 70$: $+10\%$ extra.
  - Tertiary Preference stat $\ge 40$: $+5\%$ chance.
- **Preference Match**:
  - Player specifies their preferred partner trait (which maps to stats, e.g. "Intellectual" maps to `education`).
  - If preferred stat matches the NPC's primary archetype stat: $+20\%$ matching chance.
  - If preferred stat is set but does NOT match the NPC's primary archetype stat: $-10\%$ matching chance.
- **Premium Boost (LinkUp Gold Active)**:
  - $+20\%$ flat matching chance.

### B. Swipe App Settings & Premium Tiers
* **Daily Swipe Limit**: Free users are limited to **5 swipes per day**. Swipe counts reset when the calendar day advances.
* **LinkUp Gold Subscription**: Cost: **\$15/week** (deducted automatically on Day 7 boundaries). Benefits include:
  1. **Unlimited Swipes**: Bypasses the 5 swipe/day limit.
  2. **Stat Gate Reveal**: Displays the exact stat gates (e.g. `Requires Fitness > 25`) on locked swipe cards.
  3. **Instant Match**: View a list of "Secret Admirers" (unmatched NPCs) and instantly connect with them, completely bypassing all stat/asset gate requirements.
* **Hidden Archetypes**: Visual archetype tags (e.g. "Scholar", "Gym Rat") are hidden from the player in all UI components.

### C. NPC Registry

```
+---------------+---------------+-------------------+-----------------------------------+
| NPC ID / Name | Archetype     | Intro Stat Gate   | Location Active                   |
+---------------+---------------+-------------------+-----------------------------------+
| elena / Elena | Scholar       | Education > 20    | Grand Library                     |
| brad / Brad   | Gym Rat       | Fitness > 25      | Peak Fitness Gym                  |
| sophia/ Sophia| Socialite     | Owns a vehicle    | Neon Beats Nightclub              |
| marcus/ Marcus| Executive     | Career > 30       | OmniCorp Headquarters             |
| chloe / Chloe | Artist        | Charm > 20        | Greenwood Park                    |
+---------------+---------------+-------------------+-----------------------------------+
```

---

## 7. Generational Legacy Shift

Once a relationship reaches **$80+$** points and the player occupies at least a **1-Bedroom Apartment (Tier 2)**, they can propose marriage via the dialogue panel. Proposing immediately triggers the Generational Shift phase.

### A. Wedding Ceremony Stage
The player must select a wedding style, which deducts a fee and yields immediate benefits:
- **Registry Office**: Deducts \$200 (or remaining money if less). Yields standard starting stats and basic mood.
- **Traditional Wedding**: Deducts \$1,000. Yields a $+15$ starting parent mood bonus.
- **Lavish Gala**: Deducts \$4,000. Yields a $+30$ parent mood bonus and seeds the heir with $+5$ starting Career & Charm.

During the ceremony, the player inputs a custom name for the heir.

### B. Childhood Raising Stage
A text-based parenting card dashboard triggers. The player makes choices at 5 development stages (Ages 3, 8, 12, 15, and 18). Premium choices cost money and are disabled if parent cash is insufficient.

| Stage (Age) | Choice Title | Cost | Heir Stat Gains | Description / Consequences |
|:---:|:---|:---:|:---|:---|
| **Age 3** | Elite Early Learning Preschool | \$500 | +15 Education, +5 Career | Focuses on early languages and reading skills. |
| | Quality Time at Home | \$0 | +10 Charm, +5 Style | Free alternative focusing on creative play. |
| | Toddler Gymnastics & Swimming | \$300 | +15 Fitness, +5 Style | Coordination and early physical motor skills. |
| **Age 8** | Private Academics & Math Tutors | \$1000 | +20 Education, +10 Career | Focus on sciences, logic, and mathematics. |
| | Theater Guild & Creative Arts | \$200 | +15 Charm, +15 Style | Stage presence, social skills, and self-expression. |
| | Sports Leagues & Martial Arts | \$400 | +20 Fitness, +5 Charm | Team cooperation, endurance, and karate. |
| **Age 12** | Coding & Science Computer Kit | \$1500 | +25 Education, +15 Career | Personal PC for programming and electronics. |
| | Social Event & Fashion Budgets | \$500 | +20 Style, +20 Charm | Shopping confidence, friendships, and events. |
| | Elite Youth Athletics Training | \$600 | +25 Fitness, +5 Career | Coaching, athletics, and regional tournament play. |
| **Age 15** | Corporate Internships & College Prep| \$800 | +25 Career, +15 Education | Summer roles at OmniCorp and test tutoring. |
| | Rock Band & Design Portfolio | \$400 | +25 Charm, +25 Style | Instruments, software, and style exploration. |
| | Varsity Sports Captain Training | \$500 | +30 Fitness, +10 Charm | Varsity leadership and physical workshops. |
| **Age 18** | Ivy League Tuition Deposit | \$3000 | +30 Education, +25 Career | Prestigious university education security deposit. |
| | Boutique Fashion Studio Fund | \$1500 | +25 Style, +25 Charm | Entrepreneurial startup fund for fashion/design. |
| | Elite Athletic Academy Placement | \$2000 | +30 Fitness, +10 Career | Direct sports developer league academy spot. |

### C. Legacy Reset Mechanics
After completion of the 18th-year choice, the player starts their new life as the heir:
1. **Clock Reset**: Fast-forwards 18 years. Calendar resets to Day 1, Hour 8, Minute 0.
2. **State & Need Reset**: Need values are reset (Energy: 100%, Hunger: 20%, Hygiene: 100%, Health: 100%, Mood: 100%).
3. **Estate consolidation**: All placed furniture and stored furniture are moved to storage. Housing is reset to Parents' Couch (Tier 0) with 0 occupied slots.
4. **Inheritance & Assets**:
   - The heir inherits **50%** of the parent's post-ceremony/post-parenting cash balance.
   - The heir inherits **all vehicles** in the properties collection.
   - Dialogue matches, active dates, and relationships are reset to empty.
5. **Seeded Starting Stats**:
   $$\text{Heir Starting Stat} = \text{Childhood Decision Gains} + 10\% \text{ of Parent's Final Stat}$$
6. **Lineage Ledger**: The parent's final statistics (money, career, education, spouse name, days survived) are recorded in the family parent history and displayed on the dashboard under **Lineage**.

---

## 10. Update Set: Daily Life & Relationship Depth (Designer Notes)

This update set expands experiential content and social depth while keeping implementation risk bounded. It may add narrowly scoped state fields, reducer cases, and persistence keys needed for these features, while avoiding unrelated rewrites to test tooling, CI, and developer docs outside this section.

### A. Daily Routine Gameplay Loop Expansion
- Add a **Daily Planner** view that previews available morning/day/evening blocks as a UX layer over the existing tick clock.
  - Morning block maps to current-day ticks from 08:00-11:59.
  - Day block maps to current-day ticks from 12:00-17:59.
  - Evening block maps to current-day ticks from 18:00-23:59.
  - Planner actions still consume/advance the same tick-based time simulation used by dialogue and dates.
- Add low-pressure routine actions that are not pure stat grind:
  - Reading
  - Cooking
  - Errands
  - Calls
  - Self-care rituals
- Add evening activity options that bias mood recovery and social setup.
- Add weekly rhythm with soft goals (non-fail-state nudges).
- Add small mood bonuses for balanced routine diversity.

**Design intent:** Players can enjoy several in-game days without dating or repeating a single stat action.

### B. Romance Arc Chapters Per NPC
Each romanceable NPC route is expanded into explicit chapter states:
1. First impression
2. Friendship stage
3. Personal reveal
4. Conflict
5. Trust-building event
6. Confession
7. Committed relationship content
8. Marriage / long-term content

Implementation mapping for existing relationship-cap architecture:
- Story Tier 0 (cap 25): Chapters 1-2
- Story Tier 1 (cap 50): Chapters 3-4
- Story Tier 2 (cap 75): Chapters 5-6
- Story Tier 3 (cap 100): Chapters 7-8

**Design intent:** Relationship progression should feel narrative and emotional, not just point accumulation.

### C. Hidden Long-Term Compatibility Layer
In addition to existing match chance systems, add hidden compatibility dimensions:
- Ambition level
- Affection style
- Conflict style
- Social preference
- Family orientation
- Spending style
- Emotional openness
- Long-term goals

**Design intent:** High initial attraction can still lead to poor long-term fit; replay outcomes should diverge.

### D. Multi-Step Date Event Structure
Expand dates into scene-style multi-step events:
- Date activity selection
- Conversation choices
- Flirting style choices
- Budget choices
- Venue-specific complications
- Outcome bands: good, awkward, funny, failed

**Design intent:** Dates should feel story-driven; failed dates should still create memorable narrative value.

### E. Relationship Memory & Meaningful Follow-Through
**Life Sim** intentionally does not include a typical visual-novel gift-giving system. Relationship progress should come from shared time, meaningful choices, remembered context, compatibility, dates, routines, conflict/repair, and long-term follow-through. Items may appear as contextual story props, but they must not function as repeatable affection currency.

Relationship memory tracks:
- Remembered choices and topics an NPC cares about.
- Shared activities, routines, and date locations.
- Promises, pending follow-through, and repaired conflicts.
- Important moments that future dialogue, cohabitation scenes, proposal readiness, legacy reactions, and long-term tone can reference.
- Known comfort styles such as quiet support, practical help, or direct reassurance.

Contextual item rule:
- Items must be tied to specific authored scenes.
- Items must not be repeatable affection currency.
- Items must not be categorized into universal preference tables.
- Items must not be purchasable as a generic relationship shortcut.

**Design intent:** Romance progression rewards attention, continuity, compatibility, and follow-through rather than shopping optimization.

### F. Town Identity & Location Social Texture
Locations should behave like recurring places, not static menus:
- NPC schedules
- Weekday/weekend differences
- Venue-specific events
- Chance encounters
- Recurring town events
- Ambient descriptions
- Location reputation

**Design intent:** Visiting the same place on different days can produce distinct social outcomes.

### G. Social Circles & Reputation Spillover
Add wider social graph entities and consequences:
- Friends and acquaintances
- Introductions via friends
- Exes
- Coworkers
- Neighbors
- Community-specific social reputation
- Relationship spillover effects

**Design intent:** Dating outcomes affect the broader social world, not isolated NPC tracks.

### H. NPC Roster Expansion Targets
- Increase romanceable NPC roster from 5 to **at least 10**.
- Add non-romance recurring NPCs.
- Add rivals, friends, coworkers, and neighbors.
- Add personality variants within broad archetypes.

**Design intent:** Different playthroughs should produce meaningfully different social networks and plausible romantic paths.

### I. Home Identity & Cozy Social Play
Expand home expression beyond utility optimization:
- Room themes
- Style tags
- NPC reactions to home style
- Comfort score
- Hosted dinners
- Movie nights
- Cohabitation changes post move-in/marriage

**Design intent:** Home choices communicate identity and influence mood and relationships.

### J. Acceptance Criteria Mapping
This update set is considered complete when:
- Routine play supports multiple satisfying days without mandatory dating/stat grind.
- Every romanceable NPC has a complete chaptered emotional arc.
- Compatibility can diverge from first-match quality in long-term outcomes.
- Date events read as scenes with varied emotional outcomes.
- Contextual relationship memories are discoverable and remembered by NPCs; there are no loved/liked/disliked gift tables or gift-based route shortcuts.
- Locations produce day-variant and event-variant outcomes.
- Social reputation and circles create spillover between relationships.
- Existing core NPCs meet the depth pass before any further roster expansion supports additional romantic trajectories.
- Home customization affects identity, mood, and relationship expression.


### K. Pass 1 (Structure Tightening for Designers)
To make implementation sequencing clearer, this pass adds explicit ordering guidance without broad architectural rewrites (while allowing targeted reducer/persistence additions needed for new systems):

1. **Routine-first slice**: ship daily planner + low-pressure activities + weekly soft-goal nudges first.
2. **Narrative backbone slice**: convert all romanceable NPC routes into chaptered progression states.
3. **Expression slice**: expand date scenes, relationship-memory callbacks, and home/social identity reactions.
4. **World depth slice**: add location schedules/events, reputation spillover, and expanded NPC roster.

**Pass 1 completion signal:** A designer can map every deliverable to one of the four slices above and schedule content production with minimal ambiguity.

### L. Pass 2 (Content QA & Replayability Tightening)
This pass defines content quality checks to prevent shallow implementations:

- **Routine variance check**: at least three distinct day plans (non-dating) can end with neutral-or-better mood and no forced stat grind loop.
- **Romance chapter check**: each romanceable NPC has at least one unique scene in each chapter stage (first impression through long-term content).
- **Compatibility divergence check**: at least two high-initial-match NPC routes can branch to lower long-term outcomes for different hidden-trait reasons.
- **Date tone check**: each major venue supports at least one positive, one awkward/funny, and one failed outcome path that still advances narrative context.
- **Relationship memory check**: NPC dialogue must reference at least one prior remembered choice, shared activity, promise, conflict/repair moment, or meaningful follow-through in a later interaction window.
- **Town identity check**: the same location visited on weekday vs weekend produces different social possibilities.
- **Social spillover check**: at least one relationship event changes reactions from a third-party social circle member.
- **Home expression check**: at least one NPC response changes based on room style tags/comfort profile.

**Pass 2 completion signal:** two full playthroughs with different partner priorities generate measurably different social outcomes and romance pacing.

### M. Pass 3 (Relationship Repair and Existing Cast Depth)

The current core cast must demonstrate emotional resilience before more roster expansion. Each of Elena, Brad, Sophia, Marcus, and Chloe requires six romance chapters, hidden compatibility traits, relationship memories, two preferred non-gift date types, one conflict event, one repair event, one home reaction, one location-based encounter, one long-term relationship scene, one legacy/family reaction, and at least three callbacks to earlier player choices.

Conflict triggers may include ignored messages, incompatible choices, low mood, jealousy or social reputation, missed planned dates, poor date endings, ambition mismatch, home/lifestyle mismatch, broken promises, and repeated inattentive dialogue. Conflict should pause, complicate, or branch the route rather than hard-failing it immediately.

Repair actions include apology, giving space, following through on a previous promise, choosing a thoughtful activity, revisiting a meaningful location, asking a friend for advice, writing a message, helping with a specific problem, and spending quiet time together. Repair success depends on memories, compatibility, timing, and prior behavior rather than raw stats or purchased items.

No standard gift system should be introduced: no loved gifts, liked gifts, disliked gifts, repeatable gifts, gift farming, archetype gift bonuses, gift guide logic, affection items, or gift-based route progression. Contextual props are allowed only inside specific authored scenes and cannot become universal repair currency.
