import test from 'node:test';
import assert from 'node:assert/strict';
import { DATE_TEMPLATES } from '../../src/data/dates.js';
import { LOCATIONS } from '../../src/data/locations.js';

test('Date Template Schema Validation', async (t) => {
  await t.test('all date templates have valid structure', () => {
    for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
      assert.ok(template.phases, `Date template ${id} missing phases`);
      assert.ok(Array.isArray(template.phases), `Date template ${id} phases is not an array`);
      assert.ok(template.phases.length > 0, `Date template ${id} has no phases`);
      
      // Check venueKey if present
      if (template.venueKey) {
        assert.ok(template.venueKey in LOCATIONS, 
          `Date template ${id} has invalid venueKey: ${template.venueKey}`);
      }
    }
  });
  
  await t.test('all date template phases have valid structure', () => {
    for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
      for (const phase of template.phases) {
        assert.ok(phase.id, `Date template ${templateId} phase missing id`);
        assert.ok(phase.title, `Date template ${templateId} phase ${phase.id} missing title`);
        assert.ok(phase.prompt, `Date template ${templateId} phase ${phase.id} missing prompt`);
        
        if (phase.choices) {
          assert.ok(Array.isArray(phase.choices), 
            `Date template ${templateId} phase ${phase.id} choices is not an array`);
          
          for (const choice of phase.choices) {
            assert.ok(choice.text, 
              `Date template ${templateId} phase ${phase.id} choice missing text`);
          }
        }
      }
    }
  });
  
  await t.test('date templates follow phase order', () => {
    const expectedPhases = ['arrival', 'shared_activity', 'closing_moment'];
    
    for (const [id, template] of Object.entries(DATE_TEMPLATES)) {
      const phaseIds = template.phases.map(p => p.id);
      
      // Check that phases are in the expected order
      for (let i = 0; i < expectedPhases.length; i++) {
        if (i < phaseIds.length) {
          assert.strictEqual(phaseIds[i], expectedPhases[i],
            `Date template ${id} phase order mismatch at index ${i}: expected ${expectedPhases[i]}, got ${phaseIds[i]}`);
        }
      }
    }
  });
  
  await t.test('date template choices have valid impact values', () => {
    for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
      for (const phase of template.phases) {
        for (const choice of phase.choices || []) {
          // Check relationship/chemistry impacts are numbers
          if ('relationship' in choice) {
            assert.ok(typeof choice.relationship === 'number',
              `Date template ${templateId} phase ${phase.id} choice has non-numeric relationship`);
          }
          if ('chemistry' in choice) {
            assert.ok(typeof choice.chemistry === 'number',
              `Date template ${templateId} phase ${phase.id} choice has non-numeric chemistry`);
          }
          if ('connection' in choice) {
            assert.ok(typeof choice.connection === 'number',
              `Date template ${templateId} phase ${phase.id} choice has non-numeric connection`);
          }
          if ('mood' in choice) {
            assert.ok(typeof choice.mood === 'number',
              `Date template ${templateId} phase ${phase.id} choice has non-numeric mood`);
          }
          if ('energy' in choice) {
            assert.ok(typeof choice.energy === 'number',
              `Date template ${templateId} phase ${phase.id} choice has non-numeric energy`);
          }
        }
      }
    }
  });
  
  await t.test('date templates have at least 3 choices per phase', () => {
    for (const [templateId, template] of Object.entries(DATE_TEMPLATES)) {
      for (const phase of template.phases) {
        if (phase.choices) {
          assert.ok(phase.choices.length >= 3,
            `Date template ${templateId} phase ${phase.id} has fewer than 3 choices (${phase.choices.length})`);
        }
      }
    }
  });
});
