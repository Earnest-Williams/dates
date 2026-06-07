const SAVE_KEY = 'dates-save-v1';
const SAVE_VERSION = 3;

const ensureCareerEmploymentFields = (state) => {
  state.career = state.career || {};
  state.career.supervisorNpcId = state.career.supervisorNpcId || null;
  state.career.supervisorName = state.career.supervisorName || null;
  state.career.supervisorRole = state.career.supervisorRole || null;
  state.career.coworkerNpcIds = state.career.coworkerNpcIds || [];
  state.career.workScheduleTemplate = state.career.workScheduleTemplate || [];
  state.career.attendance = state.career.attendance || {
    records: {},
    consecutiveMisses: 0,
    totalMissed: 0,
    totalLate: 0,
  };
};

const getStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
};

export const createSavePayload = (gameState) => ({
  version: SAVE_VERSION,
  savedAt: new Date().toISOString(),
  gameState,
});

export const getSaveMetadata = () => {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      version: parsed.version,
      savedAt: parsed.savedAt,
      day: parsed.gameState?.time?.day ?? null,
      hour: parsed.gameState?.time?.hour ?? null,
      location: parsed.gameState?.activeLocation ?? null,
      playerName: parsed.gameState?.family?.playerName ?? null,
    };
  } catch {
    return null;
  }
};

export const saveGameState = (gameState) => {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(createSavePayload(gameState)));
    return true;
  } catch {
    return false;
  }
};

export const runSaveMigration = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, reason: 'Invalid save payload.' };
  }

  let migratedState = { ...payload.gameState };
  let migrated = false;

  if (payload.version === 1) {
    // Migrate v1 to v2
    migratedState.features = {
      organicEncounters: false,
      compatibilityRevealUx: false,
      instantMatchRebalance: false,
      relationshipJournal: true,
      reputationSpillover: false,
      dailyPlannerUx: true,
      marketRiskControls: false,
      adultToneTags: false,
    };
    
    // Also ensure matches have extended properties for any existing NPCs
    if (migratedState.matches) {
      for (const npcId of Object.keys(migratedState.matches)) {
        const match = migratedState.matches[npcId];
        migratedState.matches[npcId] = {
          ...match,
          activeConflictId: match.activeConflictId ?? null,
          pendingRepairScene: match.pendingRepairScene ?? null,
          repairHistory: match.repairHistory ?? [],
          lastDateQuality: match.lastDateQuality ?? null,
          compatibilityScore: match.compatibilityScore ?? null,
          relationshipStage: match.relationshipStage ?? 'matched',
          exclusivityExpectation: match.exclusivityExpectation ?? 'unknown',
          publicKnowledge: match.publicKnowledge ?? 0,
          dateHistory: match.dateHistory ?? [],
          lastDateDay: match.lastDateDay ?? null,
          lastDateType: match.lastDateType ?? null,
        };
      }
    }

    payload.version = 2;
    migrated = true;
  }

  if (payload.version === 2) {
    migratedState.calendar = migratedState.calendar || {
      lastEventId: 0,
      events: [],
    };
    ensureCareerEmploymentFields(migratedState);
    payload.version = 3;
    migrated = true;
  }

  if (payload.version === SAVE_VERSION) {
    migratedState.calendar = migratedState.calendar || {
      lastEventId: 0,
      events: [],
    };
    ensureCareerEmploymentFields(migratedState);
    return { ok: true, gameState: migratedState, migrated };
  }

  return {
    ok: false,
    reason: `Unsupported save schema version: ${payload.version}.`,
  };
};

export const loadGameState = () => {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: 'Storage unavailable.' };

  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return { ok: false, reason: 'No save found.' };

  try {
    const parsed = JSON.parse(raw);
    return runSaveMigration(parsed);
  } catch {
    return { ok: false, reason: 'Save file is corrupted.' };
  }
};
