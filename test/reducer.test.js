import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTINES, isRoutineAvailable } from '../src/data/routines.js';
import { applyRoutineEffects } from '../src/state/reducers/action.js';
import { initialState, gameReducer } from '../src/state/reducers/rootReducer.js';
import { SETTLEMENTS } from '../src/data/geography.js';
import { getBusinessesForSettlement, getJobOpeningsForSettlement } from '../src/data/businesses.js';

const cloneState = () => structuredClone(initialState);

test('routes TAKE_GIG into career reducer (regression for unmapped action)', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'TAKE_GIG', payload: { gigId: 'data_entry' } });
  assert.notEqual(next, state);
  assert.ok(next.stats.money > state.stats.money);
});

test('routes TOGGLE_HEALTH_INSURANCE into action reducer', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'TOGGLE_HEALTH_INSURANCE' });
  assert.equal(next.living.hasHealthInsurance, true);
});

test('unknown actions are no-op', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'UNKNOWN_ACTION' });
  assert.deepEqual(next, state);
});

test('intro starts the first generation in the Endleigh starter setup', () => {
  const state = cloneState();

  assert.equal(state.gamePhase, 'intro');
  assert.equal(state.family.age, 18);
  assert.equal(state.stats.money, 2500);
  assert.equal(state.activeLocation, 'Endleigh');
  assert.equal(state.living.rentWaivedUntilDay, 365);
  assert.equal(state.career.activeTrack, null);
  assert.equal(state.inventory.basic_phone, 1);

  const next = gameReducer(state, { type: 'COMPLETE_INTRO' });
  assert.equal(next.gamePhase, 'living');
});

test('job hunting can move an unemployed starter into entry work', () => {
  const state = cloneState();

  const next = gameReducer(state, { type: 'JOB_HUNT', payload: { optionId: 'job_center' } });

  assert.equal(next.career.activeTrack, 'service');
  assert.equal(next.career.employerId, 'moss_lane_service');
  assert.equal(next.career.jobTitle, 'Forecourt Assistant');
  assert.ok(next.career.supervisorName);
  assert.ok(Array.isArray(next.career.workScheduleTemplate));
  assert.equal(next.career.titleLevel, 1);
  assert.ok(next.needs.energy < state.needs.energy);
  assert.match(next.logs[0], /Moss Lane Service & Shop/);
});

test('missing repeated scheduled shifts leads to termination', () => {
  const state = cloneState();
  state.career.activeTrack = 'service';
  state.career.jobTitle = 'Counter Assistant';
  state.career.employerId = 'endleigh_stores';
  state.career.workScheduleTemplate = [
    { day: 'mon', startHour: 9, endHour: 17 },
    { day: 'tue', startHour: 9, endHour: 17 },
    { day: 'wed', startHour: 9, endHour: 17 },
  ];
  state.career.attendance = { records: {}, consecutiveMisses: 0, totalMissed: 0, totalLate: 0 };
  state.time.day = 1;
  state.time.hour = 8;
  state.time.minute = 0;

  const after72Hours = gameReducer(state, { type: 'ADVANCE_TIME', payload: { ticks: 432 } });

  assert.equal(after72Hours.career.activeTrack, null);
  assert.equal(after72Hours.career.jobTitle, null);
  assert.ok(after72Hours.logs.some((line) => /fired after repeated no-shows/.test(line)));
});

test('job website search requires the starter phone', () => {
  const state = cloneState();
  state.inventory = {};

  const next = gameReducer(state, { type: 'JOB_HUNT', payload: { optionId: 'job_websites' } });

  assert.equal(next.career.activeTrack, null);
  assert.match(next.logs[0], /basic phone/);
});

test('job website search describes late-day time accurately', () => {
  const state = cloneState();
  state.time.hour = 16;
  state.time.minute = 40;

  const next = gameReducer(state, { type: 'JOB_HUNT', payload: { optionId: 'job_websites' } });

  assert.equal(next.time.hour, 18);
  assert.equal(next.time.minute, 0);
  assert.doesNotMatch(next.logs[0], /morning/);
  assert.match(next.logs[0], /1 hour 20 minutes/);
});

test('job hunt feedback includes actual time passage', () => {
  const state = cloneState();

  const next = gameReducer(state, { type: 'JOB_HUNT', payload: { optionId: 'beat_pavement' } });

  assert.equal(next.time.hour, 14);
  assert.equal(next.time.minute, 0);
  assert.match(next.logs[0], /through the morning and into the afternoon/);
  assert.match(next.logs[0], /8:00 AM to 2:00 PM/);
});

