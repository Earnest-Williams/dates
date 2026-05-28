const SAVE_KEY = 'dates-save-v1';
const SAVE_VERSION = 1;

const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return window.localStorage;
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
  storage.setItem(SAVE_KEY, JSON.stringify(createSavePayload(gameState)));
  return true;
};

export const runSaveMigration = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, reason: 'Invalid save payload.' };
  }

  if (payload.version === SAVE_VERSION) {
    return { ok: true, gameState: payload.gameState, migrated: false };
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
