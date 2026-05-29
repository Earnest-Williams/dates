import test from 'node:test';
import assert from 'node:assert/strict';
import { runSaveMigration } from '../src/state/persistence.js';

test('save migration tests', async (t) => {
  await t.test('migrates v1 payload to latest', () => {
    const v1Payload = {
      version: 1,
      savedAt: '2026-05-28T00:00:00.000Z',
      gameState: {
        matches: {
          elena: {
            met: true,
            relationship: 10,
          }
        }
      }
    };

    const result = runSaveMigration(v1Payload);
    
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.migrated, true);
    
    const { gameState } = result;
    
    // Check features flag added
    assert.ok(gameState.features);
    assert.strictEqual(gameState.features.organicEncounters, false);
    assert.ok(gameState.calendar);
    assert.deepStrictEqual(gameState.calendar.events, []);
    
    // Check matches extended fields
    assert.ok(gameState.matches.elena);
    assert.strictEqual(gameState.matches.elena.activeConflictId, null);
    assert.strictEqual(gameState.matches.elena.relationshipStage, 'matched');
  });

  await t.test('migrates v2 payload to latest', () => {
    const v2Payload = {
      version: 2,
      savedAt: '2026-05-28T00:00:00.000Z',
      gameState: {
        features: { organicEncounters: false }
      }
    };

    const result = runSaveMigration(v2Payload);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.migrated, true);
    assert.ok(result.gameState.calendar);
  });
  
  await t.test('rejects unsupported version', () => {
    const v99Payload = {
      version: 99,
      savedAt: '2026-05-28T00:00:00.000Z',
      gameState: {}
    };

    const result = runSaveMigration(v99Payload);
    assert.strictEqual(result.ok, false);
  });
});
