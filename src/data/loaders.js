/**
 * Data Loaders - Lazy loading utilities for large data files
 * 
 * This module provides lazy loading for large data files to improve
 * initial bundle size and runtime performance.
 */

// Cache for loaded modules
const dataCache = new Map();

/**
 * Lazy load a data module
 * @param {string} modulePath - The path to the module
 * @returns {Promise<any>} The loaded module
 */
async function lazyLoad(modulePath) {
  if (dataCache.has(modulePath)) {
    return dataCache.get(modulePath);
  }
  
  try {
    // Dynamic import for lazy loading
    const module = await import(modulePath);
    dataCache.set(modulePath, module);
    return module;
  } catch (error) {
    console.error(`Failed to lazy load module: ${modulePath}`, error);
    throw error;
  }
}

/**
 * Get NPCS data (lazy loaded)
 * @returns {Promise<Object>} NPCS data
 */
export async function getNPCs() {
  const module = await lazyLoad('./npcs.js');
  return module.NPCS;
}

/**
 * Get ARCHETYPES data (lazy loaded)
 * @returns {Promise<Object>} ARCHETYPES data
 */
export async function getArchetypes() {
  const module = await lazyLoad('./npcs.js');
  return module.ARCHETYPES;
}

/**
 * Get DATE_TEMPLATES data (lazy loaded)
 * @returns {Promise<Object>} DATE_TEMPLATES data
 */
export async function getDateTemplates() {
  const module = await lazyLoad('./dates.js');
  return module.DATE_TEMPLATES;
}

/**
 * Get a specific NPC by ID (lazy loaded)
 * @param {string} npcId - The NPC ID
 * @returns {Promise<Object|null>} The NPC data or null
 */
export async function getNpcById(npcId) {
  const npcs = await getNPCs();
  return npcs.find(n => n.id === npcId) || null;
}

/**
 * Get a specific date template by ID (lazy loaded)
 * @param {string} templateId - The date template ID
 * @returns {Promise<Object|null>} The date template or null
 */
export async function getDateTemplateById(templateId) {
  const templates = await getDateTemplates();
  return templates[templateId] || null;
}

/**
 * Preload all large data modules (for use after initial load)
 * This can be called after the app has loaded to preload data in the background
 */
export async function preloadAllData() {
  try {
    // Preload all large data files in parallel
    await Promise.all([
      lazyLoad('./npcs.js'),
      lazyLoad('./dates.js'),
      lazyLoad('./geography.js'),
      lazyLoad('./businesses.js'),
      lazyLoad('./townTexture.js'),
    ]);
    console.log('[Data Loaders] All large data modules preloaded');
  } catch (error) {
    console.error('[Data Loaders] Failed to preload data:', error);
  }
}

/**
 * Clear the data cache (useful for testing or HMR)
 */
export function clearDataCache() {
  dataCache.clear();
}

/**
 * Check if a module is already loaded
 * @param {string} modulePath - The path to the module
 * @returns {boolean} True if loaded
 */
export function isModuleLoaded(modulePath) {
  return dataCache.has(modulePath);
}
