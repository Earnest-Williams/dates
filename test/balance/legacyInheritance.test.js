import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('balance harness: legacy inheritance does not break relationship pacing', () => {
  let state = cloneState();
  
  // Simulate starting Generation 2 with massive wealth
  state.stats.money = 50000;
  
  // Match with Elena
  state.matches = {
    ...state.matches,
    elena: { met: true, relationship: 20, chemistry: 20, storyTier: 0, dateCount: 0 },
  };

  // Attempt to buy our way past the Tier 0 cap (25)
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  // Story Tier 0 caps relationship at 25.
  // Even though the date tried to add points, it should be capped.
  assert.equal(state.matches.elena.relationship, 25);
  
  // Wealth is drained (from travel/coffee or similar small expenses, but the relationship is still capped)
  assert.ok(state.stats.money <= 50000);
});
