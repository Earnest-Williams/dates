import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

const runLibraryDate = (state) => {
  const seeded = {
    ...state,
    time: {
      ...state.time,
      day: state.time.day + 1,
      hour: 10,
      minute: 0,
    },
  };

  let next = gameReducer(seeded, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' },
  });
  next = gameReducer(next, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  next = gameReducer(next, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  next = gameReducer(next, { type: 'CHOOSE_DATE_PHASE_OPTION', payload: { optionIndex: 0 } });
  return gameReducer(next, { type: 'CLOSE_DATE_RECAP' });
};

test('balance harness: date pacing prevents spamming the same date', () => {
  let state = cloneState();
  
  // Set up match
  state.matches = {
    ...state.matches,
    elena: { met: true, relationship: 10, chemistry: 10, storyTier: 1, dateCount: 0 },
  };

  // Date 1
  state = runLibraryDate(state);

  const relAfterDate1 = state.matches.elena.relationship;
  assert.ok(relAfterDate1 > 10);
  const gain1 = relAfterDate1 - 10;

  // Date 2
  state = runLibraryDate(state);

  const relAfterDate2 = state.matches.elena.relationship;
  const gain2 = relAfterDate2 - relAfterDate1;
  assert.ok(gain2 < gain1); // Diminishing returns start immediately

  // Date 3
  state = runLibraryDate(state);

  const relAfterDate3 = state.matches.elena.relationship;
  const gain3 = relAfterDate3 - relAfterDate2;
  assert.ok(gain3 < gain2);
  
  // Date 4
  state = runLibraryDate(state);

  const relAfterDate4 = state.matches.elena.relationship;
  const gain4 = relAfterDate4 - relAfterDate3;
  assert.ok(gain4 <= gain3);
});
