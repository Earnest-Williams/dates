import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const relationshipsPanelSource = readFileSync(
  new URL('../src/components/dashboard/RelationshipsPanel.jsx', import.meta.url),
  'utf8'
);

test('dashboard relationship UI does not render hidden compatibility trait tables', () => {
  assert.equal(relationshipsPanelSource.includes('hiddenCompatibilityTraits'), false);
  assert.equal(relationshipsPanelSource.includes('npcTraits'), false);
  assert.equal(relationshipsPanelSource.includes('playerTraits'), false);
});
