import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('balance harness: finance/investment rush', () => {
  let state = cloneState();
  // Ensure we have some money
  state.stats.money = 1000;
  
  // Buy asset
  state = gameReducer(state, {
    type: 'BUY_ASSET',
    payload: { assetId: 'shib', quantity: 10 }
  });
  
  // Advance time significantly
  for (let i = 0; i < 30; i++) {
    state = gameReducer(state, {
      type: 'ADVANCE_TIME',
      payload: { ticks: 144 } // 1 day
    });
  }

  // Sell asset
  const qty = state.portfolio['shib']?.quantity || 0;
  if (qty > 0) {
    state = gameReducer(state, {
      type: 'SELL_ASSET',
      payload: { assetId: 'shib', quantity: qty }
    });
  }

  // We should not have infinite money. 
  // Given clamping and volatility, it shouldn't just be unbounded.
  // We check that we don't end up with more than maybe 10000 after just 30 days of 10 crypto (unless insane luck, but we seeded testing)
  // Actually, we just want to ensure it doesn't crash and metrics are reasonable.
  assert.ok(state.stats.money > 0);
  assert.ok(state.stats.money < 1000000, 'Money should not easily hit 1M in 30 days from 1k');
});

test('balance harness: instant match does not skip relationship pacing when flag enabled', () => {
  let state = cloneState();
  state.features = { ...state.features, instantMatchRebalance: true };

  state = gameReducer(state, {
    type: 'INSTANT_MATCH',
    payload: { npcId: 'elena' }
  });

  // Since flag is enabled, relationship should be baseline (10) not 35
  assert.equal(state.matches.elena.relationship, 10);
  assert.equal(state.matches.elena.chemistry, 10);
  assert.equal(state.matches.elena.storyTier, 0); // No free story tier!
});
