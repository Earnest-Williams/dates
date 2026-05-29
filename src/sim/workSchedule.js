import { getTimeWindowStatus } from './time.js';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const TRACK_SHIFT_TEMPLATES = {
  service: [
    { day: 'mon', startHour: 9, endHour: 17 },
    { day: 'tue', startHour: 9, endHour: 17 },
    { day: 'thu', startHour: 12, endHour: 20 },
    { day: 'fri', startHour: 12, endHour: 20 },
    { day: 'sat', startHour: 10, endHour: 18 },
  ],
  corporate: [
    { day: 'mon', startHour: 9, endHour: 17 },
    { day: 'tue', startHour: 9, endHour: 17 },
    { day: 'wed', startHour: 9, endHour: 17 },
    { day: 'thu', startHour: 9, endHour: 17 },
    { day: 'fri', startHour: 9, endHour: 17 },
  ],
  tech: [
    { day: 'mon', startHour: 10, endHour: 18 },
    { day: 'tue', startHour: 10, endHour: 18 },
    { day: 'wed', startHour: 10, endHour: 18 },
    { day: 'thu', startHour: 10, endHour: 18 },
    { day: 'fri', startHour: 10, endHour: 18 },
  ],
  creative: [
    { day: 'mon', startHour: 10, endHour: 18 },
    { day: 'wed', startHour: 10, endHour: 18 },
    { day: 'thu', startHour: 11, endHour: 19 },
    { day: 'fri', startHour: 11, endHour: 19 },
  ],
};

export const getDayKeyForDayNumber = (day) => DAY_KEYS[(Math.max(1, day) - 1) % 7];

export const createScheduleTemplate = (trackId) => TRACK_SHIFT_TEMPLATES[trackId] || TRACK_SHIFT_TEMPLATES.service;

export const getShiftForDay = (career, day) => {
  const template = career?.workScheduleTemplate || [];
  const dayKey = getDayKeyForDayNumber(day);
  const shift = template.find((entry) => entry.day === dayKey);
  if (!shift) return null;
  return {
    ...shift,
    day,
  };
};

export const getShiftWindow = (shift) => (
  shift
    ? { startHour: shift.startHour, endHour: shift.endHour, requireFinish: true }
    : null
);

export const getShiftAttendanceStatus = (time, shift) => {
  if (!shift) return null;
  const window = getShiftWindow(shift);
  const finishStatus = getTimeWindowStatus(time, window, 32);
  if (!finishStatus.available) return { allowed: false, reason: finishStatus.reason };

  const late = time.hour > shift.startHour || (time.hour === shift.startHour && time.minute > 0);
  return { allowed: true, late };
};

export const getAttendanceRecord = (career, day) => career?.attendance?.records?.[day] || null;

export const withAttendanceRecord = (career, day, status) => {
  const current = career?.attendance || { records: {}, consecutiveMisses: 0, totalMissed: 0, totalLate: 0 };
  const records = { ...(current.records || {}), [day]: status };
  const consecutiveMisses = status === 'missed' ? (current.consecutiveMisses || 0) + 1 : 0;
  const totalMissed = (current.totalMissed || 0) + (status === 'missed' ? 1 : 0);
  const totalLate = (current.totalLate || 0) + (status === 'late' ? 1 : 0);
  return {
    ...career,
    attendance: {
      ...current,
      records,
      consecutiveMisses,
      totalMissed,
      totalLate,
    },
  };
};

