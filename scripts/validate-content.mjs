#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * Validates all game content against schema and anti-goal rules.
 * This script ensures:
 * - No gift-loop regressions
 * - No orphaned callback keys
 * - Valid schema for NPC arcs, date templates, repair scenes, home activities
 * - Tone tags are valid
 * - No invalid location/date references
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(__dirname, '..');

// Import data modules
const npcsPath = resolve(repoRoot, 'src/data/npcs.js');
const datesPath = resolve(repoRoot, 'src/data/dates.js');
const furniturePath = resolve(repoRoot, 'src/data/furniture.js');
const itemsPath = resolve(repoRoot, 'src/data/items.js');
const locationsPath = resolve(repoRoot, 'src/data/locations.js');
const townTexturePath = resolve(repoRoot, 'src/data/townTexture.js');

// Load modules
const { NPCS } = await import(npcsPath);
const { DATE_TEMPLATES } = await import(datesPath);
const { FURNITURE } = await import(furniturePath);
const { ITEMS } = await import(itemsPath);
const { LOCATIONS } = await import(locationsPath);
const { TIME_OF_DAY_LOCATION_TEXTURE } = await import(townTexturePath);

// Validation state
let errors = [];
let warnings = [];
let passed = 0;

function error(message, context = '') {
  errors.push(`${context ? `[${context}] ` : ''}${message}`);
}

function warn(message, context = '') {
  warnings.push(`${context ? `[${context}] ` : ''}${message}`);
}

function pass(message, context = '') {
  passed++;
  console.log(`✅ ${context ? `[${context}] ` : ''}${message}`);
}

/**
 * Validate NPC romance arcs
 */
function validateNpcArcs() {
  console.log('\n=== Validating NPC Romance Arcs ===');
  
  const requiredFields = ['id', 'type', 'minRelationship', 'title', 'prompt', 'emotionalBeat', 'choices'];
  const validTypes = ['introduction', 'early connection', 'personal reveal', 'conflict', 'trust event', 'commitment event'];
  
  for (const npc of NPCS) {
    if (!npc.romanceArc) {
      warn(`NPC ${npc.id} has no romanceArc`, 'npc-arcs');
      continue;
    }
    
    for (const arc of npc.romanceArc) {
      const context = `${npc.id}.${arc.id}`;
      
      // Check required fields
      for (const field of requiredFields) {
        if (!(field in arc)) {
          error(`Missing required field '${field}'`, context);
        }
      }
      
      // Check type is valid
      if (arc.type && !validTypes.includes(arc.type)) {
        error(`Invalid arc type '${arc.type}'`, context);
      }
      
      // Check choices exist and are valid
      if (arc.choices) {
        if (!Array.isArray(arc.choices)) {
          error(`Choices must be an array`, context);
        } else if (arc.choices.length === 0) {
          error(`No choices defined`, context);
        } else {
          for (const choice of arc.choices) {
            validateChoice(choice, context);
          }
        }
      }
      
      // Check minRelationship is valid
      if (typeof arc.minRelationship === 'number') {
        if (arc.minRelationship < 0 || arc.minRelationship > 100) {
          error(`minRelationship out of range [0-100]: ${arc.minRelationship}`, context);
        }
      }
      
      // Validate emotionalBeat exists
      if (!arc.emotionalBeat || typeof arc.emotionalBeat !== 'string') {
        error(`Missing or invalid emotionalBeat`, context);
      }
    }
  }
  
  pass(`Validated ${NPCS.filter(n => n.romanceArc).length} NPC romance arcs`);
}

/**
 * Validate a choice object
 */
function validateChoice(choice, context) {
  if (!choice.text || typeof choice.text !== 'string') {
    error(`Choice missing text`, context);
  }
  
  // Check for relationship/chemistry impact
  const hasImpact = 'relationshipImpact' in choice || 'chemistryImpact' in choice || 'relationship' in choice || 'chemistry' in choice;
  if (!hasImpact) {
    warn(`Choice has no relationship/chemistry impact`, context);
  }
  
  // Validate tone if present
  if (choice.tone) {
    validateTone(choice.tone, context);
  }
  
  // Validate checkStat if present
  if (choice.checkStat) {
    const validStats = ['intelligence', 'fitness', 'charisma', 'style', 'corporate', 'finance', 'culinary', 'confidence', 'empathy', 'negotiation', 'socialIq', 'programming', 'music', 'hygiene', 'money'];
    if (!validStats.includes(choice.checkStat)) {
      error(`Invalid stat '${choice.checkStat}'`, context);
    }
  }
  
  // Validate memory/callback references
  if (choice.unlocksMemory) {
    // Memory keys should be strings
    if (typeof choice.unlocksMemory !== 'string') {
      error(`unlocksMemory must be a string`, context);
    }
  }
  
  if (choice.futureCallback) {
    if (typeof choice.futureCallback !== 'string') {
      error(`futureCallback must be a string`, context);
    }
  }
}

