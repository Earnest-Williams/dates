# Dates — Complete Development Roadmap

## North Star

Build `dates` into a **relationship-memory-first dating life sim**. Romance progression should come from shared time, authored choices, remembered context, compatibility, routines, organic encounters, conflict/repair, home life, reputation, and long-term follow-through.

It should **not** become a repeatable gift loop, a shopping-based romance game, or a pure stat grinder.

The existing stack should remain:

- React
- Vite
- Zustand
- reducer-routed game state
- data-driven content modules
- Node test runner
- action audit script

The repo already uses `node --test`, `audit:actions`, React, React DOM, and Zustand. Source anchor: `package.json` defines `test: node --test`, `audit:actions`, and the React/Zustand dependencies.

---

## Phase 0 — Stabilize Baseline and Protect Design Intent

**Duration:** 1 sprint  
**Primary goal:** Lock current behavior, add rollout controls, and prevent regression into gift-based romance.

### Required CI Gates

Keep these as mandatory checks:

```bash
npm test
npm run audit:actions
```

### Work

#### 0.1 Lock current behavior

* Preserve current reducer-driven Zustand architecture.
* Keep existing tests green before relationship-system expansion.
* Treat `npm test` and `npm run audit:actions` as required gates.
* Avoid broad architectural rewrites.

#### 0.2 Add no-gift-loop regression tests

Add a dedicated regression suite that asserts:

* Items do not grant relationship points.
* Furniture does not define `favoriteNpc`, `relationshipBonus`, or equivalent romance shortcuts.
* NPCs do not define loved/liked/disliked gift tables.
* Date templates do not include repeatable gift progression.
* Repair scenes do not use generic purchased items as conflict clears.
* Home activities do not function as disguised affection purchases.
* Shopping paths cannot directly advance romance.

Recommended test file:

```text
test/noGiftRegression.test.js
```

#### 0.3 Add feature flags

Add a `features` object to root state:

```js
features: {
  organicEncounters: false,
  compatibilityRevealUx: false,
  instantMatchRebalance: false,
  relationshipJournal: false,
  reputationSpillover: false,
  dailyPlannerUx: false,
  marketRiskControls: false,
  adultToneTags: false,
}
```

#### 0.4 Version persistence

* Bump persisted save payload version.
* Add migration tests for feature flags.
* Add migration tests for future relationship fields.
* Any state-shape change must include save migration coverage.

Recommended test file:

```text
test/saveMigration.test.js
```

### Technical Choices

* Keep Zustand and reducer dispatch.
* Keep Node test runner plus `node:assert/strict`.
* Add feature flags directly to reducer state.
* Keep feature flags persisted.
* Do not introduce Redux, Jotai, XState, or another state system.

### Definition of Done

* Existing tests pass.
* `audit:actions` passes.
* Feature flags exist and migrate safely.
* No-gift regression tests cover items, NPCs, dates, repairs, furniture, and home activities.
* No risky gameplay behavior ships unflagged.

---

## Phase 1 — Relationship Core Upgrade

**Duration:** 2 sprints
**Primary goal:** Make dating progression canonical, stateful, memory-driven, and repairable.

---

### 1.1 Canonical Date Flow

Make `DATE_TEMPLATES` the single canonical date-content source.

Target flow:

```text
GO_ON_DATE
→ CHOOSE_DATE_PHASE_OPTION
→ CHOOSE_DATE_PHASE_OPTION
→ CHOOSE_DATE_PHASE_OPTION
→ RESOLVE_DATE_EVENT
```

### Work

* Keep `GO_ON_DATE` as the entry action.
* Add `CHOOSE_DATE_PHASE_OPTION`.
* Keep `RESOLVE_DATE_EVENT` as the final write action.
* Constrain or retire any parallel legacy vibe/date path.
* Use `DATE_TEMPLATES` for all authored date phases.
* Store selected choices in `activeDateEvent`.
* Use phase choices to build final relationship, chemistry, mood, memory, conflict, repair, and compatibility outcomes.

### Proposed `activeDateEvent`

```js
activeDateEvent: {
  npcId,
  locationKey,
  dateType,
  currentPhaseIndex,
  connectionScore,
  vibe,
  chemistryScore,
  tensionScore,
  publicVisibility,
  chosenOptions,
  memoryContext,
  pendingCallbacks,
}
```

### Diminishing Returns

Add date repetition rules:

* Same NPC + same date type repeated within 7 days reduces relationship gain.
* Repeated low-effort dates increase tension or boredom.
* Callback-driven dates can bypass some repetition penalty.
* Repair dates can bypass some repetition penalty if they address an active conflict.
* High compatibility should soften bad dates but not erase consequences.

### Technical Choices

Add pure helpers:

```text
src/sim/dateScoring.js
src/sim/dateDiminishingReturns.js
```

Suggested functions:

```js
scoreDatePhaseChoice(state, activeDateEvent, choice)
calculateDateFinalOutcome(state, activeDateEvent)
calculateDateRepetitionPenalty(state, npcId, dateType)
```

