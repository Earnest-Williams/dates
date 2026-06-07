# Balance Scenarios

## Overview

Balance scenarios are deterministic playtest routes that verify no single strategy trivially dominates the game. These scenarios ensure that:

1. **No route bypasses relationship progression** through money, gifts, or exploits
2. **Multiple play styles are viable** with different trade-offs
3. **Long-term play generates meaningful memories, conflicts, and decisions**
4. **Legacy transitions don't explode wealth/stats**

## Scenario Types

### 1. Work-Only Route
**Goal:** Verify that focusing only on career doesn't trivialize romance or legacy pacing.

**Actions:**
- Work every available shift
- Study to increase corporate stat
- Minimal social interaction
- No dating

**Expected Outcomes (Day 30):**
- High corporate stat and money
- Low relationship progression
- Few or no memories created
- No conflicts or repairs
- Legacy stat total: moderate (from career only)

**Validation:**
- Relationship max < 30 with any NPC
- Number of memories < 5
- Number of conflicts = 0
- Heir stat total < 500

### 2. Finance/Investment Rush
**Goal:** Verify that investment-focused play doesn't bypass romance pacing.

**Actions:**
- Invest all available money
- Minimal dating
- Minimal social interaction
- Focus on market timing

**Expected Outcomes (Day 60):**
- High net worth
- Low relationship progression
- Few memories created
- No deep relationships
- Legacy stat total: moderate (from investments only)

**Validation:**
- Net worth > $5000
- Relationship max < 40 with any NPC
- Number of serious partners = 0
- Heir stat total < 600

### 3. Premium Swipe Rush
**Goal:** Verify that Instant Match doesn't bypass normal relationship progression.

**Actions:**
- Use Instant Match for all discoveries
- Minimal organic encounters
- Minimal date investment
- Focus on quantity over quality

**Expected Outcomes (Day 30):**
- Many contacts but shallow relationships
- Low relationship depth
- Few memories per NPC
- No conflicts (due to low investment)
- No cohabitation or proposal readiness

**Validation:**
- Number of met NPCs > 10
- Average relationship score < 20
- Number of memories per NPC < 2
- No NPC at story tier > 1

### 4. Relationship Rush
**Goal:** Verify that focusing on one relationship doesn't break pacing.

**Actions:**
- Focus on one NPC
- Date frequently
- Complete all story chapters
- Minimal other activities

**Expected Outcomes (Day 60):**
- One deep relationship
- Many memories with that NPC
- Some conflicts and repairs
- Moderate stat growth
- Proposal readiness possible

**Validation:**
- One NPC with relationship > 80
- Number of memories with that NPC > 10
- Number of conflicts > 0
- Number of repairs > 0
- Heir stat total: moderate

### 5. Multi-Partner Route
**Goal:** Verify that multi-partner play is possible but has social consequences.

**Actions:**
- Date multiple NPCs simultaneously
- Public dates in overlapping circles
- Minimal repair attempts
- Accept social consequences

**Expected Outcomes (Day 60):**
- Multiple relationships at moderate depth
- Reputation penalties in affected circles
- Conflicts from jealousy
- Few successful repairs
- Legacy stat total: moderate with penalties

**Validation:**
- Number of partners with relationship > 50 >= 3
- Average reputation in affected circles < 0
- Number of conflicts > 5
- Number of unresolved conflicts > 0
- Heir stat total < 700 (penalty applied)

### 6. Housing Rush
**Goal:** Verify that focusing on housing doesn't bypass relationship requirements.

**Actions:**
- Upgrade housing as soon as possible
- Buy expensive furniture
- Minimal dating
- Minimal social interaction

**Expected Outcomes (Day 60):**
- High housing tier
- Many furniture pieces
- Low relationship progression
- Few memories created
- Legacy stat total: moderate (from housing only)

**Validation:**
- Housing tier >= 3
- Number of furniture pieces > 15
- Relationship max < 30 with any NPC
- Number of memories < 10
- Heir stat total < 600

