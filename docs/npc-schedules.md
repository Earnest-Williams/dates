# NPC Schedules

## Overview

NPC schedules determine when and where NPCs appear for organic encounters. The system uses **time-based scheduling** combined with **location texture** to create dynamic, believable NPC movement patterns.

## Schedule System

### Core Components

1. **NPC_SCHEDULE** - Defines which NPCs appear at which locations and times
2. **LOCATION_EVENTS** - Special events that affect NPC availability
3. **TIME_OF_DAY_LOCATION_TEXTURE** - Descriptions of locations at different times
4. **getNpcEncounters()** - Main function to get available encounters

### Data Files

- `src/data/townTexture.js` - Contains all schedule and location data
- `src/data/npcs.js` - Contains NPC definitions
- `src/data/locations.js` - Contains location definitions

## NPC Schedule Structure

### NPC_SCHEDULE

```javascript
export const NPC_SCHEDULE = {
  library: {
    morning: ['elena', 'maya'],
    afternoon: ['elena', 'chloe'],
    evening: ['elena'],
    night: []
  },
  gym: {
    morning: ['brad'],
    afternoon: ['brad', 'nora'],
    evening: ['brad'],
    night: []
  },
  // ... more locations
};
```

Each location has a schedule for each time of day (morning, afternoon, evening, night) listing which NPCs can be encountered there.

### LOCATION_EVENTS

```javascript
export const LOCATION_EVENTS = {
  library: {
    morning: 'Quiet study sessions',
    afternoon: 'Group projects and research',
    evening: 'Late-night cramming',
    night: 'Closed'
  },
  // ... more locations
};
```

Location events provide flavor text and may affect encounter availability.

### TIME_OF_DAY_LOCATION_TEXTURE

```javascript
export const TIME_OF_DAY_LOCATION_TEXTURE = {
  library: {
    morning: "Focused students and retirees make the reading room bright and orderly.",
    evening: "Late lamps and closing carts make quiet conversations feel personal."
  },
  // ... more locations
};
```

This provides atmospheric descriptions for each location at different times.

## Time System

The game uses a **24-hour clock** divided into time buckets:

- **Morning:** 6:00 - 11:59
- **Afternoon:** 12:00 - 17:59
- **Evening:** 18:00 - 23:59
- **Night:** 0:00 - 5:59

### Time Functions

```javascript
// Get current time of day
export const getTimeOfDay = (hour) => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 24) return 'evening';
  return 'night';
};

// Get NPC encounters for current time/location
export const getNpcEncounters = (time, locationKey) => {
  const timeOfDay = getTimeOfDay(time);
  const npcs = NPC_SCHEDULE[locationKey]?.[timeOfDay] || [];
  return npcs.map(npcId => ({ npcId, location: locationKey, timeOfDay }));
};
```

## NPC Availability

### Base NPCs (Core Romanceable)

| NPC | Primary Locations | Best Times | Notes |
|-----|------------------|------------|-------|
| Elena | library, university | morning, afternoon | Studying, research |
| Sophia | mall, nightclub | afternoon, evening | Shopping, socializing |
| Chloe | park, art gallery | afternoon, evening | Painting, relaxing |
| Rina | nightclub, lounge | evening, night | Working, socializing |
| Maya | park, studio | afternoon, evening | Photography, art |
| Nora | bakery, kitchen | morning, afternoon | Cooking, baking |

### Phase 2 NPCs

Phase 2 NPCs use a **generic schedule** via `makePhase2RomanceArc()`:
- Available at: library, gym, park, office, club, home
- Times: morning, afternoon, evening
- Less frequent than core NPCs

## Encounter System

### Organic Encounters

Organic encounters are triggered when:
1. Player is at a location with scheduled NPCs
2. Current time matches the NPC's schedule
3. NPC is not already in an active encounter
4. Random chance (configurable)

### Encounter Data

Each encounter has:
- `npcId` - The NPC being encountered
- `location` - Where the encounter takes place
- `timeOfDay` - When the encounter occurs
- `scenario` - Description of the encounter
- `reveals` - What the player notices about the NPC
- `choices` - Available actions

### Example Encounter

```javascript
{
  npcId: 'elena',
  location: 'library',
  timeOfDay: 'morning',
  scenario: "Elena is deeply focused on her research, her brow furrowed in concentration.",
  reveals: 'academic_focus',
  choices: [
    { text: "Ask about her research", relationship: 5, chemistry: 3, discovery: 'elena_research_topic' },
    { text: "Offer to help", relationship: 3, chemistry: 5, callback: 'elena_library_help' },
    { text: "Let her work", relationship: 0, chemistry: 0 }
  ]
}
```

