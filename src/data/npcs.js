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
        {
          text: "I read academic journals constantly. (+Intelligence check)",
          checkStat: "intelligence",
          threshold: 30,
          successRelation: 25,
          successText: "Elena's eyes light up! 'Really? What's your field of study?'",
          failRelation: 5,
          failText: "She looks skeptical. 'Oh, cool. I study archeology, mostly.'"
        },
        {
          text: "Not really, I'm more of an outdoor/action person.",
          successRelation: -10,
          successText: "She sighs. 'Ah. Well, reading isn't for everyone, I suppose.'"
        }
      ],
      dateLines: {
        gym: "Elena is out of her element here. 'Is all this sweating... scientifically necessary?'",
        library: "Elena smiles happily. 'My favorite place. Let's find a quiet alcove.'",
        club: "She covers her ears. 'It's way too loud to talk! Why are we here?'",
        park: "She takes a deep breath. 'The fresh air is nice. Let's walk and talk.'"
      }
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
        {
          text: "I hit the gym hard every week. (+Fitness check)",
          checkStat: "fitness",
          threshold: 35,
          successRelation: 25,
          successText: "Brad grins and flexes. 'Let's go! We should lift together sometime.'",
          failRelation: 5,
          failText: "He taps your shoulder. 'Keep working on it, buddy. Consistency is key.'"
        },
        {
          text: "I prefer working on my mind and career.",
          successRelation: -5,
          successText: "Brad chuckles. 'Hey, can't lift books to build biceps! But to each their own.'"
        }
      ],
      dateLines: {
        gym: "Brad is pumped! 'Awesome choice! Let me spot you on the bench press.'",
        library: "He whispers loudly. 'Why are we here? There are no weights!'",
        club: "Brad dances energetically. 'Cardio session starts now!'",
        park: "He starts jogging. 'Let's do some outdoor sprints!'"
      }
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
        {
          text: "Let's go to a high-end club. (+Style check)",
          checkStat: "style",
          threshold: 40,
          successRelation: 30,
          successText: "Sophia smiles widely. 'Ooh, I love the VIP lounge there! Let's go.'",
          failRelation: -10,
          failText: "She looks at your shoes. 'Um, you're not getting past the dress code in that...'"
        },
        {
          text: "How about we grab a cheap slice of pizza?",
          successRelation: -20,
          successText: "She rolls her eyes. 'Are you joking? I don't do fast food.'"
        }
      ],
      dateLines: {
        gym: "Sophia looks disgusted. 'My hair is going to get ruined in here.'",
        library: "She yawns. 'This place is incredibly boring. Let's leave.'",
        club: "Sophia sparkles. 'Oh my god, they are playing my favorite song! Get us drinks!'",
        park: "She holds her heels. 'Walking on grass is a nightmare, but the scenery is okay.'"
      }
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
        {
          text: "I'm pushing for a promotion and building connections. (+Corporate check)",
          checkStat: "corporate",
          threshold: 45,
          successRelation: 25,
          successText: "Marcus nods, impressed. 'Excellent. Let's exchange contacts. High growth mindset.'",
          failRelation: 5,
          failText: "He looks at his watch. 'Okay, interesting. Keep grinding, I guess.'"
        },
        {
          text: "I just try to enjoy life. No need to stress about work.",
          successRelation: -15,
          successText: "Marcus frowns. 'Lacks drive. Time is money, you know.'"
        }
      ],
      dateLines: {
        gym: "Marcus checks his heart rate. 'Efficient workout. Good for productivity.'",
        library: "He looks around. 'Quiet. Good place to read business cases.'",
        club: "He tries to talk over music. 'I know the owner! Networked with him last month!'",
        park: "He checks his phone. 'Nice park. Reminds me of Silicon Valley.'"
      }
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
        {
          text: "It's about expressing our raw emotions. (+Charisma check)",
          checkStat: "charisma",
          threshold: 30,
          successRelation: 30,
          successText: "Chloe looks at you softly. 'Yes... exactly. You understand the colors of the soul.'",
          failRelation: 5,
          failText: "She tilts her head. 'Hmm. A bit clinical, but okay.'"
        },
        {
          text: "It's just biological chemistry and convenience.",
          successRelation: -15,
          successText: "Chloe sighs. 'How cynical. Art is about finding magic, not just science.'"
        }
      ],
      dateLines: {
        gym: "Chloe looks lost. 'So much repetition... it feels a bit dystopian, doesn't it?'",
        library: "She runs her hand over book spines. 'The smell of old paper... it makes me want to sketch.'",
        club: "She sways to the beat. 'The neon lights are beautiful... like a digital fever dream.'",
        park: "She smiles. 'Look at the way the sun filters through the leaves. Beautiful shadow play.'"
      }
    }
  }
];