### 7. Legacy Rush
**Goal:** Verify that legacy-focused play doesn't create runaway stat inflation.

**Actions:**
- Maximize all stats
- Complete all legacy requirements
- Minimal relationship depth
- Focus on heir stat total

**Expected Outcomes (Day 120):**
- All stats > 80
- Many legacy achievements
- Shallow relationships
- Heir stat total capped appropriately

**Validation:**
- All stats > 80
- Number of legacy achievements > 20
- Average relationship score < 30
- Heir stat total < 1500 (capped)

### 8. Balanced Life Route
**Goal:** Verify that balanced play is viable and rewarding.

**Actions:**
- Mix of work, dating, and social activities
- Date 2-3 NPCs seriously
- Complete some legacy requirements
- Maintain relationships

**Expected Outcomes (Day 60):**
- Moderate stat growth
- 2-3 deep relationships
- Many memories created
- Some conflicts and repairs
- Good heir stat total

**Validation:**
- Average stat > 40
- Number of partners with relationship > 60 >= 2
- Number of memories > 20
- Number of conflicts > 2
- Number of repairs > 2
- Heir stat total > 600

### 9. Organic Encounter Only Route
**Goal:** Verify that organic encounters provide a viable path to relationships.

**Actions:**
- No swipe app usage
- Only organic encounters
- Follow up on all encounter opportunities
- Minimal Instant Match

**Expected Outcomes (Day 60):**
- All romanceable NPCs discovered
- Moderate relationship progression
- Many organic memories
- Good social integration

**Validation:**
- All 8 main NPCs met
- Average relationship score > 30
- Number of organic memories > 15
- Number of promises > 5

### 10. Swipe-Heavy Route
**Goal:** Verify that swipe app provides efficient discovery without bypassing progression.

**Actions:**
- Use swipe app for all discoveries
- Follow up with dates
- Complete relationship arcs
- Minimal organic encounters

**Expected Outcomes (Day 60):**
- All romanceable NPCs discovered
- Moderate relationship progression
- Many date-based memories
- Good social integration

**Validation:**
- All 8 main NPCs met
- Average relationship score > 30
- Number of date memories > 15
- Number of completed chapters > 10

## Metrics Tracked

All scenarios track the following metrics:

### Relationship Metrics
- Relationship progression speed (per day)
- Number of memories created
- Number of promises created/kept/broken
- Number of conflicts triggered
- Repair success/failure rate

### Economic Metrics
- Net worth
- Debt
- Housing tier
- Number of furniture pieces

### Social Metrics
- Number of serious partners
- Reputation in each circle
- Jealousy triggers
- Gossip events

### Legacy Metrics
- Heir stat total
- Number of legacy achievements
- Legacy inheritance value

### Gameplay Metrics
- Date repetition count
- Unresolved promises
- Eviction count
- Collapse count

## Test Implementation

Balance scenarios are implemented in:
- `test/balance/day30.test.js`
- `test/balance/day60.test.js`
- `test/balance/day120.test.js`
- `test/balance/multiPartner.test.js`
- `test/balance/legacyInheritance.test.js`

Each test file contains:
- Scenario setup (initial state)
- Action sequence
- Expected outcomes
- Validation assertions

## Running Balance Tests

```bash
# Run all balance tests
npm run validate:content

# Run specific balance test
NODE_OPTIONS="--max-old-space-size=8192" node --test test/balance/day30.test.js
```

## Design Principles

1. **No Trivial Dominant Strategy** - Every route should have trade-offs
2. **Relationships Require Investment** - Money cannot bypass time and attention
3. **Consequences for Exploits** - Multi-partner, gift-spamming, and other exploits should have costs
4. **Long-Term Viability** - All routes should be playable for 120+ days
5. **Memory and Narrative** - All routes should generate meaningful stories

## Future Scenarios

- Career-first route with late romance
- Investment-first route with mid-game pivot
- Single committed route to marriage
- Multi-partner route with repair focus
- Minimalist route (low spending, low stats)
- Completionist route (all content)
