# Monitoring & Analytics Setup

This document describes the monitoring and analytics setup for Life Sim.

## Error Tracking (Sentry)

The game uses Sentry for error tracking in production. To enable Sentry:

1. Install Sentry SDK:
   ```bash
   npm install @sentry/browser
   ```

2. Set environment variables in your deployment:
   ```
   VITE_MONITORING_ENABLED=true
   VITE_SENTRY_DSN=your_sentry_dsn_here
   VITE_ENVIRONMENT=production
   ```

3. The monitoring utility (`src/utils/monitoring.js`) will automatically initialize Sentry when these variables are set.

## Analytics Tracking

The game tracks the following events:

### Automatic Tracking
- **App Start**: Tracked when the app loads
- **Phase Changes**: Tracked when the game phase changes (intro, marriage, parenting, etc.)
- **Errors**: Global error handler tracks all unhandled errors
- **Unhandled Rejections**: Tracks unhandled promise rejections
- **Balance Metrics**: Tracked every 30 seconds (money, day, housing tier)

### Manual Tracking
You can manually track events using the monitoring utility:

```javascript
import { trackEvent, trackError, trackRelationship, trackLegacy } from './utils/monitoring';

// Track a custom event
trackEvent('custom_event', { property: 'value' });

// Track an error
trackError(new Error('Something went wrong'), { context: 'additional info' });

// Track relationship progression
trackRelationship('elena', 50, 'date_completed');

// Track legacy transition
trackLegacy({ heirStats: {...}, parentStats: {...} });
```

## Local Analytics Storage

When monitoring is disabled (default in development), events are stored in localStorage:
- `lifeSimAnalytics`: Stores the last 100 events
- `lifeSimSession`: Stores the current session data

You can access this data:

```javascript
import { getAnalytics, clearAnalytics } from './utils/monitoring';

// Get all stored analytics
const events = getAnalytics();

// Clear analytics data
clearAnalytics();
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_MONITORING_ENABLED` | Enable monitoring | `false` |
| `VITE_SENTRY_DSN` | Sentry DSN | `undefined` |
| `VITE_ENVIRONMENT` | Environment name | `development` |
| `VITE_VERSION` | App version | `dev` |

## Pre-commit Hooks

The project uses husky and lint-staged for pre-commit validation:

- **Linting**: ESLint runs on all staged JS/JSX files
- **Content Validation**: Validates all data files for schema compliance
- **QA Checklist**: Runs automated content QA checks

To set up pre-commit hooks:

```bash
npm install
# husky will automatically install git hooks via the prepare script
```

## Running Validation Manually

You can run validation scripts manually:

```bash
# Validate all content
npm run validate:content

# Run QA checklist
npm run qa:content

# Audit actions
npm run audit:actions

# Run all pre-commit checks
npm run precommit
```

## Performance Optimizations

The project includes several performance optimizations:

1. **Lazy Loading**: Large data files (npcs.js, dates.js) can be lazy-loaded using `src/data/loaders.js`
2. **React.memo**: Expensive components use React.memo to prevent unnecessary re-renders
3. **Virtualization**: Long lists (like activity logs) use VirtualList for efficient rendering

### Using Lazy Loading

```javascript
import { getNPCs, getNpcById, getDateTemplates } from './data/loaders';

// Lazy load NPCs
const npcs = await getNPCs();

// Get a specific NPC
const npc = await getNpcById('elena');

// Lazy load date templates
const templates = await getDateTemplates();
```

### Using VirtualList

```javascript
import VirtualList from './components/common/VirtualList';

<VirtualList
  items={logs}
  renderItem={(index, log) => (
    <div key={index} className="log-entry">{log}</div>
  )}
  itemHeight={24}
  height={200}
/>
```
