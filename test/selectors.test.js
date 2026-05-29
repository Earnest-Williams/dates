import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMatchChance,
  getFormattedTime,
  selectActiveLocationEvent,
  selectAvailableRoutinesByTimeBucket,
  selectLocationPublicVisibility,
} from '../src/state/selectors.js';
import { initialState } from '../src/state/reducers/rootReducer.js';
import { getTimeOfDay } from '../src/data/townTexture.js';

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

test('shared daypart logic treats 3 AM as night', () => {
  const state = structuredClone(initialState);
  state.time.hour = 3;

  assert.equal(getTimeOfDay(3), 'night');
  assert.equal(selectAvailableRoutinesByTimeBucket(state), 'night');
  assert.equal(selectActiveLocationEvent(state, 'park'), null);
  assert.equal(selectLocationPublicVisibility(state, 'park', state.time), 'moderate_visibility');
  assert.equal(selectLocationPublicVisibility(state, 'club', state.time), 'high_visibility');
});

test('location events appear only in their authored time bucket', () => {
  const state = structuredClone(initialState);
  state.time.hour = 13;

  assert.equal(selectActiveLocationEvent(state, 'park')?.id, 'park_market');

  state.time.hour = 23;
  assert.equal(selectActiveLocationEvent(state, 'park'), null);
});
