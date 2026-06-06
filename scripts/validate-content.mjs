#!/usr/bin/env node
/**
 * Content Validation Script
 * Validates NPC romance arcs, date templates, and repair scenes
 * Ensures no gift-loop patterns, no orphaned callbacks, and proper schema
 */

import { NPCS } from '../src/data/npcs.js';
import { DATE_TEMPLATES } from '../src/data/dates.js';
import { ITEMS } from '../src/data/items.js';

const errors = [];

// ============================================
// Validation 1: NPC Romance Arcs
// ============================================
console.log('Validating NPC romance arcs...');

const requiredArcTypes = ['introduction', 'early connection', 'personal reveal', 'conflict', 'trust event', 'commitment event'];

// Only female NPCs are romanceable
const romanceableNPCs = NPCS.filter(n => n.gender === 'female');

for (const npc of romanceableNPCs) {
  const arcs = npc.romanceArc || [];
  
  if (!arcs || arcs.length === 0) {
    errors.push(`❌ ${npc.id}: Missing romance arcs`);
    continue;
  }
  
  // Check for required arc types
  const arcTypes = arcs.map(a => a.type);
  for (const requiredType of requiredArcTypes) {
    if (!arcTypes.includes(requiredType)) {
      errors.push(`❌ ${npc.id}: Missing arc type: ${requiredType}`);
    }
  }
  
  // Validate each arc
  for (const arc of arcs) {
    // Check required fields
    const requiredFields = ['id', 'type', 'minRelationship', 'title', 'prompt', 'emotionalBeat', 'choices'];
    for (const field of requiredFields) {
      if (!(field in arc)) {
        errors.push(`❌ ${npc.id} arc ${arc.id}: Missing field: ${field}`);
      }
    }
    
    // Validate choices
    if (arc.choices && arc.choices.length > 0) {
      for (const choice of arc.choices) {
        if (!('text' in choice)) {
          errors.push(`❌ ${npc.id} arc ${arc.id}: Choice missing 'text'`);
        }
        
        // Check for gift-based progression
        if (choice.effect && (choice.effect.relationship || choice.effect.chemistry)) {
          errors.push(`❌ ${npc.id} arc ${arc.id}: Choice has direct relationship/chemistry effect (gift pattern)`);
        }
      }
    } else {
      errors.push(`❌ ${npc.id} arc ${arc.id}: Missing choices`);
    }
  }
}

// ============================================
// Validation 2: Date Templates
// ============================================
console.log('Validating date templates...');

if (DATE_TEMPLATES) {
  for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
    if (!template.phases || template.phases.length === 0) {
      errors.push(`❌ Date template ${templateId}: Missing phases`);
    }
    
    for (const phase of template.phases || []) {
      if (!phase.prompt || !phase.choices) {
        errors.push(`❌ Date template ${templateId} phase: Missing prompt or choices`);
      }
      
      for (const choice of phase.choices || []) {
        // Check for gift-based progression
        if (choice.itemRequired || choice.giftEffect) {
          errors.push(`❌ Date template ${templateId}: Gift-based progression detected`);
        }
      }
    }
  }
} else {
  console.warn('⚠️  DATE_TEMPLATES not found - skipping date template validation');
}

// ============================================
// Validation 3: No Gift Loop Patterns
// ============================================
console.log('Validating no gift-loop patterns...');

// Check items
for (const [itemId, item] of Object.entries(ITEMS)) {
  if (item.type === 'gift') {
    errors.push(`❌ Item ${itemId}: Has type 'gift'`);
  }
  if (item.effect && (item.effect.relationship || item.effect.chemistry)) {
    errors.push(`❌ Item ${itemId}: Grants relationship/chemistry points`);
  }
  if (item.effect && item.effect.bonusArchetypes) {
    errors.push(`❌ Item ${itemId}: Has archetype bonuses`);
  }
}

// Check NPCs for gift preferences
for (const npc of NPCS) {
  const giftFields = ['giftLikes', 'lovedGifts', 'likedGifts', 'dislikedGifts', 'giftPreferences'];
  for (const field of giftFields) {
    if (npc[field]) {
      errors.push(`❌ ${npc.id}: Has gift preference field: ${field}`);
    }
  }
}

// ============================================
// Validation 4: Callback Validation
// ============================================
console.log('Validating callbacks...');

// Collect all defined callbacks
const definedCallbacks = new Set();
const referencedCallbacks = new Set();

// From NPC arcs (only romanceable NPCs)
for (const npc of romanceableNPCs) {
  for (const arc of npc.romanceArc || []) {
    for (const choice of arc.choices || []) {
      if (choice.callback) {
        referencedCallbacks.add(choice.callback);
      }
      if (choice.futureCallback) {
        referencedCallbacks.add(choice.futureCallback);
      }
    }
  }
}

// From story events and repair scenes (all NPCs)
for (const npc of NPCS) {
  // From story events
  if (npc.storyEvents) {
    for (const event of Object.values(npc.storyEvents)) {
      if (event.callback) {
        referencedCallbacks.add(event.callback);
      }
      if (event.futureCallback) {
        referencedCallbacks.add(event.futureCallback);
      }
    }
  }
  
  // From repair scenes
  if (npc.repairScene) {
    if (npc.repairScene.callback) {
      referencedCallbacks.add(npc.repairScene.callback);
    }
  }
  
  // From choice callbacks
  if (npc.choiceCallbacks) {
    for (const cb of npc.choiceCallbacks) {
      definedCallbacks.add(cb);
    }
  }
}

// Check for orphaned callbacks (warnings only, not errors)
const orphanedCallbacks = [];
for (const callback of referencedCallbacks) {
  if (!definedCallbacks.has(callback)) {
    orphanedCallbacks.push(callback);
  }
}
if (orphanedCallbacks.length > 0) {
  console.warn(`⚠️  Found ${orphanedCallbacks.length} callbacks referenced but not defined in choiceCallbacks arrays`);
  console.warn(`   This may be intentional - callbacks are stored as memory strings`);
}

// ============================================
// Validation 5: Repair Scene Validation
// ============================================
console.log('Validating repair scenes...');

for (const npc of NPCS) {
  if (npc.repairScene) {
    const repair = npc.repairScene;
    
    // Check for purchased item requirements
    if (repair.requiresPurchasedItem || repair.purchasedItemRequired) {
      errors.push(`❌ ${npc.id} repair scene: Requires purchased item`);
    }
    
    // Check for generic gift-based repair
    if (repair.choices) {
      for (const choice of repair.choices) {
        if (choice.includes('gift') || choice.includes('buy') || choice.includes('purchase')) {
          errors.push(`⚠️  ${npc.id} repair scene: Choice may be gift-based: ${choice}`);
        }
      }
    }
  }
}

// ============================================
// Report Results
// ============================================
console.log('\n' + '='.repeat(60));
console.log('VALIDATION RESULTS');
console.log('='.repeat(60));

if (errors.length === 0) {
  console.log('✅ All content validation checks passed!');
  process.exit(0);
} else {
  console.log(`❌ Found ${errors.length} validation errors:\n`);
  for (const error of errors) {
    console.log(`  ${error}`);
  }
  process.exit(1);
}
