import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('balance harness: multi-partner route drains resources', () => {
  let state = cloneState();
  state.stats.money = 200;
  state.needs.energy = 100;
  
  // Set up three matches
  state.matches = {
    ...state.matches,
    elena: { met: true, relationship: 30, chemistry: 20, storyTier: 1, dateCount: 1 },
    brad: { met: true, relationship: 30, chemistry: 20, storyTier: 1, dateCount: 1 },
    sophia: { met: true, relationship: 30, chemistry: 20, storyTier: 1, dateCount: 1 },
  };

  // Date 1
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  // Date 2
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'brad', locationKey: 'park', dateType: 'coffee_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  // Date 3
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'sophia', locationKey: 'club', dateType: 'club_night' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  // Each date costs around 10-30 money and 20+ energy, so 3 dates drain resources significantly.
  // The player started with $200 and 100 energy.
  assert.ok(state.stats.money < 200, 'Money should decrease');
  assert.ok(state.needs.energy <= 60, 'Energy should decrease heavily from 3 dates');

  // If the player tries to do routines to make money, they will lack energy.
  // This verifies that the multi-partner route is constrained by the economy.
});
