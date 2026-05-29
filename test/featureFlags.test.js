import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/state/reducers/rootReducer.js';
import { selectAvailableOrganicEncounters } from '../src/state/selectors.js';

const cloneState = () => structuredClone(initialState);

test('organic encounters selector hides encounters when flag is disabled', () => {
  const state = cloneState();
  state.time = { day: 1, hour: 19, minute: 0 };
  state.activeLocation = 'Brockleigh';

  assert.deepEqual(selectAvailableOrganicEncounters(state, 'library'), []);
});

test('organic encounters selector exposes encounters when flag is enabled', () => {
  const state = cloneState();
  state.features = { ...state.features, organicEncounters: true };
  state.time = { day: 1, hour: 19, minute: 0 };
  state.activeLocation = 'Brockleigh';

  const encounters = selectAvailableOrganicEncounters(state, 'library');

  assert.ok(encounters.some((encounter) => encounter.npcId === 'elena'));
});
