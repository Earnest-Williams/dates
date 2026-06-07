// NPC relationship schema note: romance progress is authored through shared time,
// meaningful choices, remembered context, compatibility, dates, routines,
// conflict/repair, and long-term follow-through. Do not add loved/liked/
// disliked gift lists, archetype gift bonuses, or repeatable item-based
// relationship gains to NPC records. Contextual props belong only inside
// specific story beats.

export const ARCHETYPES = {
  SCHOLAR: {
    name: "Scholar",
    primaryStat: "intelligence",
    secondaryStat: "corporate",
    tertiaryStat: "charisma",
  },
  GYM_RAT: {
    name: "Gym Rat",
    primaryStat: "fitness",
    secondaryStat: "hygiene",
    tertiaryStat: "charisma",
  },
  SOCIALITE: {
    name: "Socialite",
    primaryStat: "style",
    secondaryStat: "charisma",
    tertiaryStat: "money",
  },
  EXECUTIVE: {
    name: "Executive",
    primaryStat: "corporate",
    secondaryStat: "style",
    tertiaryStat: "intelligence",
  },
  ARTIST: {
    name: "Artist",
    primaryStat: "charisma",
    secondaryStat: "style",
    tertiaryStat: "intelligence",
  }
};

const ROMANCE_ARCS = {
  elena: [
    { id: "elena_intro", type: "introduction", minRelationship: 0, title: "A Question About Books", prompt: "Elena looks up from her notes, her guarded curiosity meeting yours. 'What kind of books do you read when no one is judging you?'", emotionalBeat: "Guarded curiosity with a hint of playful authority.", choices: [{ text: "I read to feel less alone.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "elena_knows_player_reads" }, { text: "Recommend me your strictest reading assignment.", relationshipImpact: 6, chemistryImpact: 8, unlocksMemory: "elena_assigns_reading", futureCallback: "elena_book_club_dynamic" }, { text: "I read whatever makes me look smart.", checkStat: "intelligence", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 4, unlocksMemory: "elena_impressed_by_wit" }, onFail: { relationshipImpact: -2, chemistryImpact: -1, futureCallback: "elena_intellectual_flaw" } }], futureCallback: "elena_poetry_binder" },
    { id: "elena_early", type: "early connection", minRelationship: 18, title: "Library Closing Time", prompt: "Elena is racing a deadline as security closes the library. She rubs her temples, the academic pressure and fear of losing control evident in her tight shoulders.", emotionalBeat: "Academic pressure and fear of losing control.", choices: [{ text: "Quietly sit beside her and help organize citations without being asked.", relationshipImpact: 7, chemistryImpact: 6, unlocksMemory: "elena_silent_support" }, { text: "Set a timer and make her take a tea break first.", relationshipImpact: 5, chemistryImpact: 7, unlocksMemory: "elena_allows_soft_structure" }, { text: "Tell her rest matters more than one paragraph.", relationshipImpact: 3, chemistryImpact: 5, unlocksMemory: "elena_accepts_rest" }] },
    { id: "elena_reveal", type: "personal reveal", minRelationship: 35, title: "The Fellowship Letter", prompt: "Elena admits she was waitlisted for the fellowship. She looks away, ambition warring with shame as she silently asks if you still see her the same way.", emotionalBeat: "Ambition meets shame.", choices: [{ text: "Tell her she is more than one committee decision.", relationshipImpact: 10, chemistryImpact: 8, unlocksMemory: "elena_shared_waitlist" }, { text: "Let me quiz you out loud so we can rebuild confidence.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "elena_oral_drill_ritual" }, { text: "Let's draft an appeal tonight.", checkStat: "corporate", threshold: 30, onSuccess: { relationshipImpact: 7, chemistryImpact: 5, unlocksMemory: "elena_appeal_victory" }, onFail: { relationshipImpact: 2, chemistryImpact: 1, unlocksMemory: "elena_appeal_failure" } }] },
    { id: "elena_conflict", type: "conflict", minRelationship: 52, title: "Missed Dinner", prompt: "She cancels dinner abruptly, her texts sounding unusually cold. The defensive detachment feels like a wall she built to protect herself from being a disappointment.", emotionalBeat: "Defensive detachment.", choices: [{ text: "Reply with sarcasm, matching her coldness.", relationshipImpact: -6, chemistryImpact: -4, futureCallback: "elena_deadline_argument" }, { text: "Ask if she is okay first, ignoring the brush-off.", relationshipImpact: 6, chemistryImpact: 7, unlocksMemory: "elena_trusts_player_under_stress" }, { text: "Send a calm note: no punishment, just honesty when she is ready.", relationshipImpact: 4, chemistryImpact: 6, futureCallback: "elena_repair_letter" }] },
    { id: "elena_trust", type: "trust event", minRelationship: 70, title: "Backstage Breathing", sceneTags: ['vulnerability', 'public_risk', 'emotional_hunger'], prompt: "She freezes before a thesis presentation. The academic mask slips, revealing raw panic.", emotionalBeat: "Fear beneath competence, desperate for an anchor.", choices: [{ text: "Pull her into the dark stairwell, gripping her waist to ground her.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 5 }, unlocksMemory: "elena_presentation_anchor" }, { text: "Press your forehead to hers and breathe together until the shaking stops.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 6, implication: 6, emotionalRisk: 9, publicRisk: 3 }, unlocksMemory: "elena_preference_check_in" }, { text: "Offer speaking tips only.", checkStat: "intelligence", threshold: 45, onSuccess: { relationshipImpact: 5, chemistryImpact: 3 }, onFail: { relationshipImpact: 0, chemistryImpact: -2 } }] },
    { id: "elena_commitment", type: "commitment event", minRelationship: 90, title: "Two Calendars, One Life", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "She traces the rim of her wine glass, admitting the offer abroad terrifies her because she doesn't want to leave your bed empty.", emotionalBeat: "Vulnerability, ambition, and deep physical longing.", choices: [{ text: "Pull her close and tell her you'll cross oceans to keep this alive.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "elena_chosen_partnership" }, { text: "Pin her hands gently. Tell her distance won't change how much you need her.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "elena_long_distance_seminar" }, { text: "Say you'll improvise later.", relationshipImpact: 3, chemistryImpact: 1, futureCallback: "elena_uncertain_future" }] }
  ],
  sophia: [
    { id: "sophia_intro", type: "introduction", minRelationship: 0, title: "Mirror Talk", prompt: "Sophia catches your eye in the mirror, turning away from her ring light. She asks, voice surprisingly quiet, if you prefer her public image or her actual self.", emotionalBeat: "Status anxiety and a taste for admiration.", choices: [{ text: "Tell her you like who she is when the cameras are off.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "sophia_seen_without_filter" }, { text: "Give her a sincere compliment and ask what she wants tonight.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "sophia_praise_with_care" }, { text: "Tell her the brand is elite, playing into the persona.", checkStat: "style", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "sophia_brand_validated" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "sophia_felt_misunderstood" } }] },
    { id: "sophia_early", type: "early connection", minRelationship: 18, title: "Wardrobe Spiral", prompt: "She spirals before a gala over one imperfect look. The frantic changing reveals her deep-seated fear of losing control over her presentation.", emotionalBeat: "Control through presentation.", choices: [{ text: "Sit with her in the mess and help her choose what feels authentic.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "sophia_authentic_style_support" }, { text: "Offer a playful 'styling challenge' where she directs your look too.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "sophia_mutual_style_game" }, { text: "Tell her to just wear whatever trends best.", relationshipImpact: 1, chemistryImpact: 0, futureCallback: "sophia_trend_follower" }] },
    { id: "sophia_reveal", type: "personal reveal", minRelationship: 35, title: "Contract Clause", prompt: "Sophia pours herself a drink, confessing a major brand wants to script her personal life. The glossy performance drops entirely, revealing deep, quiet sincerity.", emotionalBeat: "Sincerity beneath performance.", choices: [{ text: "Tell her to protect her boundaries first.", relationshipImpact: 10, chemistryImpact: 8, unlocksMemory: "sophia_boundary_priority" }, { text: "Draft three non-negotiables and rehearse saying no.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "sophia_practiced_boundaries" }, { text: "Tell her to take the money and adapt.", checkStat: "negotiation", threshold: 40, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "sophia_money_focus" }, onFail: { relationshipImpact: -3, chemistryImpact: -2, futureCallback: "sophia_felt_pushed" } }] },
    { id: "sophia_conflict", type: "conflict", minRelationship: 52, title: "Leaked Photos Night", prompt: "After a massive privacy leak, she shuts everyone out, aggressively accusing the whole room of chasing clout. Humiliation and distrust radiate from her.", emotionalBeat: "Humiliation and distrust.", choices: [{ text: "Argue she is overreacting.", relationshipImpact: -7, chemistryImpact: -5, futureCallback: "sophia_defensive_argument" }, { text: "Offer complete privacy and ask what support looks like right now.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "sophia_safe_with_player" }, { text: "Protect her space and screen all messages for one night.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "sophia_crisis_protocol" }] },
    { id: "sophia_trust", type: "trust event", minRelationship: 70, title: "No-Makeup Morning", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "She invites you over before a live stream. Without makeup or lighting, her exhaustion is palpable as she leans her full weight against you in the quiet kitchen.", emotionalBeat: "Letting the image drop, craving physical anchoring.", choices: [{ text: "Cancel your plans and pull her into your lap until she stops shivering.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 6, implication: 7, emotionalRisk: 8, publicRisk: 0 } }, { text: "Ask what she needs: the ruthless manager or someone to just hold her.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 5, implication: 6, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "sophia_pre_stream_checkin" }, { text: "Coach her PR response immediately.", checkStat: "socialIq", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 1, chemistryImpact: -1 } }] },
    { id: "sophia_commitment", type: "commitment event", minRelationship: 90, title: "Private Account", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Sophia locks her phone in a drawer. 'I want something that belongs only to us,' she demands, pulling you down onto the bed.", emotionalBeat: "Choosing sincerity and raw intimacy over status.", choices: [{ text: "Promise her complete exclusivity and trace the line of her jaw.", relationshipImpact: 14, chemistryImpact: 12, tone: { heat: 8, implication: 9, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "sophia_private_life_commitment" }, { text: "Make her swear to leave the persona outside the bedroom.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 9, implication: 8, emotionalRisk: 8, publicRisk: 0 }, futureCallback: "sophia_offline_night" }, { text: "Keep things public and flexible.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "sophia_public_pressure" }] }
  ],
  chloe: [
    { id: "chloe_intro", type: "introduction", minRelationship: 0, title: "Wet Paint", prompt: "Chloe asks what connection means while mixing colors with trembling hands. Her quiet observation masks a deep fear of intrusion.", emotionalBeat: "Tender curiosity and craving muse-like attention.", choices: [{ text: "Tell her connection is being witnessed gently.", relationshipImpact: 9, chemistryImpact: 10, unlocksMemory: "chloe_seen_gently" }, { text: "Ask her to direct a quick sketch of you while you hold still.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "chloe_directed_pose" }, { text: "Tell her connection is mostly chemistry.", checkStat: "charisma", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "chloe_felt_chemistry" }, onFail: { relationshipImpact: -3, chemistryImpact: -3, futureCallback: "chloe_disappointed_intro" } }] },
    { id: "chloe_early", type: "early connection", minRelationship: 18, title: "Open Mic Nerves", prompt: "She wants to perform but completely freezes backstage. Her insecurity threatens to swallow her artistry whole unless someone grounds her.", emotionalBeat: "Insecurity beneath artistry.", choices: [{ text: "Hold her hand and breathe together in the dark.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "chloe_grounded_backstage" }, { text: "Offer a grounding ritual where she picks your role.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "chloe_backstage_ritual" }, { text: "Push her on stage before she overthinks.", relationshipImpact: 1, chemistryImpact: 0, futureCallback: "chloe_stage_fright" }] },
    { id: "chloe_reveal", type: "personal reveal", minRelationship: 35, title: "Critic's Review", prompt: "A harsh review makes Chloe spiral, questioning whether she is a complete fraud. The artistic intensity she usually channels into her work is now turned painfully inward.", emotionalBeat: "Artistic intensity turning inward.", choices: [{ text: "Read the review together and separate signal from cruelty.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "chloe_shared_review" }, { text: "Ask her to paint the feeling before discussing it.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "chloe_painted_feeling" }, { text: "Tell her to ignore critics completely.", checkStat: "confidence", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "chloe_ignored_critic" }, onFail: { relationshipImpact: 0, chemistryImpact: -1, futureCallback: "chloe_doubt_lingers" } }] },
    { id: "chloe_conflict", type: "conflict", minRelationship: 52, title: "Canceled Session", prompt: "You miss a promised gallery walk and she immediately paints over the piece she made for you. The destruction is a raw, devastating abandonment trigger.", emotionalBeat: "Abandonment trigger.", choices: [{ text: "Dismiss her reaction as being overly dramatic.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "chloe_painted_over" }, { text: "Apologize and ask to hear the hurt fully, no defense.", relationshipImpact: 8, chemistryImpact: 8, futureCallback: "chloe_repaint_together" }, { text: "Offer to sit quietly while she decides what to salvage.", relationshipImpact: 5, chemistryImpact: 6, unlocksMemory: "chloe_repair_presence" }] },
    { id: "chloe_trust", type: "trust event", minRelationship: 70, title: "Flooded Studio", sceneTags: ['vulnerability', 'emotional_hunger'], prompt: "Amidst the ruined canvases, she breaks down, burying her face in your neck and craving physical grounding in the mess.", emotionalBeat: "Letting you witness grief, demanding a physical anchor.", choices: [{ text: "Wrap your arms around her waist and hold her tight until the shaking stops.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 5, implication: 7, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "chloe_restoration_day" }, { text: "Ask what she needs: for you to fix this, or just to hold her.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 5, implication: 5, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "chloe_role_request" }, { text: "Tell her to replace everything quickly.", checkStat: "finance", threshold: 35, onSuccess: { relationshipImpact: 3, chemistryImpact: 2 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "chloe_commitment", type: "commitment event", minRelationship: 90, title: "The Unfinished Canvas", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Chloe's hands are still stained with paint as she pushes you gently against the studio wall. 'You're the only muse that matters,' she murmurs.", emotionalBeat: "Commitment through intense, breathless tenderness.", choices: [{ text: "Pull her in and promise you're entirely hers, canvas or no canvas.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "chloe_shared_future" }, { text: "Agree to a weekly muse night where the doors stay locked until morning.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 9, implication: 10, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "chloe_muse_rotation" }, { text: "Keep things undefined for now.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "chloe_undefined_future" }] }
  ],
  rina: [
    { id: "rina_intro", type: "introduction", minRelationship: 0, title: "After-Hours Jazz", prompt: "Rina invites you to a tiny jazz basement after her shift ends. She watches you carefully over her glass, her composed charm laced with playful tests.", emotionalBeat: "Composed charm with playful tests.", choices: [{ text: "Ask her to choose the first song and lead the vibe.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "rina_sets_the_tone" }, { text: "Tell a polished story to impress her.", relationshipImpact: 5, chemistryImpact: 5, unlocksMemory: "rina_heard_story" }, { text: "Order for both of you with confidence.", checkStat: "charisma", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 7, unlocksMemory: "rina_likes_confidence" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "rina_unimpressed" } }] },
    { id: "rina_early", type: "early connection", minRelationship: 18, title: "Midnight Service", prompt: "A staff shortage leaves Rina juggling a packed room alone. Despite the chaos, she handles it with a razor-sharp smile, fiercely guarding her independence.", emotionalBeat: "Grace under pressure.", choices: [{ text: "Quietly help reset tables without making it about you.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "rina_silent_support" }, { text: "Let her direct you task-by-task for twenty minutes.", relationshipImpact: 6, chemistryImpact: 8, unlocksMemory: "rina_backroom_teamwork" }, { text: "Tell her to ignore work and just hang out with you.", relationshipImpact: -2, chemistryImpact: 1, futureCallback: "rina_work_ethic_tension" }] },
    { id: "rina_reveal", type: "personal reveal", minRelationship: 35, title: "Family Ledger", prompt: "Rina admits she sends most of her income home. She looks away, her usual polished pride mixed with an exhausting fatigue, feeling trapped between duty and desire.", emotionalBeat: "Pride mixed with fatigue.", choices: [{ text: "Tell her she can be devoted to them and still choose joy.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "rina_shared_burden" }, { text: "Build a practical budget and a small freedom fund together.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "rina_freedom_fund" }, { text: "Push her for a risky all-in career leap.", checkStat: "finance", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "rina_career_pushed" }, onFail: { relationshipImpact: -3, chemistryImpact: -2, futureCallback: "rina_felt_pressured" } }] },
    { id: "rina_conflict", type: "conflict", minRelationship: 52, title: "Unread Message", prompt: "She goes quiet for two days after a family emergency and returns distant. The withdrawal is sudden and sharp when she gets overwhelmed.", emotionalBeat: "Withdrawal when overwhelmed.", choices: [{ text: "Demand immediate explanations for the silence.", relationshipImpact: -7, chemistryImpact: -5, futureCallback: "rina_pushed_away" }, { text: "Tell her you'll listen when she's ready, and mean it.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "rina_safe_silence" }, { text: "Leave a short voice note and one practical offer of help.", relationshipImpact: 5, chemistryImpact: 6, futureCallback: "rina_voice_note_thread" }] },
    { id: "rina_trust", type: "trust event", minRelationship: 70, title: "Empty Dance Floor", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "After closing, she locks the doors and pulls you flush against her in the dark. Her usual polished control shatters completely.", emotionalBeat: "Letting control become raw physical intimacy.", choices: [{ text: "Grip her waist and match her demanding, electric rhythm.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "rina_closing_dance" }, { text: "Take control for one intense turn, pulling her flush before stepping back.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 9, implication: 8, emotionalRisk: 6, publicRisk: 0 } }, { text: "Turn it into a performance challenge.", checkStat: "fitness", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 5 }, onFail: { relationshipImpact: -1, chemistryImpact: -1 } }] },
    { id: "rina_commitment", type: "commitment event", minRelationship: 90, title: "Two Tickets", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Rina receives a touring offer. She backs you against the door, voice tight as she demands to know if you'll wait for her.", emotionalBeat: "Hope and physical desperation fighting fear of abandonment.", choices: [{ text: "Swear to her that distance will only make the reunions explosive.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 8, implication: 10, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "rina_tour_commitment" }, { text: "Start a private playlist ritual for the lonely hotel nights.", relationshipImpact: 11, chemistryImpact: 13, tone: { heat: 7, implication: 9, emotionalRisk: 8, publicRisk: 0 }, futureCallback: "rina_city_playlist_arc" }, { text: "Keep things open and undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "rina_drifting_route" }] }
  ],
  maya: [
    { id: "maya_intro", type: "introduction", minRelationship: 0, title: "Rooftop Lens", prompt: "Maya points her lens at the skyline before turning it directly on you. With fearless honesty, she asks if you prefer to be seen or hidden.", emotionalBeat: "Direct curiosity and fearless honesty.", choices: [{ text: "Tell her you want to be seen, but only by someone who pays attention.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "maya_sees_player_clearly" }, { text: "Let her frame your first portrait shot right there.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "maya_first_portrait" }, { text: "Deflect her intense gaze with jokes.", checkStat: "charisma", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 4, unlocksMemory: "maya_amused_by_jokes" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "maya_felt_deflected" } }] },
    { id: "maya_early", type: "early connection", minRelationship: 18, title: "Street Interview", prompt: "Her interview subject bails abruptly. She asks you to step in for a practice run, her creative urgency laced with a soft, sudden vulnerability.", emotionalBeat: "Creative urgency with soft vulnerability.", choices: [{ text: "Answer her questions honestly, staying entirely grounded.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "maya_honest_interview" }, { text: "Let her direct the whole scene while you just stay present.", relationshipImpact: 6, chemistryImpact: 8, futureCallback: "maya_director_dynamic" }, { text: "Try to control the interview flow yourself.", relationshipImpact: -1, chemistryImpact: 1, futureCallback: "maya_power_struggle" }] },
    { id: "maya_reveal", type: "personal reveal", minRelationship: 35, title: "The Cut Room", prompt: "Surrounded by photos, Maya admits she avoids long-term relationships because she fears losing her edge. The self-protection barely hides a deep, quiet longing.", emotionalBeat: "Longing underneath self-protection.", choices: [{ text: "Tell her she doesn't need to shrink to stay loved.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "maya_identity_safe" }, { text: "Set boundaries that protect both of your autonomy.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "maya_autonomy_protected" }, { text: "Promise intensity without rigid structure.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 5, unlocksMemory: "maya_intensity_promised" }, onFail: { relationshipImpact: -3, chemistryImpact: -2, futureCallback: "maya_felt_smothered" } }] },
    { id: "maya_conflict", type: "conflict", minRelationship: 52, title: "Published Without Warning", prompt: "Maya posts a candid, highly intimate photo of you that sparks attention before checking in. Her drive for freedom collides painfully with your boundaries.", emotionalBeat: "Freedom vs. intimacy boundaries.", choices: [{ text: "Publicly call her out in the comments.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "maya_public_argument" }, { text: "Tell her privately what trust needs to look like for you.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "maya_respects_boundaries" }, { text: "Ask for a strict review rule before future posts.", relationshipImpact: 6, chemistryImpact: 6, futureCallback: "maya_editorial_rulebook" }] },
    { id: "maya_trust", type: "trust event", minRelationship: 70, title: "Contact Sheet Night", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "Maya throws the unedited contact sheets aside. She pulls you down onto the couch, her usual detachment breaking as she asks what you really see when you look at her.", emotionalBeat: "Radical openness, seeking deep physical connection.", choices: [{ text: "Trace her jawline and tell her she's the only frame you care about.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 6, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "maya_unedited_seen" }, { text: "Pin her gently and map out every detail you notice about her body.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 7, implication: 7, emotionalRisk: 9, publicRisk: 0 } }, { text: "Pick only polished shots.", checkStat: "style", threshold: 40, onSuccess: { relationshipImpact: 3, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "maya_commitment", type: "commitment event", minRelationship: 90, title: "Dual Residency", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Maya straddles your lap, tangling her hands in your shirt. She has a dual-city residency offer and needs to know if the anchor between you is strong enough to hold her.", emotionalBeat: "Choosing devotion wrapped in intense, unapologetic need.", choices: [{ text: "Grip her waist and swear you'll make every weekend together count.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "maya_dual_city_commitment" }, { text: "Make her promise to leave the camera behind when she comes home to your bed.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 9, implication: 10, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "maya_weekly_contact_sheet" }, { text: "Keep it casual and undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "maya_open_ended_arc" }] }
  ],
  nora: [
    { id: "nora_intro", type: "introduction", minRelationship: 0, title: "Kitchen Timing", prompt: "Nora stands in the kitchen, wiping flour off her apron. With warm discipline and playful control, she asks if you trust recipes or pure instinct.", emotionalBeat: "Warm discipline and playful control.", choices: [{ text: "Ask her to teach you her exact method.", relationshipImpact: 8, chemistryImpact: 9, unlocksMemory: "nora_recipe_apprentice" }, { text: "Suggest improvising and tasting as you go.", relationshipImpact: 6, chemistryImpact: 7, unlocksMemory: "nora_improviser" }, { text: "Pretend you have culinary expertise.", checkStat: "culinary", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 5, unlocksMemory: "nora_impressed_by_skills" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "nora_caught_bluffing" } }] },
    { id: "nora_early", type: "early connection", minRelationship: 18, title: "Before Sunrise Prep", prompt: "She invites you to prep croissants at 4AM, a ruthless test to see if you can handle her pace. But watching her fold butter reveals a tenderness hidden inside her rigor.", emotionalBeat: "Tenderness hidden inside rigor.", choices: [{ text: "Show up early, caffeine in hand, and follow her system.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "nora_morning_discipline" }, { text: "Ask her to assign you one station and own it completely.", relationshipImpact: 7, chemistryImpact: 8, unlocksMemory: "nora_station_trust" }, { text: "Complain about the brutal schedule.", relationshipImpact: -3, chemistryImpact: -2, futureCallback: "nora_disappointed_in_lazy" }] },
    { id: "nora_reveal", type: "personal reveal", minRelationship: 35, title: "Burnt Batch", prompt: "Staring at a ruined batch of macarons, Nora confesses she still hears an old mentor telling her she's never enough. The flawless perfectionism finally cracks open.", emotionalBeat: "Perfectionism cracking open.", choices: [{ text: "Tell her she is not her worst batch.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "nora_self_criticism_shared" }, { text: "Write a recovery plan together for bad service days.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "nora_recovery_plan" }, { text: "Tell her to toughen up and ignore the past.", checkStat: "confidence", threshold: 40, onSuccess: { relationshipImpact: 3, chemistryImpact: 3, unlocksMemory: "nora_tough_love" }, onFail: { relationshipImpact: -4, chemistryImpact: -3, futureCallback: "nora_felt_invalidated" } }] },
    { id: "nora_conflict", type: "conflict", minRelationship: 52, title: "Missed Anniversary Service", prompt: "Nora chooses a critical service over your planned night out, stubbornly expecting you to just understand. Her duty collides painfully with your need for intimacy.", emotionalBeat: "Duty colliding with intimacy.", choices: [{ text: "Say work always wins and coldly shut down.", relationshipImpact: -7, chemistryImpact: -5, futureCallback: "nora_cold_shoulder" }, { text: "Name what hurt and ask for a make-up ritual.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "nora_repair_ritual" }, { text: "Show up after service with food and clear boundaries for next time.", relationshipImpact: 6, chemistryImpact: 7, futureCallback: "nora_after_service_rule" }] },
    { id: "nora_trust", type: "trust event", minRelationship: 70, title: "Chef's Table for Two", sceneTags: ['late_night', 'vulnerability', 'secrecy', 'temptation'], prompt: "Nora closes the kitchen, locking out the world. She serves you a private menu, but the tension between you runs much hotter than the food.", emotionalBeat: "Control offered as devotion, boiling over into desire.", choices: [{ text: "Pull her across the table for a tasting menu of your own.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 7, implication: 9, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "nora_private_tasting" }, { text: "Let her feed you every bite while maintaining breathless eye contact.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 8, implication: 8, emotionalRisk: 8, publicRisk: 0 } }, { text: "Critique every dish technically.", checkStat: "culinary", threshold: 45, onSuccess: { relationshipImpact: 4, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "nora_commitment", type: "commitment event", minRelationship: 90, title: "Second Location", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Nora pushes you into the cool metal of the walk-in fridge. She's expanding the bakery but needs to know she won't lose you to the grind.", emotionalBeat: "Ambition anchored by fierce, demanding intimacy.", choices: [{ text: "Tell her she's yours, and you'll protect your time together at all costs.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 3 }, unlocksMemory: "nora_second_location_commitment" }, { text: "Pin her hands above her head and swear you aren't going anywhere.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 9, implication: 10, emotionalRisk: 7, publicRisk: 3 }, futureCallback: "nora_no_work_tuesdays" }, { text: "Leave the future undefined.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "nora_blurred_future" }] }
  ]
};


const BASE_NPCS = [
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
      75: { prompt: "Elena is presenting her thesis but is having a panic attack backstage. The pressure of the spotlight is breaking her composure.", sceneTags: ['vulnerability', 'public_risk', 'emotional_hunger'], tone: { heat: 4, implication: 5, emotionalRisk: 8, publicRisk: 6 }, statCheck: "empathy", threshold: 40, successText: "You calm her down and she gives a brilliant presentation.", failText: "You stumble over your words, but she eventually calms down." },
      100: { prompt: "Elena pulls you into her dimly lit study, the door clicking shut behind you. 'I can't focus on anything else when you're looking at me like that,' she whispers. She traces a trembling finger down your collarbone, the academic restraint finally breaking as she pulls you against her.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation', 'secrecy'], tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Sophia is spiraling after a private leak. She drops the influencer persona entirely, clutching your hand in her dark apartment, terrified of being completely exposed.", sceneTags: ['vulnerability', 'public_risk', 'emotional_hunger'], tone: { heat: 4, implication: 7, emotionalRisk: 9, publicRisk: 8 }, statCheck: "socialIq", threshold: 40, successText: "You help her draft a perfect PR response that wins over the public.", failText: "The PR response is mediocre, but the storm eventually passes." },
      100: { prompt: "Sophia kicks off her heels in the penthouse, dropping the VIP smile completely. She presses you against the glass windows overlooking the city. 'I just want it to be us tonight,' she breathes, sliding her hands under your shirt with demanding, unapologetic need.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 9, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Chloe's studio flooded. Amidst the ruined canvases, she breaks down, burying her face in your neck and craving physical grounding in the mess.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 5, implication: 7, emotionalRisk: 9, publicRisk: 0 }, statCheck: "music", threshold: 40, successText: "You help her repair and re-string it perfectly.", failText: "It doesn't sound quite the same, but she's happy it's fixed." },
      100: { prompt: "Chloe's hands are still stained with paint as she pushes you gently against the studio wall. 'You're the only muse that matters,' she murmurs, her quiet sincerity turning into breathless intensity as she trails kisses down your jawline.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Rina is torn over family pressure. After a shift, she pulls you into the cramped back office, the forced composure cracking as she seeks your warmth to anchor her.", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], tone: { heat: 6, implication: 7, emotionalRisk: 8, publicRisk: 4 }, statCheck: "empathy", threshold: 40, successText: "You help her hold both duty and self-respect in the conversation.", failText: "She stays conflicted, but feels less alone." },
      100: { prompt: "Rina locks the heavy lounge doors, plunging the room into shadows. She presses you back against the smooth mahogany bar. 'I've been distracted by your mouth all night,' she murmurs, her usual polished control shattering as she pulls you in.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 10, emotionalRisk: 6, publicRisk: 5 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Maya's old relationship fears resurface. She brings you to the darkroom, the red light casting shadows over her intense gaze as she challenges you to see her unfiltered.", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 2 }, statCheck: "empathy", threshold: 45, successText: "You reassure her without asking her to shrink her life.", failText: "She's still uneasy, but appreciates your honesty." },
      100: { prompt: "Maya sets her camera aside, the flash turning off. 'No more observing,' she says, her voice thick with need. She pins your hands gently above your head, capturing you in a moment entirely private and overwhelmingly intense.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 9, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Nora gets funding for a second location but fears burnout. In the empty kitchen, her fierce discipline breaks. She leans heavily against you, the heat of the ovens matching the sudden, raw tension.", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], tone: { heat: 6, implication: 8, emotionalRisk: 8, publicRisk: 3 }, statCheck: "finance", threshold: 40, successText: "You map a plan that protects both ambition and sanity.", failText: "The plan is rough, but she feels supported." },
      100: { prompt: "Nora locks the bakery doors. She wipes flour from her hands before gripping your collar, pulling you flush against her. 'I'm done being disciplined for tonight,' she whispers, the strict chef persona melting into demanding physical need.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 9, emotionalRisk: 7, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  }
];


const makePhase2RomanceArc = (npcId, name) => [
  { id: `${npcId}_intro`, type: "introduction", minRelationship: 0, title: "First Real Conversation", prompt: `${name} gives you a careful opening to show who you are.`, emotionalBeat: "Curiosity and first-impression nerves.", choices: [{ text: "Ask what kind of day they are having before trying to impress them.", relationshipImpact: 6, chemistryImpact: 5, unlocksMemory: `${npcId}_honest_opening` }, { text: "Share a small honest detail about yourself.", relationshipImpact: 5, chemistryImpact: 6 }, { text: "Try too hard to sound impressive.", checkStat: "charisma", threshold: 35, onSuccess: { relationshipImpact: 4, chemistryImpact: 4 }, onFail: { relationshipImpact: -2, chemistryImpact: -1 } }] },
  { id: `${npcId}_early`, type: "early connection", minRelationship: 18, title: "A Shared Rhythm", prompt: `${name} lets the conversation slow down enough for trust to start forming.`, emotionalBeat: "Warmth, pacing, and guarded hope.", choices: [{ text: "Match their pace and listen for what matters.", relationshipImpact: 7, chemistryImpact: 5, unlocksMemory: `${npcId}_shared_rhythm` }, { text: "Suggest a low-pressure follow-up together.", relationshipImpact: 5, chemistryImpact: 6 }, { text: "Fill every silence.", relationshipImpact: 1, chemistryImpact: -1 }] },
  { id: `${npcId}_reveal`, type: "personal reveal", minRelationship: 35, title: "Something Underneath", prompt: `${name} admits there is more going on than their usual public routine shows.`, emotionalBeat: "Vulnerability balanced against self-protection.", choices: [{ text: "Thank them for trusting you with the truth.", relationshipImpact: 9, chemistryImpact: 6, unlocksMemory: `${npcId}_trusted_reveal` }, { text: "Ask what support would actually help.", relationshipImpact: 7, chemistryImpact: 6 }, { text: "Rush into advice.", checkStat: "empathy", threshold: 35, onSuccess: { relationshipImpact: 4, chemistryImpact: 3 }, onFail: { relationshipImpact: -2, chemistryImpact: -1 } }] },
  { id: `${npcId}_conflict`, type: "conflict", minRelationship: 52, title: "A Misread Moment", prompt: `${name} pulls back after a choice lands differently than you intended.`, emotionalBeat: "Hurt, uncertainty, and a chance to repair without defensiveness.", choices: [{ text: "Own the impact before explaining intent.", relationshipImpact: 7, chemistryImpact: 5, unlocksMemory: `${npcId}_owned_impact` }, { text: "Give them room, then follow up clearly.", relationshipImpact: 5, chemistryImpact: 4 }, { text: "Act like they are overreacting.", relationshipImpact: -6, chemistryImpact: -4 }] },
  { id: `${npcId}_trust`, type: "trust event", minRelationship: 70, title: "Choosing Trust", prompt: `${name} lets you see a private fear and waits to see whether you stay present.`, emotionalBeat: "Trust tested by pressure.", choices: [{ text: "Stay steady and ask what they need right now.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: `${npcId}_steady_trust` }, { text: "Offer reassurance without making promises you cannot keep.", relationshipImpact: 7, chemistryImpact: 7 }, { text: "Try to fix the feeling instantly.", checkStat: "empathy", threshold: 45, onSuccess: { relationshipImpact: 5, chemistryImpact: 3 }, onFail: { relationshipImpact: 0, chemistryImpact: -2 } }] },
  { id: `${npcId}_commitment`, type: "commitment event", minRelationship: 90, title: "A Future Named Out Loud", prompt: `${name} asks what building something real would look like after the rush fades.`, emotionalBeat: "Commitment, longing, and practical hope.", choices: [{ text: "Name the future you want and the habits that will protect it.", relationshipImpact: 13, chemistryImpact: 12, futureCallback: `${npcId}_future_habits` }, { text: "Admit you are scared but willing to keep choosing them.", relationshipImpact: 10, chemistryImpact: 11 }, { text: "Keep the future vague.", relationshipImpact: 1, chemistryImpact: 0 }] },
];

const PHASE2_NPCS = [
  { id: "liam", name: "Liam", gender: "male", archetype: "ARTIST", stat: "creativity", description: "A community muralist who notices the stories people leave on walls." },
  { id: "ava", name: "Ava", gender: "female", archetype: "SOCIALITE", stat: "style", description: "A boutique event planner with a sharp eye for whether people feel included." },
  { id: "ethan", name: "Ethan", gender: "male", archetype: "SCHOLAR", stat: "intelligence", description: "A local archivist who turns small-town history into living gossip." },
  { id: "olivia", name: "Olivia", gender: "female", archetype: "EXECUTIVE", stat: "corporate", description: "A startup operations lead trying to build ambition without burning out." },
  { id: "noah", name: "Noah", gender: "male", archetype: "GYM_RAT", stat: "fitness", description: "A climbing coach who treats patience as seriously as strength." },
  { id: "isabella", name: "Isabella", gender: "female", archetype: "ARTIST", stat: "music", description: "A violin teacher who hears sincerity before polish." },
  { id: "james", name: "James", gender: "male", archetype: "EXECUTIVE", stat: "finance", description: "A junior analyst learning that stability and status are not the same thing." },
  { id: "sofia", name: "Sofia", gender: "female", archetype: "SCHOLAR", stat: "empathy", description: "A language tutor who values thoughtful attention over perfect words." },
  { id: "emma", name: "Emma", gender: "female", archetype: "SOCIALITE", stat: "charisma", description: "A friendly cafe regular who remembers everyone's small victories." },
  { id: "alexander", name: "Alexander", gender: "male", archetype: "EXECUTIVE", stat: "negotiation", description: "A theatre producer balancing charm, logistics, and fragile egos." },
].map((npc) => ({
  ...npc,
  gatedBy: {
    type: "stat",
    stat: npc.stat,
    value: 20,
    message: `${npc.name} notices people with ${npc.stat} above 20.`,
  },
  dialogue: {
    intro: `${npc.name} seems open to a real conversation if you meet the moment honestly.`,
    choices: [
      { text: `Lead with curiosity about ${npc.name}'s day.`, successRelation: 12, successText: `${npc.name} relaxes into the conversation.` },
      { text: "Make the moment all about yourself.", successRelation: -6, successText: `${npc.name} politely creates some distance.` },
    ],
  },
  romanceArc: makePhase2RomanceArc(npc.id, npc.name),
  storyEvents: {
    25: { prompt: `${npc.name} needs encouragement before a stressful obligation.`, statCheck: npc.stat, threshold: 35, successText: "Your support lands well.", failText: "The moment is imperfect, but the effort matters." },
    50: { prompt: `${npc.name} has to choose between image and honesty.`, statCheck: "empathy", threshold: 35, successText: "You help keep the choice grounded.", failText: "It stays messy, but trust survives." },
  },
}));

export const CORE_NPC_IDS = ["elena", "sophia", "chloe"];

export const RELATIONSHIP_CONFLICT_TRIGGERS = [
  "ignored_messages",
  "incompatible_choices",
  "low_mood",
  "jealousy_social_reputation",
  "missed_planned_date",
  "poor_date_ending",
  "ambition_mismatch",
  "home_lifestyle_mismatch",
  "broken_promises",
  "repeated_inattentive_dialogue",
];

export const RELATIONSHIP_REPAIR_ACTIONS = [
  "apologize",
  "give_space",
  "follow_through_on_previous_promise",
  "choose_thoughtful_activity",
  "revisit_meaningful_location",
  "ask_friend_for_advice",
  "write_message",
  "help_with_specific_problem",
  "spend_quiet_time_together",
];

const CORE_RELATIONSHIP_CONTENT = {
  elena: {
    hiddenCompatibilityTraits: {
      ambitionLevel: "high_and_structured",
      affectionStyle: "careful_words_and_reliable_presence",
      conflictStyle: "withdraws_until_safe",
      socialPreference: "quiet_intellectual_spaces",
      familyOrientation: "chosen_family_with_academic_mentors",
      spendingStyle: "practical_books_and_savings",
      emotionalOpenness: "guarded_then_deep",
      longTermGoals: "research_fellowship_with_shared_rituals",
    },
    relationshipMemories: [
      "elena_knows_player_reads",
      "elena_assigns_reading",
      "elena_allows_soft_structure",
      "elena_shared_waitlist",
      "elena_trusts_player_under_stress",
      "elena_presentation_anchor",
      "elena_chosen_partnership",
    ],
    preferredDateTypes: ["library_date", "quiet_evening_in"],
    conflictEvent: {
      id: "elena_missed_deadline_dinner",
      trigger: "missed_planned_date",
      title: "The Dinner That Became a Footnote",
      routeImpact: "relationship pauses until the player acknowledges the broken plan",
      doesNotHardFailRoute: true,
      setup: "A planned dinner is ignored while Elena spirals over fellowship edits, and a second inattentive reply makes her pull back.",
      memoriesChecked: ["elena_assigns_reading", "elena_allows_soft_structure"],
      compatibilityChecked: ["ambitionLevel", "conflictStyle", "emotionalOpenness"],
      timingWindow: "best repaired within two in-game evenings, before her presentation scene",
      poorResponses: ["reply_with_sarcasm", "turn_it_into_a_scorekeeping_argument"],
    },
    repairEvent: {
      id: "elena_margin_note_repair",
      action: "write_message",
      title: "Margins, Not Excuses",
      successDependsOn: ["remembered reading preference", "timely apology", "prior patience during stress"],
      noPurchasedItemRequired: true,
      contextualItemRule: "The player may return her annotated draft if they promised to review it; buying a book cannot clear the conflict.",
      choices: [
        "write a concise apology that names the missed dinner",
        "follow through by reviewing the draft she already shared",
        "offer a quiet library walk only if she wants company",
      ],
    },
    homeReaction: {
      id: "elena_home_quiet_corners",
      likes: ["literary", "cozy"],
      dislikes: ["chaotic_party"],
      text: "Elena notices whether the home has a quiet place to read before she relaxes into the evening.",
    },
    locationBasedEncounter: {
      id: "elena_archive_encounter",
      locationKey: "library",
      callback: "If the player once recommended a personal book, she has it open beside her notes.",
    },
    longTermRelationshipScene: {
      id: "elena_two_calendars_one_life",
      premise: "A fellowship abroad forces the couple to design weekly rituals instead of relying on chemistry alone.",
      compatibilityChecks: ["ambitionLevel", "longTermGoals", "conflictStyle"],
    },
    legacyFamilyReaction: {
      id: "elena_mentor_family_dinner",
      text: "Elena treats trusted mentors as family and watches whether the player respects their role in her life.",
    },
    choiceCallbacks: [
      "elena_book_club_dynamic",
      "elena_oral_drill_ritual",
      "elena_repair_letter",
    ],
  },
  sophia: {
    hiddenCompatibilityTraits: {
      ambitionLevel: "public_brand_growth",
      affectionStyle: "attentive_presence_in_public_and_private",
      conflictStyle: "sharp_words_then_tests_reliability",
      socialPreference: "high_visibility_with_private_sincerity",
      familyOrientation: "legacy_image_and_chosen_inner_circle",
      spendingStyle: "luxury_with_reputation_risk",
      emotionalOpenness: "curated_until_trust_is_earned",
      longTermGoals: "influence_that_does_not_cost_intimacy",
    },
    relationshipMemories: [
      "sophia_seen_without_filter",
      "sophia_praise_with_care",
      "sophia_boundary_priority",
      "sophia_safe_with_player",
      "sophia_pre_stream_checkin",
      "sophia_private_life_commitment",
    ],
    preferredDateTypes: ["fine_dining", "gallery_date"],
    conflictEvent: {
      id: "sophia_caption_afterparty_conflict",
      trigger: "jealousy_social_reputation",
      title: "Tagged for the Wrong Reason",
      routeImpact: "Sophia becomes guarded about being seen with the player, but trust can be rebuilt.",
      doesNotHardFailRoute: true,
      setup: "A careless public caption and repeated inattentive dialogue make her feel like an accessory to the player's image.",
      memoriesChecked: ["sophia_seen_without_filter", "sophia_boundary_priority"],
      compatibilityChecked: ["socialPreference", "spendingStyle", "emotionalOpenness"],
      timingWindow: "best repaired before the next brand event or family legacy dinner",
      poorResponses: ["chase_clout_in_comments", "dismiss_privacy_as_bad_branding"],
    },
    repairEvent: {
      id: "sophia_private_table_repair",
      action: "choose_thoughtful_activity",
      title: "No Cameras at the Corner Table",
      successDependsOn: ["respected image boundaries", "chose privacy over status", "remembered her contract fear"],
      noPurchasedItemRequired: true,
      contextualItemRule: "Dinner works because it is a private authored activity; ordering an expensive item cannot substitute for accountability.",
      choices: [
        "apologize without making a public spectacle",
        "plan a no-post dinner at a place tied to an honest prior conversation",
        "ask her publicist friend what boundary would actually reduce harm",
      ],
    },
    homeReaction: {
      id: "sophia_home_image_vs_intimacy",
      likes: ["stylish", "clean"],
      dislikes: ["performative_luxury_without_comfort"],
      text: "Sophia compliments polish but only relaxes when the home feels private rather than staged.",
    },
    locationBasedEncounter: {
      id: "sophia_gallery_flashbulb_encounter",
      locationKey: "gallery",
      callback: "If the player protected her privacy before, she trusts them to steer her away from a gossip photographer.",
    },
    longTermRelationshipScene: {
      id: "sophia_offline_anniversary",
      premise: "Sophia chooses an anniversary with no cameras and asks whether the player can love the person behind the brand.",
      compatibilityChecks: ["socialPreference", "familyOrientation", "longTermGoals"],
    },
    legacyFamilyReaction: {
      id: "sophia_legacy_name_reaction",
      text: "Her family measures relationships as reputation alliances, and Sophia watches whether the player defends her autonomy.",
    },
    choiceCallbacks: [
      "sophia_vip_lounge_boundary",
      "sophia_brand_contract_callback",
      "sophia_no_post_anniversary",
    ],
  },
  chloe: {
    hiddenCompatibilityTraits: {
      ambitionLevel: "creative_growth_without_selling_out",
      affectionStyle: "emotional_presence_and_specific_help",
      conflictStyle: "hurt_silence_then_candid_talk",
      socialPreference: "small_creative_rooms",
      familyOrientation: "messy_but_loyal_roots",
      spendingStyle: "thrifty_resourceful_art_life",
      emotionalOpenness: "open_when_not_rushed",
      longTermGoals: "shared_home_that_protects_art_and_rest",
    },
    relationshipMemories: [
      "chloe_seen_gently",
      "chloe_directed_pose",
      "chloe_shared_review",
      "chloe_repair_presence",
      "chloe_restoration_day",
      "chloe_shared_future",
    ],
    preferredDateTypes: ["gallery_date", "park_walk"],
    conflictEvent: {
      id: "chloe_studio_silence_conflict",
      trigger: "ignored_messages",
      title: "Unread at the Studio Door",
      routeImpact: "Chloe stops initiating vulnerable conversations until the player repairs the emotional miss.",
      doesNotHardFailRoute: true,
      setup: "Ignored messages, low mood, and repeated inattentive dialogue make her feel like her art is being sampled instead of seen.",
      memoriesChecked: ["chloe_seen_gently", "chloe_shared_review"],
      compatibilityChecked: ["affectionStyle", "conflictStyle", "emotionalOpenness"],
      timingWindow: "best repaired during the damaged supplies scene or the next quiet studio night",
      poorResponses: ["critique_before_listening", "offer_generic_inspiration_quote"],
    },
    repairEvent: {
      id: "chloe_studio_supplies_repair",
      action: "help_with_specific_problem",
      title: "Tape, Turpentine, and Staying",
      successDependsOn: ["noticed the damaged supplies", "waited through silence", "helped only where invited"],
      noPurchasedItemRequired: true,
      contextualItemRule: "Replacing Chloe's damaged supplies is allowed only inside this authored flood-repair event; there is no repeatable preferred-item table.",
      choices: [
        "apologize for disappearing when she reached out",
        "replace only the damaged supplies she named after the flood",
        "spend quiet time in the studio without trying to fix every feeling",
      ],
    },
    homeReaction: {
      id: "chloe_home_makeshift_studio",
      likes: ["creative", "cozy"],
      dislikes: ["sterile_showroom"],
      text: "Chloe loves signs of a life being made by hand, especially a corner where mess is allowed to become art.",
    },
    locationBasedEncounter: {
      id: "chloe_open_mic_encounter",
      locationKey: "concert_hall",
      callback: "If the player stayed quiet with her before, she invites them backstage instead of hiding after the song.",
    },
    longTermRelationshipScene: {
      id: "chloe_home_studio_future",
      premise: "Chloe asks whether a shared future can include uneven income, late-night work, and a room for unfinished canvases.",
      compatibilityChecks: ["spendingStyle", "longTermGoals", "emotionalOpenness"],
    },
    legacyFamilyReaction: {
      id: "chloe_family_roots_reaction",
      text: "Chloe's family history is loving and chaotic; she trusts a player who does not romanticize or judge it.",
    },
    choiceCallbacks: [
      "chloe_gallery_confidence_callback",
      "chloe_flood_supplies_callback",
      "chloe_quiet_studio_callback",
    ],
  },
};

export const NPCS = [...BASE_NPCS, ...PHASE2_NPCS].map((npc) => ({
  ...npc,
  romanceArc: npc.romanceArc || makePhase2RomanceArc(npc.id, npc.name),
  ...(CORE_RELATIONSHIP_CONTENT[npc.id] || {}),
}));