### Definition of Done

* All dates resolve through one reducer pathway.
* Every date has phase-level choices.
* Date outcomes can write memories, discoveries, callbacks, conflicts, repair scenes, and stat changes.
* Repeating the same optimal date cannot farm relationship indefinitely.
* Existing date tests still pass.

---

### 1.2 Conflict and Repair as First-Class State

Extend `matches[npcId]` instead of adding a parallel relationship object too early.

### Proposed Match Shape

```js
matches[npcId] = {
  met: true,
  relationship: 10,
  chemistry: 10,
  dateCount: 0,
  storyTier: 0,

  activeConflictId: null,
  pendingRepairScene: null,
  repairHistory: [],
  lastDateQuality: null,
  compatibilityScore: null,

  relationshipStage: 'matched',
  exclusivityExpectation: 'unknown',
  publicKnowledge: 0,
}
```

### Conflict Triggers

Implement conflict triggers from:

* ignored messages
* missed planned date
* poor date ending
* broken promise
* low mood spillover
* ambition mismatch
* home lifestyle mismatch
* jealousy/social reputation
* repeated inattentive dialogue
* public date with another NPC after exclusivity expectation
* major compatibility mismatch at tier transition

### Repair Options

Implement repair options:

* apologize
* give space
* follow through on previous promise
* choose thoughtful activity
* revisit meaningful location
* ask friend for advice
* write message
* help with specific problem
* spend quiet time together
* plan a context-specific repair date

### Repair Windows

Add timing rules:

* Immediate apology works for some conflicts.
* Space works for some conflicts.
* Delayed follow-through works if a promise exists.
* Context-specific help works if a memory or callback exists.
* Generic purchased items never repair conflict.
* Money cannot directly clear conflict.

### Technical Choices

Add pure modules:

```text
src/sim/relationshipConflicts.js
src/sim/relationshipRepair.js
```

Suggested functions:

```js
getEligibleConflictTriggers(state, npcId)
startConflict(state, npcId, conflictId)
getRepairOptions(state, npcId)
resolveRepairAttempt(state, npcId, repairActionId)
```

### Definition of Done

* Failed or mediocre dates can open repair state.
* Active conflict is visible in state.
* Repair attempts are test-covered.
* Repair depends on memory, timing, compatibility, and prior behavior.
* No repair option is equivalent to “buy item, gain relationship.”

---

### 1.3 Compatibility Feedback Without Spoilers

Keep numeric compatibility internal. Expose only narrative compatibility signals.

### Work

Internally keep:

```text
compatibilityScore
compatibilityBand
playerCompatibilityTraits
npcCompatibilityTraits
```

Externally expose:

```text
strong long-term fit
mixed long-term fit
fragile long-term fit
```

Use short narrative observations instead of raw percentages.

### Reveal Moments

Reveal compatibility hints at:

* story tier transitions
* post-date recaps
* conflict/repair moments
* cohabitation attempts
* proposal readiness checks
* long-term planning scenes

### Technical Choices

Add selectors:

```js
selectCompatibilitySignal(state, npcId)
selectCompatibilityHintText(state, npcId)
selectProposalReadinessHint(state, npcId)
selectCohabitationFitHint(state, npcId)
```

Example return:

```js
{
  band: 'mixed',
  text: 'You connect easily in quiet moments, but long-term ambition still feels unresolved.'
}
```

### Definition of Done

* Player sees compatibility through narrative hints.
* Raw numeric compatibility is not exposed in normal UI.
* Compatibility affects dates, repair, cohabitation, and proposal readiness.
* Compatibility never deterministically forces success or failure.

---

## Phase 2 — Discovery and World Texture

**Duration:** 2 sprints
**Primary goal:** Make the game world playable outside the swipe app.

The repo already has scheduled NPC encounters and location texture. This phase integrates those systems into gameplay and UI.

---

### 2.1 Organic NPC Encounters

Use `src/data/townTexture.js` as source of truth for scheduled encounters.

### Work

Add reducer actions:

```text
DISCOVER_NPC_AT_LOCATION
START_ORGANIC_ENCOUNTER
RESOLVE_ORGANIC_ENCOUNTER
```

Organic encounters should be able to:

* introduce an NPC without a swipe match
* create low-stakes relationship start
* reveal a schedule clue
* seed a memory
* seed a callback
* unlock a future date
* reveal a location-specific hook
* add public visibility/reputation context

### Design Rule

Swiping remains efficient discovery. Organic encounters provide richer context. Neither path should bypass normal relationship progression.

### Technical Choices

Selectors:

```js
selectCurrentLocationEncounters(state)
selectAvailableOrganicEncounters(state)
selectLocationTexture(state)
selectLocationEvent(state)
```

Reducer integration:

```text
TRAVEL
→ check current location/time
→ getNpcEncounters(time, locationKey)
→ expose encounters in MapUI/Dashboard
```

### Definition of Done

