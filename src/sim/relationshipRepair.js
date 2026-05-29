import { NPCS, RELATIONSHIP_REPAIR_ACTIONS } from '../data/npcs.js';
import { calculateRepairReputationModifier } from './reputation.js';

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const createEmptyMemory = () => ({
  rememberedChoices: [],
  sharedActivities: [],
  promises: {},
  importantMoments: [],
  comfortKnown: [],
  lastMeaningfulInteractionDay: null,
});

const ACTION_LABELS = {
  apologize: 'Apologize directly',
  give_space: 'Give them space',
  follow_through_on_previous_promise: 'Follow through on a previous promise',
  choose_thoughtful_activity: 'Choose a thoughtful activity',
  revisit_meaningful_location: 'Revisit a meaningful location',
  ask_friend_for_advice: 'Ask a friend for advice',
  write_message: 'Write a message',
  help_with_specific_problem: 'Help with a specific problem',
  spend_quiet_time_together: 'Spend quiet time together',
  context_repair: 'Use the specific repair opening',
};

const getCurrentDay = (state) => state?.time?.day || 1;

const getElapsedDays = (state, matchData, memory) => {
  const startedDay = matchData.repairOpenedDay
    ?? matchData.conflictStartedDay
    ?? memory.lastMeaningfulInteractionDay
    ?? getCurrentDay(state);
  return Math.max(0, getCurrentDay(state) - startedDay);
};

const hasPendingPromise = (memory, key) => {
  if (!key) return false;
  return memory.promises?.[key] === 'pending';
};

const countMemorySignals = (memory) => {
  return (memory.rememberedChoices?.length || 0)
    + (memory.sharedActivities?.length || 0)
    + Object.keys(memory.promises || {}).length
    + (memory.importantMoments?.length || 0)
    + (memory.comfortKnown?.length || 0);
};

const getNpcRepairEvent = (npcId) => {
  const npc = NPCS.find((candidate) => candidate.id === npcId);
  return npc?.repairEvent || null;
};

const normalizeRepairActionId = (npcId, actionId) => {
  const repairEvent = getNpcRepairEvent(npcId);
  if (actionId === 'context_repair') {
    return repairEvent?.action || 'apologize';
  }
  return actionId;
};

const isValidRepairAction = (actionId) => {
  return actionId === 'context_repair' || RELATIONSHIP_REPAIR_ACTIONS.includes(actionId);
};

export const getRepairActionLabel = (actionId) => {
  if (typeof actionId !== 'string') return '';
  return ACTION_LABELS[actionId] || actionId.replaceAll('_', ' ');
};

export const getAvailableRepairActions = (state, npcId, matchData) => {
  const repairEvent = getNpcRepairEvent(npcId);
  const options = [
    {
      id: 'apologize',
      label: getRepairActionLabel('apologize'),
      description: 'Fast, direct, and best when the hurt is fresh.',
    },
    {
      id: 'give_space',
      label: getRepairActionLabel('give_space'),
      description: 'Works better after at least one day has passed.',
    },
  ];

  if (matchData?.pendingRepairScene) {
    options.unshift({
      id: 'context_repair',
      label: repairEvent?.title || getRepairActionLabel('context_repair'),
      description: `Follow up on ${matchData.pendingRepairScene} with remembered context.`,
    });
  }

  if (repairEvent?.action && !options.some((option) => option.id === repairEvent.action)) {
    options.push({
      id: repairEvent.action,
      label: getRepairActionLabel(repairEvent.action),
      description: repairEvent.successDependsOn?.join(', ') || 'Use an authored repair path.',
    });
  }

  return options.map((option) => ({
    ...option,
    evaluation: evaluateRepairAction(state, npcId, matchData, option.id),
  }));
};

