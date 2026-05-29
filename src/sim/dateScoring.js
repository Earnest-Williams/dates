import { NPCS } from '../data/npcs.js';

export const scoreDatePhaseChoice = (state, activeDateEvent, choice) => {
  const npc = NPCS.find((item) => item.id === activeDateEvent.npcId);
  let connectionChange = choice.connection || 0;
  let relationshipChange = choice.relationship || 0;
  let moodChange = choice.mood || 0;
  let energyChange = choice.energy || 0;
  let discovery = choice.discovery;
  let chemistryChange = choice.chemistry || 0;

  if (npc && choice.preferredArchetypes?.includes(npc.archetype)) {
    connectionChange += 8;
  } else if (npc && choice.dislikedArchetypes?.includes(npc.archetype)) {
    connectionChange -= 8;
  }

  if (choice.checkStat) {
    const success = state.stats[choice.checkStat] >= choice.threshold;
    if (success && choice.success) {
      connectionChange += choice.success.connection || 0;
      relationshipChange += choice.success.relationship || 0;
      moodChange += choice.success.mood || 0;
      energyChange += choice.success.energy || 0;
      chemistryChange += choice.success.chemistry || 0;
      if (choice.success.discovery) discovery = choice.success.discovery;
    } else if (!success && choice.fail) {
      connectionChange += choice.fail.connection || 0;
      relationshipChange += choice.fail.relationship || 0;
      moodChange += choice.fail.mood || 0;
      energyChange += choice.fail.energy || 0;
      chemistryChange += choice.fail.chemistry || 0;
      if (choice.fail.discovery) discovery = choice.fail.discovery;
    }
  }

  return {
    connectionChange,
    relationshipChange,
    moodChange,
    energyChange,
    chemistryChange,
    discovery,
    memory: choice.memory,
    callback: choice.callback,
    conflict: choice.conflict,
    repairScene: choice.repairScene,
  };
};