* Every romanceable NPC can be discovered or progressed through at least one organic encounter.
* Organic encounters write memory/context, not just `met: true`.
* Swipe app is no longer the only meaningful discovery path.
* Encounters respect location and time.

---

### 2.2 Location Events and Town Texture

Use location events to make dates and organic encounters feel grounded.

### Work

Add location-event logic for:

* library book sale
* gym challenge day
* park market
* mall discount weekend
* office networking mixer
* nightclub guest-list night
* rainy evening at home

Location events should affect:

* available encounter choices
* public visibility
* reputation circle exposure
* date phase flavor
* memory/discovery tags
* repair scene eligibility

### Technical Choices

Selectors:

```js
selectActiveLocationEvent(state)
selectLocationRomanceHooks(state, locationKey)
selectLocationPublicVisibility(state, locationKey, time)
```

### Definition of Done

* Locations feel different mechanically and narratively.
* Location hooks appear in dates and organic encounters.
* Public/private context affects reputation and jealousy.
* Location events never become shopping-based romance progression.

---

### 2.3 Daily Planner as Primary Play Loop

Make routine planning the top-level day-entry UX.

### Work

Promote daily planning into the dashboard’s primary action section.

Organize options by time bucket:

```text
morning
afternoon
evening
night
```

Planner should show:

* available routines
* organic encounters
* pending promises
* relationship warnings
* energy/mood/hunger constraints
* money/rent pressure
* social opportunities
* active conflicts
* repair windows
* date opportunities

### Technical Choices

Evolve `DailyRoutinePanel` into a dashboard-level section.

Selectors:

```js
selectAvailableRoutinesByTimeBucket(state)
selectPlannerWarnings(state)
selectPlannerSocialOpportunities(state)
selectPlannerEconomicPressure(state)
selectPlannerRepairOpportunities(state)
selectPlannerPromiseDeadlines(state)
```

Do not add a separate calendar simulation. Use existing reducer ticks.

### Definition of Done

* Dashboard answers “What should I do today?”
* Routines, relationships, economy, and time are visible in one planning surface.
* Planner actions advance time through existing reducer flow.
* Planner does not duplicate canonical state.

---

### 2.4 Home Identity Integration

Reuse existing home-style systems. Do not create a second home scoring system.

### Work

Use:

```text
calculateHomeStyleProfile
getDominantHomeStyles
getNpcHomeStyleReaction
HOME_ACTIVITIES
NPC home reactions
```

Home scenes should trigger from:

* placed furniture tags
* NPC preferred home styles
* relationship stage
* pending repair scene
* cohabitation state
* current home activity
* date type
* recent promises

Home identity should affect:

* home dates
* cohabitation
* repair options
* comfort discoveries
* shared routines
* proposal readiness
* roommate/cohabitation logs

### Hard Rule

Home identity must not become:

* NPC gift preference
* purchasable affection shortcut
* furniture-based relationship farming
* “buy exact furniture for +relationship”

### Technical Choices

Selectors:

```js
selectHomeStyleProfile(state)
selectHomeStyleFit(state, npcId)
selectAvailableHomeScenes(state, npcId)
selectHomeActivityDateOptions(state, npcId)
selectHomeRepairOptions(state, npcId)
```

### Definition of Done

* Home style affects scenes and reactions.
* NPCs respond to home identity through authored context.
* Home activities can seed dates and repairs.
* Furniture never directly grants relationship points.

---

## Phase 3 — Economy, Career, Reputation, and Anti-Exploit Balance

**Duration:** 1–2 sprints
**Primary goal:** Make optimization interesting without letting money, premium features, or investments bypass romance pacing.

---

### 3.1 Instant Match Rebalance

Keep Instant Match as discovery convenience, not progression bypass.

### New Behavior

Instant Match should create contact only:

```js
[npcId]: {
  met: true,
  discoveredVia: 'instant_match',
  relationship: 10,
  chemistry: 10,
  dateCount: 0,
  storyTier: 0,
  relationshipStage: 'matched',
}
```

It should not:

* unlock story chapters
* seed deep memories
* skip compatibility discovery
* skip date flow
* bypass conflict/repair
* bypass cohabitation readiness
* bypass proposal readiness

### Technical Choices

* Gate behind `features.instantMatchRebalance`.
* Keep action name `INSTANT_MATCH`.
* Modify reducer behavior only when flag is enabled.
* Add regression tests for old/new behavior while flag exists.

### Definition of Done

* Instant Match creates contact but not commitment progress.
* Instant Match does not create deep relationship memory.
* Date/story progression still requires normal interaction flow.
* Premium remains useful but not dominant.

---

### 3.2 Investment Risk Controls

Centralize and stabilize market behavior.

### Work

Move market tick logic into:

```text
src/sim/markets.js
```

Add functions:

```js
advanceMarketDay(assetPrices, priceHistories, rng)
applyMarketNews(assetPrices, newsEvent, rng)
calculateTransactionFriction(assetId, quantity, side)
clampAssetPrice(assetId, price)
```

Add risk controls:

