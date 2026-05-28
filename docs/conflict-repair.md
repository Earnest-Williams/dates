# Conflict & Repair Mechanics

Unlike many dating sims where relationships only move in a positive direction, Brockleighshire embraces tension and disagreement.

## 1. Triggering Conflicts
Conflicts (`activeConflictId`) are triggered when:
- A date ends with a very low Vibe score (< 30).
- The player makes a dialogue choice tagged with a conflict payload.
- A Story Event goes poorly or the player fails a critical stat check that the NPC deeply cares about.

When an Active Conflict exists, relationship progression is soft-locked. The player cannot advance the relationship tier or successfully invite the NPC on standard dates until the conflict is repaired.

## 2. The Repair System
To resolve a conflict, the player must use the **Conflict & Repair UX** (accessible from the Relationships Dashboard).

Repairs are not guaranteed. Success depends on:
1. **Compatibility**: High compatibility provides a buffer, making apologies or space more effective.
2. **Contextual History (Pending Repair Scenes)**: If a specific argument occurred (e.g. `argument_about_work_life_balance`), the player might unlock a unique `pendingRepairScene`. Choosing this specific follow-up context has a much higher success rate than a generic "Apologize" option.
3. **Space vs Immediate Action**: Some NPCs react better to being given space (taking 0 game ticks, but requiring patience), while others respect a direct, immediate apology (costing game ticks/energy).

## 3. Post-Repair Memory
Successfully repairing a conflict doesn't just erase it—it is logged in `importantMoments` as a completed obstacle, which often unlocks deeper trust and pushes the relationship into a more authentic, mature phase.
