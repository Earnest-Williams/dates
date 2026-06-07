#!/usr/bin/env node

/**
 * Content QA Checklist Automation
 * 
 * This script automates the content QA checklist defined in the design docs.
 * It validates:
 * - Routine variance check
 * - Romance chapter check
 * - Compatibility divergence check
 * - Date tone check
 * - Relationship memory check
 * - Town identity check
 * - Social spillover check
 * - Home expression check
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..');

// Load data
const { NPCS } = await import(resolve(repoRoot, 'src/data/npcs.js'));
const { DATE_TEMPLATES } = await import(resolve(repoRoot, 'src/data/dates.js'));
const { LOCATIONS } = await import(resolve(repoRoot, 'src/data/locations.js'));
const { TIME_OF_DAY_LOCATION_TEXTURE } = await import(resolve(repoRoot, 'src/data/townTexture.js'));

let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
}

console.log('=== Content QA Checklist ===\n');

// 1. Routine variance check
console.log('--- Routine Variance Check ---');
const { ROUTINES } = await import(resolve(repoRoot, 'src/data/routines.js'));
check(
  'At least 3 distinct day plans exist',
  ROUTINES.length >= 3,
  `Found ${ROUTINES.length} routines`
);

// 2. Romance chapter check
console.log('\n--- Romance Chapter Check ---');
const romanceableNPCs = NPCS.filter(n => n.romanceable !== false);
let allChaptersComplete = true;

for (const npc of romanceableNPCs) {
  if (!npc.romanceArc) {
    check(`NPC ${npc.id} has romance arc`, false);
    allChaptersComplete = false;
    continue;
  }
  
  // Check for at least one unique scene in each chapter stage
  const chapterStages = ['first impression', 'friendship', 'personal reveal', 'conflict', 'trust event', 'commitment event'];
  let hasAllStages = true;
  
  for (const stage of chapterStages) {
    const hasStage = npc.romanceArc.some(arc => arc.type === stage);
    if (!hasStage) {
      check(`NPC ${npc.id} has ${stage} stage`, false);
      hasAllStages = false;
      allChaptersComplete = false;
    }
  }
  
  if (hasAllStages) {
    check(`NPC ${npc.id} has all chapter stages`, true);
  }
}

// 3. Compatibility divergence check
console.log('\n--- Compatibility Divergence Check ---');
const npcWithCompatibility = romanceableNPCs.filter(n => n.compatibilityTraits);
check(
  'At least 2 NPCs have compatibility traits',
  npcWithCompatibility.length >= 2,
  `Found ${npcWithCompatibility.length} NPCs with compatibility traits`
);

// 4. Date tone check
console.log('\n--- Date Tone Check ---');
const dateTemplateKeys = Object.keys(DATE_TEMPLATES);
let hasPositive = false;
let hasAwkward = false;
let hasFailed = false;

for (const key of dateTemplateKeys) {
  const template = DATE_TEMPLATES[key];
  if (template.outcome === 'good') hasPositive = true;
  if (template.outcome === 'awkward' || template.outcome === 'funny') hasAwkward = true;
  if (template.outcome === 'failed') hasFailed = true;
}

check('At least one positive date outcome', hasPositive);
check('At least one awkward/funny date outcome', hasAwkward);
check('At least one failed date outcome', hasFailed);

// 5. Relationship memory check
console.log('\n--- Relationship Memory Check ---');
let hasMemoryCallbacks = false;
let hasPromises = false;
let hasConflicts = false;

for (const npc of romanceableNPCs) {
  if (npc.romanceArc) {
    for (const arc of npc.romanceArc) {
      if (arc.choices) {
        for (const choice of arc.choices) {
          if (choice.memory) hasMemoryCallbacks = true;
          if (choice.promise) hasPromises = true;
          if (choice.conflict) hasConflicts = true;
        }
      }
    }
  }
}

check('NPCs have memory callbacks', hasMemoryCallbacks);
check('NPCs have promise tracking', hasPromises);
check('NPCs have conflict/repair events', hasConflicts);

// 6. Town identity check
console.log('\n--- Town Identity Check ---');
const locationKeys = Object.keys(TIME_OF_DAY_LOCATION_TEXTURE);
check(
  'Locations have time-variant texture',
  locationKeys.length > 0,
  `Found ${locationKeys.length} locations with texture`
);

// 7. Social spillover check
console.log('\n--- Social Spillover Check ---');
const npcWithReputation = NPCS.filter(n => n.reputationCircle);
check(
  'At least 1 NPC has reputation circle',
  npcWithReputation.length >= 1,
  `Found ${npcWithReputation.length} NPCs with reputation circles`
);

// 8. Home expression check
console.log('\n--- Home Expression Check ---');
const npcWithHomeReactions = NPCS.filter(n => n.homeStyleReactions);
check(
  'At least 1 NPC has home style reactions',
  npcWithHomeReactions.length >= 1,
  `Found ${npcWithHomeReactions.length} NPCs with home style reactions`
);

// 9. No gift-loop regression
console.log('\n--- Anti-Gift Loop Check ---');
let hasGiftTables = false;
let hasItemBonuses = false;

for (const npc of NPCS) {
  if (npc.favoriteItems || npc.giftPreferences) {
    hasGiftTables = true;
    check('No NPC has gift tables', false, `NPC ${npc.id} has gift preferences`);
  }
}

for (const npc of NPCS) {
  if (npc.romanceArc) {
    for (const arc of npc.romanceArc) {
      if (arc.choices) {
        for (const choice of arc.choices) {
          if (choice.itemBonus || choice.giftBonus) {
            hasItemBonuses = true;
            check('No romance arc uses item bonuses', false);
          }
        }
      }
    }
  }
}

if (!hasGiftTables && !hasItemBonuses) {
  check('No gift-loop regressions found', true);
}

// Summary
console.log('\n=== Summary ===');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  console.log('\n⚠️  Some QA checks failed. Please review the content.');
  process.exit(1);
} else {
  console.log('\n✅ All QA checks passed!');
  process.exit(0);
}