* volatility bounds
* transaction fees or bid/ask spread
* no same-tick buy/sell exploit
* deterministic seeded tests
* bounded market-news impact
* minimum/maximum daily move clamps by asset class
* transaction log for balance tests

### Technical Choices

* Keep market updates in existing time/tick cycle.
* Extract pure logic from reducer.
* Inject seeded RNG in tests.
* Avoid full market simulation complexity.

### Definition of Done

* Market tests are deterministic.
* Investment-only route does not trivialize survival or romance pacing by Day 30/60.
* Investment risk is readable but not chaotic.
* Market logic is no longer buried in a large reducer body.

---

### 3.3 Reputation Spillover

Use lightweight reputation circles instead of one global score.

### Proposed State

```js
reputation: {
  coworkers: 0,
  friends: 0,
  nightlife: 0,
  creative: 0,
  academic: 0,
  exes: 0,
}
```

### Circle Mapping

```text
Elena  → academic
Brad   → friends / fitness if added later
Sophia → nightlife
Rina   → nightlife
Marcus → coworkers
Nora   → coworkers
Chloe  → creative
Maya   → creative
Exes   → exes
```

### Work

Reputation should affect:

* organic encounters
* jealousy likelihood
* public-date consequences
* gossip
* invitation tone
* repair difficulty
* NPC social graph responses
* nightlife/public events
* office/career events

### Technical Choices

Add:

```text
src/sim/reputation.js
```

Suggested functions:

```js
adjustReputationForPublicDate(state, npcId, locationKey)
calculateGossipRisk(state, npcId, locationKey)
selectRelevantReputationCircle(npcId, locationKey)
calculateRepairReputationModifier(state, npcId)
```

### Definition of Done

* Multi-partner behavior creates relevant social consequences.
* Reputation is circle-specific.
* Public choices matter more in social locations.
* Reputation affects encounter tone and repair difficulty.

---

### 3.4 Balance Scenario Harness

Add deterministic scenario tests for exploit detection.

### Work

Create scripted bot routes:

* work-only
* finance/investment rush
* premium swipe rush
* relationship rush
* multi-partner route
* housing rush
* legacy rush
* balanced life route

Track metrics:

* net worth
* debt
* housing tier
* relationship max
* number of serious partners
* conflicts triggered
* conflicts repaired
* heir stat total
* collapse count
* eviction count
* date repetition count
* unresolved promises

### Technical Choices

Add:

```text
test/balance/day30.test.js
test/balance/day60.test.js
test/balance/day120.test.js
test/balance/multiPartner.test.js
test/balance/legacyInheritance.test.js
```

Add helper:

```js
runScenario(initialState, actions, { rngSeed })
```

### Definition of Done

* No single route trivially dominates.
* Money cannot bypass relationship memory.
* Premium cannot bypass progression.
* Legacy does not produce runaway stat/wealth inflation.
* Multi-partner route is possible but costly.

---

## Phase 4 — Relationship Journal and Visible Memory UX

**Duration:** 1 sprint
**Primary goal:** Make hidden relationship systems legible without exposing raw numeric internals.

---

### 4.1 Relationship Event Log

Add historical event logging while keeping `relationshipMemory` as the summarized state.

### Proposed State

```js
relationshipEvents: {
  [npcId]: [
    {
      id,
      day,
      source,
      type,
      tags,
      memoryKey,
      promiseKey,
      conflictId,
      repairScene,
      publicVisibility,
      relationshipDelta,
      chemistryDelta,
      summary,
    }
  ]
}
```

### Event Sources

Log events from:

* dialogue
* date phases
* date resolution
* organic encounters
* NPC alerts
* conflict starts
* repair attempts
* cohabitation
* proposal
* marriage
* legacy/family reactions
* home scenes
* reputation spillover

### Technical Choices

Add helper:

```js
appendRelationshipEvent(state, npcId, event)
```

Keep logs compact to avoid save bloat.

### Definition of Done

* Important relationship changes create event records.
* Event log persists.
* Event log supports journal UI.
* Event log does not replace summarized memory state.

---

### 4.2 Relationship Journal UI

Add a journal view for each NPC.

### UI Sections

For each NPC:

* What they remember
* Shared activities
* Pending promises
* Important moments
* Comfort style
* Current tension
* Compatibility observations
* Recent date outcomes
* Repair opportunities
* Reputation/social context
* Suggested next step

### Technical Choices

Components:

```text
RelationshipJournal.jsx
NpcMemoryCard.jsx
PromiseTracker.jsx
ConflictBadge.jsx
DateRecap.jsx
CompatibilityHint.jsx
ReputationHint.jsx
```

Selectors:

```js
selectNpcJournal(state, npcId)
selectNpcPromises(state, npcId)
selectNpcConflictBadge(state, npcId)
selectNpcRecentMemories(state, npcId)
selectNpcCompatibilityHint(state, npcId)
selectNpcRecentEvents(state, npcId)
selectNpcSuggestedNextStep(state, npcId)
```

### Definition of Done

