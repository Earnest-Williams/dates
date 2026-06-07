import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CORE_NPC_IDS,
  NPCS,
  RELATIONSHIP_CONFLICT_TRIGGERS,
  RELATIONSHIP_REPAIR_ACTIONS,
} from '../src/data/npcs.js';

const REQUIRED_TYPES = [
  'introduction',
  'early connection',
  'personal reveal',
  'conflict',
  'trust event',
  'commitment event',
];

const REQUIRED_CONFLICT_TRIGGERS = [
  'ignored_messages',
  'incompatible_choices',
  'low_mood',
  'jealousy_social_reputation',
  'missed_planned_date',
  'poor_date_ending',
  'ambition_mismatch',
  'home_lifestyle_mismatch',
  'broken_promises',
  'repeated_inattentive_dialogue',
];

const REQUIRED_REPAIR_ACTIONS = [
  'apologize',
  'give_space',
  'follow_through_on_previous_promise',
  'choose_thoughtful_activity',
  'revisit_meaningful_location',
  'ask_friend_for_advice',
  'write_message',
  'help_with_specific_problem',
  'spend_quiet_time_together',
];

test('all romanceable npcs have six romance arc chapters with required beats', () => {
  // Only female NPCs are romanceable
  const romanceableNPCs = NPCS.filter(n => n.gender === 'female');
  assert.ok(romanceableNPCs.length >= 6);

  for (const npc of romanceableNPCs) {
    assert.ok(Array.isArray(npc.romanceArc));
    assert.ok(npc.romanceArc.length >= 6);

    const chapterTypes = npc.romanceArc.map((chapter) => chapter.type);
    for (const requiredType of REQUIRED_TYPES) {
      assert.ok(chapterTypes.includes(requiredType), `${npc.id} missing ${requiredType}`);
    }
  }
});

test('relationship conflict and repair catalogs exclude gift shortcuts', () => {
  assert.deepEqual(RELATIONSHIP_CONFLICT_TRIGGERS, REQUIRED_CONFLICT_TRIGGERS);
  assert.deepEqual(RELATIONSHIP_REPAIR_ACTIONS, REQUIRED_REPAIR_ACTIONS);

  const serializedCatalogs = JSON.stringify([
    RELATIONSHIP_CONFLICT_TRIGGERS,
    RELATIONSHIP_REPAIR_ACTIONS,
  ]).toLowerCase();
  assert.equal(serializedCatalogs.includes('gift'), false);
});

test('current five npcs have depth pass relationship content', () => {
  for (const npcId of CORE_NPC_IDS) {
    const npc = NPCS.find((candidate) => candidate.id === npcId);
    assert.ok(npc, `${npcId} missing`);

    assert.ok(npc.hiddenCompatibilityTraits);
    assert.ok(Object.keys(npc.hiddenCompatibilityTraits).length >= 8);
    assert.ok(Array.isArray(npc.relationshipMemories));
    assert.ok(npc.relationshipMemories.length >= 6);
    assert.ok(Array.isArray(npc.preferredDateTypes));
    assert.ok(npc.preferredDateTypes.length >= 2);
    assert.ok(npc.conflictEvent);
    assert.ok(REQUIRED_CONFLICT_TRIGGERS.includes(npc.conflictEvent.trigger));
    assert.equal(npc.conflictEvent.doesNotHardFailRoute, true);
    assert.ok(npc.repairEvent);
    assert.ok(REQUIRED_REPAIR_ACTIONS.includes(npc.repairEvent.action));
    assert.equal(npc.repairEvent.noPurchasedItemRequired, true);
    assert.ok(npc.homeReaction);
    assert.ok(npc.locationBasedEncounter);
    assert.ok(npc.longTermRelationshipScene);
    assert.ok(npc.legacyFamilyReaction);
    assert.ok(Array.isArray(npc.choiceCallbacks));
    assert.ok(npc.choiceCallbacks.length >= 3);
  }
});

test('core npc repair paths depend on context instead of purchases or raw stats', () => {
  for (const npc of NPCS.filter((candidate) => CORE_NPC_IDS.includes(candidate.id))) {
    assert.ok(npc.conflictEvent.memoriesChecked.length > 0);
    assert.ok(npc.conflictEvent.compatibilityChecked.length > 0);
    assert.ok(npc.conflictEvent.timingWindow.length > 0);
    assert.ok(npc.repairEvent.successDependsOn.length >= 3);

    const repairText = JSON.stringify(npc.repairEvent).toLowerCase();
    assert.equal(npc.repairEvent.noPurchasedItemRequired, true);
    assert.equal(repairText.includes('buy apology flowers'), false);
    assert.equal(repairText.includes('preferred item'), false);
    assert.equal(repairText.includes('universal repair gift'), false);
    assert.equal(repairText.includes('+relationship'), false);
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
  // Only check romanceable (female) NPCs
  const romanceableNPCs = NPCS.filter(n => n.gender === 'female');
  for (const npc of romanceableNPCs) {
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
