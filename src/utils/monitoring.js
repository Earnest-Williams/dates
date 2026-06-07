/**
 * Monitoring & Analytics Utilities
 * 
 * This module provides error tracking and analytics for the game.
 * It supports Sentry for error tracking and local storage for analytics.
 */

// Configuration
const MONITORING_ENABLED = import.meta.env.VITE_MONITORING_ENABLED === 'true';
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

// Analytics storage key
const ANALYTICS_KEY = 'lifeSimAnalytics';
const SESSION_KEY = 'lifeSimSession';

// Initialize Sentry if configured
let Sentry = null;

if (MONITORING_ENABLED && SENTRY_DSN) {
  try {
    // Dynamic import to avoid bundling Sentry in development
    const sentryModule = await import('@sentry/browser');
    Sentry = sentryModule;
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      tracesSampleRate: 0.1, // 10% of transactions
      replaysSessionSampleRate: 0.01, // 1% of sessions
      replaysOnErrorSampleRate: 0.1, // 10% of errors
    });
    
    console.log('[Monitoring] Sentry initialized');
  } catch (error) {
    console.warn('[Monitoring] Failed to initialize Sentry:', error);
  }
}

/**
 * Track an error
 * @param {Error|string} error - The error to track
 * @param {Object} context - Additional context
 */
export function trackError(error, context = {}) {
  if (!MONITORING_ENABLED) {
    console.error('[Monitoring] Error (monitoring disabled):', error, context);
    return;
  }
  
  try {
    if (Sentry) {
      Sentry.captureException(error, { contexts: context });
    }
    
    // Also log to console
    console.error('[Monitoring] Tracked error:', error, context);
  } catch (monitoringError) {
    console.error('[Monitoring] Failed to track error:', monitoringError);
  }
}

/**
 * Track a message/event
 * @param {string} message - The message to track
 * @param {string} level - Level: 'info', 'warning', 'error'
 * @param {Object} data - Additional data
 */
export function trackMessage(message, level = 'info', data = {}) {
  if (!MONITORING_ENABLED) {
    console.log(`[Monitoring] ${level}: ${message}`, data);
    return;
  }
  
  try {
    if (Sentry) {
      Sentry.captureMessage(message, { level, extra: data });
    }
    
    console.log(`[Monitoring] ${level}: ${message}`, data);
  } catch (monitoringError) {
    console.error('[Monitoring] Failed to track message:', monitoringError);
  }
}

/**
 * Start a new analytics session
 */
export function startSession(playerId) {
  const session = {
    id: generateId(),
    playerId: playerId || 'unknown',
    startedAt: Date.now(),
    environment: ENVIRONMENT,
    version: import.meta.env.VITE_VERSION || 'dev',
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  if (MONITORING_ENABLED && Sentry) {
    Sentry.setUser({ id: playerId || 'unknown' });
    Sentry.startSession({ user: { id: playerId || 'unknown' } });
  }
  
  return session;
}

/**
 * End the current session
 */
export function endSession() {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    const sessionData = JSON.parse(session);
    sessionData.endedAt = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.removeItem(SESSION_KEY);
  }
  
  if (MONITORING_ENABLED && Sentry) {
    Sentry.endSession();
  }
}

/**
 * Track a game event
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Event properties
 */
export function trackEvent(eventName, properties = {}) {
  if (!MONITORING_ENABLED) {
    console.log('[Monitoring] Event:', eventName, properties);
    return;
  }
  
  try {
    const session = localStorage.getItem(SESSION_KEY);
    const sessionId = session ? JSON.parse(session).id : generateId();
    
    const event = {
      timestamp: Date.now(),
      event: eventName,
      properties,
      sessionId,
    };
    
    // Store in localStorage (limited to last 100 events)
    const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    analytics.push(event);
    if (analytics.length > 100) {
      analytics.shift();
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    
    // Also send to Sentry if available
    if (Sentry) {
      Sentry.captureEvent({
        type: 'custom',
        custom: event,
      });
    }
    
    console.log('[Monitoring] Tracked event:', eventName);
  } catch (error) {
    console.error('[Monitoring] Failed to track event:', error);
  }
}

/**
 * Track balance metrics
 * @param {Object} metrics - Balance metrics to track
 */
export function trackBalanceMetrics(metrics) {
  trackEvent('balance_metrics', {
    ...metrics,
    timestamp: Date.now(),
  });
}

/**
 * Track relationship progression
 * @param {string} npcId - NPC ID
 * @param {number} relationship - Current relationship value
 * @param {string} action - Action that caused the change
 */
export function trackRelationship(npcId, relationship, action) {
  trackEvent('relationship_progress', {
    npcId,
    relationship,
    action,
    timestamp: Date.now(),
  });
}

/**
 * Track legacy transition
 * @param {Object} legacyData - Legacy transition data
 */
export function trackLegacy(legacyData) {
  trackEvent('legacy_transition', {
    ...legacyData,
    timestamp: Date.now(),
  });
}

/**
 * Get all stored analytics
 * @returns {Array} Array of analytics events
 */
export function getAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear all analytics data
 */
export function clearAnalytics() {
  localStorage.removeItem(ANALYTICS_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Generate a unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Export monitoring status
 */
export const monitoring = {
  enabled: MONITORING_ENABLED,
  sentryEnabled: !!SENTRY_DSN,
  environment: ENVIRONMENT,
};

export default {
  trackError,
  trackMessage,
  trackEvent,
  trackBalanceMetrics,
  trackRelationship,
  trackLegacy,
  startSession,
  endSession,
  getAnalytics,
  clearAnalytics,
  monitoring,
};