export const evaluateRepairAction = (state, npcId, matchData, actionId) => {
  if (!matchData) {
    return {
      success: false,
      score: 0,
      reason: 'No relationship exists to repair.',
      relationshipDelta: 0,
      chemistryDelta: 0,
      title: getRepairActionLabel(actionId),
    };
  }

  if (!isValidRepairAction(actionId)) {
    return {
      success: false,
      score: 0,
      reason: 'Invalid repair action.',
      relationshipDelta: 0,
      chemistryDelta: 0,
      title: getRepairActionLabel(actionId),
    };
  }

  const hasRepairNeed = Boolean(matchData.activeConflictId || matchData.pendingRepairScene);
  if (!hasRepairNeed) {
    return {
      success: false,
      score: 0,
      reason: 'There is no active conflict or repair scene.',
      relationshipDelta: 0,
      chemistryDelta: 0,
      title: getRepairActionLabel(actionId),
    };
  }

  const memory = {
    ...createEmptyMemory(),
    ...(state?.relationshipMemory?.[npcId] || {}),
  };
  const repairEvent = getNpcRepairEvent(npcId);
  const resolvedActionId = normalizeRepairActionId(npcId, actionId);
  const elapsedDays = getElapsedDays(state, matchData, memory);
  const compatibilityScore = matchData.compatibilityScore ?? 50;
  const memorySignals = countMemorySignals(memory);
  const hasScenePromise = hasPendingPromise(memory, matchData.pendingRepairScene);
  const hasEventPromise = hasPendingPromise(memory, repairEvent?.id);

  let score = 35;
  const reasons = [];

  if (actionId === 'context_repair') {
    score += 25;
    reasons.push('used the specific repair opening');
  }

  if (repairEvent?.action === resolvedActionId) {
    score += 18;
    reasons.push(`matched ${repairEvent.title}`);
  } else if (resolvedActionId === 'apologize') {
    score += elapsedDays <= 1 ? 12 : 4;
    reasons.push('named the hurt directly');
  } else if (resolvedActionId === 'give_space') {
    score += elapsedDays >= 1 ? 14 : -12;
    reasons.push(elapsedDays >= 1 ? 'gave emotions time to settle' : 'space was offered too soon');
  }

  if (hasScenePromise || hasEventPromise) {
    score += 14;
    reasons.push('followed up on a pending promise');
  }

  if (memorySignals >= 5) {
    score += 10;
    reasons.push('drew on strong shared history');
  } else if (memorySignals >= 2) {
    score += 5;
    reasons.push('used remembered context');
  }

  if (compatibilityScore >= 70) {
    score += 8;
    reasons.push('strong compatibility helped the repair land');
  } else if (compatibilityScore < 40) {
    score -= 8;
    reasons.push('fragile compatibility made repair harder');
  }

  if (elapsedDays === 0 && resolvedActionId !== 'give_space') {
    score += 6;
    reasons.push('acted quickly');
  } else if (elapsedDays > 2) {
    score -= Math.min(20, (elapsedDays - 2) * 5);
    reasons.push('waited past the best repair window');
  }

  const reputationModifier = calculateRepairReputationModifier(state, npcId);
  if (reputationModifier !== 1) {
    score = Math.round(score * reputationModifier);
    reasons.push(
      reputationModifier > 1
        ? 'good standing made repair easier'
        : 'bad standing made repair harder'
    );
  }

  score = clamp(score);
  const success = score >= 70;
  const relationshipDelta = success ? Math.max(6, Math.round(score / 9)) : -3;
  const chemistryDelta = success ? Math.max(2, Math.round(score / 15)) : 0;
  const reason = reasons.length > 0 ? reasons.join('; ') : 'repair context was limited';

  return {
    success,
    score,
    reason,
    resolvedActionId,
    repairScene: matchData.pendingRepairScene || repairEvent?.id || null,
    relationshipDelta,
    chemistryDelta,
    elapsedDays,
    reputationModifier,
    title: repairEvent?.title || getRepairActionLabel(actionId),
  };
};
