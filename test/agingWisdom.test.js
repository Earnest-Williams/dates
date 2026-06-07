import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('birthday crossing at day 365 increments age and logs once', () => {
  const state = cloneState();
  state.time = { day: 364, hour: 8, minute: 0 };

  const nextState = gameReducer(state, {
    type: 'ADVANCE_TIME',
    payload: { ticks: 144 },
  });

  assert.equal(nextState.time.day, 365);
  assert.equal(nextState.family.age, 19);
  assert.equal(nextState.logs.filter((log) => log.includes('Happy birthday')).length, 1);
});

test('birthday logs are not duplicated after the crossing is already recorded', () => {
  const state = cloneState();
  state.time = { day: 365, hour: 8, minute: 0 };
  state.family.age = 19;

  const nextState = gameReducer(state, {
    type: 'ADVANCE_TIME',
    payload: { ticks: 6 },
  });

  assert.equal(nextState.family.age, 19);
  assert.equal(nextState.logs.filter((log) => log.includes('Happy birthday')).length, 0);
});

test('simulateTicks tolerates saves without family data', () => {
  const state = cloneState();
  delete state.family;

  const nextState = gameReducer(state, {
    type: 'ADVANCE_TIME',
    payload: { ticks: 1 },
  });

  assert.equal(nextState.family, undefined);
});

test('wisdom bonus applies after age 30 without flooring fractional stat gains', () => {
  const state = cloneState();
  state.family.age = 31;
  state.stats.intelligence = 10;
  state.needs.mood = 50;

  const nextState = gameReducer(state, {
    type: 'PERFORM_ACTION',
    payload: {
      actionName: 'Read a thoughtful essay',
      ticks: 1,
      statChanges: { intelligence: 0.5 },
      energyCost: 0,
      moneyChange: 0,
    },
  });

  assert.equal(nextState.stats.intelligence, 10.55);
});

test('wisdom bonus does not apply to excluded stats', () => {
  const state = cloneState();
  state.family.age = 31;
  state.stats.fitness = 10;
  state.needs.mood = 50;

  const nextState = gameReducer(state, {
    type: 'PERFORM_ACTION',
    payload: {
      actionName: 'Practice balance',
      ticks: 1,
      statChanges: { fitness: 1 },
      energyCost: 0,
      moneyChange: 0,
    },
  });

  assert.equal(nextState.stats.fitness, 11);
});