/**
 * Validate tone object
 */
function validateTone(tone, context) {
  const validProps = ['heat', 'implication', 'emotionalRisk', 'publicRisk'];
  
  for (const prop of validProps) {
    if (!(prop in tone)) {
      error(`Tone missing property '${prop}'`, context);
    } else if (typeof tone[prop] !== 'number') {
      error(`Tone property '${prop}' is not a number`, context);
    } else if (tone[prop] < 0 || tone[prop] > 10) {
      error(`Tone property '${prop}' out of range [0-10]: ${tone[prop]}`, context);
    }
  }
  
  // Check for extra properties
  for (const prop of Object.keys(tone)) {
    if (!validProps.includes(prop)) {
      error(`Tone has invalid property '${prop}'`, context);
    }
  }
}

/**
 * Validate date templates
 */
function validateDateTemplates() {
  console.log('\n=== Validating Date Templates ===');
  
  for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
    const context = `date.${id}`;
    
    if (!template.phases || !Array.isArray(template.phases)) {
      error(`Missing or invalid phases array`, context);
      continue;
    }
    
    if (template.phases.length === 0) {
      error(`No phases defined`, context);
      continue;
    }
    
    for (const phase of template.phases) {
      const phaseContext = `${context}.${phase.id}`;
      
      if (!phase.id || !phase.title || !phase.prompt) {
        error(`Phase missing required fields`, phaseContext);
      }
      
      if (phase.choices) {
        for (const choice of phase.choices) {
          validateChoice(choice, phaseContext);
        }
      }
      
      // Validate venueKey if present
      if (template.venueKey) {
        const validLocations = Object.keys(LOCATIONS);
        if (!validLocations.includes(template.venueKey)) {
          error(`Invalid venueKey '${template.venueKey}'`, context);
        }
      }
    }
  }
  
  pass(`Validated ${Object.keys(DATE_TEMPLATES).length} date templates`);
}

/**
 * Validate no gift-loop regressions
 */
function validateNoGiftRegressions() {
  console.log('\n=== Validating No Gift-Loop Regressions ===');
  
  // Check items don't grant relationship points
  for (const [id, item] of Object.entries(ITEMS)) {
    if (item.relationship || item.relationshipBonus || item.relationshipPoints) {
      error(`Item '${id}' grants relationship points`, 'no-gift');
    }
  }
  
  // Check furniture doesn't define romance shortcuts
  for (const [id, furniture] of Object.entries(FURNITURE)) {
    if (furniture.favoriteNpc || furniture.relationshipBonus || furniture.relationshipPoints) {
      error(`Furniture '${id}' defines romance shortcuts`, 'no-gift');
    }
  }
  
  // Check NPCs don't have gift tables
  for (const npc of NPCS) {
    if (npc.giftPreferences || npc.lovedGifts || npc.likedGifts || npc.dislikedGifts) {
      error(`NPC '${npc.id}' has gift preferences`, 'no-gift');
    }
  }
  
  // Check date templates don't include repeatable gift progression
  for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      for (const choice of phase.choices || []) {
        if (choice.text && choice.text.toLowerCase().includes('gift') && 
            (choice.relationship || choice.relationshipImpact)) {
          error(`Date template '${id}' has gift-based relationship progression`, 'no-gift');
        }
      }
    }
  }
  
  pass(`No gift-loop regressions detected`);
}

/**
 * Validate callback references
 */
function validateCallbacks() {
  console.log('\n=== Validating Callback References ===');
  
  const allCallbacks = new Set();
  const referencedCallbacks = new Set();
  
  // Collect all defined callbacks from NPCs
  for (const npc of NPCS) {
    if (npc.choiceCallbacks) {
      for (const callback of npc.choiceCallbacks) {
        allCallbacks.add(callback);
      }
    }
  }
  
  // Check all referenced callbacks exist
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        for (const choice of arc.choices || []) {
          if (choice.futureCallback) {
            referencedCallbacks.add(choice.futureCallback);
            if (!allCallbacks.has(choice.futureCallback)) {
              warn(`Orphaned callback reference: ${choice.futureCallback}`, `${npc.id}.${arc.id}`);
            }
          }
        }
      }
    }
    
    if (npc.storyEvents) {
      for (const [level, event] of Object.entries(npc.storyEvents)) {
        if (event.futureCallback) {
          referencedCallbacks.add(event.futureCallback);
          if (!allCallbacks.has(event.futureCallback)) {
            warn(`Orphaned callback reference: ${event.futureCallback}`, `${npc.id}.storyEvents[${level}]`);
          }
        }
      }
    }
  }
  
  // Check DATE_TEMPLATES for callbacks
  for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      for (const choice of phase.choices || []) {
        if (choice.futureCallback) {
          referencedCallbacks.add(choice.futureCallback);
          if (!allCallbacks.has(choice.futureCallback)) {
            warn(`Orphaned callback reference: ${choice.futureCallback}`, `date.${id}`);
          }
        }
      }
    }
  }
  
  pass(`Validated ${referencedCallbacks.size} callback references`);
}

