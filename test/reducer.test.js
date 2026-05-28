import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('routes TAKE_GIG into career reducer (regression for unmapped action)', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'TAKE_GIG', payload: { gigId: 'missing-gig' } });
  assert.notEqual(next, state);
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