* Player can see what each NPC remembers.
* Pending promises are visible.
* Conflict and repair state are visible.
* Compatibility appears as narrative hint text.
* Player can understand why relationship state changed without inspecting raw state.

---

## Phase 5 — Adult Tone, Tension, and Narrative Boundaries

**Duration:** 1 sprint initial system, then ongoing content use
**Primary goal:** Support adult romantic tension through implication, secrecy, public/private stakes, and emotional consequence — not explicit visual pornography.

---

### 5.1 Adult Tone Tags

Add scene metadata:

```js
sceneTags: [
  'secrecy',
  'temptation',
  'late_night',
  'public_risk',
  'private_invitation',
  'emotional_hunger',
  'near_confession',
  'reputation_pressure',
  'afterparty_quiet',
  'longing',
  'vulnerability',
]
```

### Tone Object

```js
tone: {
  heat: 0,
  implication: 0,
  emotionalRisk: 0,
  publicRisk: 0,
}
```

Do not create an “explicitness meter.” Keep explicitness out of the visual/content reward loop.

### Work

Use adult-tone metadata to influence:

* scene prose
* public visibility
* reputation risk
* jealousy risk
* callback intensity
* late-night invitations
* private/public contrast
* repair tone

### Technical Choices

Add validator rules:

* tone metadata is optional but schema-valid when present
* no pornographic visual asset references
* no explicit reward unlock system
* adult-tone scenes must produce narrative, memory, reputation, or relationship consequences

### Definition of Done

* Adult romantic tension exists through text, implication, timing, secrecy, and consequence.
* No explicit visual pornography is added.
* Adult-tone scenes affect memory, trust, jealousy, reputation, or commitment.
* Tone system supports both slow-burn and temptation-heavy routes.

### Addendum: Heightened Tone & Metadata Usage
* **Tone Spice Level:** The prose and dialogue in late-stage encounters (Tier 75/100, Chapters 5/6, and intimate dates) are written with a heightened, explicit tension and emotional/physical longing, far exceeding the initial plan's baseline, while avoiding outright visual pornography.
* **Metadata-Only:** For now, the `tone: { heat, implication, emotionalRisk, publicRisk }` properties remain purely narrative metadata to inform the UI and journal. They do not actively manipulate raw relationship or chemistry math, though they are stored in the payload.

---

### 5.2 Route-Specific Tone Pass

Apply tone tags by route:

```text
Elena  → intellectual intimacy, restraint, ambition/shame
Brad   → vulnerability beneath bravado, physical discipline, reassurance
Sophia → public/private identity, status pressure, being seen
Marcus → control, overwork, late-night vulnerability
Chloe  → creative vulnerability, quiet sincerity
Rina   → nightlife confidence, after-midnight honesty
Maya   → artistic curiosity, nature/study intimacy
Nora   → professional pressure, competence, controlled vulnerability
```

### Definition of Done

* Each route has distinct adult-tone identity.
* Tone does not flatten into generic seduction.
* Adult scenes are tied to character psychology and relationship state.

---

## Phase 6 — Content Production Pipeline

**Duration:** ongoing
**Primary goal:** Make romance content scalable, testable, and consistent with the no-gift rule.

---

### 6.1 Arc Writing Pass

Expand each chapter’s prose to match `emotionalBeat`.

Every romance chapter should validate:

```js
{
  id,
  type,
  minRelationship,
  title,
  prompt,
  emotionalBeat,
  choices: [
    {
      text,
      relationshipImpact,
      chemistryImpact,
      memory,
      callback,
      conflict,
      repairScene,
      checkStat,
      threshold,
      onSuccess,
      onFail
    }
  ]
}
```

### Required Chapter Qualities

Each chapter should have:

* at least two choices
* at least one non-stat path
* relationship/chemistry outcome structure
* memory or callback potential
* alternate outcome or consequence
* no repeatable gift logic
* no generic purchased repair
* emotional beat reflected in prose

### Definition of Done

* Every romanceable NPC has complete chapter coverage.
* Every chapter has meaningful choice structure.
* Every chapter can create or reference memory.
* Route writing supports future callbacks.

---

### 6.2 Scene QA Checklist

Validate:

* memory callbacks
* conflict triggers
* repair dependencies
* date template references
* NPC schedule coverage
* home activity references
* no-gift compliance
* no orphaned callback keys
* no invalid location/date references
* no adult-tone schema violations
* no relationship gain from purchasable items

### Technical Choices

Add content validator:

```text
scripts/validate-content.mjs
```

Add package script:

```json
{
  "validate:content": "node scripts/validate-content.mjs"
}
```

Eventually require:

```bash
npm test
npm run audit:actions
npm run validate:content
```

### Definition of Done

* Every route chapter passes schema validation.
* Every date template passes schema validation.
* Every repair scene has dependencies.
* Every callback references valid state/content.
* No authored content creates shopping-based romance progression.

---

### 6.3 Content Structure Tests

Add tests for:

