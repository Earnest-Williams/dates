import test from 'node:test';
import assert from 'node:assert/strict';
import { NPCS } from '../src/data/npcs.js';

const REQUIRED_TYPES = [
  'introduction',
  'early connection',
  'personal reveal',
  'conflict',
  'trust event',
  'commitment event',
];

test('all core npcs have six romance arc chapters with required beats', () => {
  assert.equal(NPCS.length, 8);

  for (const npc of NPCS) {
    assert.ok(Array.isArray(npc.romanceArc));
    assert.ok(npc.romanceArc.length >= 6);

    const chapterTypes = npc.romanceArc.map((chapter) => chapter.type);
    for (const requiredType of REQUIRED_TYPES) {
      assert.ok(chapterTypes.includes(requiredType), `${npc.id} missing ${requiredType}`);
    }
  }
});

test('new npc roster includes three added female routes and one bisexual npc', () => {
  const npcIds = new Set(NPCS.map((npc) => npc.id));
  assert.ok(npcIds.has('rina'));
  assert.ok(npcIds.has('maya'));
  assert.ok(npcIds.has('nora'));

  const maya = NPCS.find((npc) => npc.id === 'maya');
  assert.ok(maya);
  assert.equal(maya.gender, 'female');
  assert.equal(maya.sexuality, 'bisexual');
});

test('chapters include progression and outcome structure', () => {
  for (const npc of NPCS) {
    for (const chapter of npc.romanceArc) {
      assert.equal(typeof chapter.minRelationship, 'number');
      assert.equal(typeof chapter.emotionalBeat, 'string');
      assert.ok(chapter.emotionalBeat.length > 0);
      assert.ok(Array.isArray(chapter.choices));
      assert.ok(chapter.choices.length >= 2);

      let hasNonStatPath = false;
      let hasImpacts = false;
      let hasAltOutcome = false;
      for (const choice of chapter.choices) {
        if (!choice.checkStat) {
          hasNonStatPath = true;
        }

        const directImpact =
          typeof choice.relationshipImpact === 'number' &&
          typeof choice.chemistryImpact === 'number';

        const successImpact =
          choice.onSuccess &&
          typeof choice.onSuccess.relationshipImpact === 'number' &&
          typeof choice.onSuccess.chemistryImpact === 'number';

        const failImpact =
          choice.onFail &&
          typeof choice.onFail.relationshipImpact === 'number' &&
          typeof choice.onFail.chemistryImpact === 'number';

        if (directImpact || (successImpact && failImpact)) {
          hasImpacts = true;
        }

        if (choice.onFail || typeof choice.relationshipImpact === 'number') {
          hasAltOutcome = true;
        }
      }

      assert.ok(hasNonStatPath, `${npc.id}:${chapter.id} must allow a non-stat path`);
      assert.ok(hasImpacts, `${npc.id}:${chapter.id} missing relationship/chemistry impacts`);
      assert.ok(hasAltOutcome, `${npc.id}:${chapter.id} must preserve alternate outcomes`);
    }
  }
});
