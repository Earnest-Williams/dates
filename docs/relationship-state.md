# Relationship State & Memory Engine

Brockleighshire uses a bespoke "Relationship-Memory-First" architecture. We strictly reject traditional gift-based affection climbing or repeating rote actions to fill a relationship bar.

## 1. Core Principles
* **No Gift-Affection Loop:** Furniture, items, or money do not directly grant relationship points. They only change the player's personal context (e.g., housing tier, stats).
* **Context over Repetition:** Repeating the same date or interaction yields diminishing returns. NPCs value progression and novel experiences over grinding.
* **Memory is State:** Real relationship progression is driven by the `relationshipMemory` object, which logs what the player chose during authored narrative scenes.

## 2. The `relationshipMemory` Object
Every met NPC maintains a memory context tracking decisions the player has made.
```json
{
  "elena": {
    "rememberedChoices": ["helped_library_volunteers", "defended_boundaries"],
    "sharedActivities": ["date_library", "date_park"],
    "promises": { "will_read_recommendation": "pending" },
    "importantMoments": ["memorable_date", "conflict_library_noise"],
    "comfortKnowns": ["attentive_support"],
    "lastMeaningfulInteractionDay": 12
  }
}
```

## 3. The `matches` Object
While `relationshipMemory` tracks the narrative "why", the `matches` state holds the "what" (numeric boundaries and tier locks).
```json
{
  "elena": {
    "met": true,
    "relationship": 45, // Capped at thresholds (e.g., 25, 50, 75, 100) until story events unlock them
    "chemistry": 30, // Affects the multiplier of relationship gains
    "dateCount": 2,
    "storyTier": 1, // Represents unlocking deeper intimacy limits
    "activeConflictId": null,
    "pendingRepairScene": null
  }
}
```

## 4. Relationship Caps & Story Tiers
Relationship points are capped by the NPC's `storyTier`. A player cannot grind past a cap; they must trigger and successfully navigate a unique Story Event to increase the tier.

* Tier 0: Cap 25
* Tier 1: Cap 50
* Tier 2: Cap 75
* Tier 3: Cap 100

This enforces narrative pacing and prevents the player from brute-forcing intimacy.
