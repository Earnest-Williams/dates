export const CAREER_TITLES = [
  { level: 1, title: 'Intern', minCorporate: 0, bonusMultiplier: 1.0 },
  { level: 2, title: 'Junior Associate', minCorporate: 20, bonusMultiplier: 1.2 },
  { level: 3, title: 'Senior Associate', minCorporate: 40, bonusMultiplier: 1.5 },
  { level: 4, title: 'Manager', minCorporate: 60, bonusMultiplier: 2.0 },
  { level: 5, title: 'Executive Director', minCorporate: 80, bonusMultiplier: 3.0 },
  { level: 6, title: 'CEO', minCorporate: 100, bonusMultiplier: 5.0 }
];

export const getCurrentCareer = (corporateScore) => {
  let current = CAREER_TITLES[0];
  for (const career of CAREER_TITLES) {
    if (corporateScore >= career.minCorporate) {
      current = career;
    } else {
      break;
    }
  }
  return current;
};

export const WORK_EVENTS = [
  {
    prompt: "Your boss asks you to stay late to finish a critical presentation.",
    choices: [
      { text: "Stay and finish it. (Uses Energy)", checkStat: 'corporate', threshold: 20, successRelation: 0, failRelation: 0, successText: "The boss is impressed.", failText: "You made mistakes due to fatigue.", bonusMoney: 50, energyCost: 20, moodCost: 10 },
      { text: "Decline and go home.", checkStat: 'negotiation', threshold: 30, successRelation: 0, failRelation: 0, successText: "You smoothly excused yourself.", failText: "The boss seems annoyed.", bonusMoney: 0, energyCost: 0, moodCost: 0 }
    ]
  },
  {
    prompt: "A coworker takes credit for your idea in a meeting.",
    choices: [
      { text: "Call them out professionally.", checkStat: 'confidence', threshold: 35, successRelation: 0, failRelation: 0, successText: "You reclaimed your credit and earned respect.", failText: "You came off as petty.", bonusMoney: 30, energyCost: 5, moodCost: -10 },
      { text: "Let it slide and avoid conflict.", checkStat: 'empathy', threshold: 10, successRelation: 0, failRelation: 0, successText: "You maintained peace in the office.", failText: "You feel terrible.", bonusMoney: 0, energyCost: 0, moodCost: 15 }
    ]
  }
];
