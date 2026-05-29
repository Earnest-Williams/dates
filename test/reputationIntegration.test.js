import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';
import { evaluateRepairAction } from '../src/sim/relationshipRepair.js';

const cloneState = () => structuredClone(initialState);

test('public dates update the relevant reputation circle and expose gossip pressure', () => {
  const state = cloneState();
  state.reputation.academic = 25;
  state.matches.elena = {
    met: true,
    relationship: 20,
    chemistry: 10,
    dateCount: 0,
    storyTier: 1,
  };

  const dating = gameReducer(state, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' },
  });

  assert.equal(dating.reputation.academic, 27);
  assert.match(dating.logs[0], /academic circle noticed the public date/);

  const resolved = gameReducer(dating, {
    type: 'RESOLVE_DATE_EVENT',
    payload: {
      finalVibe: 15,
      logText: 'The public study date collapsed.',
      dateOutcome: { conflict: 'fake_expertise' },
    },
  });

  assert.equal(resolved.lastDateRecap.gossipPenalty, 2);
  assert.ok(resolved.lastDateRecap.relationshipChange < -10);
  assert.match(resolved.logs[1], /Public gossip added pressure/);
});

test('organic encounters change reputation and reputation modifies repair evaluation', () => {
  const state = cloneState();
  state.matches.elena = {
    met: true,
    relationship: 5,
    chemistry: 5,
    dateCount: 0,
    storyTier: 0,
    relationshipStage: 'acquaintance',
  };
  state.activeEncounterEvent = {
    npcId: 'elena',
    location: 'library',
    choices: [
      {
        text: 'Help carry research notes',
        relationship: 5,
        chemistry: 2,
        mood: 1,
      },
    ],
  };

  const resolved = gameReducer(state, {
    type: 'RESOLVE_ORGANIC_ENCOUNTER',
    payload: { choiceIndex: 0 },
  });

  assert.equal(resolved.reputation.academic, 1);
  assert.match(resolved.logs[0], /academic circle reacted to the encounter/);

  const repairState = cloneState();
  repairState.matches.elena = {
    met: true,
    relationship: 25,
    chemistry: 20,
    dateCount: 1,
    storyTier: 1,
    activeConflictId: 'fake_expertise',
    pendingRepairScene: 'honest_study_repair',
    repairOpenedDay: 1,
    compatibilityScore: 45,
  };
  repairState.relationshipMemory.elena = {
    rememberedChoices: [],
    sharedActivities: [],
    promises: { honest_study_repair: 'pending' },
    importantMoments: ['fake_expertise'],
    comfortKnown: [],
    lastMeaningfulInteractionDay: 1,
  };

  repairState.reputation.academic = 30;
  const goodStanding = evaluateRepairAction(
    repairState,
    'elena',
    repairState.matches.elena,
    'context_repair'
  );

  repairState.reputation.academic = -30;
  const badStanding = evaluateRepairAction(
    repairState,
    'elena',
    repairState.matches.elena,
    'context_repair'
  );

  assert.equal(goodStanding.reputationModifier, 1.2);
  assert.equal(badStanding.reputationModifier, 0.8);
  assert.ok(goodStanding.score > badStanding.score);
});
