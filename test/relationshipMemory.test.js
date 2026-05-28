import test from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS } from '../src/data/items.js';
import { NPCS } from '../src/data/npcs.js';
import { giveGift } from '../src/state/actions/social.js';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('item catalog contains no repeatable relationship gift entries', () => {
  for (const item of Object.values(ITEMS)) {
    assert.notEqual(item.type, 'gift');
    assert.equal(item.effect?.bonusArchetypes, undefined);
    assert.equal(item.effect?.relationship, undefined);
  }
});

test('npc data contains no gift preference tables', () => {
  for (const npc of NPCS) {
    assert.equal(npc.giftLikes, undefined);
    assert.equal(npc.lovedGifts, undefined);
    assert.equal(npc.likedGifts, undefined);
    assert.equal(npc.dislikedGifts, undefined);
  }
});

test('gift action is unavailable and cannot change relationship by repeated item use', () => {
  const state = cloneState();
  state.inventory.supplements = 2;
  state.matches.elena = {
    met: true,
    relationship: 10,
    chemistry: 10,
    dateCount: 0,
    storyTier: 0,
  };

  let dispatchedAction = null;
  const result = giveGift(state, (action) => {
    dispatchedAction = action;
  }, 'elena', 'supplements');
  const next = gameReducer(state, {
    type: 'GIVE_GIFT',
    payload: { npcId: 'elena', itemKey: 'supplements' },
  });

  assert.equal(result, false);
  assert.equal(dispatchedAction, null);
  assert.deepEqual(next, state);
});

test('dialogue and dates record relationship memory instead of item affection', () => {
  const state = cloneState();
  state.matches.elena = {
    met: true,
    relationship: 10,
    chemistry: 10,
    dateCount: 0,
    storyTier: 0,
  };

  const afterDialogue = gameReducer(state, {
    type: 'ANSWER_DIALOGUE',
    payload: { npcId: 'elena', optionIndex: 0 },
  });
  assert.ok(afterDialogue.relationshipMemory.elena.rememberedChoices.length > 0);
  assert.equal(afterDialogue.relationshipMemory.elena.lastMeaningfulInteractionDay, 1);

  const dating = gameReducer(afterDialogue, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library' },
  });
  const afterDate = gameReducer(dating, {
    type: 'RESOLVE_DATE_EVENT',
    payload: { finalVibe: 85, logText: 'A focused evening together.' },
  });

  assert.ok(afterDate.relationshipMemory.elena.sharedActivities.includes('date_library'));
  assert.ok(afterDate.relationshipMemory.elena.importantMoments.includes('memorable_date'));
});
