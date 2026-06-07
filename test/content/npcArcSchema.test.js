import test from 'node:test';
import assert from 'node:assert/strict';
import { NPCS } from '../../src/data/npcs.js';

// Test NPC Arc Schema validation
test('NPC Romance Arc Schema Validation', async (t) => {
  await t.test('all NPCs with romanceArc have valid structure', () => {
    const requiredFields = ['id', 'type', 'minRelationship', 'title', 'prompt', 'emotionalBeat', 'choices'];
    const validTypes = ['introduction', 'early connection', 'personal reveal', 'conflict', 'trust event', 'commitment event'];
    
    for (const npc of NPCS) {
      if (!npc.romanceArc) continue;
      
      for (const arc of npc.romanceArc) {
        // Check required fields
        for (const field of requiredFields) {
          assert.ok(field in arc, `NPC ${npc.id} arc ${arc.id} missing field: ${field}`);
        }
        
        // Check type is valid
        assert.ok(validTypes.includes(arc.type), `NPC ${npc.id} arc ${arc.id} has invalid type: ${arc.type}`);
        
        // Check choices is an array with at least one element
        assert.ok(Array.isArray(arc.choices), `NPC ${npc.id} arc ${arc.id} choices is not an array`);
        assert.ok(arc.choices.length > 0, `NPC ${npc.id} arc ${arc.id} has no choices`);
        
        // Check minRelationship is valid
        if (typeof arc.minRelationship === 'number') {
          assert.ok(arc.minRelationship >= 0 && arc.minRelationship <= 100, 
            `NPC ${npc.id} arc ${arc.id} minRelationship out of range: ${arc.minRelationship}`);
        }
        
        // Check emotionalBeat is a string
        assert.ok(typeof arc.emotionalBeat === 'string' && arc.emotionalBeat.length > 0,
          `NPC ${npc.id} arc ${arc.id} has invalid emotionalBeat`);
      }
    }
  });
  
  await t.test('arc IDs follow naming convention', () => {
    for (const npc of NPCS) {
      if (!npc.romanceArc) continue;
      
      for (const arc of npc.romanceArc) {
        // Arc IDs should follow pattern: {npcId}_{type}
        const expectedPrefix = `${npc.id}_`;
        assert.ok(arc.id.startsWith(expectedPrefix), 
          `NPC ${npc.id} arc ${arc.id} does not start with ${expectedPrefix}`);
      }
    }
  });
  
  await t.test('arc types are unique per NPC', () => {
    for (const npc of NPCS) {
      if (!npc.romanceArc) continue;
      
      const types = new Set();
      for (const arc of npc.romanceArc) {
        assert.ok(!types.has(arc.type), 
          `NPC ${npc.id} has duplicate arc type: ${arc.type}`);
        types.add(arc.type);
      }
    }
  });
  
  await t.test('arc minRelationship values are increasing', () => {
    const typeOrder = {
      'introduction': 0,
      'early connection': 1,
      'personal reveal': 2,
      'conflict': 3,
      'trust event': 4,
      'commitment event': 5
    };
    
    for (const npc of NPCS) {
      if (!npc.romanceArc) continue;
      
      const sortedArcs = [...npc.romanceArc].sort((a, b) => 
        typeOrder[a.type] - typeOrder[b.type] || a.minRelationship - b.minRelationship
      );
      
      for (let i = 1; i < sortedArcs.length; i++) {
        const prev = sortedArcs[i - 1];
        const curr = sortedArcs[i];
        
        assert.ok(curr.minRelationship >= prev.minRelationship,
          `NPC ${npc.id} arc ${curr.id} minRelationship (${curr.minRelationship}) < previous arc ${prev.id} (${prev.minRelationship})`);
      }
    }
  });
});
