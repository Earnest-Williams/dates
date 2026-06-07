# Adult Tone Guide

## Overview

The `dates` game supports adult romantic tension through **implication, secrecy, public/private stakes, and emotional consequence** — not explicit visual pornography. This document describes how the tone system works and how to author content that maintains the game's mature, narrative-driven approach to romance.

## Tone Metadata

### Scene Tags

Scene tags categorize the emotional and narrative context of a scene. Available tags:

- `secrecy` - Private moments, hidden from public view
- `temptation` - Situations with strong physical/emotional pull
- `late_night` - Scenes occurring in intimate, late-hour settings
- `public_risk` - Moments where discovery would have social consequences
- `private_invitation` - Explicit or implicit invitation to intimacy
- `emotional_hunger` - Deep need for connection or validation
- `near_confession` - Moments approaching vulnerability or revelation
- `reputation_pressure` - Social expectations weighing on the characters
- `afterparty_quiet` - Intimate moments after social events
- `longing` - Yearning, desire, unfulfilled need
- `vulnerability` - Emotional exposure, lowered defenses

### Tone Object

The tone object quantifies the intensity of adult romantic tension:

```javascript
tone: {
  heat: 0,       // Physical tension (0-10)
  implication: 0, // Suggestive subtext (0-10)
  emotionalRisk: 0, // Emotional vulnerability (0-10)
  publicRisk: 0   // Social/reputation risk (0-10)
}
```

**Guidelines:**
- `heat`: Physical intimacy and attraction. Higher values indicate more charged physical moments.
- `implication`: Suggestive language, subtext, what's left unsaid. Higher values indicate more layered communication.
- `emotionalRisk`: Emotional exposure, vulnerability. Higher values indicate deeper personal revelation.
- `publicRisk`: Risk of social consequences, reputation impact. Higher values indicate greater potential fallout.

**Important:** The tone object is **metadata only** for now. It informs UI, journal entries, and internal scene selection, but does not directly manipulate relationship or chemistry math.

## Route-Specific Tone Identity

Each romanceable NPC has a distinct tone identity that should be reflected in their scenes:

### Elena (SCHOLAR)
- **Theme:** Intellectual intimacy, restraint, ambition/shame
- **Tone Profile:** High emotionalRisk, moderate implication, low-moderate heat, low publicRisk
- **Key Tags:** vulnerability, secrecy, emotional_hunger, late_night
- **Narrative Focus:** Academic pressure, fear of losing control, vulnerability beneath competence

### Brad (GYM_RAT)
- **Theme:** Vulnerability beneath bravado, physical discipline, reassurance
- **Tone Profile:** High emotionalRisk, moderate heat, moderate implication, low publicRisk
- **Key Tags:** vulnerability, secrecy, emotional_hunger, late_night
- **Narrative Focus:** Physical strength masking emotional fragility, fear of irrelevance, raw honesty in private

### Sophia (SOCIALITE)
- **Theme:** Public/private identity, status pressure, being seen
- **Tone Profile:** High publicRisk, high implication, moderate heat, moderate emotionalRisk
- **Key Tags:** public_risk, secrecy, vulnerability, late_night, temptation
- **Narrative Focus:** Performance vs. authenticity, fear of exposure, choosing sincerity over status

### Marcus (EXECUTIVE)
- **Theme:** Control, overwork, late-night vulnerability
- **Tone Profile:** High emotionalRisk, moderate implication, moderate heat, moderate publicRisk
- **Key Tags:** vulnerability, secrecy, emotional_hunger, late_night
- **Narrative Focus:** Ruthless professionalism giving way to raw need, control slipping into intimacy

### Chloe (ARTIST)
- **Theme:** Creative vulnerability, quiet sincerity
- **Tone Profile:** High emotionalRisk, moderate implication, low-moderate heat, low publicRisk
- **Key Tags:** vulnerability, emotional_hunger, secrecy, late_night
- **Narrative Focus:** Artistic intensity, fear of intrusion, breathless tenderness

### Rina (SOCIALITE variant)
- **Theme:** Nightlife confidence, after-midnight honesty
- **Tone Profile:** High implication, high heat, moderate emotionalRisk, moderate publicRisk
- **Key Tags:** late_night, vulnerability, longing, temptation, public_risk
- **Narrative Focus:** Polished control shattering, raw physical intimacy, public persona vs. private desire

### Maya (ARTIST variant)
- **Theme:** Artistic curiosity, nature/study intimacy
- **Tone Profile:** High emotionalRisk, high implication, moderate heat, low publicRisk
- **Key Tags:** vulnerability, secrecy, emotional_hunger, late_night, longing
- **Narrative Focus:** Radical openness, fear of losing edge, intense physical connection

### Nora (EXECUTIVE variant)
- **Theme:** Professional pressure, competence, controlled vulnerability
- **Tone Profile:** High emotionalRisk, moderate heat, moderate implication, moderate publicRisk
- **Key Tags:** vulnerability, secrecy, emotional_hunger, late_night, temptation
- **Narrative Focus:** Discipline breaking into desire, ambition anchored by intimacy, control offered as devotion

## Content Authoring Rules

### Do:
1. **Use implication and subtext** - Let the player's imagination fill in the gaps
2. **Focus on emotional consequence** - Every intimate moment should have narrative weight
3. **Respect character psychology** - Each NPC's tone should reflect their personality and backstory
4. **Create memory and callback potential** - Adult scenes should generate lasting relationship context
5. **Maintain public/private contrast** - What happens in private should feel different from public interactions

### Do Not:
1. **Add explicit visual pornography** - No graphic visual descriptions
2. **Create explicit reward systems** - No "unlock explicit content" mechanics
3. **Use tone as a stat boost** - Tone metadata should not directly increase relationship/chemistry numbers
4. **Make all routes the same** - Each NPC should have distinct tone identity
5. **Separate romance from narrative** - Adult tension should always serve character and story

## Implementation Locations

Tone tags and metadata should be added to:

1. **ROMANCE_ARCS** - Trust and commitment events (already implemented)
2. **storyEvents** - Level 75 and 100 events (already implemented)
3. **DATE_TEMPLATES** - Date phases with adult tension (partially implemented)
4. **Repair scenes** - Intimate repair moments (to be implemented)
5. **Home scenes** - Private cohabitation moments (to be implemented)

## Validation

All tone metadata must:
- Use valid scene tags from the approved list
- Have tone values between 0-10
- Not be used to bypass relationship progression
- Not be tied to purchasable items or gifts
- Produce narrative, memory, reputation, or relationship consequences

## Testing

Tone system validation is covered by:
- `test/toneTags.test.js` (to be created)
- Content validation script (`scripts/validate-content.mjs`)

## Future Enhancements

The tone system is designed to be extended:
- UI indicators for tone intensity
- Journal entries that reflect tone context
- Reputation and jealousy systems that respond to publicRisk
- Callback systems that reference tone metadata
