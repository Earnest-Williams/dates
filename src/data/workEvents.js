const baseChoices = {
  steady: {
    text: 'Handle it steadily and keep the line moving',
    statCheck: 'socialIq',
    threshold: 28,
    successRewards: { promotionPoints: 8, mood: 4 },
    failRewards: { promotionPoints: -4, mood: -6 },
  },
  escalate: {
    text: 'Escalate to your supervisor and document everything',
    statCheck: 'corporate',
    threshold: 25,
    successRewards: { promotionPoints: 6, mood: 2 },
    failRewards: { promotionPoints: -2, mood: -4 },
  },
  wingIt: {
    text: 'Wing it and hope nobody notices',
    statCheck: 'none',
    threshold: 0,
    successRewards: { mood: 0 },
    failRewards: { promotionPoints: -8, mood: -8 },
  },
};

const buildEvent = (id, title, prompt, choices) => ({ id, title, prompt, choices });

const withLogLines = (choice, successLog, failLog) => ({
  ...choice,
  successLog,
  failLog,
});

const BY_BUSINESS_TYPE = {
  grocery: [
    buildEvent(
      'grocery_stock_count_mismatch',
      'Stock Count Mismatch',
      'A pallet arrived short and the till totals do not match the delivery note.',
      [
        withLogLines(baseChoices.steady, 'You resolved the stock mismatch and kept customers flowing.', 'You lost track of the count and had to write off stock.'),
        withLogLines(baseChoices.escalate, 'You escalated early and prevented a full inventory mess.', 'Your notes were incomplete and the issue got pinned on your shift.'),
        withLogLines(baseChoices.wingIt, 'Nobody caught it this hour.', 'The gap was discovered at close and your supervisor is unhappy.'),
      ],
    ),
  ],
  petrol_station: [
    buildEvent(
      'forecourt_pump_alarm',
      'Forecourt Pump Alarm',
      'A pump fault alarm is blaring while a queue builds at the till.',
      [
        withLogLines(baseChoices.steady, 'You kept calm, paused the pump, and moved customers safely.', 'The queue got hostile and the forecourt stalled.'),
        withLogLines(baseChoices.escalate, 'You called the supervisor immediately and the fault was contained.', 'You called late and the delay cost the station money.'),
        withLogLines(baseChoices.wingIt, 'You guessed right this time.', 'You guessed wrong and the manager had to shut a pump lane.'),
      ],
    ),
  ],
  takeaway: [
    buildEvent(
      'takeaway_order_pileup',
      'Order Pileup',
      'Courier pickups and walk-ins both spike during your shift.',
      [
        withLogLines(baseChoices.steady, 'You triaged tickets and service recovered.', 'Tickets backed up and customers left angry.'),
        withLogLines(baseChoices.escalate, 'You pulled in backup and saved dinner rush.', 'The escalation came too late to recover the rush.'),
        withLogLines(baseChoices.wingIt, 'You survived on luck.', 'Orders went out wrong and refunds hit the till.'),
      ],
    ),
  ],
  pub: [
    buildEvent(
      'pub_bar_rush',
      'Bar Rush',
      'A match-day crowd arrives all at once with complex drink orders.',
      [
        withLogLines(baseChoices.steady, 'You kept tabs accurate and moved the bar line quickly.', 'You lost tab control and had to comp drinks.'),
        withLogLines(baseChoices.escalate, 'You called support and stabilized the bar floor.', 'Support arrived too late and complaints piled up.'),
        withLogLines(baseChoices.wingIt, 'You coasted through this one.', 'Cash-up found missing receipts and your shift took the blame.'),
      ],
    ),
  ],
  cafe: [
    buildEvent(
      'cafe_machine_failure',
      'Coffee Machine Failure',
      'The main espresso machine stalls during the busiest hour.',
      [
        withLogLines(baseChoices.steady, 'You rerouted drinks and kept regulars calm.', 'Service times spiked and tips dropped.'),
        withLogLines(baseChoices.escalate, 'You got the supervisor to split stations and recover flow.', 'The handoff was messy and queue rage grew.'),
        withLogLines(baseChoices.wingIt, 'You improvised for now.', 'The improvised workflow collapsed and orders were refunded.'),
      ],
    ),
  ],
  default: [
    buildEvent(
      'shift_pressure',
      'Shift Pressure',
      'An operational issue lands on your desk right before close.',
      [
        withLogLines(baseChoices.steady, 'You handled it cleanly and protected the shift.', 'You missed details and cleanup took longer.'),
        withLogLines(baseChoices.escalate, 'You escalated with good notes and avoided fallout.', 'Escalation without details made things worse.'),
        withLogLines(baseChoices.wingIt, 'You got away with a shortcut this time.', 'The shortcut backfired and hurt trust.'),
      ],
    ),
  ],
};

export const getWorkEventsForContext = (businessType) => (
  BY_BUSINESS_TYPE[businessType] || BY_BUSINESS_TYPE.default
);

