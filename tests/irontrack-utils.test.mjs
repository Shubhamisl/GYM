import assert from 'node:assert/strict';

import {
  buildTrackerUrl,
  createWorkoutCalendarEntry,
  getActiveProgramSummary,
  getDayOptions,
  getMetricSearchResults,
  getMuscleDataForExercise,
  getWeekOptions,
} from '../src/utils/irontrackUtils.js';

const samplePrograms = {
  alpha: {
    name: 'Alpha Strength',
    blocks: [
      {
        name: 'Foundation',
        weeks: [1, 2],
        days: [
          { focus: 'Upper Power', exercises: [{ name: 'Bench Press' }] },
          { focus: 'Rest Day', exercises: [] },
        ],
      },
      {
        name: 'Peak',
        weeks: [3],
        days: [{ focus: 'Full Body', exercises: [] }],
      },
    ],
  },
};

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('buildTrackerUrl carries program, week, day, and date into the tracker route', () => {
  assert.equal(
    buildTrackerUrl({ programId: 'alpha', week: 2, day: 1, date: '2026-04-10' }),
    '/tracker?program=alpha&week=2&day=1&date=2026-04-10',
  );
});

test('getWeekOptions labels each week with its block name', () => {
  assert.deepEqual(getWeekOptions(samplePrograms.alpha), [
    { value: 1, label: 'Week 1 - Foundation' },
    { value: 2, label: 'Week 2 - Foundation' },
    { value: 3, label: 'Week 3 - Peak' },
  ]);
});

test('getDayOptions labels each day with its workout focus', () => {
  assert.deepEqual(getDayOptions(samplePrograms.alpha, 2), [
    { value: 1, label: 'Day 1 - Upper Power', focus: 'Upper Power' },
    { value: 2, label: 'Day 2 - Rest Day', focus: 'Rest Day' },
  ]);
});

test('createWorkoutCalendarEntry includes workout focus and finish time', () => {
  assert.deepEqual(
    createWorkoutCalendarEntry(samplePrograms.alpha, {
      programId: 'alpha',
      week: 1,
      day: 1,
      finishedAt: '18:30',
    }),
    {
      programId: 'alpha',
      week: 1,
      day: 1,
      focus: 'Upper Power',
      finishedAt: '18:30',
    },
  );
});

test('getMetricSearchResults finds dashboard metrics and routes to their owning pages', () => {
  assert.deepEqual(getMetricSearchResults('calendar').map((result) => result.to), ['/stats']);
  assert.deepEqual(getMetricSearchResults('squad').map((result) => result.to), ['/party']);
});

test('getMuscleDataForExercise maps hip adduction and abduction to SVG muscle IDs', () => {
  assert.deepEqual(getMuscleDataForExercise('Machine Hip Adduction').primary, ['adductors']);
  assert.ok(getMuscleDataForExercise('Machine Hip Abduction').primary.includes('abductors'));
});

test('getActiveProgramSummary uses real program data instead of mock dashboard copy', () => {
  assert.deepEqual(
    getActiveProgramSummary(samplePrograms.alpha, {
      programId: 'alpha',
      daysCompleted: 1,
    }),
    {
      programId: 'alpha',
      title: 'Alpha Strength',
      subtitle: 'Week 1 - Foundation',
      focus: 'Upper Power',
      completion: 50,
      nextWeek: 1,
      nextDay: 1,
      totalTrainingDays: 2,
    },
  );
});
