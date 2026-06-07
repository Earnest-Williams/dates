import test from 'node:test';
import assert from 'node:assert/strict';
import { formatOrganicEncounterRewardSummary } from '../src/components/organicEncounterRewards.js';

test('organic encounter rewards render chemistry when relationship is zero', () => {
  const summary = formatOrganicEncounterRewardSummary({
    text: 'Let the chemistry carry the moment.',
    relationship: 0,
    chemistry: 4,
  });

  assert.equal(summary, 'Relationship +0, Chemistry +4');
});
