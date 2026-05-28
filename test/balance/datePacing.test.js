import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('balance harness: date pacing prevents spamming the same date', () => {
  let state = cloneState();
  
  // Set up match
  state.matches = {
    ...state.matches,
    elena: { met: true, relationship: 10, chemistry: 10, storyTier: 1, dateCount: 0 },
  };

  // Date 1
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  const relAfterDate1 = state.matches.elena.relationship;
  assert.ok(relAfterDate1 > 10);
  const gain1 = relAfterDate1 - 10;

  // Date 2
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  const relAfterDate2 = state.matches.elena.relationship;
  const gain2 = relAfterDate2 - relAfterDate1;
  assert.equal(gain2, gain1); // First repeat is fine

  // Date 3 (Starts seeing diminishing returns)
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  const relAfterDate3 = state.matches.elena.relationship;
  const gain3 = relAfterDate3 - relAfterDate2;
  assert.ok(gain3 < gain2);
  
  // Date 4
  state = gameReducer(state, { type: 'GO_ON_DATE', payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  state = gameReducer(state, { type: 'CLOSE_DATE_RECAP' });

  const relAfterDate4 = state.matches.elena.relationship;
  const gain4 = relAfterDate4 - relAfterDate3;
  assert.ok(gain4 <= gain3);
});
