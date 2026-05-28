export const NPC_ALERTS = {
  elena: [
    {
      id: "elena_study_help",
      npcId: "elena",
      message: "Elena messages you: 'Hey! I'm prepping for a major history presentation tomorrow and I'm totally stuck on some sources. Any chance you could look over my notes?'",
      choices: [
        {
          text: "Explain the sources clearly (Requires Intelligence > 30)",
          checkStat: "intelligence",
          threshold: 30,
          successRelation: 15,
          successChemistry: 15,
          failRelation: -5,
          failChemistry: -5,
          energyCost: 10,
          successText: "You spend an hour helping. Elena is amazed: 'Wow, your explanation makes perfect sense! Thank you so much!'",
          failText: "You try to explain but get confused. Elena looks puzzled: 'Um, I don't think that's quite right... but thanks for trying.'"
        },
        {
          text: "Politely decline",
          successRelation: 0,
          successChemistry: -5,
          successText: "You reply that you're busy. Elena messages: 'No worries, I'll figure it out!'"
        }
      ]
    }
  ],
  brad: [
    {
      id: "brad_gym_spot",
      npcId: "brad",
      message: "Brad texts you: 'Yo! I'm trying to hit a new squat PR today and need a reliable spotter. You down to head to the gym right now?'",
      choices: [
        {
          text: "Spot him safely (Requires Fitness > 25)",
          checkStat: "fitness",
          threshold: 25,
          successRelation: 15,
          successChemistry: 10,
          failRelation: -5,
          failChemistry: -5,
          energyCost: 15,
          successText: "You spot Brad perfectly as he hits his PR. Brad yells: 'Let's go! Absolute beast spot, thanks bro!'",
          failText: "You struggle to lift the bar. Brad has to rack it: 'A bit sketchy there, we need to work on your form!'"
        },
        {
          text: "Say you have to skip today",
          successRelation: 0,
          successChemistry: -5,
          successText: "You text back you can't make it. Brad: 'All good, no gains for the weak! Catch you later.'"
        }
      ]
    }
  ],
  sophia: [
    {
      id: "sophia_vip_invite",
      npcId: "sophia",
      message: "Sophia sends a selfie: 'Hey! I got into the VIP lounge at Neon Beats tonight and have a guest pass. You HAVE to come. Don't embarrass me, okay?'",
      choices: [
        {
          text: "Attend and buy a bottle (Costs $50, Requires Charisma > 30)",
          checkStat: "charisma",
          threshold: 30,
          successRelation: 20,
          successChemistry: 15,
          failRelation: 5,
          failChemistry: 5,
          moneyCost: 50,
          energyCost: 15,
          successText: "You charm the lounge and Sophia is thrilled: 'Everyone was asking who you were! Such a fun night!'",
          failText: "You felt out of place and spent $50 on drinks. Sophia whispers: 'You're being a bit quiet...'"
        },
        {
          text: "Pass on the invite",
          successRelation: -5,
          successChemistry: -10,
          successText: "You decline. Sophia replies: 'Wow, okay. Guess you don't like fun. Bye.'"
        }
      ]
    }
  ],
  marcus: [
    {
      id: "marcus_business_pitch",
      npcId: "marcus",
      message: "Marcus messages: 'Hey. I'm reviewing a pitch deck for a seed round and want an outside perspective. Do you have a few minutes to critique this model?'",
      choices: [
        {
          text: "Give detailed business feedback (Requires Corporate > 30)",
          checkStat: "corporate",
          threshold: 30,
          successRelation: 15,
          successChemistry: 10,
          energyCost: 10,
          successText: "Marcus sends a thumbs up: 'Insightful critique on the unit economics. You've got real business acumen.'",
          failText: "Marcus replies: 'That feedback is a bit generic... I'll stick to my advisors' inputs.'"
        },
        {
          text: "Ignore the message",
          successRelation: -10,
          successChemistry: -5,
          successText: "You don't reply. Marcus deletes the thread."
        }
      ]
    }
  ],
  chloe: [
    {
      id: "chloe_art_gallery",
      npcId: "chloe",
      message: "Chloe texts: 'I'm displaying a small painting at the community gallery. It's really personal... would you come look at it with me?'",
      choices: [
        {
          text: "Express creative appreciation (Requires Charisma > 25)",
          checkStat: "charisma",
          threshold: 25,
          successRelation: 20,
          successChemistry: 15,
          energyCost: 10,
          successText: "You offer a deep, poetic thought. Chloe looks touched: 'You saw exactly what I felt when painting it...'",
          failText: "You make a joke about the abstract style. Chloe looks hurt: 'Ah... I see. Maybe it is a bit silly...'"
        },
        {
          text: "Politely decline",
          successRelation: -5,
          successChemistry: -5,
          successText: "Chloe texts back: 'Oh, okay. Maybe next time.'"
        }
      ]
    }
  ]
};

export const JEALOUSY_CONFRONTATION = {
  id: "jealousy_confrontation",
  message: "Spotted! {NPC_NAME} runs into you and looks upset: 'Hey... my friends told me they saw you on a date at the nightclub with someone else. Are we not exclusive? I thought we had a connection.'",
  choices: [
    {
      text: "Explain smoothly (Requires Charisma > 30)",
      checkStat: "charisma",
      threshold: 30,
      successRelation: 5,
      successChemistry: 5,
      failRelation: -20,
      failChemistry: -15,
      successText: "You explain that you're still getting to know people. They sigh: 'Okay, I guess we aren't officially exclusive... yet.'",
      failText: "They shake their head: 'Don't try to smooth-talk your way out of this. It's disrespectful.'"
    },
    {
      text: "Apologize sincerely (Requires Empathy > 25)",
      checkStat: "empathy",
      threshold: 25,
      successRelation: 10,
      successChemistry: 5,
      failRelation: -15,
      failChemistry: -10,
      successText: "You apologize for hurting their feelings. They soften: 'Thanks for being honest. Let's talk about where we stand.'",
      failText: "They look unconvinced: 'It feels like you're just saying what I want to hear.'"
    },
    {
      text: "Be confident: 'We're not committed yet!' (Requires Confidence > 35)",
      checkStat: "confidence",
      threshold: 35,
      successRelation: -10,
      successChemistry: 10,
      failRelation: -25,
      failChemistry: -20,
      successText: "You stand your ground. They look taken aback: 'Well, you're right. But don't expect me to wait around forever.'",
      failText: "They scoff: 'Wow, arrogance. I'm out of here.'"
    }
  ]
};
