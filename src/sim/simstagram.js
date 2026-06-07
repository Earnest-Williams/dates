export const canPostSimstagramContent = (state, content) => {
  return (state.needs?.energy ?? 0) >= content.energyCost;
};

export const calculateSimstagramStatMultiplier = (stats, statRequirements) => {
  let totalStats = 0;
  let requiredTotal = 0;

  for (const [stat, weight] of Object.entries(statRequirements || {})) {
    totalStats += (stats?.[stat] || 0) * weight;
    requiredTotal += 100 * weight;
  }

  if (requiredTotal <= 0) return 1.0;

  return 0.5 + (totalStats / requiredTotal) * 2.0;
};
