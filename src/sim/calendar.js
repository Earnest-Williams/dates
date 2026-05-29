import { NPCS } from '../data/npcs.js';
import { ROUTINES } from '../data/routines.js';
import { CAREER_TRACKS, JOB_SEARCH_OPTIONS } from '../data/projects.js';
import { gigs, sideHustles } from '../data/gigs.js';
import { courses } from '../data/education.js';
import { abilities } from '../data/abilities.js';
import { SETTLEMENTS } from '../data/geography.js';
import { LOCATIONS } from '../data/locations.js';
import { formatTime, getTimeWindowStatus } from './time.js';
import { getDayKeyForDayNumber, getShiftForDay } from './workSchedule.js';

const MAX_CALENDAR_EVENTS = 180;
const DEFAULT_DATE_WINDOW = { startHour: 6, endHour: 24, requireFinish: true };

const toAbsoluteMinutes = (time) => ((time.day - 1) * 24 * 60) + (time.hour * 60) + time.minute;

const timesEqual = (a, b) => a.day === b.day && a.hour === b.hour && a.minute === b.minute;

const getNpcName = (npcId) => NPCS.find((npc) => npc.id === npcId)?.name || npcId;

const getRoutineLabel = (routineId) => ROUTINES.find((routine) => routine.id === routineId)?.label || routineId;

const getJobHuntLabel = (optionId) => JOB_SEARCH_OPTIONS[optionId]?.name || 'Job Search';

const getGigName = (gigId) => gigs[gigId]?.name || gigId;

const getHustleName = (hustleId) => sideHustles[hustleId]?.name || hustleId;

const getCourseName = (courseId) => courses[courseId]?.name || courseId;

const getAbilityName = (abilityId) => abilities[abilityId]?.name || abilityId;
const getTrackName = (trackId) => CAREER_TRACKS[trackId]?.name || trackId;

const normalizeCalendar = (calendar = {}) => ({
  lastEventId: Number.isFinite(calendar.lastEventId) ? calendar.lastEventId : 0,
  events: Array.isArray(calendar.events) ? calendar.events : [],
});

