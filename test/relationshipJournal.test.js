import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';
import { selectNpcJournal } from '../src/state/selectors.js';

const cloneState = () => structuredClone(initialState);

test('relationship events are logged during dates and accessible via journal selectors', () => {
  let state = cloneState();

  // Go on date
  state = gameReducer(state, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' }
  });

  // Choose option
  state = gameReducer(state, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 }
  });

  // Since coffee_chat has 3 phases, do two more
  state = gameReducer(state, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 }
  });

  state = gameReducer(state, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 }
  });

  // Date is resolved automatically after 3 phases
  
  const journal = selectNpcJournal(state, 'elena');
  console.log('relationshipEvents', state.relationshipEvents);
  console.log('activeDateEvent', state.activeDateEvent);

  // Assert events logged
  assert.ok(journal.recentEvents.length > 0, 'Should have logged at least one event');
  assert.equal(journal.recentEvents[0].source, 'date');
  assert.ok(journal.recentEvents[0].summary.includes('Date at'), 'Summary should include date context');

  // Assert memories accessible
  assert.ok(journal.memories.length > 0, 'Should have picked up memories from date options');
});

test('instant match logs an event', () => {
  let state = cloneState();
  state.features = { ...state.features, instantMatchRebalance: true };

  state = gameReducer(state, {
    type: 'INSTANT_MATCH',
    payload: { npcId: 'elena' }
  });

  const journal = selectNpcJournal(state, 'elena');
  assert.equal(journal.recentEvents.length, 1);
  assert.equal(journal.recentEvents[0].source, 'instant_match');
});
