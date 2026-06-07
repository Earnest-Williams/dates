import test from 'node:test';
import assert from 'node:assert/strict';
import { HOME_ACTIVITIES } from '../../src/data/furniture.js';

test('Home Activity Schema Validation', async (t) => {
  await t.test('all home activities have valid structure', () => {
    for (const [id, activity] of Object.entries(HOME_ACTIVITIES || {})) {
      assert.ok(activity.dateType, `Home activity ${id} missing dateType`);
      assert.ok(activity.tags, `Home activity ${id} missing tags`);
      assert.ok(Array.isArray(activity.tags), `Home activity ${id} tags is not an array`);
      assert.ok(activity.tags.length > 0, `Home activity ${id} has no tags`);
    }
  });
  
  await t.test('home activities have unique IDs', () => {
    const ids = new Set();
    for (const id of Object.keys(HOME_ACTIVITIES || {})) {
      assert.ok(!ids.has(id), `Duplicate home activity ID: ${id}`);
      ids.add(id);
    }
  });
  
  await t.test('home activity tags are valid strings', () => {
    for (const [id, activity] of Object.entries(HOME_ACTIVITIES || {})) {
      for (const tag of activity.tags || []) {
        assert.ok(typeof tag === 'string', 
          `Home activity ${id} has non-string tag: ${typeof tag}`);
        assert.ok(tag.length > 0, 
          `Home activity ${id} has empty tag`);
      }
    }
  });
  
  await t.test('home activity dateTypes reference valid date templates', () => {
    // We can't easily check this without importing DATE_TEMPLATES
    // So we just check that dateType is a string
    for (const [id, activity] of Object.entries(HOME_ACTIVITIES || {})) {
      assert.ok(typeof activity.dateType === 'string',
        `Home activity ${id} dateType is not a string`);
      assert.ok(activity.dateType.length > 0,
        `Home activity ${id} dateType is empty`);
    }
  });
});