/**
 * Validate memory references
 */
function validateMemories() {
  console.log('\n=== Validating Memory References ===');
  
  const allMemories = new Set();
  const referencedMemories = new Set();
  
  // Collect all memories from NPCs
  for (const npc of NPCS) {
    if (npc.memories) {
      for (const memory of npc.memories) {
        allMemories.add(memory);
      }
    }
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        for (const choice of arc.choices || []) {
          if (choice.unlocksMemory) {
            allMemories.add(choice.unlocksMemory);
          }
        }
      }
    }
  }
  
  // Check all referenced memories
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        for (const choice of arc.choices || []) {
          if (choice.unlocksMemory) {
            referencedMemories.add(choice.unlocksMemory);
          }
          if (choice.checkMemory) {
            referencedMemories.add(choice.checkMemory);
          }
        }
      }
    }
  }
  
  // Check for orphaned memory references
  for (const memory of referencedMemories) {
    if (!allMemories.has(memory) && !memory.startsWith('player_')) {
      warn(`Potential orphaned memory reference: ${memory}`);
    }
  }
  
  pass(`Validated ${referencedMemories.size} memory references`);
}

/**
 * Validate location references
 */
function validateLocations() {
  console.log('\n=== Validating Location References ===');
  
  const validLocations = Object.keys(LOCATIONS);
  
  // Check date templates
  for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
    if (template.venueKey && !validLocations.includes(template.venueKey)) {
      error(`Invalid location reference: ${template.venueKey}`, `date.${id}`);
    }
  }
  
  // Check town texture - structure is { location: { timeOfDay: description } }
  for (const [locKey, timeEntries] of Object.entries(TIME_OF_DAY_LOCATION_TEXTURE)) {
    if (!validLocations.includes(locKey)) {
      error(`Invalid location in town texture: ${locKey}`, 'townTexture');
    }
    for (const [time, texture] of Object.entries(timeEntries)) {
      // Validate time is a string (description)
      if (typeof texture !== 'string') {
        error(`Invalid town texture entry for ${locKey}.${time}`, 'townTexture');
      }
    }
  }
  
  pass(`Validated location references`);
}

/**
 * Validate scene tags
 */
function validateSceneTags() {
  console.log('\n=== Validating Scene Tags ===');
  
  const validTags = new Set([
    'secrecy', 'temptation', 'late_night', 'public_risk', 'private_invitation',
    'emotional_hunger', 'near_confession', 'reputation_pressure', 'afterparty_quiet',
    'longing', 'vulnerability'
  ]);
  
  // Check NPC romance arcs
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        if (arc.sceneTags) {
          for (const tag of arc.sceneTags) {
            if (!validTags.has(tag)) {
              error(`Invalid scene tag: ${tag}`, `${npc.id}.${arc.id}`);
            }
          }
        }
      }
    }
    
    if (npc.storyEvents) {
      for (const [level, event] of Object.entries(npc.storyEvents)) {
        if (event.sceneTags) {
          for (const tag of event.sceneTags) {
            if (!validTags.has(tag)) {
              error(`Invalid scene tag: ${tag}`, `${npc.id}.storyEvents[${level}]`);
            }
          }
        }
      }
    }
  }
  
  // Check date templates
  for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      if (phase.sceneTags) {
        for (const tag of phase.sceneTags) {
          if (!validTags.has(tag)) {
            error(`Invalid scene tag: ${tag}`, `date.${id}.${phase.id}`);
          }
        }
      }
    }
  }
  
  pass(`Validated scene tags`);
}

/**
 * Main validation function
 */
async function runValidation() {
  console.log('Starting content validation...\n');
  
  validateNoGiftRegressions();
  validateNpcArcs();
  validateDateTemplates();
  validateCallbacks();
  validateMemories();
  validateLocations();
  validateSceneTags();
  
  console.log('\n=== Validation Summary ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of warnings) {
      console.log(`  ⚠️  ${warning}`);
    }
  }
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const err of errors) {
      console.log(`  ❌ ${err}`);
    }
    process.exit(1);
  }
  
  console.log('\n✅ All content validation passed!');
  process.exit(0);
}

// Run validation
runValidation().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
