export const ARCHETYPES = {
  SCHOLAR: {
    name: "Scholar",
    primaryStat: "intelligence",
    secondaryStat: "corporate",
    tertiaryStat: "charisma",
    giftLikes: ["Books", "Telescope"],
  },
  GYM_RAT: {
    name: "Gym Rat",
    primaryStat: "fitness",
    secondaryStat: "hygiene",
    tertiaryStat: "charisma",
    giftLikes: ["Supplements", "Smart Watch"],
  },
  SOCIALITE: {
    name: "Socialite",
    primaryStat: "style",
    secondaryStat: "charisma",
    tertiaryStat: "money",
    giftLikes: ["Perfume", "Luxury Watch", "Flowers"],
  },
  EXECUTIVE: {
    name: "Executive",
    primaryStat: "corporate",
    secondaryStat: "style",
    tertiaryStat: "intelligence",
    giftLikes: ["Luxury Watch", "Espresso Machine"],
  },
  ARTIST: {
    name: "Artist",
    primaryStat: "charisma",
    secondaryStat: "style",
    tertiaryStat: "intelligence",
    giftLikes: ["Paint Set", "Flowers"],
  }
};

export const NPCS = [
  {
    id: "elena",
    name: "Elena",
    gender: "female",
    archetype: "SCHOLAR",
    description: "A Ph.D. candidate who loves ancient history, strategy games, and reading in coffee shops.",
    gatedBy: {
      type: "stat",
      stat: "intelligence",
      value: 20,
      message: "Elena prefers someone she can have intellectual conversations with (Requires Intelligence > 20)."
    },
    dialogue: {
      intro: "Oh, hi! I was just reading about the Roman Republic. Do you read much?",
      choices: [
        { text: "I read academic journals constantly. (+Intelligence check)", checkStat: "intelligence", threshold: 30, successRelation: 25, successText: "Elena's eyes light up! 'Really? What's your field of study?'", failRelation: 5, failText: "She looks skeptical. 'Oh, cool. I study archeology, mostly.'" },
        { text: "Not really, I'm more of an outdoor/action person.", successRelation: -10, successText: "She sighs. 'Ah. Well, reading isn't for everyone, I suppose.'" }
      ]
    },
    storyEvents: {
      25: { prompt: "Elena needs help proofreading her mid-term thesis. It's heavily technical.", statCheck: "intelligence", threshold: 40, successText: "You catch several logical errors. She is incredibly grateful!", failText: "You missed some obvious typos, but she appreciates the effort." },
      50: { prompt: "Elena's laptop crashed and she might lose her research!", statCheck: "programming", threshold: 30, successText: "You managed to recover her files from the broken drive!", failText: "You couldn't save the data, but you comforted her." },
      75: { prompt: "Elena is presenting her thesis but is having a panic attack backstage.", statCheck: "empathy", threshold: 40, successText: "You calm her down and she gives a brilliant presentation.", failText: "You stumble over your words, but she eventually calms down." },
      100: { prompt: "After a wonderful evening, Elena invites you in. The room is softly lit by a desk lamp. She traces a finger along your jawline, whispering that she's never felt so understood. You spend the night wrapped in each other's arms, sharing deep secrets until morning.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "brad",
    name: "Brad",
    gender: "male",
    archetype: "GYM_RAT",
    description: "A certified fitness trainer obsessed with clean eating, protein shakes, and deadlift PRs.",
    gatedBy: {
      type: "stat",
      stat: "fitness",
      value: 25,
      message: "Brad only matches with people who take their fitness seriously (Requires Fitness > 25)."
    },
    dialogue: {
      intro: "Yo! Just finished a brutal leg day. What's your fitness routine look like?",
      choices: [
        { text: "I hit the gym hard every week. (+Fitness check)", checkStat: "fitness", threshold: 35, successRelation: 25, successText: "Brad grins and flexes. 'Let's go! We should lift together sometime.'", failRelation: 5, failText: "He taps your shoulder. 'Keep working on it, buddy. Consistency is key.'" },
        { text: "I prefer working on my mind and career.", successRelation: -5, successText: "Brad chuckles. 'Hey, can't lift books to build biceps! But to each their own.'" }
      ]
    },
    storyEvents: {
      25: { prompt: "Brad is trying to hit a new deadlift PR but is doubting himself.", statCheck: "confidence", threshold: 40, successText: "You hype him up and he smashes the PR!", failText: "You try to cheer, but he misses the lift." },
      50: { prompt: "Brad's sponsor wants him to do a cooking stream for healthy meals.", statCheck: "culinary", threshold: 30, successText: "You help him cook a perfect macro-friendly meal on stream.", failText: "You burn the chicken, but the chat finds it funny." },
      75: { prompt: "Brad injured his shoulder and is depressed about losing his gains.", statCheck: "empathy", threshold: 40, successText: "You convince him that recovery is just as important as lifting.", failText: "He stays moody, but appreciates your presence." },
      100: { prompt: "Brad's usual intense energy softens as he pulls you close. 'I've never let anyone see me like this,' he admits quietly. You spend a passionate and deeply connected night together. In the morning, you wake up to him making you both breakfast.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "sophia",
    name: "Sophia",
    gender: "female",
    archetype: "SOCIALITE",
    description: "A fashion influencer who loves VIP parties, fine dining, and fast cars.",
    gatedBy: {
      type: "asset",
      assets: ["scooter", "sedan", "sports_car"],
      message: "Sophia doesn't date guys who walk everywhere (Requires owning a Vehicle)."
    },
    dialogue: {
      intro: "Hey there! Love your outfit. Where are we going tonight? It better be somewhere exclusive.",
      choices: [
        { text: "Let's go to a high-end club. (+Style check)", checkStat: "style", threshold: 40, successRelation: 30, successText: "Sophia smiles widely. 'Ooh, I love the VIP lounge there! Let's go.'", failRelation: -10, failText: "She looks at your shoes. 'Um, you're not getting past the dress code in that...'" },
        { text: "How about we grab a cheap slice of pizza?", successRelation: -20, successText: "She rolls her eyes. 'Are you joking? I don't do fast food.'" }
      ]
    },
    storyEvents: {
      25: { prompt: "Sophia is having a wardrobe crisis before a major fashion gala.", statCheck: "style", threshold: 50, successText: "You pick out the perfect accessory. She stuns the red carpet!", failText: "You pick a clashing color. She has to change entirely." },
      50: { prompt: "Sophia is negotiating a brand deal but feels they are lowballing her.", statCheck: "negotiation", threshold: 40, successText: "You advise her on contract terms and she secures double the pay!", failText: "She takes the lower deal, but is glad you tried to help." },
      75: { prompt: "Sophia's private photos were leaked and she's facing public backlash.", statCheck: "socialIq", threshold: 40, successText: "You help her draft a perfect PR response that wins over the public.", failText: "The PR response is mediocre, but the storm eventually passes." },
      100: { prompt: "The VIP parties fade away as Sophia kicks off her heels in her penthouse. She looks at you with absolute sincerity. 'I just want it to be us tonight.' You share a tender, unforgettable night, waking up to the sunrise over the city.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "marcus",
    name: "Marcus",
    gender: "male",
    archetype: "EXECUTIVE",
    description: "A high-powered startup founder who drinks too much espresso and lives in business pitches.",
    gatedBy: {
      type: "stat",
      stat: "corporate",
      value: 30,
      message: "Marcus values corporate ambition and networking (Requires Corporate > 30)."
    },
    dialogue: {
      intro: "Hey, I've got 5 minutes between investor calls. What's your 30-second elevator pitch?",
      choices: [
        { text: "I'm pushing for a promotion and building connections. (+Corporate check)", checkStat: "corporate", threshold: 45, successRelation: 25, successText: "Marcus nods, impressed. 'Excellent. Let's exchange contacts.'", failRelation: 5, failText: "He looks at his watch. 'Okay, interesting. Keep grinding.'" },
        { text: "I just try to enjoy life. No need to stress about work.", successRelation: -15, successText: "Marcus frowns. 'Lacks drive. Time is money, you know.'" }
      ]
    },
    storyEvents: {
      25: { prompt: "Marcus needs help analyzing a financial report before a board meeting.", statCheck: "finance", threshold: 40, successText: "You spot a crucial accounting error. He owes you big time!", failText: "You couldn't make sense of the spreadsheets." },
      50: { prompt: "Marcus is stressed out and hasn't slept in two days.", statCheck: "empathy", threshold: 30, successText: "You convince him to take a day off and relax.", failText: "He refuses to rest, but appreciates your concern." },
      75: { prompt: "Marcus's startup is facing a hostile takeover.", statCheck: "corporate", threshold: 60, successText: "You formulate a 'poison pill' strategy to save his company!", failText: "He loses controlling interest, but you help him through the transition." },
      100: { prompt: "Marcus finally puts his phone on 'Do Not Disturb'. He holds your hands, his eyes full of warmth. 'You're the only thing that matters right now.' The night is intimate and intensely romantic. You wake up feeling completely revitalized.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "chloe",
    name: "Chloe",
    gender: "female",
    archetype: "ARTIST",
    description: "An indie painter who loves acoustic concerts, thirfting, and deep late-night talks.",
    gatedBy: {
      type: "stat",
      stat: "charisma",
      value: 20,
      message: "Chloe connects on a deeper emotional level (Requires Charisma > 20)."
    },
    dialogue: {
      intro: "Hey... I'm working on a painting about human vulnerability. What does connection mean to you?",
      choices: [
        { text: "It's about expressing our raw emotions. (+Charisma check)", checkStat: "charisma", threshold: 30, successRelation: 30, successText: "Chloe looks at you softly. 'Yes... exactly.'", failRelation: 5, failText: "She tilts her head. 'Hmm. A bit clinical, but okay.'" },
        { text: "It's just biological chemistry and convenience.", successRelation: -15, successText: "Chloe sighs. 'How cynical. Art is about finding magic, not just science.'" }
      ]
    },
    storyEvents: {
      25: { prompt: "Chloe is stuck on a painting and needs creative inspiration.", statCheck: "creativity", threshold: 40, successText: "You suggest a bold color palette. She creates a masterpiece!", failText: "Your suggestions don't click, but she finishes it eventually." },
      50: { prompt: "Chloe has an art gallery showing but is terrified of the critics.", statCheck: "confidence", threshold: 30, successText: "You bolster her confidence and she charms the critics.", failText: "She hides in the back, but the art sells anyway." },
      75: { prompt: "Chloe's favorite acoustic guitar was damaged in a flood.", statCheck: "music", threshold: 40, successText: "You help her repair and re-string it perfectly.", failText: "It doesn't sound quite the same, but she's happy it's fixed." },
      100: { prompt: "Surrounded by canvas and paint, Chloe smiles softly and pulls you into an embrace. 'You're my favorite muse.' The night is full of whispered confessions and gentle affection. Morning light finds you both tangled in the sheets.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  }
];
