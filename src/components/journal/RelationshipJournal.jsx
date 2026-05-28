import React from 'react';
import { useStore } from '../../state/store';
import { selectNpcJournal } from '../../state/selectors';
import { NPCS } from '../../data/npcs';
import './Journal.css';

const NpcMemoryCard = ({ memories }) => (
  <div className="journal-section">
    <h3>What They Remember</h3>
    {memories.length === 0 ? (
      <p>No major memories yet. Spend more time together!</p>
    ) : (
      <ul className="memory-list">
        {memories.map((m, i) => (
          <li key={i} className="memory-item">
            {m.type === 'comfort' ? '✨ ' : '💭 '}
            {m.text.replace(/_/g, ' ')}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const PromiseTracker = ({ promises }) => (
  <div className="journal-section">
    <h3>Promises & Follow-Through</h3>
    {promises.length === 0 ? (
      <p>No active promises.</p>
    ) : (
      <ul className="promise-list">
        {promises.map((p, i) => (
          <li key={i} className="promise-item">
            {p.status === 'pending' ? '⏳ ' : '✅ '}
            {p.key.replace(/_/g, ' ')}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ConflictBadge = ({ badge }) => {
  if (!badge) return null;
  const isRepair = badge.type === 'repair_needed';
  return (
    <div className={`badge ${isRepair ? 'repair' : 'conflict'}`}>
      {isRepair ? '⚠️ Repair Opportunity Available' : '💔 Active Conflict'}
    </div>
  );
};

const CompatibilityHint = ({ hint }) => (
  <div className="journal-section">
    <h3>Long-Term Compatibility</h3>
    <p className="compatibility-hint">{hint.text}</p>
  </div>
);

const DateRecap = ({ events }) => (
  <div className="journal-section">
    <h3>Recent Relationship Events</h3>
    {events.length === 0 ? (
      <p>No events logged.</p>
    ) : (
      <ul className="event-list">
        {events.slice(0, 5).map((e, i) => (
          <li key={i} className="event-item">
            <strong>Day {e.day}</strong>: {e.summary}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const RelationshipJournal = ({ npcId }) => {
  const journal = useStore(state => selectNpcJournal(state, npcId));
  const npc = NPCS.find(n => n.id === npcId);

  if (!npc || !journal) return <div>Loading Journal...</div>;

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>{npc.name}'s Journal</h2>
        <ConflictBadge badge={journal.conflictBadge} />
      </div>

      <NpcMemoryCard memories={journal.memories} />
      <PromiseTracker promises={journal.promises} />
      <CompatibilityHint hint={journal.compatibilityHint} />
      <DateRecap events={journal.recentEvents} />

      <div className="journal-section next-step">
        {journal.suggestedNextStep}
      </div>
    </div>
  );
};
