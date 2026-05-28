# NPC Content Authoring Guide

## Relationship progression rule

dates intentionally does not include a typical visual-novel gift-giving system. Relationship progress should come from shared time, meaningful choices, remembered context, compatibility, dates, routines, conflict/repair, and long-term follow-through. Items may appear as contextual story props, but they must not function as repeatable affection currency.

Do not author NPC loved/liked/disliked gift tables, archetype item bonuses, gift multipliers, repeatable gift penalties, gift farming loops, or “give X to NPC for +relationship” content.

## Authoring relationship memory

When writing NPC scenes, prefer memory hooks such as:

- A topic the player paid attention to.
- A routine or place the NPC and player shared.
- A promise the player made and later kept or broke.
- A conflict trigger and a repair option.
- A comfort style the NPC responds to.
- A long-term compatibility or family-context reaction.

Contextual props are valid only when they belong to a specific authored beat and cannot be repeated as affection currency.

## Current NPC depth schema

Before adding more romanceable characters, the current core cast (`elena`, `brad`, `sophia`, `marcus`, and `chloe`) must each define the following authored fields in `src/data/npcs.js`:

- `hiddenCompatibilityTraits`: ambition, affection, conflict, social, family, spending, emotional openness, and long-term goal dimensions.
- `relationshipMemories`: concrete memory keys that later scenes can reference.
- `preferredDateTypes`: at least two non-gift date templates.
- `conflictEvent`: one route conflict with a trigger, memory checks, compatibility checks, timing window, and `doesNotHardFailRoute: true`.
- `repairEvent`: one contextual repair path using apology, space, follow-through, thoughtful activity, meaningful place, friend advice, written message, specific help, or quiet time. Success should depend on memories, compatibility, timing, and prior behavior.
- `homeReaction`, `locationBasedEncounter`, `longTermRelationshipScene`, and `legacyFamilyReaction`.
- `choiceCallbacks`: at least three callback keys for earlier player choices.

Conflict triggers can come from ignored messages, incompatible choices, low mood, jealousy or social reputation, missed planned dates, poor date endings, ambition mismatch, home/lifestyle mismatch, broken promises, and repeated inattentive dialogue. Do not use bad gifts as a standard conflict trigger.

Repair must not be reducible to shopping. Valid contextual item use includes replacing Chloe's damaged supplies during that specific authored repair, bringing Marcus notes from a meeting because the player promised to help, or making dinner at home after a stressful week. Disallowed patterns include apology flowers for relationship points, preferred items that clear conflict, universal repair gifts, and repeatable gift-giving.