const createDescriptor = (state, action) => {
  switch (action.type) {
    case 'PERFORM_ACTION':
      return {
        label: action.payload.actionName || 'Activity',
        category: 'activity',
        mergeKey: `activity:${action.payload.actionName || 'generic'}`,
      };
    case 'SLEEP':
      return {
        label: `Sleep (${action.payload?.hours || 0}h)`,
        category: 'rest',
        mergeKey: 'sleep',
      };
    case 'COOK_MEAL':
      return { label: 'Cooked a meal', category: 'home', mergeKey: 'cook_meal' };
    case 'DINE_OUT':
      return { label: 'Dined out', category: 'food', mergeKey: 'dine_out' };
    case 'SHOWER':
      return { label: 'Shower', category: 'home', mergeKey: 'shower' };
    case 'WATCH_TV':
      return { label: 'Watched TV', category: 'home', mergeKey: 'watch_tv' };
    case 'VISIT_HOSPITAL':
      return { label: 'Clinic visit', category: 'health', mergeKey: 'visit_hospital' };
    case 'TRAVEL': {
      const locationName = SETTLEMENTS[action.payload?.locationKey]?.name || action.payload?.locationKey || 'destination';
      return {
        label: `Travel to ${locationName}`,
        category: 'travel',
        mergeKey: `travel:${action.payload?.locationKey || 'unknown'}`,
      };
    }
    case 'DO_ROUTINE':
      return {
        label: `Routine: ${getRoutineLabel(action.payload?.routineId)}`,
        category: 'routine',
        mergeKey: `routine:${action.payload?.routineId || 'unknown'}`,
      };
    case 'JOB_HUNT':
      return {
        label: getJobHuntLabel(action.payload?.optionId),
        category: 'career',
        mergeKey: `job_hunt:${action.payload?.optionId || 'unknown'}`,
      };
    case 'SWITCH_TRACK':
      return {
        label: `Interview: ${getTrackName(action.payload?.trackId)}`,
        category: 'career',
        mergeKey: `switch_track:${action.payload?.trackId || 'unknown'}`,
      };
    case 'START_PROJECT':
      return {
        label: 'Planned next project shift',
        category: 'career',
        mergeKey: `start_project:${action.payload?.projectId || 'unknown'}`,
      };
    case 'WORK_ON_PROJECT':
      return {
        label: 'Career shift',
        category: 'career',
        mergeKey: `project:${state.career?.currentProject || 'unknown'}`,
      };
    case 'TAKE_GIG':
      return {
        label: `Freelance: ${getGigName(action.payload?.gigId)}`,
        category: 'career',
        mergeKey: `gig:${action.payload?.gigId || 'unknown'}`,
      };
    case 'WORK_SIDE_HUSTLE':
      return {
        label: `Side hustle: ${getHustleName(action.payload?.hustleId)}`,
        category: 'career',
        mergeKey: `hustle:${action.payload?.hustleId || 'unknown'}`,
      };
    case 'STUDY_COURSE':
      return {
        label: `Study: ${getCourseName(state.education?.activeCourse)}`,
        category: 'education',
        mergeKey: `course:${state.education?.activeCourse || 'unknown'}`,
      };
    case 'SWIPE_NPC':
      return { label: 'Checked LinkUp', category: 'social', mergeKey: 'swipe_session' };
    case 'ANSWER_DIALOGUE':
      return {
        label: `Talked with ${getNpcName(action.payload?.npcId)}`,
        category: 'social',
        mergeKey: `dialogue:${action.payload?.npcId || 'unknown'}`,
      };
    case 'GO_ON_DATE':
      return {
        label: `Travel for date with ${getNpcName(action.payload?.npcId)}`,
        category: 'date',
        mergeKey: `date_travel:${action.payload?.npcId || 'unknown'}`,
      };
    case 'CHOOSE_DATE_PHASE_OPTION':
    case 'RESOLVE_DATE_EVENT':
      return {
        label: `Date with ${getNpcName(state.activeDateEvent?.npcId)}`,
        category: 'date',
        mergeKey: `date:${state.activeDateEvent?.npcId || 'unknown'}`,
      };
    case 'RESOLVE_STORY_EVENT':
      return {
        label: `Story event with ${getNpcName(action.payload?.npcId)}`,
        category: 'social',
        mergeKey: `story:${action.payload?.npcId || 'unknown'}`,
      };
    case 'ASK_TO_MOVE_IN':
      return {
        label: `Move-in day with ${getNpcName(action.payload?.npcId)}`,
        category: 'family',
        mergeKey: `move_in:${action.payload?.npcId || 'unknown'}`,
      };
    case 'PROPOSE_MARRIAGE':
      return {
        label: `Proposal talk with ${getNpcName(action.payload?.npcId)}`,
        category: 'family',
        mergeKey: `proposal:${action.payload?.npcId || 'unknown'}`,
      };
    case 'COMPLETE_WEDDING':
      return { label: 'Wedding day', category: 'family', mergeKey: 'wedding_day' };
    case 'SELECT_PARENTING_CHOICE':
      return { label: 'Parenting decision', category: 'family', mergeKey: 'parenting_choice' };
    case 'REDUCE_CHILD_STRESS':
      return { label: 'Time with your child', category: 'family', mergeKey: 'reduce_child_stress' };
    case 'RESOLVE_ORGANIC_ENCOUNTER':
      return {
        label: `Encounter at ${state.activeEncounterEvent?.location || state.activeLocation}`,
        category: 'social',
        mergeKey: `encounter:${state.activeEncounterEvent?.npcId || 'unknown'}`,
      };
    case 'RESOLVE_NPC_ALERT':
      return {
        label: `Urgent message: ${getNpcName(state.activeNpcAlert?.npcId)}`,
        category: 'social',
        mergeKey: `npc_alert:${state.activeNpcAlert?.npcId || 'unknown'}`,
      };
    case 'ATTEMPT_REPAIR':
      return {
        label: `Repair talk with ${getNpcName(action.payload?.npcId)}`,
        category: 'social',
        mergeKey: `repair:${action.payload?.npcId || 'unknown'}`,
      };
    case 'POST_SIMSTAGRAM':
      return {
        label: `Simstagram: ${action.payload?.contentType || 'post'}`,
        category: 'social',
        mergeKey: `simstagram:${action.payload?.contentType || 'post'}`,
      };
    case 'USE_ABILITY':
      return {
        label: `Used ability: ${getAbilityName(action.payload?.abilityId)}`,
        category: 'ability',
        mergeKey: `ability:${action.payload?.abilityId || 'unknown'}`,
      };
    case 'ENROLL_COURSE':
      return {
        label: `Enrolled: ${getCourseName(action.payload?.courseId)}`,
        category: 'education',
        mergeKey: `enroll_course:${action.payload?.courseId || 'unknown'}`,
      };
    case 'PAY_BILLS':
      return {
        label: 'Paid bills',
        category: 'finance',
        mergeKey: 'pay_bills',
      };
    case 'TOGGLE_HEALTH_INSURANCE':
      return {
        label: 'Insurance admin',
        category: 'finance',
        mergeKey: 'insurance_toggle',
      };
    case 'DISCOVER_NPC_AT_LOCATION':
      return {
        label: `Met ${getNpcName(action.payload?.npcId)}`,
        category: 'social',
        mergeKey: `discover:${action.payload?.npcId || 'unknown'}`,
      };
    case 'INSTANT_MATCH':
      return {
        label: `Instant match with ${getNpcName(action.payload?.npcId)}`,
        category: 'social',
        mergeKey: `instant_match:${action.payload?.npcId || 'unknown'}`,
      };
    case 'ADVANCE_TIME':
      return {
        label: 'Waited',
        category: 'time',
        mergeKey: 'advance_time',
      };
    default:
      return null;
  }
};

