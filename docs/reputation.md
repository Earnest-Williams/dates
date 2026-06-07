# Reputation System

## Overview

The reputation system tracks social standing across different circles, creating consequences for public behavior, multi-partner routes, and social visibility. Unlike a single global reputation score, the system uses **circle-specific reputation** to model how different social groups perceive the player.

## Reputation Circles

The game tracks reputation in the following circles:

```javascript
reputation: {
  coworkers: 0,      // Professional colleagues
  friends: 0,        // Social friends and acquaintances
  nightlife: 0,      // Club/party scene
  creative: 0,       // Artists, musicians, writers
  academic: 0,       // Scholars, students, intellectuals
  exes: 0,           // Former partners
}
```

### NPC to Circle Mapping

| NPC | Primary Circle | Secondary Circle |
|-----|---------------|------------------|
| Elena | academic | - |
| Brad | friends | fitness |
| Sophia | nightlife | - |
| Rina | nightlife | - |
| Marcus | coworkers | - |
| Nora | coworkers | - |
| Chloe | creative | - |
| Maya | creative | - |
| Exes | exes | - |

## How Reputation Works

### Gaining Reputation

Reputation increases through:
- **Public dates** in circle-appropriate locations
- **Successful social interactions** with NPCs in that circle
- **Positive gossip** from other NPCs in the circle
- **Attending circle-specific events**
- **Helping NPCs** in circle-related situations

### Losing Reputation

Reputation decreases through:
- **Public conflicts** with NPCs in that circle
- **Multi-partner behavior** that becomes known
- **Broken promises** to NPCs in that circle
- **Jealousy triggers** from overlapping relationships
- **Negative gossip** spreading through the circle

### Reputation Effects

Reputation affects:

1. **Organic Encounters**
   - Higher reputation = more frequent and positive encounters
   - Lower reputation = fewer encounters, or encounters with distrust

2. **Jealousy Likelihood**
   - Public dates with high reputation difference = higher jealousy risk
   - Multi-partner behavior in the same circle = severe reputation penalty

3. **Public-Date Consequences**
   - Dating someone in a circle where you have low reputation = social backlash
   - Dating someone in a circle where you have high reputation = social approval

4. **Gossip**
   - Reputation affects how gossip spreads and is received
   - Low reputation = gossip is believed more easily
   - High reputation = gossip is dismissed more easily

5. **Invitation Tone**
   - NPCs in circles where you have high reputation = more enthusiastic invitations
   - NPCs in circles where you have low reputation = more hesitant or conditional invitations

6. **Repair Difficulty**
   - Low reputation in a circle = harder to repair conflicts with NPCs in that circle
   - High reputation in a circle = easier to repair conflicts with NPCs in that circle

7. **NPC Social Graph Responses**
   - NPCs react differently based on your reputation in their circle
   - Friends may defend you or distance themselves based on reputation

8. **Nightlife/Public Events**
   - Access to exclusive events may be restricted by reputation
   - VIP treatment at venues requires good nightlife reputation

9. **Office/Career Events**
   - Professional opportunities may require good coworker reputation
   - Promotions and recommendations depend on professional reputation

## Implementation

### State Structure

```javascript
state.reputation = {
  coworkers: -10,   // Range: -100 to 100
  friends: 5,
  nightlife: 0,
  creative: 15,
  academic: -5,
  exes: -20,
}
```

### Key Functions

The reputation system is implemented in `src/sim/reputation.js`:

- `adjustReputationForPublicDate(state, npcId, locationKey)` - Adjusts reputation based on public date visibility
- `calculateGossipRisk(state, npcId, locationKey)` - Calculates risk of gossip spreading
- `selectRelevantReputationCircle(npcId, locationKey)` - Gets the relevant circle for an NPC/location
- `calculateRepairReputationModifier(state, npcId)` - Calculates reputation effect on repair difficulty

### Location Reputation Context

Different locations have different reputation implications:

- **Library, University, Bookstore** → academic circle
- **Gym, Sports Complex** → friends/fitness circle
- **Nightclub, Bar, Lounge** → nightlife circle
- **Art Gallery, Studio, Music Venue** → creative circle
- **Office, Coworking Space** → coworkers circle

## Anti-Goal: No Shopping-Based Reputation

Reputation **cannot** be improved through:
- Purchasing items
- Buying gifts
- Spending money directly
- Owning specific furniture (furniture affects home style, not reputation directly)

Reputation **can** be improved through:
- Meaningful social interactions
- Keeping promises
- Successful dates
- Positive public behavior
- Helping NPCs in their circle

## Testing

Reputation system is tested in:
- `test/reputationIntegration.test.js`
- Content validation ensures no reputation shortcuts exist

## Future Enhancements

- Circle-specific events and opportunities
- Reputation decay over time (forgiveness/forgetting)
- Reputation recovery mechanics
- More granular circle definitions
