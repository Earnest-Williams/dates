export const formatOrganicEncounterRewardSummary = (choice) => {
  if (!choice) return null;
  const hasRelationship = choice.relationship !== undefined;
  const hasChemistry = choice.chemistry !== undefined;

  if (!hasRelationship && !hasChemistry) return null;

  const relationship = choice.relationship ?? 0;
  const chemistry = choice.chemistry ?? 0;

  return `Relationship ${relationship >= 0 ? '+' : ''}${relationship}, Chemistry ${chemistry >= 0 ? '+' : ''}${chemistry}`;
};
