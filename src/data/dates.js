export const DATE_EVENTS = {
  gym: [
    {
      prompt: "Your date is struggling with the bench press. What do you do?",
      choices: [
        { text: "Offer a spot and correct their form.", checkStat: 'fitness', threshold: 30, successRelation: 15, failRelation: -5, successText: "They appreciate your expertise!", failText: "You struggle to lift it. Embarrassing." },
        { text: "Cheer them on enthusiastically.", checkStat: 'charisma', threshold: 20, successRelation: 10, failRelation: 0, successText: "They love the motivation!", failText: "You sound a bit sarcastic." }
      ]
    },
    {
      prompt: "A gym bro tries to hit on your date. How do you handle it?",
      choices: [
        { text: "Intimidate them by flexing.", checkStat: 'fitness', threshold: 40, successRelation: 20, failRelation: -10, successText: "The bro walks away quickly. Your date is impressed.", failText: "You just look silly. Your date laughs awkwardly." },
        { text: "Politely but firmly tell them to back off.", checkStat: 'confidence', threshold: 25, successRelation: 15, failRelation: -5, successText: "Handled like a pro.", failText: "You stutter and back down." }
      ]
    }
  ],
  library: [
    {
      prompt: "You both reach for the same rare book on philosophy. What do you say?",
      choices: [
        { text: "Quote a passage from it.", checkStat: 'intelligence', threshold: 35, successRelation: 20, failRelation: -5, successText: "They are amazed by your knowledge!", failText: "You misquote it terribly." },
        { text: "Smoothly let them have it.", checkStat: 'charm', threshold: 25, successRelation: 10, failRelation: 0, successText: "They blush and thank you.", failText: "You drop the book on their foot." }
      ]
    }
  ],
  club: [
    {
      prompt: "The DJ plays a high-energy track. What's your move?",
      choices: [
        { text: "Show off your best dance moves.", checkStat: 'style', threshold: 35, successRelation: 15, failRelation: -10, successText: "You own the dance floor!", failText: "You trip and fall." },
        { text: "Buy a round of expensive drinks.", checkStat: 'finance', threshold: 20, successRelation: 10, failRelation: 0, successText: "They appreciate the luxury.", failText: "Your card gets declined." }
      ]
    }
  ],
  office: [
    {
      prompt: "Your date asks for your opinion on a complex business merger.",
      choices: [
        { text: "Analyze the financial implications.", checkStat: 'corporate', threshold: 30, successRelation: 15, failRelation: -5, successText: "They are deeply impressed by your acumen.", failText: "You confuse mergers with acquisitions." },
        { text: "Crack a joke about corporate greed.", checkStat: 'charisma', threshold: 25, successRelation: 10, failRelation: -5, successText: "They laugh at your witty take.", failText: "They find it unprofessional." }
      ]
    }
  ],
  park: [
    {
      prompt: "You spot a beautiful landscape. Your date mentions they love art.",
      choices: [
        { text: "Discuss the color theory of the sunset.", checkStat: 'creativity', threshold: 30, successRelation: 20, failRelation: -5, successText: "They are captivated by your perspective.", failText: "You sound completely pretentious." },
        { text: "Set up a cute picnic spot quickly.", checkStat: 'culinary', threshold: 20, successRelation: 15, failRelation: 0, successText: "They love the snacks you brought!", failText: "The food is a bit stale." }
      ]
    }
  ]
};
