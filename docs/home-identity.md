# Home Identity & Housing

Housing in Brockleighshire is an expression of the player's progression and personal style, tying directly into social encounters without functioning as a shallow gift system.

## 1. Housing Tiers
Players start on their parents' couch (Tier 0) and can rent increasingly expensive apartments (Tier 1 to 3) as their career and finances improve. Higher housing tiers unlock more `slots` for placing furniture.

## 2. Furniture as Identity, Not Gifts
We strictly avoid allowing players to buy "gifts" for NPCs to raise affection. Instead, furniture items represent the player's lifestyle choices.
- A `gas_range` allows better cooking.
- A `smart_tv` allows efficient mood recovery.
- A `luxury_painting` acts as a passive stat booster for Charm/Style.

## 3. NPC Impressions
When the player invites an NPC to their home for a date, the Date Engine checks the player's placed furniture.
Instead of checking if the player owns the NPC's "favorite item," the system analyzes the *aggregate vibe* of the apartment using `getNpcHomeStyleReaction` and applies a `connectionBonus` to the date's starting Vibe.

- **Comfortable**: The apartment layout aligns well with the NPC's core values. (+8 starting Vibe)
- **Curious**: The apartment is different from what they expect, but interesting. (+3 starting Vibe)
- **Clashing**: The apartment directly contradicts the NPC's comfort zone (e.g., highly chaotic/cheap furniture when they value order/status). (+0 starting Vibe)

This ensures that the home space feels like a meaningful narrative reflection of the player, rather than an optimization puzzle.