```text
test/content/npcArcSchema.test.js
test/content/dateTemplateSchema.test.js
test/content/repairSceneSchema.test.js
test/content/homeActivitySchema.test.js
test/content/toneTags.test.js
test/content/noOrphanCallbacks.test.js
```

### Definition of Done

* Content breaks fail tests before runtime.
* No orphan memory/callback keys.
* No invalid repair scene references.
* No invalid location/date references.

---

## Phase 7 — UI/UX Integration Pass

**Duration:** 1–2 sprints
**Primary goal:** Make systems playable, readable, and emotionally legible.

---

### 7.1 Dashboard Restructure

Dashboard should prioritize:

* current needs
* daily planner
* active promises
* active conflicts
* relationship opportunities
* money pressure
* location opportunities
* upcoming NPC windows

### Work

Create dashboard sections:

```text
Today
Needs
Planner
Relationships
Promises
Opportunities
Money/Risk
Recent Logs
```

### Definition of Done

* Player can decide what to do next without opening every sub-app.
* Relationship pressure and life pressure are visible together.
* Dashboard supports both casual and optimization play.

---

### 7.2 Date Recap UX

After date completion, show:

* date quality
* relationship change
* chemistry change
* memory gained
* discovery gained
* promise created
* conflict risk
* repair opportunity
* compatibility hint
* reputation/public visibility consequence

### Technical Choices

Component:

```text
DateRecap.jsx
```

Selectors:

```js
selectLastDateRecap(state)
selectDateOutcomeSummary(state, npcId)
```

### Definition of Done

* Player understands why a date succeeded or failed.
* Date outcomes feel narrative, not just numeric.
* Repair opportunities are clear.

---

### 7.3 Conflict/Repair UX

Add a visible repair flow.

### UI Should Show

* what happened
* why it matters
* available repair options
* time sensitivity
* relevant memory/promise
* likely emotional tone
* unavailable options and why

### Technical Choices

Component:

```text
ConflictRepairPanel.jsx
```

Selectors:

```js
selectActiveConflict(state, npcId)
selectAvailableRepairOptions(state, npcId)
selectRepairWindow(state, npcId)
```

### Definition of Done

* Conflicts are not hidden surprises.
* Repair is understandable without showing raw formulas.
* Player can choose repair strategy.

---

### 7.4 Organic Encounter UX

Add encounter cards to Map/Dashboard.

### UI Should Show

* who is present
* location texture
* encounter hook
* time window
* likely tone
* public/private context
* whether encounter is new or follow-up

### Technical Choices

Components:

```text
OrganicEncounterCard.jsx
LocationTexturePanel.jsx
```

### Definition of Done

* Player sees organic social opportunities.
* Encounters feel grounded in place/time.
* Encounters can start without swipe app.

---

### 7.5 Home Identity UX

Add home identity summary.

### UI Should Show

* dominant home styles
* available home activities
* NPC reactions
* cohabitation/home-date implications
* repair scene opportunities

### Technical Choices

Components:

```text
HomeStylePanel.jsx
HomeActivityPanel.jsx
NpcHomeReaction.jsx
```

### Definition of Done

* Home style is readable.
* Home activities feel like lifestyle choices.
* Home identity does not look like a gift optimization table.

---

## Phase 8 — Documentation and Design Bible Update

**Duration:** parallel with Phases 1–7
**Primary goal:** Keep implementation, content authoring, and tests aligned.

---

### New Docs

Add:

```text
docs/relationship-state.md
docs/date-engine.md
docs/conflict-repair.md
docs/npc-schedules.md
docs/daily-planner.md
docs/home-identity.md
docs/reputation.md
docs/adult-tone-guide.md
docs/balance-scenarios.md
docs/save-migrations.md
docs/content-validation.md
```

### Update Existing Docs

Update:

```text
README.md
game_design_bible.md
docs/relationship-memory.md
docs/npc-content-authoring.md
```

### Required Doc Rules

Docs must explicitly preserve:

* no typical gift-giving system
* no loved/liked/disliked gift tables
* no repeatable affection items
* no shopping-based relationship progression
* contextual items only inside authored scenes
* repair depends on memory/timing/context, not purchases
* compatibility is narrative-facing, numeric-internal
* adult tension is implication/context/consequence, not explicit visual content

### Definition of Done

* Every new system has a doc.
* Docs match tests.
* Docs match reducers/selectors.
* Authoring docs prevent future content drift.

---

## Phase 9 — Final Balance, QA, and Release Hardening

**Duration:** 1–2 sprints
**Primary goal:** Ensure the full loop works over long play sessions.

---

### 9.1 Long-Run Playtest Scenarios

Test scripted and manual routes:

```text
Day 30 casual route
Day 60 balanced route
Day 120 legacy route
multi-partner route
single committed route
career-first route
investment-first route
home/cohabitation route
organic encounter only route
swipe-heavy route
```

### Metrics

Track:

* relationship progression speed
* number of memories created
* number of promises created/kept/broken
* number of conflicts triggered
* repair success/failure rate
* money growth
* eviction/collapse frequency
* reputation drift
* jealousy triggers
* legacy inheritance value
* date repetition patterns

