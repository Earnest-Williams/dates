import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDateDiminishingReturns, checkDateRepetition, recordDateInHistory } from '../src/sim/dateDiminishingReturns.js';

test('date diminishing returns system', async (t) => {
  await t.test('no penalty for first date', () => {
    const result = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, {}, 80);
    assert.equal(result.relGain, 20, 'Should have full gain');
    assert.equal(result.chemChange, 15, 'Should have full chem change');
    assert.equal(result.diminished, false, 'Should not be diminished');
    assert.equal(result.penaltyReason, null, 'Should have no penalty reason');
  });

  await t.test('penalty for repeated date within 7 days', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6 // Current day is 6, date was on day 5 (within 7 days)
    };
    const result = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, false, false, 50);
    assert.equal(result.diminished, true, 'Should be diminished');
    assert.ok(result.relGain < 20, 'Should have reduced gain');
    assert.ok(result.chemChange < 15, 'Should have reduced chem change');
    assert.ok(result.penaltyReason?.includes('repeated'), 'Should have penalty reason');
  });

  await t.test('callback date bypasses 50% of penalty', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6
    };
    const result = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, true, false, 50);
    assert.ok(result.relGain > 0, 'Should have positive gain');
    assert.ok(result.penaltyAmount < 35, 'Should have reduced penalty amount');
  });

  await t.test('repair date bypasses all penalty', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6
    };
    const result = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, false, true, 50);
    assert.equal(result.diminished, false, 'Repair date should not be diminished');
    assert.equal(result.relGain, 20, 'Repair date should have full gain');
    assert.equal(result.chemChange, 15, 'Repair date should have full chem change');
  });

  await t.test('high compatibility softens penalty', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6
    };
    const resultHighCompat = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, false, false, 80);
    const resultLowCompat = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, false, false, 30);
    assert.ok(resultHighCompat.relGain > resultLowCompat.relGain, 'High compatibility should soften penalty');
  });

  await t.test('low connection increases penalty', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6
    };
    const resultHighConnection = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 80, false, false, 50);
    const resultLowConnection = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWithHistory, 20, false, false, 50);
    assert.ok(resultHighConnection.relGain > resultLowConnection.relGain, 'Low connection should increase penalty');
  });

  await t.test('no penalty for negative gains', () => {
    const matchWithHistory = {
      ...recordDateInHistory({}, 'library_date', 5),
      currentDay: 6
    };
    const result = applyDateDiminishingReturns(-10, -5, 'elena', 'library_date', {}, matchWithHistory, 20, false, false, 50);
    assert.equal(result.relGain, -10, 'Negative gains should not be penalized');
    assert.equal(result.chemChange, -5, 'Negative chem should not be penalized');
    assert.equal(result.diminished, false, 'Should not be diminished for negative gains');
  });

  await t.test('recordDateInHistory tracks dates correctly', () => {
    const match1 = recordDateInHistory({}, 'library_date', 5);
    assert.equal(match1.dateHistory.length, 1, 'Should have 1 date recorded');
    assert.equal(match1.dateHistory[0].dateType, 'library_date', 'Should record date type');
    assert.equal(match1.dateHistory[0].day, 5, 'Should record day');
    assert.equal(match1.lastDateDay, 5, 'Should set lastDateDay');
    assert.equal(match1.lastDateType, 'library_date', 'Should set lastDateType');

    const match2 = recordDateInHistory(match1, 'park_walk', 6);
    assert.equal(match2.dateHistory.length, 2, 'Should have 2 dates recorded');
    assert.equal(match2.dateHistory[0].dateType, 'park_walk', 'Should have newest date first');
  });

  await t.test('checkDateRepetition detects repetitions', () => {
    const match = {
      dateHistory: [
        { dateType: 'library_date', day: 5 },
        { dateType: 'library_date', day: 3 },
        { dateType: 'park_walk', day: 4 }
      ],
      currentDay: 6
    };

    const result = checkDateRepetition(match, 'library_date');
    assert.equal(result.isRepeated, true, 'Should detect repetition');
    assert.equal(result.recentCount, 2, 'Should count 2 recent dates');
    assert.equal(result.totalCount, 2, 'Should count 2 total dates');
  });

  await t.test('lifetime repetition penalty after 3 dates', () => {
    const matchWith3Dates = {
      dateHistory: [
        { dateType: 'library_date', day: 10 },
        { dateType: 'library_date', day: 8 },
        { dateType: 'library_date', day: 5 }
      ],
      currentDay: 15
    };
    const result = applyDateDiminishingReturns(20, 15, 'elena', 'library_date', {}, matchWith3Dates, 80, false, false, 50);
    assert.equal(result.diminished, true, 'Should be diminished for lifetime repetition');
    assert.ok(result.penaltyReason?.includes('lifetime'), 'Should mention lifetime repetition');
  });
});
