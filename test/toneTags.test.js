import test from 'node:test';
import assert from 'node:assert/strict';
import { NPCS } from '../src/data/npcs.js';
import { DATE_TEMPLATES } from '../src/data/dates.js';

// Valid scene tags from adult-tone-guide.md
const VALID_SCENE_TAGS = new Set([
  'secrecy',
  'temptation',
  'late_night',
  'public_risk',
  'private_invitation',
  'emotional_hunger',
  'near_confession',
  'reputation_pressure',
  'afterparty_quiet',
  'longing',
  'vulnerability',
]);

// Valid tone properties
const VALID_TONE_PROPERTIES = new Set(['heat', 'implication', 'emotionalRisk', 'publicRisk']);

/**
 * Extract all tone objects from a choices array
 */
function extractTonesFromChoices(choices) {
  const tones = [];
  if (!choices) return tones;
  for (const choice of choices) {
    if (choice.tone) {
      tones.push(choice.tone);
    }
  }
  return tones;
}

/**
 * Validate a tone object
 */
function validateToneObject(tone, context) {
  const errors = [];
  
  if (!tone || typeof tone !== 'object') {
    errors.push(`${context}: Tone is not an object`);
    return errors;
  }
  
  // Check all properties are valid
  for (const key of Object.keys(tone)) {
    if (!VALID_TONE_PROPERTIES.has(key)) {
      errors.push(`${context}: Invalid tone property '${key}'`);
    }
  }
  
  // Check all required properties are present
  for (const prop of VALID_TONE_PROPERTIES) {
    if (!(prop in tone)) {
      errors.push(`${context}: Missing tone property '${prop}'`);
    }
  }
  
  // Check values are numbers between 0-10
  for (const [key, value] of Object.entries(tone)) {
    if (typeof value !== 'number') {
      errors.push(`${context}: Tone property '${key}' is not a number (got ${typeof value})`);
    } else if (value < 0 || value > 10) {
      errors.push(`${context}: Tone property '${key}' is out of range [0-10] (got ${value})`);
    }
  }
  
  return errors;
}

/**
 * Validate scene tags
 */
function validateSceneTags(tags, context) {
  const errors = [];
  if (!tags) return errors;
  for (const tag of tags) {
    if (!VALID_SCENE_TAGS.has(tag)) {
      errors.push(`${context}: Invalid scene tag '${tag}'`);
    }
  }
  return errors;
}

// Test 1: Validate all tone objects in NPC romanceArcs
console.log('Testing NPC romanceArc tone validation...');
{
  const errors = [];
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        const context = `${npc.id}.romanceArc.${arc.id}`;
        
        // Check sceneTags on the arc itself
        if (arc.sceneTags) {
          errors.push(...validateSceneTags(arc.sceneTags, context));
        }
        
        // Check tones in choices
        const tones = extractTonesFromChoices(arc.choices || []);
        for (const tone of tones) {
          errors.push(...validateToneObject(tone, context));
        }
      }
    }
  }
  
  assert.deepEqual(errors, [], `Tone validation errors in romanceArcs: ${errors.join('; ')}`);
  console.log('✅ NPC romanceArc tone validation passed');
}

// Test 2: Validate all tone objects in NPC storyEvents
console.log('Testing NPC storyEvents tone validation...');
{
  const errors = [];
  for (const npc of NPCS) {
    if (npc.storyEvents) {
      for (const [level, event] of Object.entries(npc.storyEvents)) {
        const context = `${npc.id}.storyEvents[${level}]`;
        
        // Check sceneTags
        if (event.sceneTags) {
          errors.push(...validateSceneTags(event.sceneTags, context));
        }
        
        // Check tone
        if (event.tone) {
          errors.push(...validateToneObject(event.tone, context));
        }
      }
    }
  }
  
  assert.deepEqual(errors, [], `Tone validation errors in storyEvents: ${errors.join('; ')}`);
  console.log('✅ NPC storyEvents tone validation passed');
}

