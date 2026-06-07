import { getCalendarReminders } from '../../sim/calendar';
import { getDaypart } from '../../sim/time';
import { getDayKeyForDayNumber, getShiftForDay } from '../../sim/workSchedule';

const toAbsoluteMinutes = (time) => ((time.day - 1) * 24 * 60) + (time.hour * 60) + time.minute;

const isEventOnDay = (event, day) => event.startTime?.day === day || event.endTime?.day === day;

const CalendarPanel = ({ gameState }) => {
  const currentDay = gameState.time.day;
  const currentDaypart = getDaypart(gameState.time.hour);
  const calendar = gameState.calendar || { events: [] };
  const todayEvents = (calendar.events || [])
    .filter((event) => isEventOnDay(event, currentDay))
    .sort((a, b) => toAbsoluteMinutes(a.startTime) - toAbsoluteMinutes(b.startTime))
    .slice(-8);
  const plannedShift = getShiftForDay(gameState.career, currentDay);
  const shiftAttendance = gameState.career?.attendance?.records?.[currentDay] || null;
  const reminders = getCalendarReminders(gameState).slice(0, 5);

  return (
    <div className="bento-card calendar">
      <h2 className="section-title">Calendar & Schedule</h2>
      <p style={{ opacity: 0.78, marginTop: -6, marginBottom: 12 }}>
        Day {currentDay} ({currentDaypart})
      </p>

      <div className="calendar-list">
        {plannedShift && (
          <div className="calendar-item">
            <div className="calendar-time">
              {plannedShift.startHour}:00 - {plannedShift.endHour}:00
            </div>
            <div className="calendar-summary">
              <strong>Scheduled Work Shift ({getDayKeyForDayNumber(currentDay).toUpperCase()})</strong>
              <span>
                {gameState.career.jobTitle || 'Work'} {shiftAttendance ? `• ${shiftAttendance.replace('_', ' ')}` : '• pending'}
              </span>
            </div>
          </div>
        )}
        {todayEvents.length === 0 && (
          <p style={{ opacity: 0.65 }}>No entries yet today. Your actions will build the schedule automatically.</p>
        )}
        {todayEvents.map((event) => (
          <div key={event.id} className="calendar-item">
            <div className="calendar-time">
              {event.startLabel} - {event.endLabel}
            </div>
            <div className="calendar-summary">
              <strong>{event.label}</strong>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="calendar-reminders">
        <h3>Upcoming</h3>
        {reminders.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarPanel);
