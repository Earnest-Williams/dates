# Content Validation

## Overview

Content validation ensures that all game content adheres to schema requirements, anti-goal rules, and design constraints. This prevents regressions, catches errors early, and maintains consistency across the codebase.

## Validation Layers

### 1. Schema Validation

Validates that all content has the required structure and valid values.

**Files:**
- `test/content/npcArcSchema.test.js` - Validates NPC romance arc structure
- `test/content/dateTemplateSchema.test.js` - Validates date template structure
- `test/content/repairSceneSchema.test.js` - Validates repair action structure
- `test/content/homeActivitySchema.test.js` - Validates home activity structure
- `test/content/toneTags.test.js` - Validates tone tag metadata

**What it checks:**
- Required fields are present
- Field types are correct
- Enum values are valid
- Arrays have minimum lengths
- Numeric values are in range

### 2. Anti-Gift Regression Validation

Validates that no content creates gift-loop exploits.

**Files:**
- `test/noGiftRegression.test.js` - Main anti-gift tests
- `scripts/validate-content.mjs` - Content validation script

**What it checks:**
- Items don't grant relationship points
- Furniture doesn't define romance shortcuts
- NPCs don't have gift preference tables
- Date templates don't include repeatable gift progression
- Repair scenes don't use generic purchased items
- Home activities don't function as disguised affection purchases
- Shopping paths cannot directly advance romance

### 3. Reference Validation

Validates that all references (callbacks, memories, locations) are valid.

**Files:**
- `test/content/noOrphanCallbacks.test.js` - Validates callback references
- `scripts/validate-content.mjs` - Validates memory and location references

**What it checks:**
- All `futureCallback` references exist in `choiceCallbacks`
- All `unlocksMemory` references are valid
- All `checkMemory` references are valid
- All location references are valid
- All date template venueKeys are valid

### 4. Tone Tag Validation

Validates that tone tags are used correctly.

**Files:**
- `test/toneTags.test.js` - Comprehensive tone tag validation
- `scripts/validate-content.mjs` - Scene tag validation

**What it checks:**
- All tone objects have required properties (`heat`, `implication`, `emotionalRisk`, `publicRisk`)
- Tone values are numbers between 0-10
- Scene tags are from the approved list
- Tone tags don't bypass relationship progression
- sceneTags are present where tone exists
- Route-specific tone identity is maintained

## Running Validation

### Run All Tests

```bash
npm test
```

This runs all tests including:
- Schema validation tests
- Anti-gift regression tests
- Tone tag tests
- Content structure tests

### Run Content Validation Script

```bash
npm run validate:content
```

This runs the comprehensive content validation script that checks:
- NPC romance arcs
- Date templates
- No gift-loop regressions
- Callback references
- Memory references
- Location references
- Scene tags

### Run Specific Test Files

```bash
# Schema validation
NODE_OPTIONS="--max-old-space-size=8192" node --test test/content/

# Tone tags
NODE_OPTIONS="--max-old-space-size=8192" node --test test/toneTags.test.js

# No gift regression
NODE_OPTIONS="--max-old-space-size=8192" node --test test/noGiftRegression.test.js
```

## Validation Rules

### NPC Romance Arcs

Each romance arc must have:
- `id` - Unique identifier following `{npcId}_{type}` pattern
- `type` - One of: `introduction`, `early connection`, `personal reveal`, `conflict`, `trust event`, `commitment event`
- `minRelationship` - Number between 0-100, increasing with arc progression
- `title` - String description
- `prompt` - String scenario text
- `emotionalBeat` - String describing the emotional core
- `choices` - Array with at least 1 choice

Each choice must have:
- `text` - String choice text
- At least one of: `relationshipImpact`, `chemistryImpact`, `relationship`, `chemistry`
- Optional: `unlocksMemory`, `futureCallback`, `checkStat`, `threshold`, `onSuccess`, `onFail`, `tone`

### Date Templates

Each date template must have:
- `phases` - Array of phase objects
- Optional: `venueKey` - Valid location key

Each phase must have:
- `id` - One of: `arrival`, `shared_activity`, `closing_moment`
- `title` - String
- `prompt` - String
- `choices` - Array with at least 3 choices

### Tone Tags

Tone objects must have:
- `heat` - Number 0-10 (physical tension)
- `implication` - Number 0-10 (suggestive subtext)
- `emotionalRisk` - Number 0-10 (emotional vulnerability)
- `publicRisk` - Number 0-10 (social/reputation risk)

Scene tags must be from the approved list:
- `secrecy`
- `temptation`
- `late_night`
- `public_risk`
- `private_invitation`
- `emotional_hunger`
- `near_confession`
- `reputation_pressure`
- `afterparty_quiet`
- `longing`
- `vulnerability`

### Anti-Gift Rules

The following are **never allowed**:
- Items with `relationship`, `relationshipBonus`, or `relationshipPoints` properties
- Furniture with `favoriteNpc`, `relationshipBonus`, or `relationshipPoints` properties
- NPCs with `giftPreferences`, `lovedGifts`, `likedGifts`, or `dislikedGifts` properties
- Date templates with gift-based relationship progression
- Repair scenes that use generic purchased items as conflict clears
- Home activities that function as disguised affection purchases
- Shopping paths that can directly advance romance

## Content Authoring Checklist

Before committing new content, verify:

### NPC Arcs
- [ ] All required fields present
- [ ] Arc types are unique per NPC
- [ ] minRelationship values are increasing
- [ ] Each arc has at least 2 choices
- [ ] At least one choice has no stat check (non-stat path)
- [ ] Choices have relationship/chemistry outcomes
- [ ] Choices create memory or callback potential
- [ ] Emotional beat is reflected in prose
- [ ] No repeatable gift logic
- [ ] No generic purchased repair

### Date Templates
- [ ] All required fields present
- [ ] Phases follow order: arrival → shared_activity → closing_moment
- [ ] Each phase has at least 3 choices
- [ ] Choices have valid impact values
- [ ] venueKey references valid location

### Tone Tags
- [ ] Tone objects have all 4 properties
- [ ] Tone values are 0-10
- [ ] sceneTags are from approved list
- [ ] sceneTags present where tone exists
- [ ] Tone doesn't bypass relationship progression
- [ ] Route-specific tone identity maintained

### References
- [ ] All futureCallback references exist in choiceCallbacks
- [ ] All unlocksMemory references are valid
- [ ] All checkMemory references are valid
- [ ] All location references are valid

## CI Integration

All validation runs in CI:

```yaml
# In .github/workflows/ci.yml
- name: Run tests
  run: npm test

- name: Validate content
  run: npm run validate:content
```

## Error Handling

When validation fails:
1. **Errors** - Must be fixed before merging
2. **Warnings** - Should be addressed, but may be acceptable
3. **Info** - Informational only

### Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Missing required field | Content missing a required property | Add the missing field |
| Invalid enum value | Using a value not in the allowed list | Use a valid value |
| Orphaned callback | Callback referenced but not defined | Define the callback or remove the reference |
| Invalid location | Location key doesn't exist | Use a valid location key |
| Tone property missing | Tone object missing a property | Add all 4 tone properties |
| Tone out of range | Tone value < 0 or > 10 | Clamp to 0-10 |
| Gift regression | Content creates gift-based romance | Remove gift-based progression |

## Future Enhancements

- **Automated content linting** - Pre-commit hooks
- **Visual validation reports** - HTML output with error locations
- **Content preview** - In-game content browser with validation overlay
- **Schema versioning** - Track content schema changes over time