const buildCalendarEvent = (descriptor, actionType, eventId, startTime, endTime, location) => {
  const durationMinutes = Math.max(0, toAbsoluteMinutes(endTime) - toAbsoluteMinutes(startTime));
  return {
    id: eventId,
    actionType,
    label: descriptor.label,
    category: descriptor.category,
    mergeKey: descriptor.mergeKey,
    location,
    startTime,
    endTime,
    startLabel: formatTime(startTime.hour, startTime.minute),
    endLabel: formatTime(endTime.hour, endTime.minute),
    durationMinutes,
  };
};

const shouldMerge = (latest, incoming) => (
  latest
  && latest.mergeKey === incoming.mergeKey
  && timesEqual(latest.endTime, incoming.startTime)
);

export const recordCalendarEvent = (state, nextState, action) => {
  if (nextState === state) return nextState;

  const startMinutes = toAbsoluteMinutes(state.time);
  const endMinutes = toAbsoluteMinutes(nextState.time);
  if (endMinutes <= startMinutes) return nextState;

  const descriptor = createDescriptor(state, action);
  if (!descriptor) return nextState;

  const calendar = normalizeCalendar(nextState.calendar || state.calendar);
  const nextEventId = calendar.lastEventId + 1;
  const location = LOCATIONS[nextState.activeLocation]?.name || nextState.activeLocation;
  const incomingEvent = buildCalendarEvent(
    descriptor,
    action.type,
    nextEventId,
    { ...state.time },
    { ...nextState.time },
    location,
  );

  const events = [...calendar.events];
  if (shouldMerge(events[0], incomingEvent)) {
    const latest = events[0];
    events[0] = {
      ...latest,
      endTime: incomingEvent.endTime,
      endLabel: incomingEvent.endLabel,
      durationMinutes: Math.max(0, toAbsoluteMinutes(incomingEvent.endTime) - toAbsoluteMinutes(latest.startTime)),
    };
    return {
      ...nextState,
      calendar: {
        ...calendar,
        lastEventId: nextEventId,
        events,
      },
    };
  }

  events.unshift(incomingEvent);
  if (events.length > MAX_CALENDAR_EVENTS) events.length = MAX_CALENDAR_EVENTS;

  return {
    ...nextState,
    calendar: {
      ...calendar,
      lastEventId: nextEventId,
      events,
    },
  };
};