### Definition of Done

* No trivial dominant strategy.
* Romance cannot be bought.
* Multiple play styles are viable.
* Long-term play generates memories, conflicts, repairs, and commitment decisions.
* Legacy transition does not explode wealth/stats.

---

### 9.2 Save/Load Hardening

Test save/load across:

* active date
* active conflict
* active repair
* active organic encounter
* relationship journal
* reputation state
* planner state
* cohabitation
* marriage
* legacy transition

### Definition of Done

* Saves survive all major phases.
* Corrupt/missing fields migrate safely.
* Active scenes can resume or safely collapse to dashboard.

---

### 9.3 Release Gate

Final release gate:

```bash
npm test
npm run audit:actions
npm run validate:content
```

Plus manual smoke test:

```text
new game
first organic encounter
first swipe match
first date
failed date
repair
home date
conflict
cohabitation attempt
proposal attempt
legacy transition
save/load during normal play
```

### Definition of Done

* All automated checks pass.
* Manual smoke test passes.
* Docs reflect shipped behavior.
* No anti-goal regressions.

---

## Cross-Cutting Technical Decisions

### State Architecture

Keep:

* Zustand store
* reducer-routed `gameReducer`
* domain reducers
* pure simulation helpers
* selector layer for UI-derived signals

Avoid:

* second global state system
* duplicated derived UI state
* UI components mutating domain state directly
* direct relationship math inside UI components

---

### Data Contracts

Short term:

* JS data modules
* test-time validators
* strict shape checks in content tests

Medium term:

* optional schema helpers
* optional TypeScript migration only if codebase size justifies it

Recommended data layout:

```text
src/data/npcs.js
src/data/dates.js
src/data/townTexture.js
src/data/furniture.js
src/data/relationshipScenes.js
src/data/repairScenes.js
src/data/reputation.js
src/data/adultTone.js
```

---

### Persistence

Version save payloads for every state-shape change.

Migration tests must cover:

* `features`
* extended `matches[npcId]`
* `relationshipEvents`
* `reputation`
* future relationship-stage fields
* active date event shape
* active conflict/repair state
* planner state, if persisted

Rule: if it changes save shape, it gets a migration test.

---

### UI Composition

Use selectors for:

* compatibility hints
* conflict badges
* encounter availability
* home style fit
* promise warnings
* daily planner suggestions
* organic encounter opportunities
* reputation warnings
* date recap summaries
* repair options

Avoid storing UI summaries directly in state unless they are historical event records.

---

### Guardrails

Maintain explicit anti-goal tests blocking:

* gift tables
* loved/liked/disliked gift preferences
* repeatable affection items
* shopping-based romance progression
* furniture relationship bonuses
* universal repair gifts
* archetype item bonuses
* purchasable conflict clears
* money-to-romance bypasses
* explicit visual adult reward systems

Allowed contextual items must be:

* tied to a specific authored scene
* non-repeatable
* not optimal commodities
* not generic affection currency
* not universal relationship repair

---

## Recommended PR Sequence

1. **PR 1 — Baseline CI and anti-gift regression**

   * Keep `npm test`
   * Keep `npm run audit:actions`
   * Add broader no-gift tests

2. **PR 2 — Feature flags and save migration**

   * Add `features`
   * Bump save payload version
   * Add migration tests

3. **PR 3 — Canonical date flow**

   * Add `CHOOSE_DATE_PHASE_OPTION`
   * Make `DATE_TEMPLATES` the sole authored date source
   * Add date-phase tests

4. **PR 4 — Conflict/repair state**

   * Extend `matches[npcId]`
   * Add conflict/repair helpers
   * Add reducer tests

5. **PR 5 — Compatibility reveal selectors**

   * Add narrative compatibility hints
   * Hide raw score in UI
   * Add selector tests

6. **PR 6 — Organic encounter integration**

   * Wire `getNpcEncounters()` into Map/Dashboard
   * Add organic encounter actions
   * Add encounter tests

7. **PR 7 — Daily planner UX**

   * Promote routine planner to dashboard
   * Add time-bucket planning selectors
   * Add planner warnings

8. **PR 8 — Home identity scenes**

   * Wire home style profile into dates/repairs
   * Add home activity scene selectors
   * Add no-gift home tests

9. **PR 9 — Instant Match rebalance**

   * Feature-flag new behavior
   * Make Instant Match contact-only
   * Add premium-route tests

10. **PR 10 — Market risk controls**

    * Extract market logic to `src/sim/markets.js`
    * Add deterministic seeded tests
    * Add friction/clamps

11. **PR 11 — Reputation circles**

    * Add circle reputation state
    * Add social spillover helpers
    * Add public-date/gossip tests

12. **PR 12 — Relationship event log**

    * Add event logging helper
    * Persist relationship events
    * Add event tests

13. **PR 13 — Relationship journal UI**

    * Add journal selectors
    * Add journal components
    * Add UI smoke coverage if available

