import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchChance, getFormattedTime } from '../src/state/selectors.js';
import { initialState } from '../src/state/reducers/rootReducer.js';

test('formatted time uses 12-hour clock', () => {
  const state = structuredClone(initialState);
  state.time.hour = 13;
  state.time.minute = 5;
  assert.equal(getFormattedTime(state), '1:05 PM');
});

test('calculateMatchChance is bounded [0,1] for known npc', () => {
  const state = structuredClone(initialState);
  const chance = calculateMatchChance(state, 'ava');
  assert.ok(chance >= 0 && chance <= 1);
});

test('calculateMatchChance returns 0 for unknown npc', () => {
  const state = structuredClone(initialState);
  assert.equal(calculateMatchChance(state, 'unknown'), 0);
});
