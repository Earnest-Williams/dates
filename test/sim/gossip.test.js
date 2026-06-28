import { test } from 'node:test';
import assert from 'node:assert';
import { generateRumor, processPendingRumors } from '../../src/sim/reputation.js';
import { getEligibleConflictTriggers } from '../../src/sim/relationshipConflicts.js';

test('generateRumor respects settlement popTier', () => {
  const state = {
    time: { day: 1 },
    matches: {
      elena: { relationship: 50, met: true },
      sophia: { relationship: 50, met: true } // Different circle (academic vs nightlife)
    }
  };
  
  // Test Endleigh (Very Low population -> 5% chance)
  // We can't perfectly test randomness without mocking Math.random, but we can verify it doesn't throw
  // and returns either null or a valid rumor object.
  const rumorEndleigh = generateRumor(state, 'elena', 'park', 'Endleigh');
  if (rumorEndleigh) {
    assert.equal(rumorEndleigh.targetNpcId, 'elena');
    assert.equal(rumorEndleigh.daysUntilMature, 2);
    assert.equal(rumorEndleigh.settlementId, 'Endleigh');
  }

  // Test Brockleigh (High population -> 60% chance)
  let foundRumor = false;
  for (let i = 0; i < 20; i++) {
    const rumor = generateRumor(state, 'elena', 'club', 'Brockleigh');
    if (rumor) {
      foundRumor = true;
      assert.ok(['academic', 'nightlife'].includes(rumor.witnessCircle)); // Should pick an active circle
      break;
    }
  }
  // With 60% chance, 20 attempts should almost guarantee a hit
  assert.ok(foundRumor, 'Failed to generate a rumor in high population area after 20 attempts');
});

test('rumors incubate and mature over time', () => {
  let state = {
    reputation: {
      pendingRumors: [
        { targetNpcId: 'elena', witnessCircle: 'nightlife', daysUntilMature: 2 }
      ],
      activeRumors: []
    }
  };

  // 1 day passes
  state = processPendingRumors(state, 1);
  assert.equal(state.reputation.pendingRumors.length, 1);
  assert.equal(state.reputation.activeRumors.length, 0);
  assert.equal(state.reputation.pendingRumors[0].daysUntilMature, 1);

  // Another day passes
  state = processPendingRumors(state, 1);
  assert.equal(state.reputation.pendingRumors.length, 0);
  assert.equal(state.reputation.activeRumors.length, 1);
  assert.equal(state.reputation.activeRumors[0].targetNpcId, 'elena');
});

test('mature rumors trigger jealousy conflicts', () => {
  const state = {
    time: { day: 4 },
    matches: {
      sophia: { met: true, relationship: 50 }, // Nightlife circle
      elena: { met: true, relationship: 50 } // Academic circle
    },
    reputation: {
      activeRumors: [
        { targetNpcId: 'elena', witnessCircle: 'nightlife', locationKey: 'club', settlementId: 'Brockleigh' }
      ]
    }
  };

  // Sophia is in nightlife. She hears the rumor about the player dating Elena.
  const sophiaTriggers = getEligibleConflictTriggers(state, 'sophia');
  const jealousyConflict = sophiaTriggers.find(t => t.id === 'public_date_with_another');
  assert.ok(jealousyConflict, 'Sophia should trigger a conflict due to rumor in her circle');
  assert.equal(jealousyConflict.severity, 2); // default severity

  // Elena is the target of the rumor (she was ON the date), so she shouldn't get mad at herself
  const elenaTriggers = getEligibleConflictTriggers(state, 'elena');
  const elenaJealousy = elenaTriggers.find(t => t.id === 'public_date_with_another');
  assert.ok(!elenaJealousy, 'Elena should not get a jealousy trigger for her own date rumor');
});