14. **PR 14 — Adult tone tags**

    * Add tone metadata
    * Add tone validator
    * Add route tone authoring docs

15. **PR 15 — Content validation pipeline**

    * Add `scripts/validate-content.mjs`
    * Add `npm run validate:content`
    * Add schema/content tests

16. **PR 16+ — Arc writing and scene expansion**

    * Expand prose
    * Add callbacks
    * Add repair scenes
    * Add route-specific adult tension through implication/context

17. **PR 17 — Documentation consolidation**

    * Update README
    * Update design bible
    * Add system docs
    * Ensure docs match tests

18. **PR 18 — Final balance and release hardening**

    * Add long-run scenario tests
    * Add save/load hardening tests
    * Run manual smoke test

---

## Roadmap Completion Definition of Done

The roadmap is complete when:

1. Relationship progression is memory/scene-driven and not purchasable.
2. Organic encounter path works for all romanceable NPCs.
3. Date flow is canonical and phase-based.
4. Conflict/repair is visible, stateful, and test-covered.
5. Compatibility feedback is narrative, not raw numeric spoiler text.
6. Home identity affects scenes without becoming gift preference logic.
7. Daily planner becomes the primary day-entry UX.
8. Instant Match is discovery convenience, not progression bypass.
9. Economy has no trivial dominant path that bypasses romance/legacy pacing.
10. Reputation spillover creates social consequences for public/multi-partner behavior.
11. Adult romantic tension exists through implication/context/consequence, not explicit visual content.
12. Relationship journal explains memory, promises, conflicts, and recent outcomes.
13. Content validation catches schema errors, orphan callbacks, invalid repairs, and gift-loop regressions.
14. Save/load works across active dates, conflicts, repairs, cohabitation, and legacy transition.
15. Docs and tests reflect all new system contracts.

---

## Highest-Leverage Build Order

Build in this order:

1. Phase 0 — Stabilization and anti-gift guardrails
2. Phase 1 — Canonical date flow and conflict/repair state
3. Phase 2 — Organic encounters, daily planner, home identity
4. Phase 3 — Instant Match, markets, reputation, anti-exploit balance
5. Phase 4 — Relationship event log and journal UX
6. Phase 5 — Adult tone tags and route-specific tone pass
7. Phase 6 — Content validation and writing pipeline
8. Phase 7 — UI/UX integration pass
9. Phase 8 — Documentation update
10. Phase 9 — Final balance, QA, and release hardening

---

## Completion Matrix

| Phase | Item | Status |
|---|---|---|
| Phase 0 | 0.1 Lock current behavior (CI gates) | ✅ Completed |
| Phase 0 | 0.2 Add no-gift-loop regression tests | ✅ Completed |
| Phase 0 | 0.3 Add feature flags | ✅ Completed |
| Phase 0 | 0.4 Version persistence & save migrations | ✅ Completed |
| Phase 1 | 1.1 Canonical Date Flow | ✅ Completed |
| Phase 1 | 1.2 Conflict and Repair State | ✅ Completed |
| Phase 1 | 1.3 Compatibility Feedback | ✅ Completed |
| Phase 2 | 2.1 Organic NPC Encounters | ✅ Completed |
| Phase 2 | 2.2 Location Events and Town Texture | ✅ Completed |
| Phase 2 | 2.3 Daily Planner | ✅ Completed |
| Phase 2 | 2.4 Home Identity Integration | ✅ Completed |
| Phase 3 | 3.1 Instant Match Rebalance | ✅ Completed |
| Phase 3 | 3.2 Investment Risk Controls | ✅ Completed |
| Phase 3 | 3.3 Reputation Spillover | ✅ Completed |
| Phase 3 | 3.4 Balance Scenario Harness | ✅ Completed |
| Phase 4 | 4.1 Relationship Event Log | ✅ Completed |
| Phase 4 | 4.2 Relationship Journal UI | ✅ Completed |
| Phase 5 | 5.1 Adult Tone Tags | ⬜ Pending |
| Phase 5 | 5.2 Route-Specific Tone Pass | ⬜ Pending |
| Phase 6 | 6.1 Arc Writing Pass | ⬜ Pending |
| Phase 6 | 6.2 Scene QA Checklist | ⬜ Pending |
| Phase 6 | 6.3 Content Structure Tests | ⬜ Pending |
| Phase 7 | 7.1 Dashboard Restructure | ⬜ Pending |
| Phase 7 | 7.2 Date Recap UX | ⬜ Pending |
| Phase 7 | 7.3 Conflict/Repair UX | ⬜ Pending |
| Phase 7 | 7.4 Organic Encounter UX | ⬜ Pending |
| Phase 7 | 7.5 Home Identity UX | ⬜ Pending |
| Phase 8 | Documentation Updates | ⬜ Pending |
| Phase 9 | 9.1 Long-Run Playtest Scenarios | ⬜ Pending |
| Phase 9 | 9.2 Save/Load Hardening | ⬜ Pending |
| Phase 9 | 9.3 Release Gate | ⬜ Pending |
