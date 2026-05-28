import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSavePayload,
  getSaveMetadata,
  loadGameState,
  runSaveMigration,
  saveGameState,
} from '../src/state/persistence.js';

const makeStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    clear: () => data.clear(),
  };
};

test('save and load round trip works', () => {
  global.window = { localStorage: makeStorage() };
  const gameState = { time: { day: 3, hour: 12 }, activeLocation: 'Endleigh', family: { playerName: 'Alex' } };
  assert.equal(saveGameState(gameState), true);

  const loaded = loadGameState();
  assert.equal(loaded.ok, true);
  assert.deepEqual(loaded.gameState, gameState);

  const metadata = getSaveMetadata();
  assert.equal(metadata.day, 3);
  assert.equal(metadata.hour, 12);
});

test('unsupported save version fails gracefully', () => {
  const result = runSaveMigration({ version: 999, gameState: {} });
  assert.equal(result.ok, false);
});

test('payload version is set', () => {
  const payload = createSavePayload({});
  assert.equal(payload.version, 1);
  assert.equal(typeof payload.savedAt, 'string');
});
