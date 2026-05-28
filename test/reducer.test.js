import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTINES, isRoutineAvailable } from '../src/data/routines.js';
import { applyRoutineEffects } from '../src/state/reducers/action.js';
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
  const { updatedStats, updatedNeeds } = applyRoutineEffects(state, {
    effects: { credentials: 5, mood: 1 },
    energyCost: 0,
  });

  assert.deepEqual(updatedStats.credentials, state.stats.credentials);
  assert.equal(updatedNeeds.mood, Math.min(100, state.needs.mood + 1));
});

test('routine tracker resets weekly counts when crossing week boundary after skipped routine days', () => {
  const state = cloneState();
  state.time.day = 9;
  state.routineTracker = {
    day: 7,
    completedToday: ['read_fiction'],
    weeklyCounts: { read_fiction: 3 },
  };
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'call_family_friend' } });

  assert.equal(next.routineTracker.day, 9);
  assert.deepEqual(next.routineTracker.weeklyCounts, { call_family_friend: 1 });
});

test('routine reducer tolerates partially initialized tracker from older saves', () => {
  const state = cloneState();
  state.routineTracker = { day: 1 };
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'read_fiction' } });

  assert.equal(next.routineTracker.day, 1);
  assert.deepEqual(next.routineTracker.completedToday, ['read_fiction']);
  assert.equal(next.routineTracker.weeklyCounts.read_fiction, 1);
});
