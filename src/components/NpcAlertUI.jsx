import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';
import './NpcAlertUI.css';

const NpcAlertUI = () => {
  const { gameState, resolveNpcAlert } = useGameStore();
  const { activeNpcAlert, stats } = gameState;

  if (!activeNpcAlert) return null;

  const npc = NPCS.find(n => n.id === activeNpcAlert.npcId);
  const npcName = npc ? npc.name : 'Unknown Match';
  const avatarChar = npcName.charAt(0);

  return (
    <div className="date-event-container animate-fade-in">
      <div className="glass-panel date-event-card">
        <header className="date-event-header">
          <div className="date-event-avatar">{avatarChar}</div>
          <div>
            <h3>Inbox: {npcName}</h3>
            <span className="location-sub">Incoming Alert</span>
          </div>
        </header>

        <div className="date-event-prompt">
          <p>"{activeNpcAlert.message}"</p>
        </div>

        <div className="date-event-choices">
          {activeNpcAlert.choices.map((choice, idx) => {
            const hasStatGate = choice.checkStat !== undefined;
            const meetsStat = hasStatGate ? stats[choice.checkStat] >= choice.threshold : true;
            const hasMoney = choice.moneyCost ? stats.money >= choice.moneyCost : true;
            const isLocked = (hasStatGate && !meetsStat) || !hasMoney;

            let requirementText = '';
            if (hasStatGate && !meetsStat) {
              requirementText = `🔒 Needs ${choice.checkStat.charAt(0).toUpperCase() + choice.checkStat.slice(1)} ${choice.threshold}`;
            } else if (!hasMoney) {
              requirementText = `🔒 Needs $${choice.moneyCost}`;
            }

            return (
              <button
                key={idx}
                className={`btn-choice ${isLocked ? 'locked' : ''}`}
                onClick={() => resolveNpcAlert(idx)}
                disabled={isLocked}
              >
                <div className="choice-text-layout">
                  <span>{choice.text}</span>
                  {isLocked && <span className="choice-lock-reason">{requirementText}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NpcAlertUI;
