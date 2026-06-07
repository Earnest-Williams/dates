import test from 'node:test';
import assert from 'node:assert/strict';
import { SOCIAL_MEDIA_CONTENT } from '../src/data/socialMedia.js';
import { canPostSimstagramContent, calculateSimstagramStatMultiplier } from '../src/sim/simstagram.js';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('simstagram UI eligibility matches post action energy eligibility', () => {
  const content = SOCIAL_MEDIA_CONTENT.find((item) => item.id === 'coding_stream');
  const state = cloneState();
  state.needs.energy = content.energyCost - 1;

  assert.equal(canPostSimstagramContent(state, content), false);

  state.needs.energy = content.energyCost;
  assert.equal(canPostSimstagramContent(state, content), true);
});

test('simstagram stat requirement values are follower weights used by reducer math', () => {
  const content = SOCIAL_MEDIA_CONTENT.find((item) => item.id === 'selfie');
  const state = cloneState();
  state.stats.charisma = 40;
  state.stats.style = 40;

  const originalRandom = Math.random;
  Math.random = () => 0.99;

  const expectedGain = Math.floor(
    content.baseFollowers * calculateSimstagramStatMultiplier(state.stats, content.statRequirements)
  );
  const nextState = gameReducer(state, {
    type: 'POST_SIMSTAGRAM',
    payload: {
      contentType: content.id,
      statRequirements: content.statRequirements,
      baseFollowers: content.baseFollowers,
      energyCost: content.energyCost,
    },
  });

  Math.random = originalRandom;

  assert.equal(nextState.simstagram.posts[0].followersGained, expectedGain);
});
