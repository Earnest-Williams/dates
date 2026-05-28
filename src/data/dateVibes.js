export const DATE_VIBES = {
  phases: [
    {
      id: "activity",
      title: "Choose an Activity",
      options: [
        { text: "Suggest a quiet corner to talk", preferredArchetypes: ["SCHOLAR", "ARTIST"], dislikedArchetypes: ["SOCIALITE"], vibeChange: 20 },
        { text: "Challenge them to a friendly competition", preferredArchetypes: ["GYM_RAT", "EXECUTIVE"], dislikedArchetypes: ["SCHOLAR"], vibeChange: 20 },
        { text: "Find the center of attention", preferredArchetypes: ["SOCIALITE", "EXECUTIVE"], dislikedArchetypes: ["SCHOLAR", "ARTIST"], vibeChange: 20 },
        { text: "Just go with the flow", preferredArchetypes: [], dislikedArchetypes: [], vibeChange: 5 }
      ]
    },
    {
      id: "conversation",
      title: "Pick a Conversation Topic",
      options: [
        { text: "Talk about career goals and ambitions", checkStat: "corporate", threshold: 40, successVibe: 25, failVibe: -10, preferredArchetypes: ["EXECUTIVE"] },
        { text: "Discuss art and philosophy", checkStat: "intelligence", threshold: 40, successVibe: 25, failVibe: -10, preferredArchetypes: ["SCHOLAR", "ARTIST"] },
        { text: "Gossip and tell funny stories", checkStat: "charisma", threshold: 40, successVibe: 25, failVibe: -10, preferredArchetypes: ["SOCIALITE"] },
        { text: "Talk about health and routines", checkStat: "fitness", threshold: 40, successVibe: 25, failVibe: -10, preferredArchetypes: ["GYM_RAT"] }
      ]
    },
    {
      id: "food",
      title: "Order Food & Drinks",
      options: [
        { text: "Order something extravagant", cost: 50, vibeChange: 30, preferredArchetypes: ["SOCIALITE", "EXECUTIVE"] },
        { text: "Order a healthy salad", cost: 15, vibeChange: 15, preferredArchetypes: ["GYM_RAT"] },
        { text: "Order coffee and pastries", cost: 10, vibeChange: 15, preferredArchetypes: ["SCHOLAR", "ARTIST"] },
        { text: "Split the bill on fries", cost: 5, vibeChange: 5, preferredArchetypes: [] }
      ]
    }
  ]
};
