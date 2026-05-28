export const WORK_EVENTS = [
  {
    id: "whistleblower",
    title: "Ethical Dilemma: Embezzlement",
    description: "You notice an accounting discrepancy that points directly to your manager skimming company funds. What do you do?",
    choices: [
      {
        text: "Report to HR (Whistleblow)",
        statCheck: "negotiation",
        threshold: 30,
        successLog: "HR believed you! The manager was fired. You gained immense respect and a stress-free environment.",
        failLog: "HR didn't believe you. You were reassigned to a worse desk and the manager is making your life hell.",
        successRewards: { mood: 20, promotionPoints: 10, money: 500 },
        failRewards: { mood: -30, promotionPoints: -10, energy: -20 }
      },
      {
        text: "Cover for them",
        statCheck: "corporate",
        threshold: 20,
        successLog: "The manager noticed you looking the other way. They rewarded you quietly, but you feel terrible.",
        failLog: "The auditors caught the discrepancy anyway. You were implicated for not saying anything.",
        successRewards: { money: 1000, mood: -20, promotionPoints: 5 },
        failRewards: { money: -500, mood: -20, promotionPoints: -20 }
      },
      {
        text: "Ignore it entirely",
        statCheck: "none",
        threshold: 0,
        successLog: "You kept your head down. Someone else eventually reported it. Nothing changed for you.",
        failLog: "You kept your head down. Someone else eventually reported it. Nothing changed for you.",
        successRewards: { mood: 0 },
        failRewards: { mood: 0 }
      }
    ]
  },
  {
    id: "burnout_crunch",
    title: "Mandatory Crunch Time",
    description: "Upper management has demanded weekend crunch hours to meet an impossible deadline. Everyone is exhausted.",
    choices: [
      {
        text: "Push through the pain",
        statCheck: "fitness",
        threshold: 40,
        successLog: "Your stamina paid off. You completed the work, impressing management.",
        failLog: "You physically couldn't handle it and collapsed at your desk.",
        successRewards: { promotionPoints: 15, money: 300, energy: -30 },
        failRewards: { health: -20, energy: -50, mood: -30 }
      },
      {
        text: "Organize a pushback",
        statCheck: "charisma",
        threshold: 50,
        successLog: "You convinced the team to stand together. Management backed down and hired contractors.",
        failLog: "Nobody stood with you. You looked like a slacker and were reprimanded.",
        successRewards: { mood: 20, energy: 0, promotionPoints: 5 },
        failRewards: { promotionPoints: -15, mood: -20 }
      },
      {
        text: "Take sick leave",
        statCheck: "none",
        threshold: 0,
        successLog: "You called in sick. The team suffered, but you got your rest.",
        failLog: "You called in sick. The team suffered, but you got your rest.",
        successRewards: { energy: 30, mood: 10, promotionPoints: -5 },
        failRewards: { energy: 30, mood: 10, promotionPoints: -5 }
      }
    ]
  },
  {
    id: "office_gossip",
    title: "Vicious Office Gossip",
    description: "A rumor is spreading that could ruin a coworker's career, and you know it's completely false.",
    choices: [
      {
        text: "Defend them publicly",
        statCheck: "charisma",
        threshold: 35,
        successLog: "You shut the rumor down. The coworker owes you big time.",
        failLog: "You tried to stop it, but got dragged into the drama yourself.",
        successRewards: { mood: 15, promotionPoints: 10 },
        failRewards: { mood: -15, stress: 10 }
      },
      {
        text: "Join in the gossip",
        statCheck: "corporate",
        threshold: 30,
        successLog: "You cleverly used the gossip to eliminate a rival for your next promotion.",
        failLog: "It backfired. The rumor was traced back to you, hurting your reputation.",
        successRewards: { promotionPoints: 15, mood: -10 },
        failRewards: { promotionPoints: -20, mood: -20 }
      },
      {
        text: "Stay out of it",
        statCheck: "none",
        threshold: 0,
        successLog: "You put your headphones in and ignored everyone.",
        failLog: "You put your headphones in and ignored everyone.",
        successRewards: { mood: 0 },
        failRewards: { mood: 0 }
      }
    ]
  }
];
