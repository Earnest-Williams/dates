# The Date Engine

Dates in Brockleighshire are multi-phase, authored experiences designed to build narrative memories rather than just outputting numbers. 

## 1. Multi-Phase Structure
Dates consist of 3 distinct phases. A player progresses by choosing a dialogue or action response in each phase.
1. **Initial Phase:** Setting the scene and first impressions.
2. **Escalation Phase:** The core interaction (often requiring a Stat Check).
3. **Resolution Phase:** Determining the outcome and memory formed.

## 2. Vibe / Connection Score
During the date, choices affect the `connectionScore` (often referred to as 'Vibe').
- **>= 80 Vibe**: Exceptional date. Yields highest Relationship and Chemistry gains. Often creates a "Memorable Date" moment.
- **50 - 79 Vibe**: Good date. Standard relationship growth.
- **30 - 49 Vibe**: Mediocre date. Very small relationship growth, chemistry stays stagnant.
- **< 30 Vibe**: Bad date. Leads to relationship penalties and potentially sparks an Active Conflict.

## 3. Diminishing Returns
The Date Engine enforces a strictly diminishing return curve to prevent players from spamming the same date activity over and over to min-max relationship scores.
- **1st Time**: Full reward.
- **2nd Time**: 50% reward.
- **3rd Time**: 25% reward.
- **4th+ Time**: 0% reward (and triggers a negative memory / bored response).

## 4. Authored Choice Consequences
Date choices are not purely numeric. They contain payloads that map to the NPC's `relationshipMemory`:
```javascript
{
  text: "Defend their boundaries to the rude stranger",
  relationship: 5,
  memory: "defended_boundaries",
  discovery: "appreciates_direct_confrontation"
}
```
At the end of the date, these payloads are injected into the persistent `relationshipMemory` and are later referenced during Story Events or Conflict Repairs.
