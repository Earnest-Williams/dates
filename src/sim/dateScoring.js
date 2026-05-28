export const scoreDatePhaseChoice = (state, activeDateEvent, choice) => {
  let connectionChange = choice.connection || 0;
  let moodChange = choice.mood || 0;
  let energyChange = choice.energy || 0;
  let discovery = choice.discovery;
  let chemistryChange = choice.chemistry || 0;
  
  if (choice.checkStat) {
    const success = state.stats[choice.checkStat] >= choice.threshold;
    if (success && choice.success) {
      connectionChange += choice.success.connection || 0;
      moodChange += choice.success.mood || 0;
      chemistryChange += choice.success.chemistry || 0;
      if (choice.success.discovery) discovery = choice.success.discovery;
    } else if (!success && choice.fail) {
      connectionChange += choice.fail.connection || 0;
      moodChange += choice.fail.mood || 0;
      chemistryChange += choice.fail.chemistry || 0;
      if (choice.fail.discovery) discovery = choice.fail.discovery;
    }
  }

  return {
    connectionChange,
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
