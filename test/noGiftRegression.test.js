import test from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../src/data/items.js';
import { NPCS } from '../src/data/npcs.js';
import { FURNITURE } from '../src/data/furniture.js';
import { DATE_TEMPLATES } from '../src/data/dates.js';

test('no gift-loop regressions in data', async (t) => {
  await t.test('items do not grant relationship points', () => {
    for (const key of Object.keys(ITEMS)) {
      const item = ITEMS[key];
      if (item.effect) {
        assert.ok(item.effect.relationship === undefined, `Item ${key} grants relationship points`);
      }
    }
  });

  await t.test('furniture does not define romance shortcuts', () => {
    for (const key of Object.keys(FURNITURE)) {
      const furniture = FURNITURE[key];
      assert.ok(furniture.favoriteNpc === undefined, `Furniture ${key} defines favoriteNpc`);
      assert.ok(furniture.relationshipBonus === undefined, `Furniture ${key} defines relationshipBonus`);
    }
  });

  await t.test('NPCs do not define gift tables', () => {
    for (const npc of NPCS) {
      assert.ok(npc.lovedGifts === undefined, `NPC ${npc.id} defines lovedGifts`);
      assert.ok(npc.likedGifts === undefined, `NPC ${npc.id} defines likedGifts`);
      assert.ok(npc.dislikedGifts === undefined, `NPC ${npc.id} defines dislikedGifts`);
    }
  });

  await t.test('date templates do not include repeatable gift progression', () => {
    for (const dateKey of Object.keys(DATE_TEMPLATES)) {
      const dateTemplate = DATE_TEMPLATES[dateKey];
      assert.ok(dateTemplate.giftRequired === undefined, `Date ${dateKey} defines giftRequired`);
    }
  });
});