## Location-Based Encounters

### Library
- **Morning:** Elena, Maya (studying, research)
- **Afternoon:** Elena, Chloe (reading, sketching)
- **Evening:** Elena (late-night study)
- **Night:** Closed

### Gym
- **Morning:** Brad (workout)
- **Afternoon:** Brad, Nora (training, prep)
- **Evening:** Brad (evening workout)
- **Night:** Closed

### Park
- **Morning:** Chloe, Maya (sketching, photography)
- **Afternoon:** Chloe, Maya, Marcus (relaxing, walking)
- **Evening:** Chloe, Maya (sunset, golden hour)
- **Night:** Rina (after-hours)

### Mall
- **Morning:** Sophia (shopping)
- **Afternoon:** Sophia, Rina (shopping, errands)
- **Evening:** Sophia, Rina (social shopping)
- **Night:** Closed

### Office
- **Morning:** Marcus, Nora (work)
- **Afternoon:** Marcus, Nora (meetings, prep)
- **Evening:** Marcus (overtime)
- **Night:** Marcus (late work)

### Nightclub
- **Morning:** Closed
- **Afternoon:** Closed
- **Evening:** Sophia, Rina (socializing, working)
- **Night:** Sophia, Rina (partying, after-hours)

### Home
- **Morning:** All (waking up, breakfast)
- **Afternoon:** All (relaxing, chores)
- **Evening:** All (dinner, relaxing)
- **Night:** All (late-night, sleeping)

## Special Encounters

### Story Events

NPCs have **storyEvents** at specific relationship levels (25, 50, 75, 100) that trigger special encounters:

```javascript
storyEvents: {
  25: { prompt: "Elena needs help proofreading her thesis.", statCheck: "intelligence", threshold: 40, ... },
  50: { prompt: "Elena's laptop crashed!", statCheck: "programming", threshold: 30, ... },
  75: { prompt: "Elena is presenting her thesis but having a panic attack.", ... },
  100: { prompt: "Elena pulls you into her study...", ... }
}
```

### Location Events

Location events affect encounter availability and tone:

- **Library:** Book sale, study groups
- **Gym:** Challenge day, new equipment
- **Park:** Market, outdoor concert
- **Mall:** Discount weekend, holiday sale
- **Office:** Networking mixer, deadline crunch
- **Nightclub:** Guest-list night, VIP event
- **Home:** Rainy evening, quiet night in

## Implementation Details

### getNpcEncounters()

The main function to get available encounters:

```javascript
export const getNpcEncounters = (time, locationKey) => {
  const timeOfDay = getTimeOfDay(time);
  const npcs = NPC_SCHEDULE[locationKey]?.[timeOfDay] || [];
  
  return npcs.map(npcId => {
    const npc = NPCS.find(n => n.id === npcId);
    if (!npc) return null;
    
    return {
      npcId,
      location: locationKey,
      timeOfDay,
      scenario: getEncounterScenario(npcId, locationKey, timeOfDay),
      reveals: getEncounterReveals(npcId, locationKey, timeOfDay),
      choices: getEncounterChoices(npcId, locationKey, timeOfDay)
    };
  }).filter(Boolean);
};
```

### Encounter Selection

When multiple NPCs are available at a location/time:
1. Filter by player's current state (met, not in conflict, etc.)
2. Random selection with weights based on:
   - NPC compatibility
   - Player's relationship with NPC
   - Location/Time appropriateness
   - Story progression needs

## Testing

NPC schedules are tested in:
- `test/organicEncounters.test.js` - Tests encounter generation
- `test/organicEncounterUI.test.js` - Tests encounter UI
- `test/phase2NpcIntegration.test.js` - Tests Phase 2 NPC integration

## Future Enhancements

- **Dynamic schedules** - NPCs move between locations based on time/story
- **Memory-based encounters** - NPCs remember past interactions and reference them
- **Promise-based encounters** - NPCs appear based on promises made
- **Conflict-based encounters** - NPCs seek you out to resolve conflicts
- **Reputation-based encounters** - NPC availability affected by reputation
- **Weather-based encounters** - Different encounters in rain, snow, etc.
- **Seasonal encounters** - Holiday-specific events and interactions