test('job hunting respects practical time windows', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, { type: 'JOB_HUNT', payload: { optionId: 'beat_pavement' } });

  assert.equal(next.career.activeTrack, null);
  assert.deepEqual(next.time, state.time);
  assert.match(next.logs[0], /not practical right now/);
  assert.match(next.logs[0], /8 AM-6 PM/);
});

test('career project work respects practical time windows', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;
  state.career.activeTrack = 'service';
  state.career.currentProject = 'cover_counter';
  state.career.titleLevel = 1;

  const next = gameReducer(state, { type: 'WORK_ON_PROJECT', payload: { energyCost: 20 } });

  assert.deepEqual(next.time, state.time);
  assert.equal(next.career.projectProgress, state.career.projectProgress);
  assert.match(next.logs[0], /Work shift is not practical right now/);
});

test('gig work respects practical time windows', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, { type: 'TAKE_GIG', payload: { gigId: 'data_entry' } });

  assert.deepEqual(next.time, state.time);
  assert.equal(next.stats.money, state.stats.money);
  assert.match(next.logs[0], /Data Entry is not practical right now/);
});

test('side hustles respect practical time windows', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;
  state.properties.vehicles = ['sports_car'];

  const next = gameReducer(state, { type: 'WORK_SIDE_HUSTLE', payload: { hustleId: 'rideshare' } });

  assert.deepEqual(next.time, state.time);
  assert.equal(next.stats.money, state.stats.money);
  assert.match(next.logs[0], /Rideshare Driver is not practical right now/);
});

test('career interviews respect practical time windows', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, { type: 'SWITCH_TRACK', payload: { trackId: 'service' } });

  assert.equal(next.career.activeTrack, null);
  assert.match(next.logs[0], /Career interviews are not practical right now/);
});

test('career interview attempts consume time when available', () => {
  const state = cloneState();
  state.time.hour = 9;
  state.time.minute = 0;

  const next = gameReducer(state, { type: 'SWITCH_TRACK', payload: { trackId: 'service' } });

  assert.equal(next.time.hour, 11);
  assert.equal(next.time.minute, 0);
  assert.match(next.logs[0], /Failed the interview/);
});

test('starting a project uses time and respects work hours', () => {
  const openState = cloneState();
  openState.time.hour = 10;
  openState.time.minute = 0;
  openState.career.activeTrack = 'service';
  openState.career.titleLevel = 1;

  const openResult = gameReducer(openState, { type: 'START_PROJECT', payload: { projectId: 'cover_counter' } });
  assert.equal(openResult.career.currentProject, 'cover_counter');
  assert.equal(openResult.time.hour, 10);
  assert.equal(openResult.time.minute, 20);

  const closedState = cloneState();
  closedState.time.hour = 2;
  closedState.time.minute = 0;
  closedState.career.activeTrack = 'service';
  closedState.career.titleLevel = 1;

  const closedResult = gameReducer(closedState, { type: 'START_PROJECT', payload: { projectId: 'cover_counter' } });
  assert.deepEqual(closedResult.time, closedState.time);
  assert.match(closedResult.logs[0], /Starting a shift plan is not practical right now/);
});

test('each settlement has representative essential businesses and starter openings', () => {
  for (const settlementId of Object.keys(SETTLEMENTS)) {
    const businesses = getBusinessesForSettlement(settlementId);
    const types = new Set(businesses.map((business) => business.type));

    assert.ok(types.has('grocery') || types.has('supermarket'), `${settlementId} needs a grocery store`);
    assert.ok(types.has('petrol_station'), `${settlementId} needs a petrol station`);
    assert.ok(types.has('pub'), `${settlementId} needs a pub`);
    assert.ok(getJobOpeningsForSettlement(settlementId, 'beat_pavement').length > 0, `${settlementId} needs walk-in starter jobs`);
  }
});

test('prepaid starter rent prevents weekly rent charges during first year', () => {
  const state = cloneState();
  state.time.day = 7;
  state.stats.money = 2500;

  const next = gameReducer(state, { type: 'PROCESS_WEEKLY_BILLS' });
  assert.ok(next.stats.money > state.stats.money);
  assert.equal(next.stats.housingTier, 1);
  assert.match(next.logs[0], /Rent is prepaid/);
});

test('routine action advances time and applies need/stat changes', () => {
  const state = cloneState();
  state.activeLocation = 'Bramblewick';
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'take_walk' } });
  assert.equal(next.time.minute, 30);
  assert.ok(next.needs.energy < state.needs.energy);
  assert.ok(next.needs.mood > state.needs.mood - 1);
  assert.ok(next.stats.fitness > state.stats.fitness);
});

