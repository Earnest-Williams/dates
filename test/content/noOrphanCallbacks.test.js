import test from 'node:test';
import assert from 'node:assert/strict';
import { NPCS } from '../../src/data/npcs.js';
import { DATE_TEMPLATES } from '../../src/data/dates.js';

test('No Orphaned Callbacks', async (t) => {
  await t.test('all choiceCallbacks are strings', () => {
    for (const npc of NPCS) {
      if (npc.choiceCallbacks) {
        for (const callback of npc.choiceCallbacks) {
          assert.ok(typeof callback === 'string',
            `Callback in ${npc.id} is not a string: ${typeof callback}`);
          assert.ok(callback.length > 0,
            `Callback in ${npc.id} is empty string`);
        }
      }
    }
  });
  
  await t.test('choiceCallbacks follow naming convention', () => {
    for (const npc of NPCS) {
      if (npc.choiceCallbacks) {
        for (const callback of npc.choiceCallbacks) {
          // Should be lowercase with underscores
          assert.ok(callback === callback.toLowerCase(),
            `Callback '${callback}' in ${npc.id} should be lowercase`);
          assert.ok(!callback.includes(' '),
            `Callback '${callback}' in ${npc.id} should use underscores, not spaces`);
        }
      }
    }
  });
  
  await t.test('futureCallback references in romance arcs are strings', () => {
    for (const npc of NPCS) {
      if (npc.romanceArc) {
        for (const arc of npc.romanceArc) {
          for (const choice of arc.choices || []) {
            if (choice.futureCallback) {
              assert.ok(typeof choice.futureCallback === 'string',
                `futureCallback in ${npc.id}.${arc.id} is not a string`);
              assert.ok(choice.futureCallback.length > 0,
                `futureCallback in ${npc.id}.${arc.id} is empty`);
            }
          }
        }
      }
    }
  });
  
  await t.test('futureCallback references in storyEvents are strings', () => {
    for (const npc of NPCS) {
      if (npc.storyEvents) {
        for (const [level, event] of Object.entries(npc.storyEvents)) {
          if (event.futureCallback) {
            assert.ok(typeof event.futureCallback === 'string',
              `futureCallback in ${npc.id}.storyEvents[${level}] is not a string`);
            assert.ok(event.futureCallback.length > 0,
              `futureCallback in ${npc.id}.storyEvents[${level}] is empty`);
          }
        }
      }
    }
  });
  
  await t.test('futureCallback references in date templates are strings', () => {
    for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
      for (const phase of template.phases || []) {
        for (const choice of phase.choices || []) {
          if (choice.futureCallback) {
            assert.ok(typeof choice.futureCallback === 'string',
              `futureCallback in date template ${templateId} is not a string`);
            assert.ok(choice.futureCallback.length > 0,
              `futureCallback in date template ${templateId} is empty`);
          }
        }
      }
    }
  });
});
