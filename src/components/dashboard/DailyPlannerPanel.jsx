import { useState } from 'react';
import { getDaypart, formatTime } from '../../sim/time';
import { getShiftForDay } from '../../sim/workSchedule';
import { ROUTINES } from '../../data/routines';
import { NPCS } from '../../data/npcs';
import { LOCATIONS } from '../../data/locations';
import './DailyPlannerPanel.css';

const DAYS_TO_SHOW = 7;

const getDayName = (dayNumber) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[(dayNumber - 1) % 7];
};

const getTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour < 24; hour += 2) {
    slots.push({ hour, label: formatTime(hour, 0) });
  }
  return slots;
};

const getNpcName = (npcId) => {
  const npc = NPCS.find(n => n.id === npcId);
  return npc ? npc.name : npcId;
};

const getActivityColor = (category) => {
  const colors = {
    work: '#3b82f6',
    date: '#ec4899',
    social: '#8b5cf6',
    selfcare: '#10b981',
    study: '#f59e0b',
    routine: '#6366f1',
    travel: '#06b6d4',
    rest: '#6b7280',
    career: '#3b82f6',
    education: '#84cc16',
    home: '#f97316',
    health: '#ef4444',
    finance: '#eab308',
    family: '#ec4899',
  };
  return colors[category] || '#9ca3af';
};

