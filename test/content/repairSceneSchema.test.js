import test from 'node:test';
import assert from 'node:assert/strict';
import { RELATIONSHIP_REPAIR_ACTIONS } from '../../src/data/npcs.js';

test('Repair Scene Schema Validation', async (t) => {
  await t.test('all repair actions are valid strings', () => {
    for (const repairAction of RELATIONSHIP_REPAIR_ACTIONS) {
      assert.ok(typeof repairAction === 'string', 
        `Repair action is not a string: ${typeof repairAction}`);
      assert.ok(repairAction.length > 0, 
        'Repair action is empty string');
    }
  });
  
  await t.test('repair actions have unique IDs', () => {
    const ids = new Set();
    for (const repairAction of RELATIONSHIP_REPAIR_ACTIONS) {
      assert.ok(!ids.has(repairAction), 
        `Duplicate repair action ID: ${repairAction}`);
      ids.add(repairAction);
    }
  });
  
  await t.test('repair actions follow naming convention', () => {
    for (const repairAction of RELATIONSHIP_REPAIR_ACTIONS) {
      // Should be lowercase with underscores
      assert.ok(repairAction === repairAction.toLowerCase(),
        `Repair action '${repairAction}' should be lowercase`);
      assert.ok(!repairAction.includes(' '),
        `Repair action '${repairAction}' should use underscores, not spaces`);
    }
  });
  
  await t.test('repair actions are non-empty', () => {
    for (const repairAction of RELATIONSHIP_REPAIR_ACTIONS) {
      assert.ok(repairAction.length >= 3,
        `Repair action '${repairAction}' is too short (${repairAction.length} chars)`);
    }
  });
});
