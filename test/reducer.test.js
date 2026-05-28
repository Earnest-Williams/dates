import test from 'node:test';
import assert from 'node:assert/strict';
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