const DailyPlannerPanel = ({ gameState }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'routine',
    routineId: '',
    npcId: '',
    location: '',
    customLabel: '',
    startHour: 8,
    duration: 2,
  });

  const { time, calendar, career, matches, activeLocation } = gameState;
  const currentDay = time.day;
  const currentHour = time.hour;
  const currentDaypart = getDaypart(currentHour);

  // Get scheduled work shifts for the week
  const getWorkShifts = () => {
    const shifts = [];
    for (let dayOffset = 0; dayOffset < DAYS_TO_SHOW; dayOffset++) {
      const dayNum = currentDay + dayOffset;
      const shift = getShiftForDay(career, dayNum);
      if (shift) {
        shifts.push({
          day: dayNum,
          startHour: shift.startHour,
          endHour: shift.endHour,
          label: 'Work Shift',
          category: 'work',
          location: career.jobTitle || 'Work',
        });
      }
    }
    return shifts;
  };

  // Get existing calendar events
  const getCalendarEvents = () => {
    const events = [];
    for (let dayOffset = 0; dayOffset < DAYS_TO_SHOW; dayOffset++) {
      const dayNum = currentDay + dayOffset;
      const dayEvents = (calendar?.events || [])
        .filter(e => e.startTime?.day === dayNum || e.endTime?.day === dayNum)
        .map(e => ({
          day: dayNum,
          startHour: e.startTime?.hour || 0,
          endHour: e.endTime?.hour || 0,
          label: e.label || 'Event',
          category: e.category || 'activity',
          location: e.location || activeLocation,
        }));
      events.push(...dayEvents);
    }
    return events;
  };

  // Get available routines
  const availableRoutines = ROUTINES.filter(r => {
    // Check furniture requirements
    if (r.furnitureReqs && r.furnitureReqs.length > 0) {
      const hasRequiredFurniture = r.furnitureReqs.some(req => 
        gameState.placedFurniture.includes(req)
      );
      if (!hasRequiredFurniture && !r.anyFurniture) return false;
    }
    return true;
  });

  // Get available NPCs for dates
  const availableNPCs = Object.entries(matches || {})
    .filter(([, match]) => match.met && match.relationship > 10)
    .map(([npcId]) => ({ id: npcId, name: getNpcName(npcId) }));

  // Get available locations
  const availableLocations = Object.entries(LOCATIONS)
    .map(([key, loc]) => ({ key, name: loc.name }))
    .filter(loc => loc.key !== 'home' || activeLocation === 'home');

  const workShifts = getWorkShifts();
  const calendarEvents = getCalendarEvents();
  const timeSlots = getTimeSlots();

  // Combine all events
  const allEvents = [...workShifts, ...calendarEvents];

  // Group events by day
  const eventsByDay = {};
  allEvents.forEach(event => {
    if (!eventsByDay[event.day]) {
      eventsByDay[event.day] = [];
    }
    eventsByDay[event.day].push(event);
  });

  // Get events for a specific day and time slot
  const getEventsForSlot = (dayNum, hour) => {
    const dayEvents = eventsByDay[dayNum] || [];
    return dayEvents.filter(e => hour >= e.startHour && hour < e.endHour);
  };

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  const handleSubmitEvent = () => {
    // This would dispatch an action to schedule the event
    // For now, just close the modal
    setShowAddEvent(false);
    setNewEvent({
      type: 'routine',
      routineId: '',
      npcId: '',
      location: '',
      customLabel: '',
      startHour: 8,
      duration: 2,
    });
  };

  const handleCancelEvent = () => {
    setShowAddEvent(false);
    setNewEvent({
      type: 'routine',
      routineId: '',
      npcId: '',
      location: '',
      customLabel: '',
      startHour: 8,
      duration: 2,
    });
  };

  // Check if current time allows scheduling
  const canSchedule = currentDaypart !== 'night' || currentHour < 22;

  return (
    <div className="bento-card daily-planner">
      <h2 className="section-title">Daily Planner</h2>
      
      <div className="planner-header">
        <p style={{ opacity: 0.78, marginTop: -6, marginBottom: 12 }}>
          Day {currentDay} ({currentDaypart}) • {formatTime(currentHour, time.minute)}
        </p>
        <button 
          className="btn-primary btn-small"
          onClick={handleAddEvent}
          disabled={!canSchedule}
        >
          + Add Event
        </button>
      </div>

      {/* Week view */}
      <div className="planner-week-view">
        {Array.from({ length: DAYS_TO_SHOW }).map((_, dayOffset) => {
          const dayNum = currentDay + dayOffset;
          const dayName = getDayName(dayNum);
          const isToday = dayNum === currentDay;
          const dayEvents = eventsByDay[dayNum] || [];
          
          return (
            <div 
              key={dayNum}
              className={`planner-day ${isToday ? 'today' : ''}`}
              onClick={() => setSelectedDay(dayNum)}
            >
              <div className="day-header">
                <span className="day-name">{dayName}</span>
                <span className="day-number">Day {dayNum}</span>
              </div>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <div 
                    key={idx}
                    className="day-event-dot"
                    style={{ backgroundColor: getActivityColor(event.category) }}
                    title={`${event.label} (${event.startHour}:00-${event.endHour}:00)`}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="more-events">+{dayEvents.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slot grid for selected day */}
      {selectedDay && (
        <div className="planner-day-view">
          <h3>Day {selectedDay} ({getDayName(selectedDay)})</h3>
          <div className="time-slot-grid">
            {timeSlots.map(slot => {
              const events = getEventsForSlot(selectedDay, slot.hour);
              const isPast = selectedDay < currentDay || (selectedDay === currentDay && slot.hour < currentHour);
              
              return (
                <div 
                  key={slot.hour}
                  className={`time-slot ${isPast ? 'past' : ''} ${events.length > 0 ? 'has-event' : ''}`}
                >
                  <span className="slot-time">{slot.label}</span>
                  <div className="slot-events">
                    {events.map((event, idx) => (
                      <div 
                        key={idx}
                        className="slot-event"
                        style={{ backgroundColor: getActivityColor(event.category) }}
                        title={`${event.label} at ${event.location}`}
                      >
                        {event.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn-secondary btn-small" onClick={() => setSelectedDay(null)}>
            Back to Week View
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="planner-modal-overlay" onClick={handleCancelEvent}>
          <div className="planner-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Event</h3>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Event Type</label>
                <select 
                  value={newEvent.type} 
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="routine">Routine</option>
                  <option value="date">Date</option>
                  <option value="work">Work</option>
                  <option value="selfcare">Self-Care</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {newEvent.type === 'routine' && (
                <div className="form-group">
                  <label>Routine</label>
                  <select 
                    value={newEvent.routineId}
                    onChange={(e) => setNewEvent({ ...newEvent, routineId: e.target.value })}
                  >
                    <option value="">Select a routine...</option>
                    {availableRoutines.map(routine => (
                      <option key={routine.id} value={routine.id}>
                        {routine.label} ({routine.durationTicks * 10} mins)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newEvent.type === 'date' && (
                <>
                  <div className="form-group">
                    <label>NPC</label>
                    <select 
                      value={newEvent.npcId}
                      onChange={(e) => setNewEvent({ ...newEvent, npcId: e.target.value })}
                    >
                      <option value="">Select an NPC...</option>
                      {availableNPCs.map(npc => (
                        <option key={npc.id} value={npc.id}>{npc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <select 
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    >
                      <option value="">Select a location...</option>
                      {availableLocations.map(loc => (
                        <option key={loc.key} value={loc.key}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {newEvent.type === 'custom' && (
                <div className="form-group">
                  <label>Label</label>
                  <input 
                    type="text" 
                    value={newEvent.customLabel}
                    onChange={(e) => setNewEvent({ ...newEvent, customLabel: e.target.value })}
                    placeholder="Event name..."
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <select 
                    value={newEvent.startHour}
                    onChange={(e) => setNewEvent({ ...newEvent, startHour: parseInt(e.target.value) })}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.hour} value={slot.hour}>{slot.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <select 
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 6, 8].map(h => (
                      <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleCancelEvent}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSubmitEvent}>
                  Schedule Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="planner-stats">
        <div className="stat-item">
          <span className="stat-label">Upcoming Shifts</span>
          <span className="stat-value">{workShifts.filter(s => s.day >= currentDay).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Scheduled Events</span>
          <span className="stat-value">{calendarEvents.filter(e => e.day >= currentDay).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available NPCs</span>
          <span className="stat-value">{availableNPCs.length}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyPlannerPanel;
