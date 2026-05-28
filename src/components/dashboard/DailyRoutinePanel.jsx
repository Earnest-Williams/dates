import { ROUTINES, getRoutineTimeBucket, isRoutineAvailable } from '../../data/routines';

const DailyRoutinePanel = ({ gameState, doRoutine }) => {
  const timeBucket = getRoutineTimeBucket(gameState.time.hour);
  const tracker = gameState.routineTracker || { completedToday: [], weeklyCounts: {} };
  const available = ROUTINES.filter((routine) => isRoutineAvailable(routine, gameState));
  const filtered = available.slice(0, 6);
  const weeklyGoalProgress = Object.values(tracker.weeklyCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="bento-card routine">
      <h2 className="section-title">Daily Planner ({timeBucket})</h2>
      <p style={{ opacity: 0.75, marginTop: -8 }}>
        Soft weekly goal: 10 balanced routines • Progress: {weeklyGoalProgress}/10
      </p>
      <div className="routine-list">
        {filtered.map((routine) => (
          <button key={routine.id} className="routine-btn" onClick={() => doRoutine?.(routine.id)}>
            <div><strong>{routine.label}</strong></div>
            <small>{routine.durationTicks * 10} mins • {(routine.tags || []).join(' • ')}</small>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ opacity: 0.7 }}>No routines available right now. Rest, relocate, or adjust needs.</p>
        )}
      </div>
      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Completed today: {tracker.completedToday.length} • Mix reading, cooking, errands, calls, and self-care for mood bonuses.
      </p>
    </div>
  );
};

export default DailyRoutinePanel;
