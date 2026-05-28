import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';
import { getNpcEncounters } from '../src/data/townTexture.js';

const cloneState = () => structuredClone(initialState);

test('organic encounters introduce NPCs and build relationship state without swiping', () => {
  const state = cloneState();
  
  // 1. Discover NPC
  const afterDiscover = gameReducer(state, {
    type: 'DISCOVER_NPC_AT_LOCATION',
    payload: { npcId: 'elena', locationKey: 'library' }
  });
  
  assert.equal(afterDiscover.matches.elena.met, true);
  assert.equal(afterDiscover.matches.elena.discoveredVia, 'organic');
  assert.equal(afterDiscover.matches.elena.relationship, 5);

  // 2. Start encounter
  const encounters = getNpcEncounters({ day: 1, hour: 19 }, 'library');
  const elenaEncounter = encounters.find(e => e.npcId === 'elena');
  
  const afterStart = gameReducer(afterDiscover, {
    type: 'START_ORGANIC_ENCOUNTER',
    payload: { encounter: elenaEncounter }
  });
  
  assert.equal(afterStart.gamePhase, 'encounter');
  assert.ok(afterStart.activeEncounterEvent);

  // 3. Resolve encounter
  const afterResolve = gameReducer(afterStart, {
    type: 'RESOLVE_ORGANIC_ENCOUNTER',
    payload: { choiceIndex: 0 } // First choice
  });
  
  assert.equal(afterResolve.gamePhase, 'living');
  assert.equal(afterResolve.activeEncounterEvent, null);
  // Base relationship was 5, choice adds relationship
  assert.ok(afterResolve.matches.elena.relationship > 5);
  // State time should have advanced (simulateTicks(2) = 20 mins)
  assert.ok(afterResolve.time.minute >= 20 || afterResolve.time.hour > 0);
});