test('routine reducer safely ignores unknown routine id', () => {
  const state = cloneState();
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'missing_routine' } });
  assert.deepEqual(next, state);
});

test('calendar records time-advancing actions automatically', () => {
  const state = cloneState();
  state.gamePhase = 'living';

  const next = gameReducer(state, {
    type: 'PERFORM_ACTION',
    payload: {
      actionName: 'Study (2hrs)',
      ticks: 12,
      statChanges: { intelligence: 2 },
      energyCost: 15,
      moneyChange: 0,
    },
  });

  assert.equal(next.calendar.events.length, 1);
  assert.equal(next.calendar.events[0].label, 'Study (2hrs)');
  assert.equal(next.calendar.events[0].startLabel, '8:00 AM');
  assert.equal(next.calendar.events[0].endLabel, '10:00 AM');
});

test('calendar records administrative scheduling actions', () => {
  const state = cloneState();
  state.time.hour = 10;
  state.time.minute = 0;
  state.stats.creativity = 30;

  const next = gameReducer(state, { type: 'ENROLL_COURSE', payload: { courseId: 'design_workshop', useLoan: false } });

  assert.equal(next.time.hour, 10);
  assert.equal(next.time.minute, 30);
  assert.equal(next.education.activeCourse, 'design_workshop');
  assert.equal(next.calendar.events[0].actionType, 'ENROLL_COURSE');
});

test('perform action respects time windows in reducer', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, {
    type: 'PERFORM_ACTION',
    payload: {
      actionName: 'Studied at local library',
      ticks: 6,
      statChanges: { intelligence: 1 },
      energyCost: 10,
      moneyChange: 0,
      availableWindow: { startHour: 7, endHour: 23, requireFinish: true },
      durationTicks: 6,
    },
  });

  assert.deepEqual(next.time, state.time);
  assert.match(next.logs[0], /not practical right now/);
});

test('dates respect location time windows in reducer', () => {
  const state = cloneState();
  state.gamePhase = 'living';
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, {
    type: 'GO_ON_DATE',
    payload: { npcId: 'elena', locationKey: 'library', dateType: 'library_date' },
  });

  assert.equal(next.gamePhase, 'living');
  assert.deepEqual(next.time, state.time);
  assert.match(next.logs[0], /Date at Grand Library is not practical right now/);
});

test('routine reducer blocks daytime routines during the night', () => {
  const state = cloneState();
  state.time.hour = 3;
  state.time.minute = 0;

  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'tidy_apartment' } });

  assert.deepEqual(next.time, state.time);
  assert.equal(next.needs.energy, state.needs.energy);
  assert.match(next.logs[0], /Cannot do "Tidy the Apartment" right now/);
});

test('routine availability tolerates partially initialized state', () => {
  const routine = ROUTINES.find((item) => item.id === 'call_family_friend');
  assert.equal(isRoutineAvailable(routine, { activeLocation: 'Endleigh' }), false);
});

test('routine reducer ignores non-numeric effect targets', () => {
  const state = cloneState();
  const { updatedStats, updatedNeeds } = applyRoutineEffects(state, {
    effects: { credentials: 5, mood: 1 },
    energyCost: 0,
  });

  assert.deepEqual(updatedStats.credentials, state.stats.credentials);
  assert.equal(updatedNeeds.mood, Math.min(100, state.needs.mood + 1));
});

test('routine tracker resets weekly counts when crossing week boundary after skipped routine days', () => {
  const state = cloneState();
  state.time.day = 9;
  state.activeLocation = 'Bramblewick';
  state.routineTracker = {
    day: 7,
    completedToday: ['read_fiction'],
    weeklyCounts: { read_fiction: 3 },
  };
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'take_walk' } });

  assert.equal(next.routineTracker.day, 9);
  assert.deepEqual(next.routineTracker.weeklyCounts, { take_walk: 1 });
});

test('routine reducer tolerates partially initialized tracker from older saves', () => {
  const state = cloneState();
  state.activeLocation = 'Bramblewick';
  state.routineTracker = { day: 1 };
  const next = gameReducer(state, { type: 'DO_ROUTINE', payload: { routineId: 'take_walk' } });

  assert.equal(next.routineTracker.day, 1);
  assert.deepEqual(next.routineTracker.completedToday, ['take_walk']);
  assert.equal(next.routineTracker.weeklyCounts.take_walk, 1);
});
