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

const ROMANCE_ARCS = {
  elena: [
    { id: "elena_intro", type: "introduction", minRelationship: 0, title: "A Question About Books", prompt: "Elena asks what kind of books you read when no one is judging you.", emotionalBeat: "Guarded curiosity with a hint of playful authority.", choices: [{ text: "I read to feel less alone.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "elena_knows_player_reads" }, { text: "Recommend me your strictest reading assignment.", relationshipImpact: 6, chemistryImpact: 8, unlocksMemory: "elena_assigns_reading", futureCallback: "elena_book_club_dynamic" }, { text: "I read whatever makes me look smart.", checkStat: "intelligence", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -1 } }], futureCallback: "elena_poetry_binder" },
    { id: "elena_early", type: "early connection", minRelationship: 18, title: "Library Closing Time", prompt: "She is racing a deadline as security closes the library.", emotionalBeat: "Academic pressure and fear of losing control.", choices: [{ text: "Stay and help organize citations.", relationshipImpact: 7, chemistryImpact: 6 }, { text: "Set a timer and make her take a tea break first.", relationshipImpact: 5, chemistryImpact: 7, unlocksMemory: "elena_allows_soft_structure" }, { text: "Tell her rest matters more than one paragraph.", relationshipImpact: 3, chemistryImpact: 5, unlocksMemory: "elena_accepts_rest" }] },
    { id: "elena_reveal", type: "personal reveal", minRelationship: 35, title: "The Fellowship Letter", prompt: "Elena admits she was waitlisted after publicly projecting confidence.", emotionalBeat: "Ambition meets shame.", choices: [{ text: "You are more than one committee decision.", relationshipImpact: 10, chemistryImpact: 8, unlocksMemory: "elena_shared_waitlist" }, { text: "Let me quiz you out loud so we can rebuild confidence.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "elena_oral_drill_ritual" }, { text: "Let's draft an appeal tonight.", checkStat: "corporate", threshold: 30, onSuccess: { relationshipImpact: 7, chemistryImpact: 5 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "elena_conflict", type: "conflict", minRelationship: 52, title: "Missed Dinner", prompt: "She cancels abruptly and sounds cold by text.", emotionalBeat: "Defensive detachment.", choices: [{ text: "Reply with sarcasm.", relationshipImpact: -6, chemistryImpact: -4, futureCallback: "elena_deadline_argument" }, { text: "Ask if she is okay first.", relationshipImpact: 6, chemistryImpact: 7, unlocksMemory: "elena_trusts_player_under_stress" }, { text: "Send a calm note: no punishment, just honesty when ready.", relationshipImpact: 4, chemistryImpact: 6, futureCallback: "elena_repair_letter" }] },
    { id: "elena_trust", type: "trust event", minRelationship: 70, title: "Backstage Breathing", prompt: "She freezes before a thesis presentation.", emotionalBeat: "Fear beneath competence.", choices: [{ text: "Ground her with breathing and presence.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "elena_presentation_anchor" }, { text: "Ask if she wants a firm pep talk or quiet reassurance.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "elena_preference_check_in" }, { text: "Offer speaking tips only.", checkStat: "intelligence", threshold: 45, onSuccess: { relationshipImpact: 5, chemistryImpact: 3 }, onFail: { relationshipImpact: 0, chemistryImpact: -2 } }] },
    { id: "elena_commitment", type: "commitment event", minRelationship: 90, title: "Two Calendars, One Life", prompt: "She receives an offer abroad and asks for a real plan together.", emotionalBeat: "Vulnerability with ambition.", choices: [{ text: "Build a concrete long-distance plan.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "elena_chosen_partnership" }, { text: "Create a shared weekly ritual: she picks the reading, you discuss it.", relationshipImpact: 11, chemistryImpact: 12, unlocksMemory: "elena_long_distance_seminar" }, { text: "Say you'll improvise later.", relationshipImpact: 3, chemistryImpact: 1, futureCallback: "elena_uncertain_future" }] }
  ],
  brad: [
    { id: "brad_intro", type: "introduction", minRelationship: 0, title: "Post-Workout Truth", prompt: "Brad asks what discipline means when no one is watching.", emotionalBeat: "Confidence masking insecurity and liking explicit praise.", choices: [{ text: "Consistency beats intensity.", relationshipImpact: 8, chemistryImpact: 7 }, { text: "Give him a playful pep-talk challenge.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "brad_likes_motivation_talk" }, { text: "Flex for him and boast.", checkStat: "fitness", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 5 }, onFail: { relationshipImpact: -1, chemistryImpact: -2 } }] },
    { id: "brad_early", type: "early connection", minRelationship: 18, title: "Meal Prep Night", prompt: "His sponsor requests a live cooking stream.", emotionalBeat: "Bravado under pressure.", choices: [{ text: "Cook together off-camera first.", relationshipImpact: 7, chemistryImpact: 6, unlocksMemory: "brad_trusts_player_prep" }, { text: "Let him lead while you follow his routine exactly.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "brad_controlled_kitchen" }, { text: "Push him to wing it live.", relationshipImpact: -2, chemistryImpact: 1, futureCallback: "brad_stream_disaster" }] },
    { id: "brad_reveal", type: "personal reveal", minRelationship: 35, title: "Old Injury Scare", prompt: "Brad admits he is terrified of becoming irrelevant if his body fails.", emotionalBeat: "Vulnerability beneath bravado.", choices: [{ text: "Your worth is not your PR numbers.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "brad_identity_beyond_fitness" }, { text: "Let me spot you through recovery drills at your pace.", relationshipImpact: 7, chemistryImpact: 8 }, { text: "Train harder and silence doubters.", checkStat: "confidence", threshold: 40, onSuccess: { relationshipImpact: 4, chemistryImpact: 4 }, onFail: { relationshipImpact: -3, chemistryImpact: -2 } }] },
    { id: "brad_conflict", type: "conflict", minRelationship: 52, title: "Skipped Session", prompt: "You miss a planned gym meet and Brad feels dismissed.", emotionalBeat: "Fear of not being prioritized.", choices: [{ text: "Defend yourself aggressively.", relationshipImpact: -6, chemistryImpact: -5 }, { text: "Apologize and ask what it triggered for him.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "brad_opens_about_abandonment" }, { text: "Offer to rebuild trust with a realistic shared routine.", relationshipImpact: 5, chemistryImpact: 6, futureCallback: "brad_repair_schedule" }] },
    { id: "brad_trust", type: "trust event", minRelationship: 70, title: "Rehab Day", prompt: "During shoulder rehab he is embarrassed by basic movements.", emotionalBeat: "Shame around weakness.", choices: [{ text: "Stay and count every rep with him.", relationshipImpact: 9, chemistryImpact: 9 }, { text: "Coach him firmly through each set.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "brad_firm_coaching_dynamic" }, { text: "Try to distract him with jokes.", checkStat: "charisma", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 5 }, onFail: { relationshipImpact: -1, chemistryImpact: 0 } }] },
    { id: "brad_commitment", type: "commitment event", minRelationship: 90, title: "Off-Season Decision", prompt: "Brad can take a major contract that relocates him for months.", emotionalBeat: "Choosing intimacy over image.", choices: [{ text: "Commit to shared routines and check-ins.", relationshipImpact: 13, chemistryImpact: 11, unlocksMemory: "brad_committed_routine" }, { text: "Promise weekly challenge videos for each other.", relationshipImpact: 10, chemistryImpact: 11, futureCallback: "brad_distance_training_arc" }, { text: "Keep it casual and undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "brad_distance_loop" }] }
  ],
  sophia: [
    { id: "sophia_intro", type: "introduction", minRelationship: 0, title: "Mirror Talk", prompt: "Sophia asks if you like her public image or her actual self.", emotionalBeat: "Status anxiety and a taste for admiration.", choices: [{ text: "I like who you are off-camera.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "sophia_seen_without_filter" }, { text: "Give her a sincere compliment and ask what she wants tonight.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "sophia_praise_with_care" }, { text: "Your brand is elite.", checkStat: "style", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "sophia_early", type: "early connection", minRelationship: 18, title: "Wardrobe Spiral", prompt: "She spirals before a gala over one imperfect look.", emotionalBeat: "Control through presentation.", choices: [{ text: "Help her choose what feels authentic.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Offer a playful 'styling challenge' where she directs your look too.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "sophia_mutual_style_game" }, { text: "Tell her to wear whatever trends best.", relationshipImpact: 1, chemistryImpact: 0 }] },
    { id: "sophia_reveal", type: "personal reveal", minRelationship: 35, title: "Contract Clause", prompt: "Sophia confesses a brand wants to script her personal life.", emotionalBeat: "Sincerity beneath performance.", choices: [{ text: "Protect your boundaries first.", relationshipImpact: 10, chemistryImpact: 8, unlocksMemory: "sophia_boundary_priority" }, { text: "Draft three non-negotiables and rehearse saying no.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Take the money and adapt.", checkStat: "negotiation", threshold: 40, onSuccess: { relationshipImpact: 4, chemistryImpact: 3 }, onFail: { relationshipImpact: -3, chemistryImpact: -2 } }] },
    { id: "sophia_conflict", type: "conflict", minRelationship: 52, title: "Leaked Photos Night", prompt: "After a leak, she accuses everyone of chasing clout.", emotionalBeat: "Humiliation and distrust.", choices: [{ text: "Argue she is overreacting.", relationshipImpact: -7, chemistryImpact: -5 }, { text: "Offer privacy and ask what support looks like.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "sophia_safe_with_player" }, { text: "Protect her space and screen all messages for one night.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "sophia_crisis_protocol" }] },
    { id: "sophia_trust", type: "trust event", minRelationship: 70, title: "No-Makeup Morning", prompt: "She invites you over before a live stream, visibly exhausted.", emotionalBeat: "Letting image drop.", choices: [{ text: "Cancel plans and stay for breakfast.", relationshipImpact: 9, chemistryImpact: 10 }, { text: "Ask if she wants reassurance or direct coaching before going live.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "sophia_pre_stream_checkin" }, { text: "Coach her PR response immediately.", checkStat: "socialIq", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 1, chemistryImpact: -1 } }] },
    { id: "sophia_commitment", type: "commitment event", minRelationship: 90, title: "Private Account", prompt: "Sophia asks if you want to build something real away from audience metrics.", emotionalBeat: "Choosing sincerity over status.", choices: [{ text: "Say yes, and set real boundaries together.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "sophia_private_life_commitment" }, { text: "Create a private ritual night with no posting allowed.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "sophia_offline_night" }, { text: "Keep things public and flexible.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "sophia_public_pressure" }] }
  ],
  marcus: [
    { id: "marcus_intro", type: "introduction", minRelationship: 0, title: "Calendar Tetris", prompt: "Marcus offers a ten-minute coffee between investor calls.", emotionalBeat: "Control as survival; he relaxes when someone can take the lead.", choices: [{ text: "Use the ten minutes fully, no posturing.", relationshipImpact: 8, chemistryImpact: 7 }, { text: "Take charge and set the agenda for him.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "marcus_relieved_by_structure" }, { text: "Pitch yourself aggressively.", checkStat: "corporate", threshold: 45, onSuccess: { relationshipImpact: 6, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "marcus_early", type: "early connection", minRelationship: 18, title: "Midnight Spreadsheet", prompt: "You find him still working at 2AM and running on espresso.", emotionalBeat: "Exhaustion disguised as drive.", choices: [{ text: "Bring food and sit quietly with him.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "marcus_allows_care" }, { text: "Tell him to hand over the laptop for twenty minutes of forced rest.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "marcus_structured_shutdown" }, { text: "Tell him to push through and finish.", relationshipImpact: -1, chemistryImpact: 1 }] },
    { id: "marcus_reveal", type: "personal reveal", minRelationship: 35, title: "The Panic Draft", prompt: "Marcus admits he does not remember his last day off.", emotionalBeat: "Fear of losing control.", choices: [{ text: "You are allowed to be human, not just useful.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "marcus_seen_when_tired" }, { text: "Build him a clear stop-time ritual for each night.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Optimize your schedule harder.", checkStat: "finance", threshold: 40, onSuccess: { relationshipImpact: 4, chemistryImpact: 3 }, onFail: { relationshipImpact: -3, chemistryImpact: -2 } }] },
    { id: "marcus_conflict", type: "conflict", minRelationship: 52, title: "Do Not Disturb", prompt: "He silences your messages during a board crisis.", emotionalBeat: "Work reflex overriding intimacy.", choices: [{ text: "Accuse him of choosing work over you.", relationshipImpact: -6, chemistryImpact: -4 }, { text: "Name your hurt and ask for repair timing.", relationshipImpact: 7, chemistryImpact: 8, futureCallback: "marcus_repair_conversation" }, { text: "Set a communication protocol for crisis days.", relationshipImpact: 5, chemistryImpact: 6, unlocksMemory: "marcus_crisis_protocol" }] },
    { id: "marcus_trust", type: "trust event", minRelationship: 70, title: "First Real Day Off", prompt: "He hands you his phone and asks you to plan a no-work day.", emotionalBeat: "Emotional availability practice.", choices: [{ text: "Plan rest with no productivity goals.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "marcus_phone_off" }, { text: "Set boundaries and keep him fully offline all day.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "marcus_structured_offline_day" }, { text: "Turn it into networking anyway.", checkStat: "corporate", threshold: 60, onSuccess: { relationshipImpact: 3, chemistryImpact: 2 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "marcus_commitment", type: "commitment event", minRelationship: 90, title: "Term Sheet and Terms of Us", prompt: "Marcus asks for an explicit relationship structure that protects time for both of you.", emotionalBeat: "Intentional partnership.", choices: [{ text: "Commit to shared boundaries and weekly check-ins.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "marcus_intentional_partnership" }, { text: "Draft a relationship agreement you both can revise monthly.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "marcus_review_ritual" }, { text: "Avoid labels and keep it open-ended.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "marcus_ambiguity" }] }
  ],
  chloe: [
    { id: "chloe_intro", type: "introduction", minRelationship: 0, title: "Wet Paint", prompt: "Chloe asks what connection means while mixing colors with trembling hands.", emotionalBeat: "Tender curiosity and craving muse-like attention.", choices: [{ text: "Connection is being witnessed gently.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "chloe_seen_gently" }, { text: "Ask her to direct a quick sketch of you while you hold still.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "chloe_directed_pose" }, { text: "Connection is mostly chemistry.", checkStat: "charisma", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3 }, onFail: { relationshipImpact: -3, chemistryImpact: -3 } }] },
    { id: "chloe_early", type: "early connection", minRelationship: 18, title: "Open Mic Nerves", prompt: "She wants to perform but freezes backstage.", emotionalBeat: "Insecurity beneath artistry.", choices: [{ text: "Hold her hand and breathe together.", relationshipImpact: 8, chemistryImpact: 9 }, { text: "Offer a grounding ritual where she picks your role backstage.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "chloe_backstage_ritual" }, { text: "Push her on stage before she overthinks.", relationshipImpact: 1, chemistryImpact: 0 }] },
    { id: "chloe_reveal", type: "personal reveal", minRelationship: 35, title: "Critic's Review", prompt: "A harsh review makes Chloe question whether she is a fraud.", emotionalBeat: "Artistic intensity turning inward.", choices: [{ text: "Read the review together and separate signal from cruelty.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "chloe_shared_review" }, { text: "Ask her to paint the feeling before discussing it.", relationshipImpact: 7, chemistryImpact: 8 }, { text: "Ignore critics completely.", checkStat: "confidence", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 0, chemistryImpact: -1 } }] },
    { id: "chloe_conflict", type: "conflict", minRelationship: 52, title: "Canceled Session", prompt: "You miss a promised gallery walk and she paints over the piece she made for you.", emotionalBeat: "Abandonment trigger.", choices: [{ text: "Dismiss it as dramatic.", relationshipImpact: -7, chemistryImpact: -6 }, { text: "Apologize and ask to hear the hurt fully.", relationshipImpact: 8, chemistryImpact: 8, futureCallback: "chloe_repaint_together" }, { text: "Offer to sit quietly while she decides what to salvage.", relationshipImpact: 5, chemistryImpact: 6, unlocksMemory: "chloe_repair_presence" }] },
    { id: "chloe_trust", type: "trust event", minRelationship: 70, title: "Flooded Studio", prompt: "After a flood damages her instruments, Chloe lets you into the ruined studio.", emotionalBeat: "Letting you witness grief.", choices: [{ text: "Help restore one item slowly with her.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "chloe_restoration_day" }, { text: "Ask what role she wants you to play: helper, listener, or planner.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "chloe_role_request" }, { text: "Tell her to replace everything quickly.", checkStat: "finance", threshold: 35, onSuccess: { relationshipImpact: 3, chemistryImpact: 2 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "chloe_commitment", type: "commitment event", minRelationship: 90, title: "The Unfinished Canvas", prompt: "Chloe asks if she can paint your shared future without pretending certainty.", emotionalBeat: "Commitment through tenderness.", choices: [{ text: "Say yes and co-create rituals together.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "chloe_shared_future" }, { text: "Agree to a weekly muse night where one of you directs the date theme.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "chloe_muse_rotation" }, { text: "Keep things undefined for now.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "chloe_undefined_future" }] }
  ],
  rina: [
    { id: "rina_intro", type: "introduction", minRelationship: 0, title: "After-Hours Jazz", prompt: "Rina invites you to a tiny jazz basement after her shift ends.", emotionalBeat: "Composed charm with playful tests.", choices: [{ text: "Ask her to choose the first song and lead the vibe.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "rina_sets_the_tone" }, { text: "Tell a polished story to impress her.", relationshipImpact: 5, chemistryImpact: 5 }, { text: "Order for both of you with confidence.", checkStat: "charisma", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 7 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "rina_early", type: "early connection", minRelationship: 18, title: "Midnight Service", prompt: "A staff shortage leaves Rina juggling a packed room alone.", emotionalBeat: "Grace under pressure.", choices: [{ text: "Quietly help reset tables without making it about you.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Let her direct you task-by-task for twenty minutes.", relationshipImpact: 6, chemistryImpact: 8, unlocksMemory: "rina_backroom_teamwork" }, { text: "Tell her to ignore work and hang out now.", relationshipImpact: -2, chemistryImpact: 1, futureCallback: "rina_work_ethic_tension" }] },
    { id: "rina_reveal", type: "personal reveal", minRelationship: 35, title: "Family Ledger", prompt: "Rina admits she sends most of her income home and feels trapped between duty and desire.", emotionalBeat: "Pride mixed with fatigue.", choices: [{ text: "You can be devoted and still choose joy.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "rina_shared_burden" }, { text: "Build a practical budget and a small freedom fund together.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Push for a risky all-in career leap.", checkStat: "finance", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: -3, chemistryImpact: -2 } }] },
    { id: "rina_conflict", type: "conflict", minRelationship: 52, title: "Unread Message", prompt: "She goes quiet for two days after a family emergency and returns distant.", emotionalBeat: "Withdrawal when overwhelmed.", choices: [{ text: "Demand immediate explanations.", relationshipImpact: -7, chemistryImpact: -5 }, { text: "Tell her you'll listen when she's ready and mean it.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "rina_safe_silence" }, { text: "Leave a short voice note and one practical offer of help.", relationshipImpact: 5, chemistryImpact: 6, futureCallback: "rina_voice_note_thread" }] },
    { id: "rina_trust", type: "trust event", minRelationship: 70, title: "Empty Dance Floor", prompt: "After closing, she asks for one private dance before turning the lights off.", emotionalBeat: "Letting control become intimacy.", choices: [{ text: "Follow her lead and match her rhythm.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "rina_closing_dance" }, { text: "Ask for one turn leading, then give it back.", relationshipImpact: 7, chemistryImpact: 8 }, { text: "Turn it into a performance challenge.", checkStat: "fitness", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 5 }, onFail: { relationshipImpact: -1, chemistryImpact: -1 } }] },
    { id: "rina_commitment", type: "commitment event", minRelationship: 90, title: "Two Tickets", prompt: "Rina receives a touring offer and asks if you can build a relationship around motion.", emotionalBeat: "Hope fighting fear of abandonment.", choices: [{ text: "Commit to a shared rhythm and fixed reconnect dates.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "rina_tour_commitment" }, { text: "Start a private playlist ritual for every city stop.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "rina_city_playlist_arc" }, { text: "Keep things open and undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "rina_drifting_route" }] }
  ],
  maya: [
    { id: "maya_intro", type: "introduction", minRelationship: 0, title: "Rooftop Lens", prompt: "Maya, a bisexual documentary photographer, asks if you prefer to be seen or hidden.", emotionalBeat: "Direct curiosity and fearless honesty.", choices: [{ text: "Seen, but only by someone who really pays attention.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "maya_sees_player_clearly" }, { text: "Let her frame your first portrait shot.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "maya_first_portrait" }, { text: "Deflect with jokes.", checkStat: "charisma", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "maya_early", type: "early connection", minRelationship: 18, title: "Street Interview", prompt: "Her interview subject bails, and she asks you to step in for a practice run.", emotionalBeat: "Creative urgency with soft vulnerability.", choices: [{ text: "Answer honestly and stay grounded.", relationshipImpact: 8, chemistryImpact: 8 }, { text: "Let her direct the whole scene while you stay present.", relationshipImpact: 6, chemistryImpact: 8, futureCallback: "maya_director_dynamic" }, { text: "Try to control the interview flow.", relationshipImpact: -1, chemistryImpact: 1 }] },
    { id: "maya_reveal", type: "personal reveal", minRelationship: 35, title: "The Cut Room", prompt: "Maya admits she avoids long-term relationships because she fears losing herself.", emotionalBeat: "Longing underneath self-protection.", choices: [{ text: "You don't need to shrink to stay loved.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "maya_identity_safe" }, { text: "Set boundaries that protect both of your autonomy.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Promise intensity without structure.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 5 }, onFail: { relationshipImpact: -3, chemistryImpact: -2 } }] },
    { id: "maya_conflict", type: "conflict", minRelationship: 52, title: "Published Without Warning", prompt: "Maya posts a candid photo of you that sparks attention before checking in.", emotionalBeat: "Freedom vs. intimacy boundaries.", choices: [{ text: "Publicly call her out.", relationshipImpact: -7, chemistryImpact: -6 }, { text: "Tell her privately what trust needs to look like.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "maya_respects_boundaries" }, { text: "Ask for a review rule before future posts.", relationshipImpact: 6, chemistryImpact: 6, futureCallback: "maya_editorial_rulebook" }] },
    { id: "maya_trust", type: "trust event", minRelationship: 70, title: "Contact Sheet Night", prompt: "Maya shares unedited contact sheets and asks what version of her feels real to you.", emotionalBeat: "Radical openness.", choices: [{ text: "Choose the imperfect frames and explain why.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "maya_unedited_seen" }, { text: "Ask her to choose a frame and narrate it while you listen.", relationshipImpact: 7, chemistryImpact: 8 }, { text: "Pick only polished shots.", checkStat: "style", threshold: 40, onSuccess: { relationshipImpact: 3, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "maya_commitment", type: "commitment event", minRelationship: 90, title: "Dual Residency", prompt: "Maya is offered a dual-city residency and asks whether commitment can stay expansive.", emotionalBeat: "Choosing devotion without confinement.", choices: [{ text: "Build a flexible relationship calendar with anchor weekends.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "maya_dual_city_commitment" }, { text: "Create a shared photo journal for every week apart.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "maya_weekly_contact_sheet" }, { text: "Keep it casual and undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "maya_open_ended_arc" }] }
  ],
  nora: [
    { id: "nora_intro", type: "introduction", minRelationship: 0, title: "Kitchen Timing", prompt: "Nora, a pastry chef, asks if you trust recipes or instincts.", emotionalBeat: "Warm discipline and playful control.", choices: [{ text: "Teach me your exact method.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "nora_recipe_apprentice" }, { text: "Let's improvise and taste as we go.", relationshipImpact: 6, chemistryImpact: 7 }, { text: "Pretend expertise you don't have.", checkStat: "culinary", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 5 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "nora_early", type: "early connection", minRelationship: 18, title: "Before Sunrise Prep", prompt: "She invites you to prep croissants at 4AM to see if you can handle her pace.", emotionalBeat: "Tenderness hidden inside rigor.", choices: [{ text: "Show up early and follow her system.", relationshipImpact: 8, chemistryImpact: 8 }, { text: "Ask her to assign you one station and own it.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "nora_station_trust" }, { text: "Complain about the schedule.", relationshipImpact: -3, chemistryImpact: -2 }] },
    { id: "nora_reveal", type: "personal reveal", minRelationship: 35, title: "Burnt Batch", prompt: "Nora confesses she still hears an old mentor telling her she's never enough.", emotionalBeat: "Perfectionism cracking open.", choices: [{ text: "You are not your worst batch.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "nora_self_criticism_shared" }, { text: "Write a recovery plan together for bad service days.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Tell her to toughen up and ignore it.", checkStat: "confidence", threshold: 40, onSuccess: { relationshipImpact: 3, chemistryImpact: 3 }, onFail: { relationshipImpact: -4, chemistryImpact: -3 } }] },
    { id: "nora_conflict", type: "conflict", minRelationship: 52, title: "Missed Anniversary Service", prompt: "Nora chooses a critical service over your planned night and expects you to understand.", emotionalBeat: "Duty colliding with intimacy.", choices: [{ text: "Say work always wins and shut down.", relationshipImpact: -7, chemistryImpact: -5 }, { text: "Name what hurt and ask for a make-up ritual.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "nora_repair_ritual" }, { text: "Show up after service with food and clear boundaries for next time.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "nora_after_service_rule" }] },
    { id: "nora_trust", type: "trust event", minRelationship: 70, title: "Chef's Table for Two", prompt: "Nora closes the kitchen and serves you a six-course menu she has never shown anyone.", emotionalBeat: "Control offered as devotion.", choices: [{ text: "Let her lead every course and describe each feeling.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "nora_private_tasting" }, { text: "Ask to co-plate the dessert together.", relationshipImpact: 7, chemistryImpact: 8 }, { text: "Critique every dish technically.", checkStat: "culinary", threshold: 45, onSuccess: { relationshipImpact: 4, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "nora_commitment", type: "commitment event", minRelationship: 90, title: "Second Location", prompt: "Nora can open a second bakery but fears it will consume everything.", emotionalBeat: "Ambition balanced by longing for home.", choices: [{ text: "Commit to shared routines that protect the relationship.", relationshipImpact: 14, chemistryImpact: 12, unlocksMemory: "nora_second_location_commitment" }, { text: "Build a weekly no-work dinner she curates.", relationshipImpact: 11, chemistryImpact: 11, futureCallback: "nora_no_work_tuesdays" }, { text: "Leave the future undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "nora_blurred_future" }] }
  ]
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
    romanceArc: ROMANCE_ARCS.elena,
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
    romanceArc: ROMANCE_ARCS.brad,
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
    romanceArc: ROMANCE_ARCS.sophia,
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
    romanceArc: ROMANCE_ARCS.marcus,
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
    romanceArc: ROMANCE_ARCS.chloe,
    storyEvents: {
      25: { prompt: "Chloe is stuck on a painting and needs creative inspiration.", statCheck: "creativity", threshold: 40, successText: "You suggest a bold color palette. She creates a masterpiece!", failText: "Your suggestions don't click, but she finishes it eventually." },
      50: { prompt: "Chloe has an art gallery showing but is terrified of the critics.", statCheck: "confidence", threshold: 30, successText: "You bolster her confidence and she charms the critics.", failText: "She hides in the back, but the art sells anyway." },
      75: { prompt: "Chloe's favorite acoustic guitar was damaged in a flood.", statCheck: "music", threshold: 40, successText: "You help her repair and re-string it perfectly.", failText: "It doesn't sound quite the same, but she's happy it's fixed." },
      100: { prompt: "Surrounded by canvas and paint, Chloe smiles softly and pulls you into an embrace. 'You're my favorite muse.' The night is full of whispered confessions and gentle affection. Morning light finds you both tangled in the sheets.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "rina",
    name: "Rina",
    gender: "female",
    archetype: "SOCIALITE",
    description: "A late-night lounge manager who loves vinyl jazz, sharp tailoring, and city lights.",
    gatedBy: {
      type: "stat",
      stat: "charisma",
      value: 25,
      message: "Rina gravitates toward people with social confidence (Requires Charisma > 25)."
    },
    dialogue: {
      intro: "You look interesting. Can you keep up after midnight, or are you all talk?",
      choices: [
        { text: "Give me a challenge and I'll match your pace. (+Charisma check)", checkStat: "charisma", threshold: 35, successRelation: 25, successText: "Rina smiles. 'Good answer. Follow me.'", failRelation: 5, failText: "She laughs softly. 'Bold. We'll see.'" },
        { text: "I'm more of a quiet-night person.", successRelation: -5, successText: "Rina shrugs. 'Nothing wrong with that, just not my tempo.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.rina,
    storyEvents: {
      25: { prompt: "Rina has to host a difficult VIP table without letting the room feel tense.", statCheck: "socialIq", threshold: 40, successText: "You help diffuse the mood and the night stays elegant.", failText: "The table stays awkward, but she respects the effort." },
      50: { prompt: "A live performer cancels last minute and Rina needs a replacement set plan.", statCheck: "creativity", threshold: 35, successText: "You build a smooth backup vibe and save the set.", failText: "The transition is rough, but the night survives." },
      75: { prompt: "Rina's family asks her to move back home, putting her career at risk.", statCheck: "empathy", threshold: 40, successText: "You help her hold both duty and self-respect in the conversation.", failText: "She stays conflicted, but feels less alone." },
      100: { prompt: "After closing time, Rina locks the lounge doors and pulls you close under the dim lights. The city hums outside as the two of you share a slow, electric night together.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "maya",
    name: "Maya",
    gender: "female",
    sexuality: "bisexual",
    archetype: "ARTIST",
    description: "A bisexual documentary photographer drawn to unfiltered emotion, travel, and street stories.",
    gatedBy: {
      type: "stat",
      stat: "style",
      value: 20,
      message: "Maya notices people who carry themselves with intention (Requires Style > 20)."
    },
    dialogue: {
      intro: "I shoot people as they are, not as they pretend. Can you handle that?",
      choices: [
        { text: "Yes. Show me the lens you use when it matters. (+Style check)", checkStat: "style", threshold: 30, successRelation: 25, successText: "Maya nods. 'Good. Let's make something honest.'", failRelation: 5, failText: "She studies you. 'We'll start simple.'" },
        { text: "I'd rather keep things surface-level.", successRelation: -10, successText: "Maya tilts her head. 'Then I'm probably not your person.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.maya,
    storyEvents: {
      25: { prompt: "Maya's interview subject no-shows and she needs to salvage the shoot.", statCheck: "charisma", threshold: 35, successText: "You help secure a great replacement interview on the fly.", failText: "The backup is weaker, but the day isn't lost." },
      50: { prompt: "A publication wants to crop Maya's photo essay into clickbait.", statCheck: "negotiation", threshold: 40, successText: "You help her hold editorial ground and keep the story intact.", failText: "Some compromises happen, but her voice remains." },
      75: { prompt: "Maya's old relationship fears resurface as her project takes off in two cities.", statCheck: "empathy", threshold: 45, successText: "You reassure her without asking her to shrink her life.", failText: "She's still uneasy, but appreciates your honesty." },
      100: { prompt: "Maya develops a private contact sheet just for the two of you, then kisses you in the darkroom glow. The night unfolds with intensity, laughter, and quiet devotion.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "nora",
    name: "Nora",
    gender: "female",
    archetype: "EXECUTIVE",
    description: "A rising pastry chef running a high-pressure kitchen with exacting standards and a soft heart.",
    gatedBy: {
      type: "stat",
      stat: "culinary",
      value: 20,
      message: "Nora is drawn to people who respect craft and discipline (Requires Culinary > 20)."
    },
    dialogue: {
      intro: "If you're late, dough dies. If you're precise, magic happens. Which are you?",
      choices: [
        { text: "Give me a station and I'll earn it. (+Culinary check)", checkStat: "culinary", threshold: 30, successRelation: 25, successText: "Nora smirks. 'Apron on. Don't slow me down.'", failRelation: 5, failText: "She hands you a whisk. 'Start with basics.'" },
        { text: "I cook by vibes, not rules.", successRelation: -8, successText: "Nora laughs. 'Cute, but pastry is math.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.nora,
    storyEvents: {
      25: { prompt: "Nora's prep team falls behind before a major brunch service.", statCheck: "culinary", threshold: 40, successText: "You help stabilize stations and service lands smoothly.", failText: "Service is chaotic, but she notes your effort." },
      50: { prompt: "A critic's review rattles Nora more than she admits.", statCheck: "confidence", threshold: 35, successText: "You help her focus on growth instead of panic.", failText: "She spirals briefly, then regains composure." },
      75: { prompt: "Nora gets funding for a second location but fears burnout.", statCheck: "finance", threshold: 40, successText: "You map a plan that protects both ambition and sanity.", failText: "The plan is rough, but she feels supported." },
      100: { prompt: "Nora serves you a final course after close, then pulls you into a flour-dusted embrace. The kitchen lights dim as your night together turns intimate and unforgettable.", statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  }
];