// Test 3: Validate all tone objects in DATE_TEMPLATES
console.log('Testing DATE_TEMPLATES tone validation...');
{
  const errors = [];
  for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      const context = `DATE_TEMPLATES.${templateId}.phase.${phase.id}`;
      
      // Check sceneTags on the phase
      if (phase.sceneTags) {
        errors.push(...validateSceneTags(phase.sceneTags, context));
      }
      
      // Check tones in choices
      const tones = extractTonesFromChoices(phase.choices || []);
      for (const tone of tones) {
        errors.push(...validateToneObject(tone, context));
      }
    }
  }
  
  assert.deepEqual(errors, [], `Tone validation errors in DATE_TEMPLATES: ${errors.join('; ')}`);
  console.log('✅ DATE_TEMPLATES tone validation passed');
}

// Test 4: Verify route-specific tone identity
console.log('Testing route-specific tone identity...');
{
  // Find NPCs by ID
  const elena = NPCS.find(n => n.id === 'elena');
  const sophia = NPCS.find(n => n.id === 'sophia');
  const rina = NPCS.find(n => n.id === 'rina');
  const maya = NPCS.find(n => n.id === 'maya');
  const nora = NPCS.find(n => n.id === 'nora');
  const brad = NPCS.find(n => n.id === 'brad');
  const marcus = NPCS.find(n => n.id === 'marcus');
  const chloe = NPCS.find(n => n.id === 'chloe');
  
  // Elena should have high emotionalRisk in trust/commitment events
  if (elena && elena.romanceArc) {
    const elenaTrust = elena.romanceArc.find(a => a.id === 'elena_trust');
    const elenaCommitment = elena.romanceArc.find(a => a.id === 'elena_commitment');
    
    if (elenaTrust) {
      const tones = extractTonesFromChoices(elenaTrust.choices || []);
      assert.ok(tones.length > 0, 'Elena trust event should have tone tags');
      for (const tone of tones) {
        assert.ok(tone.emotionalRisk >= 6, `Elena trust: emotionalRisk should be >= 6, got ${tone.emotionalRisk}`);
      }
    }
    
    if (elenaCommitment) {
      const tones = extractTonesFromChoices(elenaCommitment.choices || []);
      assert.ok(tones.length > 0, 'Elena commitment event should have tone tags');
    }
  }
  
  // Sophia should have tone tags in trust/commitment
  if (sophia && sophia.romanceArc) {
    const sophiaTrust = sophia.romanceArc.find(a => a.id === 'sophia_trust');
    const sophiaCommitment = sophia.romanceArc.find(a => a.id === 'sophia_commitment');
    
    if (sophiaTrust) {
      const tones = extractTonesFromChoices(sophiaTrust.choices || []);
      assert.ok(tones.length > 0, 'Sophia trust event should have tone tags');
    }
    
    if (sophiaCommitment) {
      const tones = extractTonesFromChoices(sophiaCommitment.choices || []);
      assert.ok(tones.length > 0, 'Sophia commitment event should have tone tags');
    }
  }
  
  // Rina should have high heat and implication
  if (rina && rina.romanceArc) {
    const rinaTrust = rina.romanceArc.find(a => a.id === 'rina_trust');
    const rinaCommitment = rina.romanceArc.find(a => a.id === 'rina_commitment');
    
    if (rinaTrust) {
      const tones = extractTonesFromChoices(rinaTrust.choices || []);
      assert.ok(tones.length > 0, 'Rina trust event should have tone tags');
      for (const tone of tones) {
        assert.ok(tone.heat >= 7, `Rina trust: heat should be >= 7, got ${tone.heat}`);
        assert.ok(tone.implication >= 7, `Rina trust: implication should be >= 7, got ${tone.implication}`);
      }
    }
    
    if (rinaCommitment) {
      const tones = extractTonesFromChoices(rinaCommitment.choices || []);
      assert.ok(tones.length > 0, 'Rina commitment event should have tone tags');
    }
  }
  
  // Chloe should have tone tags
  if (chloe && chloe.romanceArc) {
    const chloeTrust = chloe.romanceArc.find(a => a.id === 'chloe_trust');
    const chloeCommitment = chloe.romanceArc.find(a => a.id === 'chloe_commitment');
    
    if (chloeTrust) {
      const tones = extractTonesFromChoices(chloeTrust.choices || []);
      assert.ok(tones.length > 0, 'Chloe trust event should have tone tags');
    }
    
    if (chloeCommitment) {
      const tones = extractTonesFromChoices(chloeCommitment.choices || []);
      assert.ok(tones.length > 0, 'Chloe commitment event should have tone tags');
    }
  }
  
  // Maya should have tone tags
  if (maya && maya.romanceArc) {
    const mayaTrust = maya.romanceArc.find(a => a.id === 'maya_trust');
    const mayaCommitment = maya.romanceArc.find(a => a.id === 'maya_commitment');
    
    if (mayaTrust) {
      const tones = extractTonesFromChoices(mayaTrust.choices || []);
      assert.ok(tones.length > 0, 'Maya trust event should have tone tags');
    }
    
    if (mayaCommitment) {
      const tones = extractTonesFromChoices(mayaCommitment.choices || []);
      assert.ok(tones.length > 0, 'Maya commitment event should have tone tags');
    }
  }
  
  // Nora should have tone tags
  if (nora && nora.romanceArc) {
    const noraTrust = nora.romanceArc.find(a => a.id === 'nora_trust');
    const noraCommitment = nora.romanceArc.find(a => a.id === 'nora_commitment');
    
    if (noraTrust) {
      const tones = extractTonesFromChoices(noraTrust.choices || []);
      assert.ok(tones.length > 0, 'Nora trust event should have tone tags');
    }
    
    if (noraCommitment) {
      const tones = extractTonesFromChoices(noraCommitment.choices || []);
      assert.ok(tones.length > 0, 'Nora commitment event should have tone tags');
    }
  }
  
  // Brad should have tone tags
  if (brad && brad.romanceArc) {
    const bradTrust = brad.romanceArc.find(a => a.id === 'brad_trust');
    const bradCommitment = brad.romanceArc.find(a => a.id === 'brad_commitment');
    
    if (bradTrust) {
      const tones = extractTonesFromChoices(bradTrust.choices || []);
      assert.ok(tones.length > 0, 'Brad trust event should have tone tags');
    }
    
    if (bradCommitment) {
      const tones = extractTonesFromChoices(bradCommitment.choices || []);
      assert.ok(tones.length > 0, 'Brad commitment event should have tone tags');
    }
  }
  
  // Marcus should have tone tags
  if (marcus && marcus.romanceArc) {
    const marcusTrust = marcus.romanceArc.find(a => a.id === 'marcus_trust');
    const marcusCommitment = marcus.romanceArc.find(a => a.id === 'marcus_commitment');
    
    if (marcusTrust) {
      const tones = extractTonesFromChoices(marcusTrust.choices || []);
      assert.ok(tones.length > 0, 'Marcus trust event should have tone tags');
    }
    
    if (marcusCommitment) {
      const tones = extractTonesFromChoices(marcusCommitment.choices || []);
      assert.ok(tones.length > 0, 'Marcus commitment event should have tone tags');
    }
  }
  
  console.log('✅ Route-specific tone identity validation passed');
}

