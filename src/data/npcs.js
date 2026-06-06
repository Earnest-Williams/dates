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
  ],
  // Phase 2 - New NPC Romance Arcs
  liam: [
    { id: "liam_intro", type: "introduction", minRelationship: 0, title: "Gym Challenge", prompt: "Liam spots you at the gym and asks if you're up for a friendly competition. His competitive spirit is matched only by his loyalty to friends.", emotionalBeat: "Competitive energy with underlying loyalty.", choices: [{ text: "Accept the challenge with confidence.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "liam_competitive_spirit" }, { text: "Suggest teaming up instead of competing.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "liam_team_player" }, { text: "Decline, saying you prefer solo workouts.", checkStat: "fitness", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "liam_respects_boundaries" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "liam_felt_rejected" } }] },
    { id: "liam_early", type: "early connection", minRelationship: 18, title: "Training Partner", prompt: "Liam asks you to be his training partner for an upcoming marathon. His dedication is inspiring, but he's hiding a fear of failure.", emotionalBeat: "Dedication masking fear of failure.", choices: [{ text: "Agree and create a detailed training plan together.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "liam_training_plan" }, { text: "Accept but suggest focusing on fun, not just results.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "liam_fun_focus" }, { text: "Decline, saying you're not marathon-ready.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "liam_understands_limits" }] },
    { id: "liam_reveal", type: "personal reveal", minRelationship: 35, title: "Old Injury", prompt: "Liam reveals he has an old knee injury that might prevent him from competing professionally. His usual confidence wavers as he shares this vulnerability.", emotionalBeat: "Confidence wavering with vulnerability.", choices: [{ text: "Tell him his worth isn't tied to competition.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "liam_worth_affirmed" }, { text: "Suggest adaptive sports he could excel at.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "liam_adaptive_sports" }, { text: "Offer to help with physical therapy.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "liam_therapy_support" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "liam_appreciates_effort" } }] },
    { id: "liam_conflict", type: "conflict", minRelationship: 52, title: "Missed Training Session", prompt: "You miss a training session without notice, and Liam is visibly disappointed. His trust has been shaken, and he's questioning your commitment.", emotionalBeat: "Trust shaken, questioning commitment.", choices: [{ text: "Make excuses and blame external factors.", relationshipImpact: -6, chemistryImpact: -5, futureCallback: "liam_trust_broken" }, { text: "Apologize sincerely and offer to make it up.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "liam_trust_repaired" }, { text: "Promise it won't happen again without explanation.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "liam_partial_trust" }] },
    { id: "liam_trust", type: "trust event", minRelationship: 70, title: "Race Day Support", sceneTags: ['vulnerability', 'emotional_hunger'], prompt: "On race day, Liam looks nervous. He admits he's scared of letting everyone down. His usual bravado is gone, replaced by raw need for support.", emotionalBeat: "Bravado replaced by raw need for support.", choices: [{ text: "Run beside him the whole way, matching his pace.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 5 }, unlocksMemory: "liam_race_support" }, { text: "Cheer loudly from the sidelines at every checkpoint.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 3 }, unlocksMemory: "liam_sideline_support" }, { text: "Tell him to focus on his time, not others' expectations.", checkStat: "confidence", threshold: 40, onSuccess: { relationshipImpact: 6, chemistryImpact: 6 }, onFail: { relationshipImpact: 3, chemistryImpact: 2 } }] },
    { id: "liam_commitment", type: "commitment event", minRelationship: 90, title: "Training for Two", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Liam pulls you close after a victory, his competitive fire now directed entirely at you. 'I want to train for something more permanent,' he murmurs, his hands tracing the lines of your body.", emotionalBeat: "Competitive fire redirected to intimacy.", choices: [{ text: "Tell him you're ready for that kind of training.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "liam_permanent_training" }, { text: "Challenge him to prove his commitment first.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 7, implication: 8, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "liam_proves_commitment" }, { text: "Keep things casual for now.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "liam_casual_approach" }] }
  ],
  ava: [
    { id: "ava_intro", type: "introduction", minRelationship: 0, title: "Bookstore Encounter", prompt: "Ava notices you browsing the philosophy section and strikes up a conversation about existentialism. Her intellectual curiosity is matched by a dry wit.", emotionalBeat: "Intellectual curiosity with dry wit.", choices: [{ text: "Engage deeply with her philosophical questions.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "ava_philosophical_connection" }, { text: "Admit you prefer lighter reading material.", relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "ava_honest_preference" }, { text: "Pretend to know more than you do.", checkStat: "intelligence", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 5, unlocksMemory: "ava_impressed_by_knowledge" }, onFail: { relationshipImpact: -3, chemistryImpact: -3, futureCallback: "ava_sees_through_bluff" } }] },
    { id: "ava_early", type: "early connection", minRelationship: 18, title: "Debate Night", prompt: "Ava invites you to a debate club meeting. She's passionate about her arguments but gets frustrated when others don't engage seriously.", emotionalBeat: "Passion for serious engagement.", choices: [{ text: "Prepare thoroughly and challenge her arguments.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ava_intellectual_sparring" }, { text: "Listen carefully and ask insightful questions.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "ava_thoughtful_listener" }, { text: "Agree with everything she says to avoid conflict.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "ava_felt_patronized" }] },
    { id: "ava_reveal", type: "personal reveal", minRelationship: 35, title: "Academic Pressure", prompt: "Ava confesses she's struggling with the pressure of her graduate studies. Her usual sharp mind feels overwhelmed, and she's afraid of disappointing her advisors.", emotionalBeat: "Sharp mind overwhelmed by pressure.", choices: [{ text: "Offer to help her study and organize her workload.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "ava_study_support" }, { text: "Encourage her to take a break and recharge.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ava_break_encouragement" }, { text: "Suggest she drop out if it's too much.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "ava_realistic_advice" }, onFail: { relationshipImpact: -5, chemistryImpact: -4, futureCallback: "ava_felt_unsupported" } }] },
    { id: "ava_conflict", type: "conflict", minRelationship: 52, title: "Intellectual Disagreement", prompt: "You and Ava have a heated disagreement about a philosophical topic. She's not just arguing the point—she's questioning whether you truly understand her perspective.", emotionalBeat: "Questioning understanding and connection.", choices: [{ text: "Double down on your position without listening.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "ava_intellectual_rift" }, { text: "Acknowledge her points and find common ground.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ava_common_ground" }, { text: "Agree to disagree and change the subject.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "ava_surface_peace" }] },
    { id: "ava_trust", type: "trust event", minRelationship: 70, title: "Late Night Study Session", sceneTags: ['late_night', 'vulnerability', 'emotional_hunger'], prompt: "Ava invites you to a late-night study session. As the hours pass, her intellectual guard drops, and she admits she's been lonely despite being surrounded by people.", emotionalBeat: "Intellectual guard dropping, admitting loneliness.", choices: [{ text: "Tell her loneliness is different from being alone.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "ava_loneliness_understood" }, { text: "Offer to be her study partner regularly.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 5, implication: 5, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "ava_regular_partner" }, { text: "Suggest she needs to socialize more.", checkStat: "socialIq", threshold: 40, onSuccess: { relationshipImpact: 4, chemistryImpact: 3 }, onFail: { relationshipImpact: -2, chemistryImpact: -2 } }] },
    { id: "ava_commitment", type: "commitment event", minRelationship: 90, title: "Thesis Defense", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Ava's thesis defense is approaching. She pulls you close in her office, her usual sharp wit softened by vulnerability. 'I need to know you'll be there, not just physically but... in every way that matters.'", emotionalBeat: "Sharp wit softened by vulnerability and need.", choices: [{ text: "Promise to be her anchor through the defense and beyond.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 6, implication: 8, emotionalRisk: 9, publicRisk: 0 }, unlocksMemory: "ava_anchor_promise" }, { text: "Tell her you believe in her mind as much as her heart.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 7, implication: 7, emotionalRisk: 8, publicRisk: 0 }, futureCallback: "ava_intellectual_devotion" }, { text: "Keep your support more casual.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "ava_casual_support" }] }
  ],
  ethan: [
    { id: "ethan_intro", type: "introduction", minRelationship: 0, title: "Coffee Shop Musician", prompt: "Ethan is playing an acoustic set at the coffee shop. He notices you listening attentively and invites you to join him for the next song. His musical talent is matched by a gentle, introspective nature.", emotionalBeat: "Musical talent with gentle introspection.", choices: [{ text: "Accept and sing along, even if imperfectly.", relationshipImpact: 9, chemistryImpact: 9, unlocksMemory: "ethan_musical_connection" }, { text: "Politely decline but compliment his playing.", relationshipImpact: 6, chemistryImpact: 5, unlocksMemory: "ethan_appreciated" }, { text: "Suggest he play something more upbeat.", checkStat: "music", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "ethan_takes_suggestion" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "ethan_felt_criticized" } }] },
    { id: "ethan_early", type: "early connection", minRelationship: 18, title: "Open Mic Night", prompt: "Ethan invites you to an open mic night where he's performing. He's nervous about playing original songs and asks if you'll be in the audience for moral support.", emotionalBeat: "Nervous about sharing original work.", choices: [{ text: "Arrive early and sit in the front row.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ethan_front_row_support" }, { text: "Bring friends to cheer him on.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "ethan_group_support" }, { text: "Tell him you'll come but don't show up.", relationshipImpact: -10, chemistryImpact: -8, futureCallback: "ethan_broken_trust" }] },
    { id: "ethan_reveal", type: "personal reveal", minRelationship: 35, title: "Writer's Block", prompt: "Ethan confesses he's been struggling with writer's block for months. His usual creative flow has dried up, and he's afraid he's lost his musical voice forever.", emotionalBeat: "Creative flow dried up, fear of losing voice.", choices: [{ text: "Tell him every artist goes through dry spells.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "ethan_dry_spell_comfort" }, { text: "Suggest a change of scenery to inspire him.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "ethan_scenery_change" }, { text: "Offer to collaborate on a new song.", checkStat: "creativity", threshold: 35, onSuccess: { relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ethan_collaboration_offer" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "ethan_appreciates_offer" } }] },
    { id: "ethan_conflict", type: "conflict", minRelationship: 52, title: "Creative Differences", prompt: "You and Ethan have a disagreement about the direction of a song you're working on together. He feels you're not respecting his artistic vision, and his gentle nature is strained.", emotionalBeat: "Gentle nature strained by creative tension.", choices: [{ text: "Insist your way is better without compromise.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "ethan_creative_rift" }, { text: "Find a middle ground that incorporates both visions.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "ethan_creative_compromise" }, { text: "Let him have full creative control.", relationshipImpact: 5, chemistryImpact: 6, futureCallback: "ethan_respects_autonomy" }] },
    { id: "ethan_trust", type: "trust event", minRelationship: 70, title: "Unreleased Song", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "Ethan plays you a song he's never performed for anyone else. His voice is raw with emotion as he shares something deeply personal. The melody lingers in the air between you.", emotionalBeat: "Raw emotion shared through music.", choices: [{ text: "Tell him it's the most beautiful thing you've ever heard.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "ethan_song_praise" }, { text: "Ask him to teach you how to play it.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "ethan_teaches_song" }, { text: "Suggest he record it professionally.", checkStat: "negotiation", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "ethan_commitment", type: "commitment event", minRelationship: 90, title: "Duet of Hearts", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Ethan hands you a guitar, his eyes reflecting the soft light of the studio. 'I wrote this for you,' he says, starting to play a melody that feels like it was composed from your shared memories. He wants to know if you're ready to make music together for a lifetime.", emotionalBeat: "Melody of shared memories, lifetime commitment.", choices: [{ text: "Take the guitar and play the harmony he's been waiting for.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "ethan_duet_commitment" }, { text: "Sing the lyrics you've been writing in your heart.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "ethan_lyrical_response" }, { text: "Listen quietly, not ready to join in yet.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "ethan_waiting_for_harmony" }] }
  ],
  olivia: [
    { id: "olivia_intro", type: "introduction", minRelationship: 0, title: "Art Gallery Opening", prompt: "Olivia is curating an art gallery opening. She notices your appreciation for a particular piece and strikes up a conversation about modern art. Her passion for creativity is infectious.", emotionalBeat: "Passion for creativity and artistic expression.", choices: [{ text: "Share your own thoughts on the artwork's meaning.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "olivia_artistic_connection" }, { text: "Ask her to explain the artist's intent.", relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "olivia_educates" }, { text: "Criticize the modern art movement.", checkStat: "style", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "olivia_debates_art" }, onFail: { relationshipImpact: -3, chemistryImpact: -3, futureCallback: "olivia_felt_judged" } }] },
    { id: "olivia_early", type: "early connection", minRelationship: 18, title: "Studio Visit", prompt: "Olivia invites you to visit her art studio. She's working on a new collection and seems excited to share her creative process with someone who appreciates art.", emotionalBeat: "Excitement to share creative process.", choices: [{ text: "Ask insightful questions about her artistic choices.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "olivia_artistic_dialogue" }, { text: "Offer to help with practical aspects of her work.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "olivia_practical_support" }, { text: "Suggest she should create more commercial work.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "olivia_commercial_tension" }] },
    { id: "olivia_reveal", type: "personal reveal", minRelationship: 35, title: "Creative Block", prompt: "Olivia confesses she's been struggling with a creative block for weeks. Her usual confidence in her artistic vision is shaken, and she's afraid she's losing her touch.", emotionalBeat: "Confidence shaken by creative block.", choices: [{ text: "Tell her every artist faces creative droughts.", relationshipImpact: 9, chemistryImpact: 8, unlocksMemory: "olivia_creative_drought_comfort" }, { text: "Suggest a collaborative project to spark inspiration.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "olivia_collaborative_spark" }, { text: "Offer to be her muse and pose for a portrait.", checkStat: "charisma", threshold: 35, onSuccess: { relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "olivia_muse_offer" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "olivia_appreciates_offer" } }] },
    { id: "olivia_conflict", type: "conflict", minRelationship: 52, title: "Artistic Criticism", prompt: "You accidentally criticize one of Olivia's favorite pieces in front of her colleagues. She feels betrayed and questions whether you truly understand her artistic vision.", emotionalBeat: "Feeling betrayed and misunderstood.", choices: [{ text: "Double down on your criticism without apology.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "olivia_artistic_rift" }, { text: "Apologize sincerely and ask how to better appreciate her work.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "olivia_artistic_understanding" }, { text: "Blame it on not knowing it was her favorite piece.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "olivia_partial_apology" }] },
    { id: "olivia_trust", type: "trust event", minRelationship: 70, title: "Private Collection", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "Olivia shows you her private collection of unfinished works. She admits these are the pieces that are too personal to display publicly. Her vulnerability is palpable as she shares her artistic soul.", emotionalBeat: "Sharing artistic soul with vulnerability.", choices: [{ text: "Tell her these are her most beautiful works because they're authentic.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "olivia_authentic_praise" }, { text: "Ask her to explain the stories behind each unfinished piece.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "olivia_stories_shared" }, { text: "Suggest she should finish them for a gallery show.", checkStat: "negotiation", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "olivia_commitment", type: "commitment event", minRelationship: 90, title: "Artistic Partnership", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Olivia stands before a blank canvas, her eyes reflecting the soft studio lights. 'I want to create something with you that's more than art,' she says, her paintbrush tracing the air between you. 'I want to create a life.'", emotionalBeat: "Creating life together through art and love.", choices: [{ text: "Take the paintbrush and add your stroke to the canvas of your future.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "olivia_canvas_commitment" }, { text: "Tell her you want to be her greatest masterpiece.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "olivia_masterpiece_response" }, { text: "Suggest you think about it more before committing.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "olivia_cautious_approach" }] }
  ],
  noah: [
    { id: "noah_intro", type: "introduction", minRelationship: 0, title: "Tech Startup Pitch", prompt: "Noah is pitching his latest tech startup idea at a networking event. He notices your interest and asks for your opinion on his business model. His entrepreneurial spirit is matched by a genuine desire to solve real problems.", emotionalBeat: "Entrepreneurial spirit with problem-solving focus.", choices: [{ text: "Ask insightful questions about his business model.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "noah_business_connection" }, { text: "Offer constructive feedback on his pitch.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "noah_constructive_feedback" }, { text: "Tell him his idea will never work.", checkStat: "finance", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "noah_realistic_feedback" }, onFail: { relationshipImpact: -3, chemistryImpact: -3, futureCallback: "noah_felt_dismissed" } }] },
    { id: "noah_early", type: "early connection", minRelationship: 18, title: "Hackathon Invitation", prompt: "Noah invites you to join his team for a weekend hackathon. He's excited about the potential of collaborative innovation and wants to see if you share his passion for technology.", emotionalBeat: "Excitement for collaborative innovation.", choices: [{ text: "Accept and suggest a specific role you can play.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "noah_team_role" }, { text: "Accept but admit you're not very technical.", relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "noah_honest_about_skills" }, { text: "Decline, saying you have other commitments.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "noah_understands_priorities" }] },
    { id: "noah_reveal", type: "personal reveal", minRelationship: 35, title: "Startup Failure", prompt: "Noah confesses that his last startup failed spectacularly, leaving him with significant debt. His usual confidence is replaced by vulnerability as he shares his fear of repeating past mistakes.", emotionalBeat: "Confidence replaced by vulnerability about past failures.", choices: [{ text: "Tell him failure is just data for the next attempt.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "noah_failure_as_data" }, { text: "Offer to help him analyze what went wrong.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "noah_analysis_support" }, { text: "Suggest he should play it safer this time.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "noah_cautious_advice" }, onFail: { relationshipImpact: 3, chemistryImpact: 2, futureCallback: "noah_appreciates_concern" } }] },
    { id: "noah_conflict", type: "conflict", minRelationship: 52, title: "Work-Life Balance", prompt: "Noah has been working 80-hour weeks on his startup and cancels your plans last minute for the third time. His dedication to his vision is straining your relationship, and he doesn't seem to notice.", emotionalBeat: "Dedication straining relationship through neglect.", choices: [{ text: "Tell him his startup isn't more important than your relationship.", relationshipImpact: -6, chemistryImpact: -5, futureCallback: "noah_priority_conflict" }, { text: "Express your feelings and ask for dedicated quality time.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "noah_quality_time_request" }, { text: "Accept his priorities without complaint.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "noah_unquestioning_support" }] },
    { id: "noah_trust", type: "trust event", minRelationship: 70, title: "Product Launch Night", sceneTags: ['late_night', 'vulnerability', 'emotional_hunger'], prompt: "On the night before his big product launch, Noah is a bundle of nerves. He admits he's terrified of failing again and asks if you believe in him. His usual entrepreneurial bravado is gone, replaced by raw need for reassurance.", emotionalBeat: "Entrepreneurial bravado replaced by raw need for reassurance.", choices: [{ text: "Tell him you believe in him more than he believes in himself.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "noah_belief_affirmed" }, { text: "Remind him of all the problems he's already solved.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "noah_problems_solved" }, { text: "Offer to help with the final launch preparations.", checkStat: "programming", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 6 }, onFail: { relationshipImpact: 3, chemistryImpact: 2 } }] },
    { id: "noah_commitment", type: "commitment event", minRelationship: 90, title: "Co-Founder Proposal", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Noah takes your hands in his, his eyes reflecting the glow of his computer screen. 'I've been building this company, but I realize now that I want to build something more important with you,' he says. 'Will you be my co-founder in life?'", emotionalBeat: "Building life together as partners and co-founders.", choices: [{ text: "Accept and tell him you're ready to build a future together.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "noah_cofounder_commitment" }, { text: "Ask him to pitch his vision for your life together.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "noah_life_pitch" }, { text: "Tell him you need time to consider the offer.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "noah_considering_offer" }] }
  ],
  isabella: [
    { id: "isabella_intro", type: "introduction", minRelationship: 0, title: "Fashion Week Backstage", prompt: "Isabella is backstage at a fashion show, making final adjustments to a model's outfit. She notices your interest in the process and explains the artistry behind fashion design. Her creativity and attention to detail are evident in every stitch.", emotionalBeat: "Creativity and attention to detail in fashion.", choices: [{ text: "Ask her about the inspiration behind her latest collection.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "isabella_design_connection" }, { text: "Compliment the craftsmanship of her work.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "isabella_craftsmanship_praise" }, { text: "Suggest she should design more practical clothing.", checkStat: "style", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "isabella_practical_suggestion" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "isabella_felt_criticized" } }] },
    { id: "isabella_early", type: "early connection", minRelationship: 18, title: "Fabric Shopping", prompt: "Isabella invites you to join her on a fabric shopping trip. She's looking for the perfect materials for her next collection and values your opinion on textures and colors.", emotionalBeat: "Valuing opinion on textures and colors.", choices: [{ text: "Offer thoughtful insights on color combinations.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "isabella_color_insights" }, { text: "Ask her to teach you about different fabric types.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "isabella_fabric_education" }, { text: "Complain about the high cost of quality fabrics.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "isabella_cost_concern" }] },
    { id: "isabella_reveal", type: "personal reveal", minRelationship: 35, title: "Family Legacy", prompt: "Isabella confesses that her family has a long history in fashion, and she feels immense pressure to live up to their legacy. Her usual confidence in her designs is shaken by the weight of expectations.", emotionalBeat: "Confidence shaken by family legacy pressure.", choices: [{ text: "Tell her she's creating her own legacy, not just continuing one.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "isabella_own_legacy" }, { text: "Offer to help her research her family's fashion history.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "isabella_family_research" }, { text: "Suggest she should distance herself from family expectations.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "isabella_distance_advice" }, onFail: { relationshipImpact: 3, chemistryImpact: 2, futureCallback: "isabella_appreciates_concern" } }] },
    { id: "isabella_conflict", type: "conflict", minRelationship: 52, title: "Creative Control", prompt: "Isabella's business partner wants to take her designs in a more commercial direction, and she's torn between artistic integrity and financial success. She asks for your opinion, but your response feels like a judgment on her values.", emotionalBeat: "Torn between artistic integrity and financial success.", choices: [{ text: "Tell her she should prioritize money over artistic vision.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "isabella_artistic_betrayal" }, { text: "Support her artistic vision and offer to help find a compromise.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "isabella_artistic_support" }, { text: "Suggest she should listen to her business partner's experience.", relationshipImpact: 5, chemistryImpact: 5, futureCallback: "isabella_balanced_advice" }] },
    { id: "isabella_trust", type: "trust event", minRelationship: 70, title: "Fitting Room Confession", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "Isabella invites you to a private fitting for her latest collection. As she adjusts the garments on you, she admits she's been feeling vulnerable about her body and her work. Her usual professional demeanor drops, revealing a need for intimate connection.", emotionalBeat: "Professional demeanor dropping, revealing vulnerability.", choices: [{ text: "Tell her she's beautiful in every way, inside and out.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "isabella_beauty_affirmed" }, { text: "Ask her to design something specifically for you.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 6, implication: 8, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "isabella_personal_design" }, { text: "Suggest she should showcase her work in a fashion show.", checkStat: "negotiation", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "isabella_commitment", type: "commitment event", minRelationship: 90, title: "Custom Design Proposal", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Isabella drapes a beautiful fabric over your shoulders, her fingers lingering as she meets your eyes. 'I want to design a life with you as carefully as I design my collections,' she whispers. 'Will you be my forever muse?'", emotionalBeat: "Designing life together as carefully as fashion collections.", choices: [{ text: "Accept and tell her you want to be her masterpiece.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "isabella_masterpiece_commitment" }, { text: "Ask her to sketch her vision for your future together.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "isabella_future_sketch" }, { text: "Tell her you need time to consider her proposal.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "isabella_considering_proposal" }] }
  ],
  james: [
    { id: "james_intro", type: "introduction", minRelationship: 0, title: "Law Library Meeting", prompt: "James is studying in the law library when you ask if you can share his table. He's initially reserved but warms up when he realizes you're genuinely interested in his work. His intellectual intensity is matched by a dry sense of humor.", emotionalBeat: "Intellectual intensity with dry humor.", choices: [{ text: "Ask him about the case he's studying.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "james_legal_connection" }, { text: "Share your own thoughts on the legal system.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "james_legal_dialogue" }, { text: "Tell him law seems boring compared to other fields.", checkStat: "intelligence", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "james_respects_opinion" }, onFail: { relationshipImpact: -3, chemistryImpact: -3, futureCallback: "james_felt_judged" } }] },
    { id: "james_early", type: "early connection", minRelationship: 18, title: "Mock Trial", prompt: "James invites you to watch him in a mock trial competition. He's nervous about performing under pressure but determined to prove himself. His competitive nature is tempered by a genuine desire to help others.", emotionalBeat: "Competitive nature tempered by desire to help.", choices: [{ text: "Attend and take notes on his performance.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "james_performance_notes" }, { text: "Wish him luck and offer encouragement.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "james_encouragement" }, { text: "Tell him mock trials aren't real law practice.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "james_practical_perspective" }] },
    { id: "james_reveal", type: "personal reveal", minRelationship: 35, title: "Pro Bono Dilemma", prompt: "James confesses he's been struggling with the ethical dilemmas of corporate law. He feels torn between the financial security it provides and his desire to do pro bono work that truly helps people.", emotionalBeat: "Torn between financial security and ethical fulfillment.", choices: [{ text: "Tell him integrity is more important than money.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "james_integrity_first" }, { text: "Suggest he find a balance between both types of work.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "james_balance_advice" }, { text: "Offer to help him research pro bono opportunities.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "james_pro_bono_support" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "james_appreciates_effort" } }] },
    { id: "james_conflict", type: "conflict", minRelationship: 52, title: "Case Disagreement", prompt: "You and James have a heated disagreement about a legal case he's working on. He feels you're being naive about how the legal system works, and his patience is wearing thin.", emotionalBeat: "Patience wearing thin over legal disagreement.", choices: [{ text: "Insist your perspective is the only moral one.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "james_moral_rift" }, { text: "Acknowledge the complexity and ask to understand his position better.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "james_complexity_understood" }, { text: "Agree to disagree on this particular case.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "james_agree_to_disagree" }] },
    { id: "james_trust", type: "trust event", minRelationship: 70, title: "Late Night Deposition Review", sceneTags: ['late_night', 'vulnerability', 'emotional_hunger'], prompt: "James is reviewing deposition transcripts late at night and looks exhausted. He admits he's been feeling overwhelmed by the responsibility of his cases and the lives they affect. His usual professional demeanor drops, revealing a need for emotional support.", emotionalBeat: "Professional demeanor dropping, revealing emotional need.", choices: [{ text: "Tell him the law needs people like him who truly care.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "james_caring_affirmed" }, { text: "Offer to help him organize his case files.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 3, implication: 5, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "james_case_support" }, { text: "Suggest he take a vacation to recharge.", checkStat: "socialIq", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "james_commitment", type: "commitment event", minRelationship: 90, title: "Legal Partnership", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "James stands before his law library, the soft light catching the serious expression in his eyes. 'I've been building my career, but I realize now that I want to build a partnership with you,' he says, taking your hand. 'Will you be my partner in life and in justice?'", emotionalBeat: "Building partnership in life and justice.", choices: [{ text: "Accept and tell him you want to stand beside him in every courtroom of life.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "james_partnership_commitment" }, { text: "Ask him to present his case for your future together.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "james_future_case" }, { text: "Tell him you need to review the terms before committing.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "james_reviewing_terms" }] }
  ],
  sofia: [
    { id: "sofia_intro", type: "introduction", minRelationship: 0, title: "Dance Studio Warm-up", prompt: "Sofia is warming up at the dance studio when she notices you watching. She invites you to join her for a quick dance lesson. Her grace and passion for movement are evident in every step.", emotionalBeat: "Grace and passion for movement.", choices: [{ text: "Accept and try to follow her lead.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "sofia_dance_connection" }, { text: "Admit you have two left feet but appreciate her artistry.", relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "sofia_appreciates_artistry" }, { text: "Suggest she should try a different style of dance.", checkStat: "fitness", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "sofia_style_suggestion" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "sofia_felt_criticized" } }] },
    { id: "sofia_early", type: "early connection", minRelationship: 18, title: "Recital Preparation", prompt: "Sofia invites you to watch her prepare for an important dance recital. She's nervous about performing a new choreography and asks for your support. Her dedication to her craft is inspiring.", emotionalBeat: "Dedication to craft with performance nerves.", choices: [{ text: "Attend every rehearsal and offer constructive feedback.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "sofia_rehearsal_support" }, { text: "Bring flowers and wish her luck.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "sofia_luck_wishes" }, { text: "Tell her she should focus on technique over artistry.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "sofia_technique_focus" }] },
    { id: "sofia_reveal", type: "personal reveal", minRelationship: 35, title: "Injury Recovery", prompt: "Sofia confesses she's been struggling with a dance injury that might end her performing career. Her usual confidence is shaken as she faces the possibility of never dancing professionally again.", emotionalBeat: "Confidence shaken by career-threatening injury.", choices: [{ text: "Tell her her artistry transcends physical performance.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "sofia_artistry_transcends" }, { text: "Suggest she explore choreography or teaching.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "sofia_new_directions" }, { text: "Offer to help with her physical therapy.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "sofia_therapy_support" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "sofia_appreciates_effort" } }] },
    { id: "sofia_conflict", type: "conflict", minRelationship: 52, title: "Missed Performance", prompt: "Sofia has to cancel a performance last minute due to her injury, and you express disappointment about missing the show. She feels you don't understand the depth of her struggle and withdraws emotionally.", emotionalBeat: "Feeling misunderstood in struggle.", choices: [{ text: "Tell her she's being overly dramatic about her injury.", relationshipImpact: -7, chemistryImpact: -6, futureCallback: "sofia_emotional_rift" }, { text: "Apologize and ask how you can better support her recovery.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "sofia_recovery_support" }, { text: "Suggest she should push through the pain for the performance.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "sofia_painful_advice" }] },
    { id: "sofia_trust", type: "trust event", minRelationship: 70, title: "Private Dance Lesson", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], prompt: "Sofia offers you a private dance lesson, her way of sharing her passion when words fail her. As she guides your movements, her usual professional distance melts away, replaced by an intimate connection through movement.", emotionalBeat: "Professional distance melting into intimate connection.", choices: [{ text: "Tell her this is the most beautiful dance you've ever experienced.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "sofia_beautiful_dance" }, { text: "Ask her to teach you her favorite dance.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 6, implication: 8, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "sofia_favorite_dance" }, { text: "Suggest she should perform this dance publicly.", checkStat: "charisma", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "sofia_commitment", type: "commitment event", minRelationship: 90, title: "Dance of Forever", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Sofia takes your hands in the empty dance studio, the mirrors reflecting your intertwined figures. 'I've been dancing my whole life, but I've never found a partner who moves with my soul like you do,' she whispers. 'Will you dance with me forever?'", emotionalBeat: "Dancing forever with soul connection.", choices: [{ text: "Accept and pull her close, promising to match her every step.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "sofia_forever_dance" }, { text: "Ask her to choreograph your life together.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "sofia_life_choreography" }, { text: "Tell her you need to think about the commitment.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "sofia_considering_commitment" }] }
  ],
  emma: [
    { id: "emma_intro", type: "introduction", minRelationship: 0, title: "Community Garden", prompt: "Emma is tending to her plot in the community garden when she notices your interest in her organic vegetables. She offers you some fresh herbs and explains her passion for sustainable living. Her warmth and connection to nature are immediately apparent.", emotionalBeat: "Warmth and connection to nature.", choices: [{ text: "Ask her about her gardening techniques.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "emma_gardening_connection" }, { text: "Compliment the quality of her produce.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "emma_produce_praise" }, { text: "Suggest she should use pesticides for better yields.", checkStat: "culinary", threshold: 30, onSuccess: { relationshipImpact: 4, chemistryImpact: 3, unlocksMemory: "emma_practical_suggestion" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "emma_felt_criticized" } }] },
    { id: "emma_early", type: "early connection", minRelationship: 18, title: "Farmers Market", prompt: "Emma invites you to join her at the farmers market where she sells her organic produce. She's passionate about connecting people with fresh, locally grown food and wants to share this experience with you.", emotionalBeat: "Passion for connecting people with fresh food.", choices: [{ text: "Help her set up and manage her market stall.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "emma_market_support" }, { text: "Ask her to teach you about seasonal produce.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "emma_seasonal_education" }, { text: "Complain about the early morning wake-up time.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "emma_understands_limits" }] },
    { id: "emma_reveal", type: "personal reveal", minRelationship: 35, title: "Family Farm Legacy", prompt: "Emma confesses that her family has owned a farm for generations, but she chose to leave to make her own way. She feels guilty about this decision and wonders if she made the right choice.", emotionalBeat: "Guilt about leaving family legacy.", choices: [{ text: "Tell her making her own path is just as valid as continuing the family tradition.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "emma_own_path" }, { text: "Offer to visit her family farm with her.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "emma_farm_visit" }, { text: "Suggest she should return to the family business.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 6, chemistryImpact: 6, unlocksMemory: "emma_return_advice" }, onFail: { relationshipImpact: 3, chemistryImpact: 2, futureCallback: "emma_appreciates_concern" } }] },
    { id: "emma_conflict", type: "conflict", minRelationship: 52, title: "Market Competition", prompt: "A new vendor at the farmers market starts undercutting Emma's prices, and she's struggling to compete. She feels you don't understand the pressure she's under to maintain her business.", emotionalBeat: "Feeling pressure to maintain business.", choices: [{ text: "Tell her she should just accept the competition and move on.", relationshipImpact: -6, chemistryImpact: -5, futureCallback: "emma_unsupported" }, { text: "Offer to help her find creative solutions to stand out.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "emma_creative_solutions" }, { text: "Suggest she should lower her prices to match the competition.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "emma_price_advice" }] },
    { id: "emma_trust", type: "trust event", minRelationship: 70, title: "Harvest Moon Dinner", sceneTags: ['late_night', 'vulnerability', 'emotional_hunger'], prompt: "Emma prepares a special dinner using ingredients from her garden. As you share the meal under the harvest moon, she admits she's been feeling lonely despite being surrounded by her community. Her usual cheerful demeanor drops, revealing a deep need for connection.", emotionalBeat: "Cheerful demeanor dropping, revealing need for connection.", choices: [{ text: "Tell her she's the heart of her community and you're lucky to be part of it.", relationshipImpact: 9, chemistryImpact: 10, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "emma_community_heart" }, { text: "Ask her to teach you how to cook with her garden ingredients.", relationshipImpact: 7, chemistryImpact: 8, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "emma_cooking_lesson" }, { text: "Suggest she should expand her garden to include more variety.", checkStat: "culinary", threshold: 35, onSuccess: { relationshipImpact: 5, chemistryImpact: 4 }, onFail: { relationshipImpact: 2, chemistryImpact: 1 } }] },
    { id: "emma_commitment", type: "commitment event", minRelationship: 90, title: "Garden of Love", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Emma leads you to a secluded part of her garden, where the moonlight filters through the leaves. 'I've been growing this garden, but I realize now that I want to grow something more beautiful with you,' she says, taking your hands in hers. 'Will you help me cultivate a life together?'", emotionalBeat: "Cultivating life together like a garden.", choices: [{ text: "Accept and tell her you want to grow old together in this garden.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "emma_garden_commitment" }, { text: "Ask her to plant a tree with you as a symbol of your future.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "emma_tree_planting" }, { text: "Tell her you need time to consider her proposal.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "emma_considering_proposal" }] }
  ],
  alexander: [
    { id: "alexander_intro", type: "introduction", minRelationship: 0, title: "Architecture Studio", prompt: "Alexander is working on blueprints in his architecture studio when you ask about his latest project. He explains his vision for sustainable urban design with genuine enthusiasm. His creativity and attention to detail are matched by a quiet confidence.", emotionalBeat: "Creativity and attention to detail in design.", choices: [{ text: "Ask him about the inspiration behind his latest design.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "alexander_design_connection" }, { text: "Compliment the elegance of his architectural vision.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "alexander_vision_praise" }, { text: "Suggest he should focus on more practical, cost-effective designs.", checkStat: "finance", threshold: 30, onSuccess: { relationshipImpact: 5, chemistryImpact: 4, unlocksMemory: "alexander_practical_advice" }, onFail: { relationshipImpact: -2, chemistryImpact: -2, futureCallback: "alexander_felt_criticized" } }] },
    { id: "alexander_early", type: "early connection", minRelationship: 18, title: "Building Site Visit", prompt: "Alexander invites you to visit one of his construction sites. He's excited to show you how his designs are being brought to life and wants to share this experience with someone who appreciates architecture.", emotionalBeat: "Excitement to share architectural vision coming to life.", choices: [{ text: "Ask insightful questions about the construction process.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "alexander_construction_dialogue" }, { text: "Offer to help with practical aspects of the project.", relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "alexander_practical_support" }, { text: "Complain about the noise and dust at the site.", relationshipImpact: 3, chemistryImpact: 2, futureCallback: "alexander_understands_discomfort" }] },
    { id: "alexander_reveal", type: "personal reveal", minRelationship: 35, title: "Mentor's Legacy", prompt: "Alexander confesses that his mentor, a famous architect, recently passed away. He feels immense pressure to live up to his mentor's legacy and is struggling with the weight of these expectations.", emotionalBeat: "Struggling with mentor's legacy expectations.", choices: [{ text: "Tell him he's creating his own architectural voice, not just continuing a legacy.", relationshipImpact: 10, chemistryImpact: 9, unlocksMemory: "alexander_own_voice" }, { text: "Offer to help him organize a retrospective of his mentor's work.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "alexander_retrospective_help" }, { text: "Suggest he should take time to grieve before making major decisions.", checkStat: "empathy", threshold: 40, onSuccess: { relationshipImpact: 7, chemistryImpact: 7, unlocksMemory: "alexander_grief_support" }, onFail: { relationshipImpact: 4, chemistryImpact: 3, futureCallback: "alexander_appreciates_concern" } }] },
    { id: "alexander_conflict", type: "conflict", minRelationship: 52, title: "Design Compromise", prompt: "Alexander has to compromise his design vision to meet a client's budget constraints. He feels you don't understand the artistic sacrifices he's having to make and withdraws emotionally.", emotionalBeat: "Feeling artistic sacrifices are misunderstood.", choices: [{ text: "Tell him he should stand firm on his artistic vision regardless of budget.", relationshipImpact: -6, chemistryImpact: -5, futureCallback: "alexander_artistic_rift" }, { text: "Acknowledge the difficulty and ask how you can support his creative process.", relationshipImpact: 8, chemistryImpact: 8, unlocksMemory: "alexander_creative_support" }, { text: "Suggest he should find clients with bigger budgets.", relationshipImpact: 4, chemistryImpact: 3, futureCallback: "alexander_client_advice" }] },
    { id: "alexander_trust", type: "trust event", minRelationship: 70, title: "Blueprint of the Heart", sceneTags: ['late_night', 'vulnerability', 'emotional_hunger'], prompt: "Alexander shows you the blueprints for his dream home, a project he's been working on secretly. He admits this design represents his vision for a future with someone special. His usual professional demeanor drops, revealing a vulnerable, hopeful side.", emotionalBeat: "Professional demeanor dropping, revealing hopeful vulnerability.", choices: [{ text: "Tell him this is the most beautiful design you've ever seen because it comes from his heart.", relationshipImpact: 9, chemistryImpact: 12, tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "alexander_heart_design" }, { text: "Ask him to explain the symbolism in each part of the design.", relationshipImpact: 7, chemistryImpact: 10, tone: { heat: 4, implication: 6, emotionalRisk: 7, publicRisk: 0 }, unlocksMemory: "alexander_design_symbolism" }, { text: "Suggest he should build this house for your future together.", checkStat: "negotiation", threshold: 35, onSuccess: { relationshipImpact: 6, chemistryImpact: 6 }, onFail: { relationshipImpact: 3, chemistryImpact: 2 } }] },
    { id: "alexander_commitment", type: "commitment event", minRelationship: 90, title: "Foundation of Love", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], prompt: "Alexander stands before his blueprints, the soft light of his studio catching the serious expression in his eyes. 'I've been designing buildings, but I realize now that I want to design a life with you,' he says, taking your hand and placing it over the blueprint of his heart. 'Will you be the foundation of my future?'", emotionalBeat: "Designing life together as architectural foundation.", choices: [{ text: "Accept and tell him you want to be the cornerstone of his every design.", relationshipImpact: 14, chemistryImpact: 15, tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, unlocksMemory: "alexander_cornerstone_commitment" }, { text: "Ask him to draw the blueprint for your shared future.", relationshipImpact: 11, chemistryImpact: 14, tone: { heat: 8, implication: 9, emotionalRisk: 7, publicRisk: 0 }, futureCallback: "alexander_future_blueprint" }, { text: "Tell him you need time to consider his proposal.", relationshipImpact: 2, chemistryImpact: 1, futureCallback: "alexander_considering_proposal" }] }
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
      75: { prompt: "Brad injured his shoulder. Alone in the locker room, his usual bravado shatters, revealing a desperate fear of becoming irrelevant.", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], tone: { heat: 5, implication: 6, emotionalRisk: 9, publicRisk: 2 }, statCheck: "empathy", threshold: 40, successText: "You convince him that recovery is just as important as lifting.", failText: "He stays moody, but appreciates your presence." },
      100: { prompt: "Brad locks the gym doors after hours. His intense energy drops into something raw and heavy. 'I've never let anyone see me like this,' he admits, his hands gripping your waist with desperate possession before pulling you into the shadows of the studio.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 8, emotionalRisk: 8, publicRisk: 3 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
      75: { prompt: "Marcus's startup faces a takeover. Exhausted and running on empty, he pulls you into his office, closing the blinds. 'I need a distraction before I break,' he admits.", sceneTags: ['vulnerability', 'secrecy', 'emotional_hunger'], tone: { heat: 6, implication: 8, emotionalRisk: 8, publicRisk: 5 }, statCheck: "corporate", threshold: 60, successText: "You formulate a 'poison pill' strategy to save his company!", failText: "He loses controlling interest, but you help him through the transition." },
      100: { prompt: "Marcus tosses his phone onto the couch. He pins you with a gaze usually reserved for ruthless negotiations. 'I'm done sharing your attention with the world.' The control slips as his hands slide to your waist, claiming you completely in the quiet of his apartment.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 9, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
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
  },
  // Phase 2 - New NPCs
  {
    id: "liam",
    name: "Liam",
    gender: "male",
    archetype: "GYM_RAT",
    description: "A competitive marathon runner with a loyal heart and a hidden fear of failure.",
    gatedBy: {
      type: "stat",
      stat: "fitness",
      value: 25,
      message: "Liam respects those who take their fitness seriously (Requires Fitness > 25)."
    },
    dialogue: {
      intro: "Hey! I'm training for a marathon. Care to join me for a run?",
      choices: [
        { text: "I'd love to! What's your training schedule? (+Fitness check)", checkStat: "fitness", threshold: 35, successRelation: 25, successText: "Liam grins. 'Perfect! Let's push each other to new limits.'", failRelation: 5, failText: "He nods. 'Good attitude. We'll start with the basics.'" },
        { text: "I prefer solo workouts.", successRelation: -5, successText: "Liam looks disappointed. 'Fair enough. Everyone has their own style.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.liam,
    storyEvents: {
      25: { prompt: "Liam is struggling with his marathon training pace.", statCheck: "fitness", threshold: 40, successText: "You help him adjust his training plan. He sets a new personal best!", failText: "He appreciates your effort but continues with his original plan." },
      50: { prompt: "Liam's old knee injury is flaring up.", statCheck: "empathy", threshold: 30, successText: "You convince him to rest and recover properly.", failText: "He pushes through the pain, but it gets worse." },
      75: { prompt: "Liam is nervous before a big race. In the locker room, his competitive bravado cracks, revealing deep vulnerability.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 5, implication: 6, emotionalRisk: 8, publicRisk: 2 }, statCheck: "confidence", threshold: 40, successText: "You calm his nerves and he runs his best race yet!", failText: "He runs well but feels he could have done better." },
      100: { prompt: "Liam pulls you into the post-race celebration, his competitive energy now directed entirely at you. 'I want to train for something more permanent with you,' he murmurs, his hands tracing your waist as he pulls you close.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "ava",
    name: "Ava",
    gender: "female",
    archetype: "SCHOLAR",
    description: "A philosophy graduate student with sharp intellect and a dry wit.",
    gatedBy: {
      type: "stat",
      stat: "intelligence",
      value: 20,
      message: "Ava enjoys deep conversations with intellectual equals (Requires Intelligence > 20)."
    },
    dialogue: {
      intro: "I couldn't help but notice you browsing the philosophy section. What's your take on existentialism?",
      choices: [
        { text: "I find existentialism fascinating. Let's discuss it! (+Intelligence check)", checkStat: "intelligence", threshold: 35, successRelation: 25, successText: "Ava's eyes light up. 'Finally, someone who gets it!'", failRelation: 5, failText: "She nods. 'Interesting perspective. Tell me more.'" },
        { text: "I prefer lighter reading material.", successRelation: -5, successText: "Ava raises an eyebrow. 'To each their own, I suppose.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.ava,
    storyEvents: {
      25: { prompt: "Ava is preparing for a major debate competition.", statCheck: "intelligence", threshold: 40, successText: "You help her refine her arguments. She wins the competition!", failText: "She does well but doesn't place as high as she hoped." },
      50: { prompt: "Ava is overwhelmed by her graduate studies.", statCheck: "empathy", threshold: 30, successText: "You help her organize her workload and she regains her confidence.", failText: "She struggles through but eventually finds her footing." },
      75: { prompt: "Ava is spiraling after a poor grade on her thesis draft. In her office, her intellectual guard drops completely.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "socialIq", threshold: 40, successText: "You help her see the feedback as constructive and she improves her work.", failText: "She takes time to process but eventually moves forward." },
      100: { prompt: "Ava pulls you close in her office, her usual sharp wit softened by vulnerability. 'I need to know you'll be there for my thesis defense,' she admits, her hands gripping your shirt with unexpected need.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "ethan",
    name: "Ethan",
    gender: "male",
    archetype: "ARTIST",
    description: "A gentle musician with a soulful voice and a deep well of creativity.",
    gatedBy: {
      type: "stat",
      stat: "music",
      value: 15,
      message: "Ethan connects with those who appreciate music (Requires Music > 15)."
    },
    dialogue: {
      intro: "I'm playing a set here. Would you like to join me for a song?",
      choices: [
        { text: "I'd love to! What should we play? (+Music check)", checkStat: "music", threshold: 30, successRelation: 25, successText: "Ethan smiles warmly. 'Let's create something beautiful together.'", failRelation: 5, failText: "He nods. 'No experience needed. I'll guide you.'" },
        { text: "I'm tone deaf, but I appreciate your music.", successRelation: -5, successText: "Ethan laughs softly. 'Appreciation is the most important part.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.ethan,
    storyEvents: {
      25: { prompt: "Ethan is preparing for an important open mic night.", statCheck: "music", threshold: 35, successText: "You help him perfect his set. The audience loves him!", failText: "He does well but feels he could have been better." },
      50: { prompt: "Ethan is struggling with writer's block.", statCheck: "creativity", threshold: 30, successText: "You suggest a change of scenery that inspires him to write a new song!", failText: "He eventually finds inspiration but it takes time." },
      75: { prompt: "Ethan is nervous about performing an original song. Backstage, his gentle nature is strained by performance anxiety.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 3 }, statCheck: "charisma", threshold: 40, successText: "You calm his nerves and he delivers a stunning performance!", failText: "He performs well but feels he didn't connect with the audience." },
      100: { prompt: "Ethan hands you a guitar in his studio, his eyes reflecting the soft light. 'I wrote this for you,' he says, starting to play a melody that feels like your shared memories. He wants to know if you're ready to make music together for a lifetime.", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "olivia",
    name: "Olivia",
    gender: "female",
    archetype: "ARTIST",
    description: "A passionate art curator with a keen eye for beauty and creativity.",
    gatedBy: {
      type: "stat",
      stat: "style",
      value: 20,
      message: "Olivia appreciates those with an eye for beauty (Requires Style > 20)."
    },
    dialogue: {
      intro: "That piece you're admiring is quite special. What do you think it represents?",
      choices: [
        { text: "It speaks to me on a deep level. What's the artist's story? (+Style check)", checkStat: "style", threshold: 35, successRelation: 25, successText: "Olivia smiles. 'I love your perspective! Let me tell you about it.'", failRelation: 5, failText: "She nods. 'Interesting interpretation. Tell me more.'" },
        { text: "I don't really get modern art.", successRelation: -5, successText: "Olivia sighs. 'It's an acquired taste, I suppose.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.olivia,
    storyEvents: {
      25: { prompt: "Olivia is preparing a new art exhibition.", statCheck: "style", threshold: 40, successText: "You help her curate the perfect collection. The exhibition is a huge success!", failText: "The exhibition does well but doesn't get the attention she hoped for." },
      50: { prompt: "Olivia is struggling with a creative block.", statCheck: "creativity", threshold: 30, successText: "You suggest a collaborative project that sparks her inspiration!", failText: "She eventually finds her muse but it takes time." },
      75: { prompt: "Olivia is upset after a critic panned her latest exhibition. In her studio, her usual confidence is shaken.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "charisma", threshold: 40, successText: "You help her see the value in her work despite the criticism.", failText: "She takes time to process but eventually regains her confidence." },
      100: { prompt: "Olivia stands before a blank canvas, her eyes reflecting the soft studio lights. 'I want to create something with you that's more than art,' she says, her paintbrush tracing the air between you. 'I want to create a life.'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "noah",
    name: "Noah",
    gender: "male",
    archetype: "EXECUTIVE",
    description: "An ambitious tech entrepreneur with a vision for innovation and a heart for solving real problems.",
    gatedBy: {
      type: "stat",
      stat: "finance",
      value: 20,
      message: "Noah respects those with business acumen (Requires Finance > 20)."
    },
    dialogue: {
      intro: "I'm working on a startup that's going to change the world. What do you think of my business model?",
      choices: [
        { text: "That sounds fascinating! Tell me more about your vision. (+Finance check)", checkStat: "finance", threshold: 35, successRelation: 25, successText: "Noah's eyes light up. 'You get it! Let me explain the details.'", failRelation: 5, failText: "He nods. 'Good questions. I'll walk you through it.'" },
        { text: "Startups are too risky. I prefer stable employment.", successRelation: -5, successText: "Noah chuckles. 'Risk is where the reward is, my friend.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.noah,
    storyEvents: {
      25: { prompt: "Noah is preparing a pitch for potential investors.", statCheck: "finance", threshold: 40, successText: "You help him refine his financial projections. The investors are impressed!", failText: "The pitch goes well but doesn't get the funding he hoped for." },
      50: { prompt: "Noah is struggling with the pressure of running a startup.", statCheck: "empathy", threshold: 30, successText: "You help him find work-life balance and he becomes more productive.", failText: "He pushes through but feels constantly stressed." },
      75: { prompt: "Noah's startup is facing financial difficulties. In his office, his usual confidence is replaced by vulnerability.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 2 }, statCheck: "negotiation", threshold: 40, successText: "You help him negotiate with creditors and save the company!", failText: "He finds a solution but it takes significant personal sacrifice." },
      100: { prompt: "Noah takes your hands in his, his eyes reflecting the glow of his computer screen. 'I've been building this company, but I realize now that I want to build something more important with you,' he says. 'Will you be my co-founder in life?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "isabella",
    name: "Isabella",
    gender: "female",
    archetype: "SOCIALITE",
    description: "A talented fashion designer with a flair for elegance and a heart for artistic integrity.",
    gatedBy: {
      type: "stat",
      stat: "style",
      value: 25,
      message: "Isabella appreciates those with style and taste (Requires Style > 25)."
    },
    dialogue: {
      intro: "That outfit is... interesting. I could help you improve it if you'd like.",
      choices: [
        { text: "I'd love your fashion advice! What would you suggest? (+Style check)", checkStat: "style", threshold: 35, successRelation: 25, successText: "Isabella smiles. 'I have just the thing in mind for you.'", failRelation: 5, failText: "She nods. 'Let's start with the basics.'" },
        { text: "I like my style just the way it is.", successRelation: -5, successText: "Isabella raises an eyebrow. 'To each their own, I suppose.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.isabella,
    storyEvents: {
      25: { prompt: "Isabella is preparing her latest fashion collection.", statCheck: "style", threshold: 40, successText: "You help her select the perfect fabrics. The collection is a huge hit!", failText: "The collection does well but doesn't get the attention she hoped for." },
      50: { prompt: "Isabella is struggling with the business side of fashion.", statCheck: "finance", threshold: 30, successText: "You help her with the financial planning and she regains her confidence.", failText: "She struggles through but eventually finds her footing." },
      75: { prompt: "Isabella's business partner wants to take her designs in a more commercial direction. In her studio, her usual confidence is shaken.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "negotiation", threshold: 40, successText: "You help her find a compromise that satisfies both artistic and business goals.", failText: "She takes time to process but eventually makes a decision." },
      100: { prompt: "Isabella drapes a beautiful fabric over your shoulders, her fingers lingering as she meets your eyes. 'I want to design a life with you as carefully as I design my collections,' she whispers. 'Will you be my forever muse?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "james",
    name: "James",
    gender: "male",
    archetype: "EXECUTIVE",
    description: "A dedicated lawyer with a sharp legal mind and a commitment to justice.",
    gatedBy: {
      type: "stat",
      stat: "corporate",
      value: 20,
      message: "James respects those with legal or corporate understanding (Requires Corporate > 20)."
    },
    dialogue: {
      intro: "I'm preparing for an important case. Do you have any interest in the law?",
      choices: [
        { text: "The law fascinates me! What kind of case are you working on? (+Corporate check)", checkStat: "corporate", threshold: 35, successRelation: 25, successText: "James nods approvingly. 'Excellent! Let me tell you about it.'", failRelation: 5, failText: "He explains patiently. 'The legal system can be complex.'" },
        { text: "Law seems boring. I prefer more creative pursuits.", successRelation: -5, successText: "James raises an eyebrow. 'Justice is its own kind of art.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.james,
    storyEvents: {
      25: { prompt: "James is preparing for a major court case.", statCheck: "corporate", threshold: 40, successText: "You help him organize his case files. He wins the case!", failText: "He does well but doesn't get the verdict he hoped for." },
      50: { prompt: "James is struggling with the ethical dilemmas of corporate law.", statCheck: "empathy", threshold: 30, successText: "You help him find clarity in his values and he makes a difficult but ethical decision.", failText: "He struggles with the decision but eventually finds his way." },
      75: { prompt: "James is overwhelmed by his caseload. In his office, his usual professional demeanor drops completely.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "socialIq", threshold: 40, successText: "You help him prioritize and delegate effectively.", failText: "He takes time to process but eventually finds balance." },
      100: { prompt: "James stands before his law library, the soft light catching the serious expression in his eyes. 'I've been building my career, but I realize now that I want to build a partnership with you,' he says, taking your hand. 'Will you be my partner in life and in justice?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "sofia",
    name: "Sofia",
    gender: "female",
    archetype: "ARTIST",
    description: "A graceful dancer with a passion for movement and a heart for teaching others.",
    gatedBy: {
      type: "stat",
      stat: "fitness",
      value: 20,
      message: "Sofia appreciates those who value physical expression (Requires Fitness > 20)."
    },
    dialogue: {
      intro: "You have the look of someone who appreciates movement. Would you like to try a dance lesson?",
      choices: [
        { text: "I'd love to learn from you! What style do you teach? (+Fitness check)", checkStat: "fitness", threshold: 35, successRelation: 25, successText: "Sofia smiles warmly. 'Perfect! Let's start with the basics.'", failRelation: 5, failText: "She nods. 'No experience needed. I'll guide you.'" },
        { text: "I have two left feet, but I appreciate your artistry.", successRelation: -5, successText: "Sofia laughs softly. 'Appreciation is the most important part.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.sofia,
    storyEvents: {
      25: { prompt: "Sofia is preparing for an important dance recital.", statCheck: "fitness", threshold: 40, successText: "You help her perfect her routine. The performance is stunning!", failText: "She does well but feels she could have been better." },
      50: { prompt: "Sofia is struggling with a dance injury.", statCheck: "empathy", threshold: 30, successText: "You help her with her physical therapy and she recovers quickly.", failText: "She pushes through but the injury takes time to heal." },
      75: { prompt: "Sofia is nervous about performing a new choreography. Backstage, her usual confidence is replaced by vulnerability.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 5, implication: 7, emotionalRisk: 8, publicRisk: 3 }, statCheck: "charisma", threshold: 40, successText: "You calm her nerves and she delivers a breathtaking performance!", failText: "She performs well but feels she didn't connect with the audience." },
      100: { prompt: "Sofia takes your hands in the empty dance studio, the mirrors reflecting your intertwined figures. 'I've been dancing my whole life, but I've never found a partner who moves with my soul like you do,' she whispers. 'Will you dance with me forever?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "emma",
    name: "Emma",
    gender: "female",
    archetype: "SCHOLAR",
    description: "A warm-hearted organic farmer with a deep connection to nature and community.",
    gatedBy: {
      type: "stat",
      stat: "culinary",
      value: 15,
      message: "Emma connects with those who appreciate fresh, natural food (Requires Culinary > 15)."
    },
    dialogue: {
      intro: "These tomatoes are from my garden. Would you like to try one?",
      choices: [
        { text: "That sounds delicious! What else do you grow? (+Culinary check)", checkStat: "culinary", threshold: 30, successRelation: 25, successText: "Emma smiles warmly. 'I'd love to show you around my garden sometime.'", failRelation: 5, failText: "She nods. 'They're all organic. Very healthy.'" },
        { text: "I prefer store-bought produce.", successRelation: -5, successText: "Emma looks disappointed. 'You don't know what you're missing.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.emma,
    storyEvents: {
      25: { prompt: "Emma is preparing for the farmers market.", statCheck: "culinary", threshold: 35, successText: "You help her harvest and prepare her produce. The market is a huge success!", failText: "The market goes well but she doesn't sell as much as she hoped." },
      50: { prompt: "Emma is struggling with pests in her garden.", statCheck: "empathy", threshold: 30, successText: "You help her find organic solutions and her garden thrives!", failText: "She finds a solution but it takes time." },
      75: { prompt: "Emma is feeling lonely despite her community connections. In her garden, her usual cheerful demeanor drops completely.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "socialIq", threshold: 40, successText: "You help her see how valued she is by her community.", failText: "She takes time to process but eventually feels better." },
      100: { prompt: "Emma leads you to a secluded part of her garden, where the moonlight filters through the leaves. 'I've been growing this garden, but I realize now that I want to grow something more beautiful with you,' she says, taking your hands in hers. 'Will you help me cultivate a life together?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  },
  {
    id: "alexander",
    name: "Alexander",
    gender: "male",
    archetype: "EXECUTIVE",
    description: "A visionary architect with a passion for sustainable design and a quiet confidence.",
    gatedBy: {
      type: "stat",
      stat: "finance",
      value: 20,
      message: "Alexander respects those with an appreciation for design and planning (Requires Finance > 20)."
    },
    dialogue: {
      intro: "I'm working on a sustainable housing project. What do you think about green architecture?",
      choices: [
        { text: "That sounds amazing! Tell me more about your designs. (+Finance check)", checkStat: "finance", threshold: 35, successRelation: 25, successText: "Alexander's eyes light up. 'I'd love to show you my blueprints.'", failRelation: 5, failText: "He nods. 'It's about creating spaces that work with nature.'" },
        { text: "I prefer traditional architecture.", successRelation: -5, successText: "Alexander raises an eyebrow. 'Tradition has its place, but the future needs innovation.'" }
      ]
    },
    romanceArc: ROMANCE_ARCS.alexander,
    storyEvents: {
      25: { prompt: "Alexander is working on a new building design.", statCheck: "finance", threshold: 40, successText: "You help him with the financial planning. The design wins an award!", failText: "The design is good but doesn't get the recognition he hoped for." },
      50: { prompt: "Alexander is struggling with a difficult client.", statCheck: "negotiation", threshold: 30, successText: "You help him find common ground with the client. They reach a satisfactory agreement!", failText: "He eventually finds a solution but it takes significant compromise." },
      75: { prompt: "Alexander is feeling overwhelmed by his mentor's legacy. In his studio, his usual confidence is shaken.", sceneTags: ['vulnerability', 'emotional_hunger'], tone: { heat: 4, implication: 6, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 40, successText: "You help him see that he's creating his own legacy, not just continuing another's.", failText: "He takes time to process but eventually finds his confidence." },
      100: { prompt: "Alexander stands before his blueprints, the soft light of his studio catching the serious expression in his eyes. 'I've been designing buildings, but I realize now that I want to design a life with you,' he says, taking your hand and placing it over the blueprint of his heart. 'Will you be the foundation of my future?'", sceneTags: ['late_night', 'vulnerability', 'longing', 'temptation'], tone: { heat: 7, implication: 8, emotionalRisk: 8, publicRisk: 0 }, statCheck: "empathy", threshold: 0, successText: "The First Night Together... (+100 Mood, +100 Energy, -50 Stress)", failText: "" }
    }
  }
];

export const CORE_NPC_IDS = ["elena", "brad", "sophia", "marcus", "chloe"];

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
  brad: {
    hiddenCompatibilityTraits: {
      ambitionLevel: "steady_self_improvement",
      affectionStyle: "enthusiastic_encouragement_and_presence",
      conflictStyle: "direct_then_needs_reassurance",
      socialPreference: "active_groups_with_private_cooldowns",
      familyOrientation: "protective_team_as_family",
      spendingStyle: "budgeted_health_routines",
      emotionalOpenness: "jokes_first_then_honest",
      longTermGoals: "sustainable_strength_and_shared_routines",
    },
    relationshipMemories: [
      "brad_likes_motivation_talk",
      "brad_trusts_player_prep",
      "brad_identity_beyond_fitness",
      "brad_opens_about_abandonment",
      "brad_firm_coaching_dynamic",
      "brad_committed_routine",
    ],
    preferredDateTypes: ["gym_date", "park_walk"],
    conflictEvent: {
      id: "brad_public_scoreboard_conflict",
      trigger: "jealousy_social_reputation",
      title: "Challenge Board Pressure",
      routeImpact: "Brad loses confidence in the player's support but keeps the route open for repair.",
      doesNotHardFailRoute: true,
      setup: "The player repeatedly turns workouts into public performance and ignores Brad's low mood after an injury.",
      memoriesChecked: ["brad_likes_motivation_talk", "brad_trusts_player_prep"],
      compatibilityChecked: ["conflictStyle", "socialPreference", "emotionalOpenness"],
      timingWindow: "best repaired before the next public gym challenge",
      poorResponses: ["post_his_score_without_permission", "mock_recovery_limits"],
    },
    repairEvent: {
      id: "brad_recovery_walk_repair",
      action: "spend_quiet_time_together",
      title: "No PRs Today",
      successDependsOn: ["respected privacy", "acknowledged injury fear", "chose a low-pressure activity"],
      noPurchasedItemRequired: true,
      contextualItemRule: "A smoothie can be shared after the walk as scene dressing, but it does not function as a repeatable repair gift.",
      choices: [
        "apologize for making confidence a public contest",
        "take a slow recovery walk and let him set the pace",
        "ask his training friend how to support rehab without hovering",
      ],
    },
    homeReaction: {
      id: "brad_home_recovery_space",
      likes: ["fitness", "cozy"],
      dislikes: ["cramped_low_hygiene"],
      text: "Brad lights up at room for stretching, then softens if the space also allows real rest.",
    },
    locationBasedEncounter: {
      id: "brad_park_bootcamp_encounter",
      locationKey: "park",
      callback: "If the player once checked his boundaries, he asks for the same before inviting them into bootcamp.",
    },
    longTermRelationshipScene: {
      id: "brad_sustainable_strength",
      premise: "Brad considers stepping back from constant sponsor challenges to build a healthier routine with the player.",
      compatibilityChecks: ["ambitionLevel", "spendingStyle", "emotionalOpenness"],
    },
    legacyFamilyReaction: {
      id: "brad_team_family_barbecue",
      text: "Brad's clients and gym friends are his family, and he notices whether the player treats them with warmth rather than ego.",
    },
    choiceCallbacks: [
      "brad_sponsor_stream_callback",
      "brad_rehab_walk_callback",
      "brad_private_hype_callback",
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
  marcus: {
    hiddenCompatibilityTraits: {
      ambitionLevel: "very_high_but_rebalancing",
      affectionStyle: "strategic_help_and_kept_promises",
      conflictStyle: "problem_solves_before_feeling",
      socialPreference: "networking_with_deliberate_private_time",
      familyOrientation: "provider_pressure_from_family_history",
      spendingStyle: "investment_first",
      emotionalOpenness: "controlled_until_burnout",
      longTermGoals: "build_something_without_losing_home",
    },
    relationshipMemories: [
      "marcus_relieved_by_structure",
      "marcus_allows_care",
      "marcus_seen_when_tired",
      "marcus_crisis_protocol",
      "marcus_phone_off",
      "marcus_intentional_partnership",
    ],
    preferredDateTypes: ["coffee_date", "fine_dining"],
    conflictEvent: {
      id: "marcus_pitch_deck_promise_conflict",
      trigger: "broken_promises",
      title: "The Missing Meeting Notes",
      routeImpact: "Marcus questions reliability, but the route branches into repair instead of failing.",
      doesNotHardFailRoute: true,
      setup: "The player promised to bring notes from a community meeting, then missed the planned date and minimized his low mood.",
      memoriesChecked: ["marcus_relieved_by_structure", "marcus_allows_care"],
      compatibilityChecked: ["ambitionLevel", "affectionStyle", "conflictStyle"],
      timingWindow: "best repaired before his board meeting story event",
      poorResponses: ["say_it_was_just_notes", "pitch_a_new_promise_without_action"],
    },
    repairEvent: {
      id: "marcus_follow_through_notes_repair",
      action: "follow_through_on_previous_promise",
      title: "Receipts, Not Speeches",
      successDependsOn: ["kept the original promise", "understood his burnout", "timed help before the board meeting"],
      noPurchasedItemRequired: true,
      contextualItemRule: "Bringing meeting notes is valid because it fulfills a specific promise; buying a business accessory cannot clear the conflict.",
      choices: [
        "deliver organized notes from the meeting",
        "apologize for making him manage the reminder",
        "protect one phone-free hour after the work is handled",
      ],
    },
    homeReaction: {
      id: "marcus_home_work_boundary",
      likes: ["organized", "calm"],
      dislikes: ["always_on_office"],
      text: "Marcus admires an efficient home but needs proof that the couch is not just another desk.",
    },
    locationBasedEncounter: {
      id: "marcus_coffee_investor_encounter",
      locationKey: "cafe",
      callback: "If the player once urged real rest, he cuts a meeting short instead of stacking another call.",
    },
    longTermRelationshipScene: {
      id: "marcus_exit_strategy_for_two",
      premise: "Marcus considers a slower growth plan that protects the relationship from permanent crunch time.",
      compatibilityChecks: ["ambitionLevel", "spendingStyle", "longTermGoals"],
    },
    legacyFamilyReaction: {
      id: "marcus_provider_history_reaction",
      text: "Marcus's family history makes security feel like love, and he listens for whether the player understands that pressure.",
    },
    choiceCallbacks: [
      "marcus_boardroom_error_callback",
      "marcus_rest_day_callback",
      "marcus_phone_free_hour",
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

export const NPCS = BASE_NPCS.map((npc) => ({
  ...npc,
  ...(CORE_RELATIONSHIP_CONTENT[npc.id] || {}),
}));
