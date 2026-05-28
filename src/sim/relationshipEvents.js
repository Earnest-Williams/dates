export const appendRelationshipEvent = (state, npcId, eventParams) => {
  const currentEvents = state.relationshipEvents?.[npcId] || [];
  
  const newEvent = {
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    day: state.time.day,
    source: eventParams.source || 'unknown',
    type: eventParams.type || 'info', // positive, negative, info, conflict, repair
    tags: eventParams.tags || [],
    memoryKey: eventParams.memoryKey || null,
    promiseKey: eventParams.promiseKey || null,
    conflictId: eventParams.conflictId || null,
    repairScene: eventParams.repairScene || null,
    relationshipDelta: eventParams.relationshipDelta || 0,
    chemistryDelta: eventParams.chemistryDelta || 0,
    summary: eventParams.summary || '',
  };

  const updatedEvents = [newEvent, ...currentEvents].slice(0, 20); // Keep last 20 events to avoid bloat

  return {
    ...state,
    relationshipEvents: {
      ...(state.relationshipEvents || {}),
      [npcId]: updatedEvents
    }
  };
};
