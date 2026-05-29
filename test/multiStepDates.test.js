import test from 'node:test';
import assert from 'node:assert/strict';
import { DATE_TEMPLATES, NPC_DATE_PREFERENCES } from '../src/data/dates.js';
import { FURNITURE, HOME_ACTIVITIES, calculateHomeStyleProfile } from '../src/data/furniture.js';
import { LOCATIONS } from '../src/data/locations.js';
import { NPCS } from '../src/data/npcs.js';
import { getNpcEncounters, LOCATION_EVENTS } from '../src/data/townTexture.js';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';

const cloneState = () => structuredClone(initialState);

test('every NPC has at least two preferred non-gift date types', () => {
  for (const npc of NPCS) {
    const preferences = NPC_DATE_PREFERENCES[npc.id] || [];
    assert.ok(preferences.length >= 2, `${npc.id} needs at least two preferences`);
    for (const dateType of preferences.slice(0, 2)) {
      assert.ok(DATE_TEMPLATES[dateType], `${dateType} must be a template`);
    }
  }
});

test('date templates use three authored phases with discovery, memory, and repair paths', () => {
  for (const template of Object.values(DATE_TEMPLATES)) {
    assert.deepEqual(template.phases.map((phase) => phase.id), [
      'arrival',
      'shared_activity',
      'closing_moment',
    ]);
    assert.ok(template.phases.every((phase) => phase.choices.length >= 3));
    assert.ok(template.phases.some((phase) => phase.choices.some((choice) => choice.discovery)));
    assert.ok(template.phases.some((phase) => phase.choices.some((choice) => choice.memory)));
    assert.ok(template.phases.some((phase) => phase.choices.some((choice) => choice.repairScene)));
    assert.equal(
      template.phases.some((phase) => phase.choices.some((choice) => choice.text.toLowerCase().includes('gift'))),
      false
    );
  }
});

test('every venue has a unique location event that can affect relationship discovery', () => {
  for (const venueKey of Object.keys(LOCATIONS)) {
    assert.ok(LOCATION_EVENTS[venueKey], `${venueKey} needs a location event`);
    assert.ok(LOCATION_EVENTS[venueKey].romanceHooks.length > 0);
  }
});

test('schedules allow NPC encounters outside the dating app', () => {
  const encounters = getNpcEncounters({ day: 1, hour: 19 }, 'library');
  assert.ok(encounters.some((encounter) => encounter.npcId === 'elena'));
  assert.equal(encounters[0].location, 'library');
});

test('mediocre and failed dates create memory, discovery, and repair state', () => {
  const state = cloneState();
  state.matches.elena = {
    met: true,
    relationship: 10,
    chemistry: 10,
    dateCount: 0,
    storyTier: 0,
  };

  const dating = gameReducer(state, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' },
  });
  const afterMediocre = gameReducer(dating, {
    type: 'RESOLVE_DATE_EVENT',
    payload: {
      finalVibe: 38,
      logText: 'A mixed but revealing library date.',
      dateOutcome: {
        discoveries: ['library_late_focus'],
        memories: ['listened_in_the_stacks'],
        relationship: 1,
      },
    },
  });
  assert.ok(afterMediocre.relationshipMemory.elena.comfortKnown.includes('library_late_focus'));
  assert.ok(afterMediocre.relationshipMemory.elena.rememberedChoices.includes('listened_in_the_stacks'));

  const nextMorning = {
    ...afterMediocre,
    time: {
      ...afterMediocre.time,
      day: afterMediocre.time.day + 1,
      hour: 10,
      minute: 0,
    },
  };
  const failedDating = gameReducer(nextMorning, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'study_date' },
  });
  const afterFailed = gameReducer(failedDating, {
    type: 'RESOLVE_DATE_EVENT',
    payload: {
      finalVibe: 15,
      logText: 'The study date went badly.',
      dateOutcome: {
        conflict: 'fake_expertise',
        repairScene: 'honest_study_repair',
      },
    },
  });
  assert.equal(afterFailed.relationshipMemory.elena.promises.honest_study_repair, 'pending');
  assert.equal(afterFailed.matches.elena.pendingRepairScene, 'honest_study_repair');
});

test('home style profile affects home dates without creating gift preferences', () => {
  const profile = calculateHomeStyleProfile(['bookshelf', 'queen_bed', 'yoga_mat']);
  assert.equal(profile.literary, 1);
  assert.equal(profile.cozy, 2);
  assert.equal(profile.fitness, 1);
  assert.equal(HOME_ACTIVITIES.quiet_reading_evening.dateType, 'quiet_evening_in');

  for (const furniture of Object.values(FURNITURE)) {
    assert.equal(furniture.favoriteNpc, undefined);
    assert.equal(furniture.relationshipBonus, undefined);
  }
});

test('multi-phase date choices accumulate state and automatically resolve at end', () => {
  const state = cloneState();
  state.matches.elena = { met: true, relationship: 10, chemistry: 10, dateCount: 0, storyTier: 0 };
  
  const initDate = gameReducer(state, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' },
  });
  
  assert.equal(initDate.activeDateEvent.currentPhaseIndex, 0);
  assert.equal(initDate.activeDateEvent.vibe, 30);
  
  const phase1 = gameReducer(initDate, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 } // "Match their quiet pace..." -> connection 12
  });
  
  assert.equal(phase1.activeDateEvent.currentPhaseIndex, 1);
  assert.equal(phase1.activeDateEvent.vibe, 42); // 30 + 12
  
  const phase2 = gameReducer(phase1, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 } // "Piece together the reader's story..." -> checks intelligence 30
  });
  
  assert.equal(phase2.activeDateEvent.currentPhaseIndex, 2);
  // Without high intelligence, it falls to fail -> base 14 + fail 2 = 16. 42 + 16 = 58
  assert.equal(phase2.activeDateEvent.vibe, 58);
  
  const phase3 = gameReducer(phase2, {
    type: 'CHOOSE_DATE_PHASE_OPTION',
    payload: { optionIndex: 0 } // "Help carry the box..." -> connection 12, memory
  });
  
  // Resolves automatically
  assert.equal(phase3.activeDateEvent, null);
  assert.strictEqual(phase3.gamePhase, 'date_recap');
  assert.ok(phase3.relationshipMemory.elena.rememberedChoices.includes('helped_library_volunteers'));
});
