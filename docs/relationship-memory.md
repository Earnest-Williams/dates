# Relationship Memory System

**Life Sim** does not use a typical visual-novel gift-giving system; it replaces repeatable item affection loops with memory-driven relationship play. Relationship progress should come from shared time, meaningful choices, remembered context, compatibility, dates, routines, conflict/repair, and long-term follow-through. Items may appear as contextual story props, but they must not function as repeatable affection currency.

## State shape

Relationship memory is stored per NPC under `relationshipMemory`:

```js
relationshipMemory: {
  elena: {
    rememberedChoices: ['talked_about_history_books'],
    sharedActivities: ['library_evening'],
    promises: {
      attend_thesis_practice: 'pending'
    },
    importantMoments: ['helped_recover_research'],
    comfortKnown: ['quiet_support'],
    lastMeaningfulInteractionDay: 12
  }
}
```

## Progression sources

Relationship growth should come from:

- Conversations and stat-checked dialogue choices.
- Shared activities, routines, and dates.
- Compatibility and long-term fit.
- Remembered choices and comfort styles.
- Conflict, repair, promises, and follow-through.
- Cohabitation, proposal, legacy, and family reaction scenes that reference prior context.

## Contextual items rule

Items are allowed only when they are:

- Tied to a specific authored scene.
- Not repeatable affection currency.
- Not categorized into universal liked/loved/disliked lists.
- Not optimal romance commodities.
- Not purchasable as a generic relationship shortcut.

Allowed examples include bringing Elena a marked-up draft because she previously asked for thesis feedback, helping Chloe replace damaged art supplies during a story event, or buying coffee during a specific date scene because that scene supports it.

**Note**: Only female NPCs are currently romanceable in this version.

Disallowed examples include repeatedly buying books, watches, flowers, or chocolates for relationship points; any universal best-gift table; archetype item bonuses; or farming purchasable items for affection.
