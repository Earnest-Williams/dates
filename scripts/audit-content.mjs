import { NPCS } from '../src/data/npcs.js';
import { DATE_TEMPLATES } from '../src/data/dates.js';

let errors = 0;

function reportError(msg) {
  console.error(`ERROR: ${msg}`);
  errors++;
}

// Validate Dates
for (const key in DATE_TEMPLATES) {
  const template = DATE_TEMPLATES[key];
  for (const phase of template.phases) {
    for (const choice of phase.choices) {
      if ('price' in choice || 'purchasable' in choice) {
        reportError(`Date ${key} phase ${phase.id} contains gift-loop property.`);
      }
    }
  }
}

// Validate NPCs
for (const npc of NPCS) {
  if (!npc.romanceArc) {
    reportError(`NPC ${npc.id} missing romanceArc`);
    continue;
  }

  for (const chapter of npc.romanceArc) {
    if (!chapter.id || !chapter.type || chapter.minRelationship === undefined || !chapter.title || !chapter.prompt || !chapter.emotionalBeat) {
      reportError(`NPC ${npc.id} chapter ${chapter.id || 'unknown'} missing required structural fields.`);
    }

    if (!chapter.choices || chapter.choices.length < 2) {
      reportError(`NPC ${npc.id} chapter ${chapter.id} must have at least 2 choices.`);
    }

    let hasMemoryOrCallback = false;
    let hasNonStatPath = false;

    if (chapter.choices) {
      for (const choice of chapter.choices) {
        if ('price' in choice || 'purchasable' in choice) {
          reportError(`NPC ${npc.id} chapter ${chapter.id} contains gift-loop property.`);
        }
        if (choice.unlocksMemory || choice.futureCallback || choice.memory || choice.callback) {
          hasMemoryOrCallback = true;
        }
        if (!choice.checkStat) {
          hasNonStatPath = true;
        }
        if (choice.tone) {
          const t = choice.tone;
          if (typeof t.heat !== 'number' || typeof t.implication !== 'number' || typeof t.emotionalRisk !== 'number' || typeof t.publicRisk !== 'number') {
            reportError(`NPC ${npc.id} chapter ${chapter.id} has invalid tone schema.`);
          }
        }
      }
    }

    if (!hasMemoryOrCallback) {
      reportError(`NPC ${npc.id} chapter ${chapter.id} must have at least one choice with a memory or callback property.`);
    }
    if (!hasNonStatPath) {
      reportError(`NPC ${npc.id} chapter ${chapter.id} must have at least one non-stat path.`);
    }
    
    if (chapter.sceneTags && !Array.isArray(chapter.sceneTags)) {
      reportError(`NPC ${npc.id} chapter ${chapter.id} has invalid sceneTags.`);
    }
  }
}

if (errors > 0) {
  console.error(`\nContent audit failed with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('Content audit passed successfully.');
}