const dayOffset = (day, cycle) => {
  const remainder = day % cycle;
  return remainder === 0 ? cycle : cycle - remainder;
};

export const getCalendarReminders = (state) => {
  const reminders = [];
  const day = state.time?.day || 1;
  const rentWaivedUntil = state.living?.rentWaivedUntilDay || 0;
  const activeTrack = state.career?.activeTrack || null;
  const currentProject = state.career?.currentProject || null;
  const activeCourse = state.education?.activeCourse || null;

  if (rentWaivedUntil >= day) {
    reminders.push(`Rent support ends on Day ${rentWaivedUntil} (${rentWaivedUntil - day} days left).`);
  }

  const nextWeekly = day + dayOffset(day, 7);
  reminders.push(`Weekly bills process on Day ${nextWeekly}.`);

  const nextMonthly = day + dayOffset(day, 30);
  reminders.push(`Monthly utilities process on Day ${nextMonthly}.`);

  if (state.living?.hasHealthInsurance) {
    reminders.push(`Health insurance premium is included in monthly billing.`);
  }

  if ((state.education?.studentLoans || 0) > 0) {
    reminders.push(`Student loan interest compounds weekly.`);
  }

  if ((state.stats?.taxOwed || 0) > 0) {
    reminders.push(`Tax debt is active: $${state.stats.taxOwed}.`);
  }

  if (!activeTrack) {
    reminders.push('Unemployed schedule: Job Centre (8 AM-5 PM), Beat the Pavement (8 AM-6 PM), Job Websites (7 AM-midnight).');
  } else if (currentProject) {
    reminders.push('Current project active: schedule an 8-hour shift between 6 AM and midnight.');
  } else {
    reminders.push(`You are employed in ${getTrackName(activeTrack)}. Start a project to plan your next shift.`);
  }

  if (activeTrack) {
    const upcoming = [];
    for (let offset = 0; offset < 7; offset += 1) {
      const dayNumber = day + offset;
      const shift = getShiftForDay(state.career, dayNumber);
      if (shift) {
        upcoming.push(`Day ${dayNumber} (${getDayKeyForDayNumber(dayNumber).toUpperCase()}): ${shift.startHour}:00-${shift.endHour}:00`);
      }
      if (upcoming.length >= 2) break;
    }
    if (upcoming.length > 0) {
      reminders.push(`Upcoming shifts: ${upcoming.join(' | ')}`);
    }
  }

  if (activeCourse) {
    const progress = state.education?.courseProgress || 0;
    reminders.push(`Course in progress: ${getCourseName(activeCourse)} (${progress} study ticks completed).`);
  }

  const pendingRepairs = Object.entries(state.matches || {}).filter(([, match]) => match?.pendingRepairScene);
  if (pendingRepairs.length > 0) {
    const names = pendingRepairs
      .slice(0, 2)
      .map(([npcId]) => getNpcName(npcId))
      .join(', ');
    reminders.push(`Relationship repair pending with ${names}.`);
  }

  return reminders;
};

export const isDateWindowAvailable = (state, locationKey, durationTicks = 6) => {
  const location = LOCATIONS[locationKey];
  if (!location?.availableWindow) {
    return { available: true, reason: null };
  }
  return getTimeWindowStatus(state.time, location.availableWindow, durationTicks);
};

export const getDateWindowLabel = (locationKey) => {
  const location = LOCATIONS[locationKey];
  return location?.availableWindow || DEFAULT_DATE_WINDOW;
};
