# Changelog

All notable changes to the Life Sim: Dating & Legacy Simulator project.

## [Unreleased]

### Added
- **Phase 3: Reputation & Social Systems**
  - Enabled `reputationSpillover` feature flag
  - Enabled `compatibilityRevealUx` feature flag
  - Added 6 new reputation selectors: `selectReputation`, `selectNpcReputation`, `selectAllReputation`, `selectReputationHint`, `isReputationSpilloverEnabled`, `selectReputationWarnings`
  - Reputation system now active: 6 circles (coworkers, friends, nightlife, creative, academic, exes) affecting gossip risk, repair difficulty, and public date visibility

- **Phase 2: Discovery & World Texture**
  - Enabled `organicEncounters` feature flag
  - Enabled `dailyPlannerUx` feature flag (was already enabled)
  - Organic NPC encounters now active: NPCs can be discovered at locations based on their schedules
  - Location events system active: Library book sale, gym challenge day, park market, mall discount weekend, office networking mixer, nightclub guest-list night, rainy evening at home
  - Daily Planner UX active: Primary day-entry experience with time buckets (morning/afternoon/evening/night)

- **Phase 1: Relationship Core Upgrade**
  - Enhanced `dateDiminishingReturns.js` with comprehensive time-based penalties:
    - Same NPC + same date type within 7 days: 50% → 75% → 87.5% stacking reduction
    - Same date type >3 times total: additional 25% lifetime penalty
    - Low connection scores (<30): additional 20% boredom penalty
    - Callback-driven dates: bypass 50% of repetition penalty
    - Repair dates: bypass all repetition penalties
    - High compatibility (>=70): soften penalties by 30%
    - Low compatibility (<40): increase penalties by 20%
  - Enhanced `relationshipConflicts.js` with all 11 conflict trigger types:
    - ignored_messages
    - missed_planned_date
    - poor_date_ending
    - broken_promises
    - low_mood (spillover)
    - ambition_mismatch
    - home_lifestyle_mismatch
    - jealousy_social_reputation
    - repeated_inattentive_dialogue
    - public_date_with_another
    - major_compatibility_mismatch
  - Added helper functions: `getEligibleConflictTriggers`, `checkDateConflictTrigger`, `startConflict`, `evaluateConflictTriggers`
  - Integrated conflict trigger evaluation in `RESOLVE_DATE_EVENT`
  - Added compatibility hint selectors: `selectCompatibilitySignal`, `selectCohabitationFitHint`
  - Updated match data structure with new fields: `dateHistory`, `lastDateDay`, `lastDateType`, `activeConflictId`, `pendingRepairScene`, `repairHistory`, `lastDateQuality`, `compatibilityScore`, `relationshipStage`, `exclusivityExpectation`, `publicKnowledge`
  - Updated persistence migration to include new match fields

- **Tests**
  - Added comprehensive test suite: `test/dateDiminishingReturns.test.js` (10 tests)
  - All existing tests pass (69 total)

### Changed
- Updated `src/state/reducers/rootReducer.js` feature flags: `organicEncounters: true`, `reputationSpillover: true`, `compatibilityRevealUx: true`
- Enhanced `src/state/reducers/social.js` to use enhanced diminishing returns and track date history
- Enhanced `src/state/selectors.js` with reputation and compatibility selectors

### Fixed
- No bugs fixed in this release (all systems were working, features were disabled by flags)

## [0.1.0] - 2026-06-07

### Added
- Initial project setup with React, Vite, Zustand
- Core game systems: needs, stats, dating, housing, legacy
- Comprehensive test suite
- Content validation scripts
- Monitoring infrastructure

---

## Feature Flags Status

| Flag | Status | Description |
|------|--------|-------------|
| `organicEncounters` | ✅ Enabled | Organic NPC discovery at locations |
| `dailyPlannerUx` | ✅ Enabled | Daily planner as primary UX |
| `reputationSpillover` | ✅ Enabled | Reputation affects social dynamics |
| `compatibilityRevealUx` | ✅ Enabled | Narrative compatibility hints |
| `relationshipJournal` | ✅ Enabled | Relationship event tracking |
| `instantMatchRebalance` | ❌ Disabled | Swipe app matching balance |
| `marketRiskControls` | ❌ Disabled | Investment risk management |
| `adultToneTags` | ❌ Disabled | Adult content tone tagging |

## Test Results

```
All tests passing: 69/69
- noGiftRegression.test.js: 4 tests
- reducer.test.js: 29 tests
- romanceArc.test.js: 6 tests
- relationshipMemory.test.js: 5 tests
- balance.test.js: 2 tests
- persistence.test.js: 5 tests
- saveMigration.test.js: 3 tests
- dateDiminishingReturns.test.js: 10 tests
- organicEncounters.test.js: 1 test
- organicEncounterUI.test.js: 1 test

Validation:
- Action audit: 49 dispatched, 62 handled cases ✅
- Content validation: 7 passed, 0 errors ✅
```

## Architecture

### Data Layer (`src/data/`)
- NPC schedules and profiles
- Location events and town texture
- Date templates and phases
- Furniture, housing, vehicles
- Careers, education, routines

### Simulation Layer (`src/sim/`)
- Time management
- Needs decay
- Date scoring and diminishing returns
- Relationship conflicts and repair
- Reputation system
- Compatibility calculation
- Matching probability

### State Layer (`src/state/`)
- Zustand store with reducer pattern
- Actions for all game domains
- Reducers for state transitions
- Selectors for derived data
- Persistence with save migrations

### UI Layer (`src/components/`)
- Dashboard with planner
- Map with organic encounters
- Swipe app for dating
- Date event UI
- Conflict repair panel
- Career, investment, and home management apps

---

*Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)*
