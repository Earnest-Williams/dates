import test from 'node:test';
import assert from 'node:assert/strict';
import { DATE_TEMPLATES, NPC_DATE_PREFERENCES } from '../src/data/dates.js';
import { LOCATIONS } from '../src/data/locations.js';
import { ARCHETYPES, NPCS } from '../src/data/npcs.js';
import { NPC_SCHEDULE } from '../src/data/townTexture.js';
import { REPUTATION_CIRCLES } from '../src/sim/reputation.js';

const PHASE2_NPC_IDS = [
  'liam',
  'ava',
  'ethan',
  'olivia',
  'noah',
  'isabella',
  'james',
  'sofia',
  'emma',
  'alexander',
];

const VALID_STATS = new Set([
  'fitness',
  'intelligence',
  'charisma',
  'style',
  'corporate',
  'programming',
  'marketing',
  'finance',
  'negotiation',
  'culinary',
  'creativity',
  'music',
  'gaming',
  'confidence',
  'socialIq',
  'empathy',
]);

const getReputationCircleCount = (npcId) => Object.values(REPUTATION_CIRCLES)
  .filter((npcIds) => npcIds.includes(npcId)).length;

test('new phase 2 NPCs are wired into relationship, encounter, reputation, and date systems', () => {
  const npcById = new Map(NPCS.map((npc) => [npc.id, npc]));

  for (const npcId of PHASE2_NPC_IDS) {
    const npc = npcById.get(npcId);
    assert.ok(npc, `${npcId} must exist in NPCS`);
    assert.ok(ARCHETYPES[npc.archetype], `${npcId} references missing archetype`);
    assert.ok(Array.isArray(npc.romanceArc), `${npcId} needs a romance arc`);
    assert.equal(npc.romanceArc.length, 6, `${npcId} needs a six-stage romance arc`);
    assert.ok(NPC_SCHEDULE[npcId]?.length > 0, `${npcId} needs organic schedules`);
    assert.ok(getReputationCircleCount(npcId) > 0, `${npcId} needs a reputation circle`);

    for (const entry of NPC_SCHEDULE[npcId]) {
      assert.ok(LOCATIONS[entry.location], `${npcId} schedule references missing location ${entry.location}`);
    }

    for (const dateType of NPC_DATE_PREFERENCES[npcId] || []) {
      assert.ok(DATE_TEMPLATES[dateType], `${npcId} references missing date template ${dateType}`);
    }

    for (const chapter of npc.romanceArc) {
      for (const choice of chapter.choices) {
        if (choice.checkStat) {
          assert.ok(VALID_STATS.has(choice.checkStat), `${npcId} references missing stat ${choice.checkStat}`);
        }
      }
    }
  }
});

test('every selectable date type has an authored template', () => {
  const selectableDateTypes = new Set(Object.values(NPC_DATE_PREFERENCES).flat());

  for (const dateType of selectableDateTypes) {
    assert.ok(DATE_TEMPLATES[dateType], `${dateType} is selectable but has no DATE_TEMPLATES entry`);
  }
});