// Test 5: Verify sceneTags are present where tone exists
console.log('Testing sceneTags presence with tone...');
{
  const errors = [];
  
  // Check NPC romanceArcs
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        const context = `${npc.id}.romanceArc.${arc.id}`;
        const hasTone = extractTonesFromChoices(arc.choices || []).length > 0;
        const hasSceneTags = arc.sceneTags && arc.sceneTags.length > 0;
        
        if (hasTone && !hasSceneTags) {
          errors.push(`${context}: Has tone but missing sceneTags`);
        }
      }
    }
  }
  
  // Check NPC storyEvents
  for (const npc of NPCS) {
    if (npc.storyEvents) {
      for (const [level, event] of Object.entries(npc.storyEvents)) {
        const context = `${npc.id}.storyEvents[${level}]`;
        const hasTone = event.tone !== undefined;
        const hasSceneTags = event.sceneTags && event.sceneTags.length > 0;
        
        if (hasTone && !hasSceneTags) {
          errors.push(`${context}: Has tone but missing sceneTags`);
        }
      }
    }
  }
  
  // Check DATE_TEMPLATES
  for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      const context = `DATE_TEMPLATES.${templateId}.phase.${phase.id}`;
      const hasTone = extractTonesFromChoices(phase.choices || []).length > 0;
      const hasSceneTags = phase.sceneTags && phase.sceneTags.length > 0;
      
      if (hasTone && !hasSceneTags) {
        errors.push(`${context}: Has tone but missing sceneTags`);
      }
    }
  }
  
  assert.deepEqual(errors, [], `sceneTags missing where tone exists: ${errors.join('; ')}`);
  console.log('✅ sceneTags presence validation passed');
}

