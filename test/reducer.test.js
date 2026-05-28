import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTINES, isRoutineAvailable } from '../src/data/routines.js';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('routes TAKE_GIG into career reducer (regression for unmapped action)', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'TAKE_GIG', payload: { gigId: 'data_entry' } });
  assert.notEqual(next, state);
  assert.ok(next.stats.money > state.stats.money);
});

test('routes TOGGLE_HEALTH_INSURANCE into action reducer', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'TOGGLE_HEALTH_INSURANCE' });
  assert.equal(next.living.hasHealthInsurance, true);
});

test('unknown actions are no-op', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'UNKNOWN_ACTION' });
  assert.deepEqual(next, state);
});

test('routine action advances time and applies need/stat changes', () => {
  const state = cloneState();
  state.activeLocation = 'Bramblewick';
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'read_fiction' } });
  assert.equal(next.time.minute, 30);
  assert.ok(next.needs.energy < state.needs.energy);
  assert.ok(next.needs.mood > state.needs.mood - 1);
  assert.ok(next.stats.intelligence > state.stats.intelligence);
});

test('routine reducer safely ignores unknown routine id', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'missing_routine' } });
  assert.deepEqual(next, state);
});

test('routine availability tolerates partially initialized state', () => {
  const routine = ROUTINES.find((item) => item.id === 'call_family_friend');
  assert.equal(isRoutineAvailable(routine, { activeLocation: 'Endleigh' }), false);
});

test('routine reducer ignores non-numeric effect targets', () => {
  const state = cloneState();
  state.needs.energy = 100;

  ROUTINES.push({
    id: 'test_non_numeric_routine',
    label: 'Test Routine',
    durationTicks: 0,
    energyCost: 0,
    effects: { credentials: 5, mood: 1 },
    tags: [],
    allowedTimes: ['morning', 'afternoon', 'evening'],
    location: 'any',
  });

  try {
    const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'test_non_numeric_routine' } });
    assert.deepEqual(next.stats.credentials, state.stats.credentials);
    assert.equal(next.needs.mood, Math.min(100, state.needs.mood + 1));
  } finally {
    ROUTINES.pop();
  }
});
