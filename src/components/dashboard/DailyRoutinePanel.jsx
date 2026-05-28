import { ROUTINES, isRoutineAvailable } from '../../data/routines';

const DailyRoutinePanel = ({ gameState, doRoutine }) => {
  const filtered = ROUTINES.filter((routine) => isRoutineAvailable(routine, gameState)).slice(0, 4);

  return (
    <div className="bento-card routine">
      <h2 className="section-title">Daily Routine</h2>
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
    </div>
  );
};

export default DailyRoutinePanel;