// Test 6: Verify tone tags are not used to bypass relationship progression
console.log('Testing tone tags do not bypass relationship progression...');
{
  const errors = [];
  
  // Check that tone is metadata only - it should not directly affect relationship/chemistry
  // We verify that tone objects don't have relationship/chemistry properties
  
  function checkToneForRelationshipBypass(tone, context) {
    const bypassProps = ['relationship', 'chemistry', 'connection', 'relationshipImpact', 'chemistryImpact'];
    for (const prop of bypassProps) {
      if (prop in tone) {
        errors.push(`${context}: Tone object should not have '${prop}' property`);
      }
    }
  }
  
  // Check NPC romanceArcs
  for (const npc of NPCS) {
    if (npc.romanceArc) {
      for (const arc of npc.romanceArc) {
        const context = `${npc.id}.romanceArc.${arc.id}`;
        const tones = extractTonesFromChoices(arc.choices || []);
        for (const tone of tones) {
          checkToneForRelationshipBypass(tone, context);
        }
      }
    }
  }
  
  // Check NPC storyEvents
  for (const npc of NPCS) {
    if (npc.storyEvents) {
      for (const [level, event] of Object.entries(npc.storyEvents)) {
        const context = `${npc.id}.storyEvents[${level}]`;
        if (event.tone) {
          checkToneForRelationshipBypass(event.tone, context);
        }
      }
    }
  }
  
  // Check DATE_TEMPLATES
  for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
    for (const phase of template.phases || []) {
      const context = `DATE_TEMPLATES.${templateId}.phase.${phase.id}`;
      const tones = extractTonesFromChoices(phase.choices || []);
      for (const tone of tones) {
        checkToneForRelationshipBypass(tone, context);
      }
    }
  }
  
  assert.deepEqual(errors, [], `Tone bypasses relationship progression: ${errors.join('; ')}`);
  console.log('✅ Tone does not bypass relationship progression');
}

// Test 7: Verify all main romanceable NPCs have tone tags in trust/commitment events
console.log('Testing all main NPCs have tone tags...');
{
  const mainNpcIds = ['elena', 'brad', 'sophia', 'marcus', 'chloe', 'rina', 'maya', 'nora'];
  const errors = [];
  
  for (const npcId of mainNpcIds) {
    const npc = NPCS.find(n => n.id === npcId);
    if (!npc) {
      errors.push(`NPC ${npcId} not found`);
      continue;
    }
    
    if (!npc.romanceArc) {
      errors.push(`${npcId}: Missing romanceArc`);
      continue;
    }
    
    const trustEvent = npc.romanceArc.find(a => a.id.endsWith('_trust'));
    const commitmentEvent = npc.romanceArc.find(a => a.id.endsWith('_commitment'));
    
    if (!trustEvent) {
      errors.push(`${npcId}: Missing trust event`);
    } else {
      const tones = extractTonesFromChoices(trustEvent.choices || []);
      if (tones.length === 0) {
        errors.push(`${npcId}: Trust event has no tone tags`);
      }
    }
    
    if (!commitmentEvent) {
      errors.push(`${npcId}: Missing commitment event`);
    } else {
      const tones = extractTonesFromChoices(commitmentEvent.choices || []);
      if (tones.length === 0) {
        errors.push(`${npcId}: Commitment event has no tone tags`);
      }
    }
  }
  
  assert.deepEqual(errors, [], `Missing tone tags: ${errors.join('; ')}`);
  console.log('✅ All main NPCs have tone tags in trust/commitment events');
}

console.log('\n✅ All tone tags tests passed!');
