import { useGameStore } from '../state/store';
import './WorkEventUI.css';

const WorkEventUI = () => {
  const { gameState, resolveWorkEvent } = useGameStore();
  const { activeWorkEvent } = gameState;

  if (!activeWorkEvent) return null;

  const handleChoice = (index) => {
    resolveWorkEvent(index);
  };

  return (
    <div className="date-event-container animate-fade-in">
      <div className="date-event-modal">
        <div className="date-event-header">
          <h2 className="date-event-title">{activeWorkEvent.title || 'Work Event'}</h2>
          {activeWorkEvent.employerName && (
            <p className="date-event-prompt" style={{ opacity: 0.8, marginBottom: '0.35rem' }}>
              {activeWorkEvent.employerName} • Supervisor: {activeWorkEvent.supervisorName || 'Shift Lead'}
            </p>
          )}
          <p className="date-event-prompt">{activeWorkEvent.prompt}</p>
        </div>

        <div className="date-event-choices">
          {activeWorkEvent.choices.map((choice, idx) => (
            <button 
              key={idx} 
              className="date-event-choice-btn"
              onClick={() => handleChoice(idx)}
            >
              <span>{choice.text}</span>
              <span className="date-event-check">
                [Check: {choice.checkStat} {choice.threshold}]
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkEventUI;
