# Save Migrations

## Overview

The save system uses **versioned payloads** to ensure backward compatibility when state shape changes. Every time the game state structure changes, the save version is incremented and migration tests are added.

## Current Save Version

The current save version is tracked in `src/state/persistence.js`:

```javascript
export const SAVE_VERSION = X;
```

## Migration System

### State Shape Changes

When adding new fields to the game state, follow these rules:

1. **Additive changes** (new fields) - No migration needed, old saves will have `undefined` for new fields
2. **Structural changes** (renamed/deleted fields) - Require migration
3. **Type changes** (string to number, etc.) - Require migration

### Migration Tests

All migrations must have corresponding tests in `test/saveMigration.test.js` that verify:
- Old saves can be loaded
- New fields get sensible defaults
- No data loss occurs
- Corrupt/missing fields are handled safely

## Migration History

### Version 1 → 2: Feature Flags

**Changes:**
- Added `features` object to root state
- Added feature flags for new systems

**Migration:**
```javascript
if (saveVersion < 2) {
  state.features = {
    organicEncounters: false,
    compatibilityRevealUx: false,
    instantMatchRebalance: false,
    relationshipJournal: false,
    reputationSpillover: false,
    dailyPlannerUx: false,
    marketRiskControls: false,
    adultToneTags: false,
  };
}
```

**Tests:**
- Verify old saves without features object get defaults
- Verify feature flags persist correctly

### Version 2 → 3: Extended Match State

**Changes:**
- Extended `matches[npcId]` with new fields:
  - `activeConflictId`
  - `pendingRepairScene`
  - `repairHistory`
  - `lastDateQuality`
  - `compatibilityScore`
  - `relationshipStage`
  - `exclusivityExpectation`
  - `publicKnowledge`

**Migration:**
```javascript
if (saveVersion < 3) {
  for (const npcId of Object.keys(state.matches || {})) {
    const match = state.matches[npcId];
    match.activeConflictId = match.activeConflictId || null;
    match.pendingRepairScene = match.pendingRepairScene || null;
    match.repairHistory = match.repairHistory || [];
    match.lastDateQuality = match.lastDateQuality || null;
    match.compatibilityScore = match.compatibilityScore || null;
    match.relationshipStage = match.relationshipStage || 'matched';
    match.exclusivityExpectation = match.exclusivityExpectation || 'unknown';
    match.publicKnowledge = match.publicKnowledge || 0;
  }
}
```

**Tests:**
- Verify old matches get new fields with defaults
- Verify new fields don't break existing relationships

### Version 3 → 4: Relationship Events

**Changes:**
- Added `relationshipEvents` object to track historical events

**Migration:**
```javascript
if (saveVersion < 4) {
  state.relationshipEvents = {};
}
```

**Tests:**
- Verify old saves get empty relationshipEvents object
- Verify relationshipEvents persists correctly

### Version 4 → 5: Reputation System

**Changes:**
- Added `reputation` object with circle-specific scores

**Migration:**
```javascript
if (saveVersion < 5) {
  state.reputation = {
    coworkers: 0,
    friends: 0,
    nightlife: 0,
    creative: 0,
    academic: 0,
    exes: 0,
  };
}
```

**Tests:**
- Verify old saves get default reputation scores
- Verify reputation persists correctly

### Version 5 → 6: Planner State

**Changes:**
- Added `planner` state for daily planning

**Migration:**
```javascript
if (saveVersion < 6) {
  state.planner = {
    warnings: [],
    opportunities: [],
    lastPlannedDay: 0,
  };
}
```

**Tests:**
- Verify old saves get default planner state
- Verify planner state persists correctly

## Migration Test Structure

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateSave } from '../src/state/persistence';

test('Save Migration Tests', async (t) => {
  await t.test('migrates version 1 to current', () => {
    const oldSave = {
      version: 1,
      // ... old state without features
    };
    const migrated = migrateSave(oldSave);
    assert.ok(migrated.features, 'Features should be added');
    assert.strictEqual(migrated.version, SAVE_VERSION, 'Version should be updated');
  });
  
  await t.test('migrates version 2 to current', () => {
    const oldSave = {
      version: 2,
      features: { organicEncounters: false },
      matches: { elena: { met: true, relationship: 10 } }
      // ... missing new match fields
    };
    const migrated = migrateSave(oldSave);
    assert.ok(migrated.matches.elena.activeConflictId === null, 'Active conflict should default to null');
    assert.ok(migrated.matches.elena.compatibilityScore === null, 'Compatibility should default to null');
  });
  
  await t.test('handles corrupt saves safely', () => {
    const corruptSave = {
      version: 999, // Future version
      // ... possibly missing fields
    };
    const migrated = migrateSave(corruptSave);
    // Should not throw, should handle gracefully
    assert.ok(migrated, 'Migration should not throw on corrupt save');
  });
});
```

## Adding a New Migration

When adding a new state field or changing state structure:

1. **Increment SAVE_VERSION** in `src/state/persistence.js`
2. **Add migration logic** in the `migrateSave()` function
3. **Add migration tests** in `test/saveMigration.test.js`
4. **Verify all tests pass**

### Example: Adding a New Field

```javascript
// In src/state/persistence.js
export const SAVE_VERSION = 7; // Increment from 6

function migrateSave(savedState) {
  let state = { ...savedState };
  
  // Previous migrations...
  
  if (state.version < 7) {
    // Add new field with default
    state.newField = defaultValue;
  }
  
  state.version = SAVE_VERSION;
  return state;
}
```

### Example: Renaming a Field

```javascript
if (state.version < 7) {
  // Rename oldField to newField
  if ('oldField' in state) {
    state.newField = state.oldField;
    delete state.oldField;
  }
}
```

## Active State Migration

Some state changes require **active migration** during gameplay:

- **Active date events** - Must be resumable or collapsible
- **Active conflicts** - Must be resumable or collapsible
- **Active repairs** - Must be resumable or collapsible
- **Active organic encounters** - Must be resumable or collapsible

These are handled in the reducer and should:
1. Serialize to save state
2. Deserialize from save state
3. Handle missing/corrupt data gracefully
4. Provide fallback behavior (collapse to dashboard)

## Testing Save/Load

### Manual Test Cases

1. **New game** - Verify initial state is correct
2. **Save mid-date** - Verify date can be resumed
3. **Save with active conflict** - Verify conflict can be resumed
4. **Save with active repair** - Verify repair can be resumed
5. **Save with organic encounter** - Verify encounter can be resumed
6. **Save during cohabitation** - Verify cohabitation state persists
7. **Save during marriage** - Verify marriage state persists
8. **Save during legacy transition** - Verify legacy state persists

### Automated Tests

Run all save/load tests:
```bash
npm test
npm run saveMigration.test.js
```

## Best Practices

1. **Always version your saves** - Never change state shape without versioning
2. **Always add migration tests** - Every version increment needs tests
3. **Never delete fields** - Deprecate instead, clean up in future versions
4. **Use sensible defaults** - New fields should have defaults that don't break gameplay
5. **Handle missing data gracefully** - Old saves should work with new code
6. **Test edge cases** - Corrupt saves, future versions, partial data

## Future Migrations

Planned future migrations:
- Cohabitation state
- Marriage state
- Legacy transition state
- Expanded planner state
- Relationship journal state
