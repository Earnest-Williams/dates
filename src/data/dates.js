export const DATE_PHASES = ['arrival', 'shared_activity', 'closing_moment'];

export const DATE_TYPE_LABELS = {
  library_date: 'Library Date',
  gym_date: 'Gym Date',
  park_walk: 'Park Walk',
  mall_outing: 'Mall Outing',
  nightclub_date: 'Nightclub Date',
  home_dinner: 'Home Dinner',
  coffee_date: 'Coffee Date',
  movie_night: 'Movie Night',
  study_date: 'Study Date',
  workout_date: 'Workout Date',
  quiet_evening_in: 'Quiet Evening In',
  errands_together: 'Errands Together',
  // Phase 2 - New Date Types
  art_gallery_date: 'Art Gallery Date',
  cooking_class_date: 'Cooking Class Date',
  wine_tasting_date: 'Wine Tasting Date',
  concert_date: 'Concert Date',
  hiking_date: 'Hiking Date',
  beach_date: 'Beach Date',
  museum_date: 'Museum Date',
  comedy_show_date: 'Comedy Show Date',
  dance_lesson_date: 'Dance Lesson Date',
  bookstore_date: 'Bookstore Date',
};

export const NPC_DATE_PREFERENCES = {
  elena: ['library_date', 'study_date', 'quiet_evening_in'],
  sophia: ['nightclub_date', 'mall_outing', 'coffee_date'],
  chloe: ['park_walk', 'movie_night', 'quiet_evening_in'],
  rina: ['nightclub_date', 'coffee_date', 'movie_night'],
  maya: ['park_walk', 'study_date', 'home_dinner'],
  nora: ['coffee_date', 'errands_together', 'study_date'],
};

const makeChoice = ({
  text,
  connection = 0,
  relationship = 0,
  chemistry = 0,
  mood = 0,
  energy = 0,
  discovery = null,
  memory = null,
  callback = null,
  conflict = null,
  repairScene = null,
  preferredArchetypes = [],
  dislikedArchetypes = [],
  checkStat = null,
  threshold = 0,
  success = {},
  fail = {},
}) => ({
  text,
  connection,
  relationship,
  chemistry,
  mood,
  energy,
  discovery,
  memory,
  callback,
  conflict,
  repairScene,
  preferredArchetypes,
  dislikedArchetypes,
  checkStat,
  threshold,
  success,
  fail,
});

export const DATE_TEMPLATES = {
  library_date: {
    id: 'library_date',
    venueKey: 'library',
    title: 'Library Date',
    opportunity: 'A quiet archive table makes careful listening feel intimate.',
    phases: [
      {
        id: 'arrival',
        title: 'Arrival: Find Your Rhythm',
        prompt: 'The library hush changes the pace of the date before either of you speaks.',
        choices: [
          makeChoice({ text: 'Match their quiet pace and ask what shelf drew them in.', connection: 12, relationship: 4, mood: 3, discovery: 'library_late_focus', memory: 'listened_in_the_stacks', preferredArchetypes: ['SCHOLAR', 'ARTIST'] }),
          makeChoice({ text: 'Whisper a playful commentary about dramatic book titles.', connection: 7, chemistry: 4, mood: 5, memory: 'shared_library_joke', preferredArchetypes: ['SOCIALITE', 'ARTIST'] }),
          makeChoice({ text: 'Rush them toward the busiest study desk.', connection: -8, relationship: -2, energy: -2, conflict: 'ignored_pacing', repairScene: 'apologize_for_rushing_library_date', dislikedArchetypes: ['SCHOLAR'] }),
        ],
      },
      {
        id: 'shared_activity',
        title: 'Shared Activity: Marginalia Game',
        prompt: 'A donated book has old notes in the margin. You can turn it into a small mystery.',
        choices: [
          makeChoice({ text: 'Piece together the reader’s story from the notes.', connection: 14, relationship: 5, mood: 4, discovery: 'likes_meaningful_patterns', memory: 'solved_margin_mystery', checkStat: 'intelligence', threshold: 30, success: { connection: 8, discovery: 'notices_tiny_details' }, fail: { connection: 2, discovery: 'enjoys_patient_effort' } }),
          makeChoice({ text: 'Ask how they annotate books when no one is watching.', connection: 10, chemistry: 3, discovery: 'private_thought_style', memory: 'talked_about_secret_notes' }),
          makeChoice({ text: 'Turn it into a competitive speed-reading challenge.', connection: 5, energy: -4, preferredArchetypes: ['EXECUTIVE'], dislikedArchetypes: ['SCHOLAR'] }),
        ],
      },
      {
        id: 'closing_moment',
        title: 'Closing Moment: Book Sale Bell',
        prompt: 'The library book sale is closing and volunteers need one last box moved.',
        choices: [
          makeChoice({ text: 'Help carry the box and let the goodbye stay unhurried.', connection: 12, relationship: 5, energy: -3, callback: 'book_sale_volunteer_callback', memory: 'helped_library_volunteers' }),
          makeChoice({ text: 'Recommend a book you think fits what you learned today.', connection: 10, chemistry: 5, discovery: 'responds_to_personal_recommendations', memory: 'personal_book_recommendation' }),
          makeChoice({ text: 'Complain that helping was not part of the date.', connection: -15, relationship: -6, mood: -6, conflict: 'resented_small_kindness', repairScene: 'make_up_by_volunteering_later' }),
        ],
      },
    ],
  },
  gym_date: {
    id: 'gym_date',
    venueKey: 'gym',
    title: 'Gym Date',
    complication: 'Challenge day makes the room louder and more public than usual.',
    phases: [
      { id: 'arrival', title: 'Arrival: Warm-Up', prompt: 'The gym is running a public challenge board today.', choices: [
        makeChoice({ text: 'Ask if they want privacy or hype before joining in.', connection: 12, relationship: 4, discovery: 'fitness_event_comfort', memory: 'checked_gym_boundaries', preferredArchetypes: ['GYM_RAT'] }),
        makeChoice({ text: 'Immediately sign both names on the challenge board.', connection: 6, chemistry: 5, energy: -4, conflict: 'public_pressure', repairScene: 'repair_after_pushy_gym_date', preferredArchetypes: ['GYM_RAT'], dislikedArchetypes: ['SCHOLAR', 'ARTIST'] }),
        makeChoice({ text: 'Suggest a low-key mobility warm-up together.', connection: 8, mood: 4, energy: 2, preferredArchetypes: ['EXECUTIVE', 'SCHOLAR'] }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Partner Set', prompt: 'A partner circuit asks for trust more than raw strength.', choices: [
        makeChoice({ text: 'Spot carefully and focus on form.', connection: 14, relationship: 4, chemistry: 3, checkStat: 'fitness', threshold: 30, success: { connection: 8, chemistry: 5 }, fail: { connection: 2, discovery: 'values_safe_effort' }, memory: 'trusted_partner_set' }),
        makeChoice({ text: 'Make the circuit funny when one of you struggles.', connection: 9, mood: 6, discovery: 'handles_imperfection_with_humor', memory: 'laughed_through_workout' }),
        makeChoice({ text: 'Compete for the best time without checking in.', connection: -8, chemistry: 2, energy: -8, conflict: 'overcompetitive_workout', repairScene: 'slow_recovery_walk_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Cooldown', prompt: 'After the noise, the cooldown mats feel almost private.', choices: [
        makeChoice({ text: 'Ask what helps them feel confident in public.', connection: 12, relationship: 5, discovery: 'public_confidence_stressor', memory: 'cooldown_confession' }),
        makeChoice({ text: 'Celebrate with a shared smoothie and no performance talk.', connection: 8, mood: 5, energy: 3, memory: 'post_workout_reset' }),
        makeChoice({ text: 'Post their challenge score without asking.', connection: -18, relationship: -7, conflict: 'privacy_breach', repairScene: 'delete_post_and_apologize' }),
      ] },
    ],
  },
  park_walk: {
    id: 'park_walk', venueKey: 'park', title: 'Park Walk', opportunity: 'The park market creates gentle chances to notice what calms someone.', phases: [
      { id: 'arrival', title: 'Arrival: Choose a Path', prompt: 'A market crowd fills the main path while the pond trail stays quiet.', choices: [
        makeChoice({ text: 'Offer the quieter pond trail first.', connection: 10, mood: 5, discovery: 'quiet_nature_restores_them', preferredArchetypes: ['SCHOLAR', 'ARTIST'], memory: 'pond_trail_choice' }),
        makeChoice({ text: 'Explore the market stalls and people-watch.', connection: 8, mood: 4, discovery: 'market_people_watching', preferredArchetypes: ['SOCIALITE'] }),
        makeChoice({ text: 'Power-walk without noticing their pace.', connection: -9, energy: -5, conflict: 'missed_walking_pace', repairScene: 'bench_conversation_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Unexpected Rain', prompt: 'Rain starts before you reach shelter.', choices: [
        makeChoice({ text: 'Laugh, slow down, and ask what rain reminds them of.', connection: 13, chemistry: 5, discovery: 'rainy_day_memory', memory: 'rain_walk_confession' }),
        makeChoice({ text: 'Find cover and make a practical plan.', connection: 9, relationship: 4, preferredArchetypes: ['EXECUTIVE', 'GYM_RAT'], memory: 'handled_rain_together' }),
        makeChoice({ text: 'Blame them for choosing the route.', connection: -16, relationship: -6, mood: -8, conflict: 'unfair_blame', repairScene: 'rain_check_apology' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Bench Pause', prompt: 'The rain clears near an empty bench.', choices: [
        makeChoice({ text: 'Sit quietly long enough for them to share first.', connection: 12, relationship: 4, discovery: 'comfort_with_silence', memory: 'quiet_bench_pause' }),
        makeChoice({ text: 'Suggest making this walk a weekly ritual.', connection: 8, chemistry: 3, callback: 'weekly_park_walk_callback', memory: 'weekly_walk_invite' }),
        makeChoice({ text: 'Check your phone through the goodbye.', connection: -12, chemistry: -5, conflict: 'distracted_goodbye', repairScene: 'phone_free_walk_repair' }),
      ] },
    ] },
  mall_outing: { id: 'mall_outing', venueKey: 'mall', title: 'Mall Outing', complication: 'Discount weekend crowds test patience without turning the date into gift shopping.', phases: [
      { id: 'arrival', title: 'Arrival: Crowd Check', prompt: 'The mall is packed for discount weekend.', choices: [
        makeChoice({ text: 'Ask which spaces feel fun and which feel draining.', connection: 11, relationship: 3, discovery: 'crowd_energy_preference', memory: 'mall_crowd_check' }),
        makeChoice({ text: 'People-watch from the balcony before choosing anything.', connection: 8, mood: 4, preferredArchetypes: ['SOCIALITE', 'ARTIST'] }),
        makeChoice({ text: 'Treat the date like an efficiency route.', connection: -6, energy: -4, preferredArchetypes: ['EXECUTIVE'], dislikedArchetypes: ['ARTIST'] }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Window-Story Game', prompt: 'Instead of buying affection, you invent stories for window displays.', choices: [
        makeChoice({ text: 'Make up a dramatic life for each mannequin.', connection: 12, mood: 7, discovery: 'playful_public_imagination', memory: 'window_story_game' }),
        makeChoice({ text: 'Compare how each of you defines comfort versus status.', connection: 10, relationship: 4, discovery: 'status_comfort_tension', preferredArchetypes: ['SOCIALITE', 'EXECUTIVE'] }),
        makeChoice({ text: 'Insist they pick what you should buy to impress people.', connection: -10, relationship: -4, conflict: 'status_pressure', repairScene: 'honest_style_conversation' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Lost Child Announcement', prompt: 'A child is separated from their parent near the fountain.', choices: [
        makeChoice({ text: 'Help guide the child to security calmly.', connection: 13, relationship: 6, mood: 3, discovery: 'care_under_public_pressure', memory: 'helped_lost_child' }),
        makeChoice({ text: 'Stay nearby and support while your date takes the lead.', connection: 9, relationship: 3, discovery: 'likes_capable_partners' }),
        makeChoice({ text: 'Act annoyed that the moment interrupted you.', connection: -17, relationship: -7, mood: -6, conflict: 'lacked_public_kindness', repairScene: 'community_kindness_repair' }),
      ] },
    ] },
  nightclub_date: { id: 'nightclub_date', venueKey: 'club', title: 'Nightclub Date', complication: 'Guest-list night brings status games and boundary tests.', phases: [
      { id: 'arrival', title: 'Arrival: Door Energy', prompt: 'The guest-list line is full of people trying to be seen.', choices: [
        makeChoice({ text: 'Check whether they want spotlight or a quiet booth.', connection: 11, relationship: 4, discovery: 'nightlife_visibility_preference', memory: 'door_boundary_check' }),
        makeChoice({ text: 'Charm the door host without making your date invisible.', connection: 8, chemistry: 5, checkStat: 'charisma', threshold: 35, success: { connection: 7 }, fail: { connection: -2, mood: -2 } }),
        makeChoice({ text: 'Name-drop loudly until someone notices.', connection: -12, mood: -5, conflict: 'status_performance', repairScene: 'humble_booth_apology' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Dance Floor Choice', prompt: 'The DJ shifts to a heavy, throbbing bassline. The crowd presses you tightly together.', choices: [
        makeChoice({ text: 'Pull them flush against you, letting the music dictate the rhythm between you.', connection: 12, chemistry: 15, tone: { heat: 8, implication: 9, emotionalRisk: 6, publicRisk: 7 }, discovery: 'consent_to_spotlight', memory: 'dance_floor_choice' }),
        makeChoice({ text: 'Lean in close enough to breathe against their neck, asking if they want to leave yet.', connection: 14, chemistry: 12, tone: { heat: 9, implication: 10, emotionalRisk: 7, publicRisk: 5 }, preferredArchetypes: ['SOCIALITE', 'ARTIST'] }),
        makeChoice({ text: 'Pull them into the crowd after they hesitate.', connection: -18, relationship: -6, conflict: 'ignored_social_boundary', repairScene: 'boundary_repair_scene' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: After-Air', prompt: 'Outside, the street is quiet. The adrenaline from the club turns into raw tension.', choices: [
        makeChoice({ text: 'Push them gently into the shadows of an alleyway for a breathless kiss.', connection: 15, chemistry: 18, tone: { heat: 9, implication: 8, emotionalRisk: 7, publicRisk: 8 }, discovery: 'after_midnight_self', memory: 'streetlight_confession' }),
        makeChoice({ text: 'Tell them you want to take them home. Right now.', connection: 12, chemistry: 14, tone: { heat: 8, implication: 10, emotionalRisk: 8, publicRisk: 2 }, memory: 'safe_night_exit' }),
        makeChoice({ text: 'Keep chasing the next party when they are tired.', connection: -15, energy: -8, conflict: 'missed_tired_signal', repairScene: 'restful_followup_date' }),
      ] },
    ] },
  home_dinner: { id: 'home_dinner', venueKey: 'home', title: 'Home Dinner', opportunity: 'Cooking together turns the apartment into a shared scene instead of a transaction.', homeStyleTags: ['cozy', 'modern', 'organized'], phases: [
      { id: 'arrival', title: 'Arrival: Welcome In', prompt: 'They step into your apartment and notice how you live.', choices: [
        makeChoice({ text: 'Give a small tour that explains what each corner helps you feel.', connection: 10, relationship: 4, discovery: 'home_identity_response', memory: 'home_style_tour' }),
        makeChoice({ text: 'Invite them to choose music while you prep.', connection: 8, chemistry: 3, mood: 4, memory: 'dinner_music_choice' }),
        makeChoice({ text: 'Apologize for every detail until the room feels tense.', connection: -7, mood: -4, conflict: 'home_insecurity_spiral', repairScene: 'simple_honest_home_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Cook Together', prompt: 'The meal needs timing, teamwork, and tolerance for imperfection.', choices: [
        makeChoice({ text: 'Make cooking collaborative instead of performative.', connection: 14, relationship: 5, mood: 4, checkStat: 'culinary', threshold: 25, success: { connection: 6, mood: 4 }, fail: { connection: 3, discovery: 'likes_imperfect_teamwork' }, memory: 'cooked_as_a_team' }),
        makeChoice({ text: 'Ask about the meals that feel like home to them.', connection: 12, discovery: 'comfort_food_memory', memory: 'talked_about_home_meals' }),
        makeChoice({ text: 'Take over every task because you know best.', connection: -12, relationship: -4, conflict: 'controlled_shared_task', repairScene: 'cook_together_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Dishes and Honesty', prompt: 'The dishes are still there after the meal.', choices: [
        makeChoice({ text: 'Wash dishes side by side and let the conversation soften.', connection: 12, relationship: 5, memory: 'dish_sink_confession', callback: 'next_home_recipe_callback' }),
        makeChoice({ text: 'Suggest a low-pressure next dinner experiment.', connection: 8, chemistry: 4, callback: 'shared_recipe_callback' }),
        makeChoice({ text: 'Leave the cleanup entirely to them.', connection: -18, relationship: -8, conflict: 'unequal_home_labor', repairScene: 'make_up_by_hosting_fairly' }),
      ] },
    ] },
  coffee_date: { id: 'coffee_date', venueKey: 'mall', title: 'Coffee Date', opportunity: 'A short coffee can reveal stressors without demanding a perfect evening.', phases: [
      { id: 'arrival', title: 'Arrival: Table Choice', prompt: 'There is one window seat and one quiet corner.', choices: [
        makeChoice({ text: 'Ask which seat fits their day.', connection: 10, discovery: 'daily_energy_state', memory: 'coffee_seat_check' }),
        makeChoice({ text: 'Choose the window for people-watching.', connection: 7, mood: 4, preferredArchetypes: ['SOCIALITE', 'ARTIST'] }),
        makeChoice({ text: 'Start venting before they settle.', connection: -8, mood: -4, conflict: 'conversation_dumping', repairScene: 'balanced_coffee_retry' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Ten-Minute Truth', prompt: 'You each get one honest question before the drinks cool.', choices: [
        makeChoice({ text: 'Ask what has been taking more energy than people realize.', connection: 13, relationship: 5, discovery: 'hidden_stressor', memory: 'ten_minute_truth' }),
        makeChoice({ text: 'Ask what kind of attention feels supportive.', connection: 12, chemistry: 3, discovery: 'attention_preference', memory: 'attention_style_talk' }),
        makeChoice({ text: 'Ask a status question meant to impress nearby strangers.', connection: -10, conflict: 'performed_for_audience', repairScene: 'private_question_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Short Date, Real Note', prompt: 'The date was brief, but the goodbye can still land.', choices: [
        makeChoice({ text: 'Name one thing you understood better about them.', connection: 11, relationship: 4, memory: 'specific_coffee_goodbye' }),
        makeChoice({ text: 'Offer a callback to the stressor they mentioned.', connection: 8, callback: 'check_in_on_hidden_stressor', memory: 'coffee_checkin_promise' }),
        makeChoice({ text: 'Call it mediocre like that means useless.', connection: -13, relationship: -5, conflict: 'dismissed_small_date', repairScene: 'small_date_repair' }),
      ] },
    ] },
  movie_night: { id: 'movie_night', venueKey: 'home', title: 'Movie Night', homeStyleTags: ['cozy', 'modern', 'artistic'], phases: [
      { id: 'arrival', title: 'Arrival: Pick the Tone', prompt: 'Choosing the tone matters more than picking the perfect film.', choices: [
        makeChoice({ text: 'Ask whether they need comfort, laughs, or intensity tonight.', connection: 11, mood: 4, discovery: 'media_comfort_tone', memory: 'movie_tone_check' }),
        makeChoice({ text: 'Suggest a strange indie film and invite honest reactions.', connection: 8, chemistry: 3, preferredArchetypes: ['ARTIST', 'SCHOLAR'] }),
        makeChoice({ text: 'Insist on your favorite without asking.', connection: -9, conflict: 'ignored_movie_preference', repairScene: 'their_pick_movie_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Watch Together', prompt: 'A quiet scene hits harder than expected.', choices: [
        makeChoice({ text: 'Notice their reaction and pause if they want to talk.', connection: 13, relationship: 5, discovery: 'emotional_media_trigger', memory: 'paused_for_feelings' }),
        makeChoice({ text: 'Trade jokes without talking over the important parts.', connection: 9, mood: 6, chemistry: 4 }),
        makeChoice({ text: 'Mock the scene while they are clearly moved.', connection: -16, relationship: -6, conflict: 'mocked_vulnerability', repairScene: 'vulnerability_apology_scene' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Credits', prompt: 'The credits give you a soft landing.', choices: [
        makeChoice({ text: 'Ask what story stayed with them.', connection: 11, discovery: 'story_values', memory: 'credits_conversation' }),
        makeChoice({ text: 'Plan a future double-feature based on both tastes.', connection: 8, chemistry: 4, callback: 'double_feature_callback' }),
        makeChoice({ text: 'Immediately check reviews instead of their thoughts.', connection: -10, conflict: 'outsourced_opinion', repairScene: 'listen_to_their_review_repair' }),
      ] },
    ] },
  study_date: { id: 'study_date', venueKey: 'library', title: 'Study Date', opportunity: 'Shared focus reveals patience, ambition, and how someone handles pressure.', phases: [
      { id: 'arrival', title: 'Arrival: Study Contract', prompt: 'You have to decide how work and affection share the table.', choices: [
        makeChoice({ text: 'Set a focus block and a real break together.', connection: 10, relationship: 4, discovery: 'focus_boundary_style', memory: 'study_contract' }),
        makeChoice({ text: 'Ask what deadline has been haunting them.', connection: 9, discovery: 'academic_or_work_pressure' }),
        makeChoice({ text: 'Flirt so much they cannot focus.', connection: -7, chemistry: 3, conflict: 'derailed_focus', repairScene: 'respect_the_deadline_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Practice Round', prompt: 'They need to rehearse an argument, presentation, or hard concept.', choices: [
        makeChoice({ text: 'Ask careful questions that sharpen their thinking.', connection: 14, relationship: 5, checkStat: 'intelligence', threshold: 30, success: { discovery: 'values_intellectual_partnership', connection: 6 }, fail: { discovery: 'values_trying_to_understand', connection: 2 }, memory: 'helped_practice_session' }),
        makeChoice({ text: 'Bring up notes from a prior promise if you made one.', connection: 10, relationship: 4, callback: 'thesis_practice_followup', memory: 'followed_through_on_notes' }),
        makeChoice({ text: 'Pretend expertise you do not have.', connection: -12, relationship: -4, conflict: 'fake_expertise', repairScene: 'honest_study_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Break Reward', prompt: 'The work is not finished, but the pressure shifted.', choices: [
        makeChoice({ text: 'Celebrate effort, not just results.', connection: 11, mood: 5, discovery: 'needs_process_praise', memory: 'praised_effort_after_study' }),
        makeChoice({ text: 'Offer a specific check-in before the deadline.', connection: 8, callback: 'deadline_checkin_callback' }),
        makeChoice({ text: 'Make the whole night about your own productivity.', connection: -10, conflict: 'self_centered_study_date', repairScene: 'support_their_deadline_repair' }),
      ] },
    ] },
  workout_date: { id: 'workout_date', venueKey: 'park', title: 'Workout Date', complication: 'Outdoor exercise can energize or expose mismatch around pace.', phases: [
      { id: 'arrival', title: 'Arrival: Pace Promise', prompt: 'Before moving, you can make the pace safe.', choices: [
        makeChoice({ text: 'Agree on a pace where both can still talk.', connection: 10, relationship: 3, discovery: 'movement_pace_preference', memory: 'pace_promise' }),
        makeChoice({ text: 'Let them lead the route.', connection: 8, chemistry: 3, preferredArchetypes: ['GYM_RAT', 'EXECUTIVE'] }),
        makeChoice({ text: 'Turn it into a surprise endurance test.', connection: -13, energy: -10, conflict: 'surprise_endurance_test', repairScene: 'gentle_walk_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Hill or Meadow', prompt: 'The trail forks between a hill sprint and a meadow loop.', choices: [
        makeChoice({ text: 'Choose based on their energy, not your ego.', connection: 12, relationship: 4, mood: 4, discovery: 'feels_seen_in_body' }),
        makeChoice({ text: 'Take the hill if both agree.', connection: 9, chemistry: 5, energy: -6, checkStat: 'fitness', threshold: 35, success: { connection: 6 }, fail: { connection: 1, mood: -2 } }),
        makeChoice({ text: 'Tease them for wanting the easier loop.', connection: -16, relationship: -6, conflict: 'shamed_body_limits', repairScene: 'body_respect_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Stretch and Breathe', prompt: 'The cooldown decides whether the date felt shared or measured.', choices: [
        makeChoice({ text: 'Stretch together and ask what kind of encouragement works.', connection: 11, discovery: 'encouragement_style', memory: 'stretch_encouragement_talk' }),
        makeChoice({ text: 'Share a calm pride in showing up.', connection: 8, mood: 5, memory: 'showed_up_workout' }),
        makeChoice({ text: 'Compare stats like a scoreboard.', connection: -9, conflict: 'scoreboard_mindset', repairScene: 'noncompetitive_workout_repair' }),
      ] },
    ] },
  quiet_evening_in: { id: 'quiet_evening_in', venueKey: 'home', title: 'Quiet Evening In', homeStyleTags: ['cozy', 'literary', 'artistic'], phases: [
      { id: 'arrival', title: 'Arrival: Lower the Volume', prompt: 'A quiet night only works if it feels chosen, not boring.', choices: [
        makeChoice({ text: 'Ask what would help their nervous system unclench.', connection: 12, mood: 5, discovery: 'decompression_need', memory: 'decompression_check' }),
        makeChoice({ text: 'Set out books, tea, or music as options without pressure.', connection: 9, relationship: 3, preferredArchetypes: ['SCHOLAR', 'ARTIST'] }),
        makeChoice({ text: 'Keep apologizing that the night is not exciting.', connection: -7, mood: -4, conflict: 'devalued_quiet_time', repairScene: 'reclaim_quiet_evening_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Parallel Comfort', prompt: 'The quiet forces a heavy, magnetic tension into the room.', choices: [
        makeChoice({ text: 'Shift closer until your thighs brush, letting the silence pull you together.', connection: 14, relationship: 5, chemistry: 10, tone: { heat: 6, implication: 8, emotionalRisk: 7, publicRisk: 0 }, discovery: 'parallel_presence_comfort', memory: 'parallel_comfort_evening' }),
        makeChoice({ text: 'Watch them read until they catch you looking, then hold their gaze.', connection: 11, chemistry: 12, tone: { heat: 7, implication: 9, emotionalRisk: 8, publicRisk: 0 }, discovery: 'slow_burn_openness' }),
        makeChoice({ text: 'Fill every silence with nervous jokes.', connection: -8, mood: -3, conflict: 'crowded_the_silence', repairScene: 'comfortable_silence_repair' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Doorway Softness', prompt: 'The goodbye lingers at the door, neither of you wanting to pull away.', choices: [
        makeChoice({ text: 'Press them gently against the doorframe, whispering that you hate saying goodnight.', connection: 12, relationship: 8, chemistry: 12, tone: { heat: 8, implication: 9, emotionalRisk: 8, publicRisk: 0 }, memory: 'peaceful_doorway_goodbye' }),
        makeChoice({ text: 'Offer to let them stay the night, no pressure, just presence.', connection: 15, relationship: 10, chemistry: 8, tone: { heat: 6, implication: 7, emotionalRisk: 9, publicRisk: 0 }, callback: 'stressful_day_quiet_evening_callback' }),
        makeChoice({ text: 'Ask whether next time can be more useful to you.', connection: -12, relationship: -5, conflict: 'made_comfort_transactional', repairScene: 'nontransactional_care_repair' }),
      ] },
    ] },
  errands_together: { id: 'errands_together', venueKey: 'mall', title: 'Errands Together', opportunity: 'Routine tasks reveal reliability, patience, and domestic compatibility.', phases: [
      { id: 'arrival', title: 'Arrival: List Merge', prompt: 'Two mundane lists become one shared route.', choices: [
        makeChoice({ text: 'Ask what errand is secretly stressing them out.', connection: 11, relationship: 4, discovery: 'routine_stressor', memory: 'errand_stress_check' }),
        makeChoice({ text: 'Sort the list by energy level instead of speed.', connection: 8, mood: 4, preferredArchetypes: ['EXECUTIVE', 'SCHOLAR'] }),
        makeChoice({ text: 'Take over the list and stop asking questions.', connection: -10, conflict: 'overmanaged_errands', repairScene: 'shared_list_repair' }),
      ] },
      { id: 'shared_activity', title: 'Shared Activity: Small Setback', prompt: 'One stop is closed, and the plan has to change.', choices: [
        makeChoice({ text: 'Adapt without blaming anyone.', connection: 13, relationship: 5, discovery: 'handles_plan_changes', memory: 'adapted_errand_plan' }),
        makeChoice({ text: 'Turn the detour into a tiny walk and talk.', connection: 9, chemistry: 3, mood: 4 }),
        makeChoice({ text: 'Act like the whole day is ruined.', connection: -15, mood: -7, conflict: 'catastrophized_errand', repairScene: 'flexibility_repair_scene' }),
      ] },
      { id: 'closing_moment', title: 'Closing Moment: Ordinary Victory', prompt: 'Nothing glamorous happened, but the day says a lot.', choices: [
        makeChoice({ text: 'Appreciate how easy ordinary life felt together.', connection: 12, relationship: 5, discovery: 'ordinary_life_compatibility', memory: 'ordinary_victory' }),
        makeChoice({ text: 'Offer to help with a future practical burden.', connection: 8, callback: 'practical_help_callback' }),
        makeChoice({ text: 'Say this was not a real date because it was useful.', connection: -13, relationship: -5, conflict: 'dismissed_routine_intimacy', repairScene: 'routine_intimacy_repair' }),
      ] },
    ] },
  // Phase 2 - New Date Templates
  art_gallery_date: {
    id: 'art_gallery_date',
    venueKey: 'art_gallery',
    title: 'Art Gallery Date',
    opportunity: 'A shared appreciation for beauty creates intimate connections.',
    phases: [
      {
        id: 'arrival',
        title: 'Arrival: First Impressions',
        prompt: 'The gallery space invites quiet contemplation and shared discovery.',
        choices: [
          makeChoice({ text: 'Ask what piece first caught their attention.', connection: 12, relationship: 4, mood: 3, discovery: 'artistic_preferences', memory: 'shared_art_discovery', preferredArchetypes: ['ARTIST', 'SCHOLAR'] }),
          makeChoice({ text: 'Share your immediate reaction to the current exhibit.', connection: 8, chemistry: 4, mood: 5, memory: 'immediate_art_reaction' }),
          makeChoice({ text: 'Criticize modern art and suggest leaving.', connection: -10, relationship: -3, mood: -2, conflict: 'art_criticism_conflict', repairScene: 'art_appreciation_repair' }),
        ],
      },
      {
        id: 'shared_activity',
        title: 'Shared Activity: Art Interpretation',
        prompt: 'You both stand before a particularly striking piece, each with different interpretations.',
        choices: [
          makeChoice({ text: 'Ask them to explain their perspective on the artwork.', connection: 14, relationship: 5, mood: 4, discovery: 'interpretive_style', memory: 'art_interpretation_dialogue', checkStat: 'intelligence', threshold: 30, success: { connection: 8, discovery: 'deep_art_understanding' }, fail: { connection: 2, discovery: 'appreciates_effort' } }),
          makeChoice({ text: 'Share your own interpretation and ask for their thoughts.', connection: 10, chemistry: 3, discovery: 'personal_art_perspective', memory: 'shared_art_interpretation' }),
          makeChoice({ text: 'Dismiss the artwork as pretentious.', connection: -8, mood: -4, conflict: 'art_dismissal', repairScene: 'art_respect_repair' }),
        ],
      },
      {
        id: 'closing_moment',
        title: 'Closing Moment: Gallery Reflection',
        prompt: 'As you prepare to leave, the gallery gift shop offers a final moment of connection.',
        choices: [
          makeChoice({ text: 'Suggest buying a print of their favorite piece as a memento.', connection: 12, relationship: 5, chemistry: 4, callback: 'art_gallery_callback', memory: 'art_memento_suggestion' }),
          makeChoice({ text: 'Ask which artist they most admire and why.', connection: 10, chemistry: 5, discovery: 'artistic_influences', memory: 'artist_admiration_dialogue' }),
          makeChoice({ text: 'Complain about the high prices in the gift shop.', connection: -5, mood: -3, conflict: 'gift_shop_complaint', repairScene: 'positive_focus_repair' }),
        ],
      },
    ] },
  cooking_class_date: {
    id: 'cooking_class_date',
    venueKey: 'cooking_school',
    title: 'Cooking Class Date',
    opportunity: 'Creating something together builds intimacy and teamwork.',
    phases: [
      {
        id: 'arrival',
        title: 'Arrival: Kitchen Chemistry',
        prompt: 'The cooking classroom buzzes with anticipation as you find your station.',
        choices: [
          makeChoice({ text: 'Ask what their favorite dish to cook is.', connection: 12, relationship: 4, mood: 3, discovery: 'culinary_preferences', memory: 'favorite_dish_dialogue', preferredArchetypes: ['EXECUTIVE', 'SOCIALITE'] }),
          makeChoice({ text: 'Offer to be their sous-chef for the class.', connection: 8, chemistry: 4, mood: 5, memory: 'sous_chef_offer' }),
          makeChoice({ text: 'Complain about having to cook with others.', connection: -10, relationship: -3, mood: -2, conflict: 'cooking_attitude_conflict', repairScene: 'cooking_enthusiasm_repair' }),
        ],
      },
      {
        id: 'shared_activity',
        title: 'Shared Activity: Recipe Collaboration',
        prompt: 'Your recipe requires teamwork and coordination.',
        choices: [
          makeChoice({ text: 'Take the lead and guide them through the recipe.', connection: 14, relationship: 5, mood: 4, discovery: 'leadership_style', memory: 'recipe_leadership', checkStat: 'culinary', threshold: 30, success: { connection: 8, discovery: 'culinary_skill_recognized' }, fail: { connection: 2, discovery: 'appreciates_initiative' } }),
          makeChoice({ text: 'Work together as equal partners.', connection: 10, chemistry: 3, discovery: 'teamwork_style', memory: 'equal_cooking_partnership' }),
          makeChoice({ text: 'Let them do all the work while you watch.', connection: -8, mood: -4, conflict: 'passive_cooking', repairScene: 'active_participation_repair' }),
        ],
      },
      {
        id: 'closing_moment',
        title: 'Closing Moment: Taste Test',
        prompt: 'The final taste test offers a moment to savor your creation together.',
        choices: [
          makeChoice({ text: 'Compliment their specific contributions to the dish.', connection: 12, relationship: 5, chemistry: 4, callback: 'cooking_compliment_callback', memory: 'specific_cooking_praise' }),
          makeChoice({ text: 'Ask what they would do differently next time.', connection: 10, chemistry: 5, discovery: 'culinary_reflection', memory: 'cooking_reflection_dialogue' }),
          makeChoice({ text: 'Criticize the final result harshly.', connection: -12, relationship: -5, mood: -6, conflict: 'cooking_criticism', repairScene: 'constructive_feedback_repair' }),
        ],
      },
    ] },
  wine_tasting_date: {
    id: 'wine_tasting_date',
    venueKey: 'wine_bar',
    title: 'Wine Tasting Date',
    opportunity: 'Shared sensory experiences create lasting memories.',
    phases: [
      {
        id: 'arrival',
        title: 'Arrival: First Pour',
        prompt: 'The wine bar offers an intimate setting for exploring new flavors together.',
        choices: [
          makeChoice({ text: 'Ask what their favorite wine region is.', connection: 12, relationship: 4, mood: 3, discovery: 'wine_preferences', memory: 'wine_region_dialogue', preferredArchetypes: ['EXECUTIVE', 'SOCIALITE'] }),
          makeChoice({ text: 'Share your own wine knowledge or lack thereof.', connection: 8, chemistry: 4, mood: 5, memory: 'wine_knowledge_sharing' }),
          makeChoice({ text: 'Complain about the pretentiousness of wine culture.', connection: -10, relationship: -3, mood: -2, conflict: 'wine_culture_conflict', repairScene: 'wine_appreciation_repair' }),
        ],
      },
      {
        id: 'shared_activity',
        title: 'Shared Activity: Flavor Analysis',
        prompt: 'You both sample a complex wine, each noticing different nuances.',
        choices: [
          makeChoice({ text: 'Ask them to describe the flavors they detect.', connection: 14, relationship: 5, mood: 4, discovery: 'sensory_perception', memory: 'wine_flavor_dialogue', checkStat: 'style', threshold: 30, success: { connection: 8, discovery: 'refined_palette' }, fail: { connection: 2, discovery: 'appreciates_effort' } }),
          makeChoice({ text: 'Share your own flavor impressions.', connection: 10, chemistry: 3, discovery: 'personal_taste_profile', memory: 'shared_wine_impressions' }),
          makeChoice({ text: 'Pretend to detect flavors you cannot actually taste.', connection: -8, mood: -4, conflict: 'wine_pretension', repairScene: 'honest_tasting_repair' }),
        ],
      },
      {
        id: 'closing_moment',
        title: 'Closing Moment: Final Toast',
        prompt: 'The sommelier offers a final, special vintage to cap the experience.',
        choices: [
          makeChoice({ text: 'Toast to new experiences and shared discoveries.', connection: 12, relationship: 5, chemistry: 4, callback: 'wine_toast_callback', memory: 'shared_wine_toast' }),
          makeChoice({ text: 'Ask what wine they would choose for a special occasion.', connection: 10, chemistry: 5, discovery: 'special_occasion_preferences', memory: 'wine_occasion_dialogue' }),
          makeChoice({ text: 'Complain about the cost of the final wine.', connection: -5, mood: -3, conflict: 'wine_cost_complaint', repairScene: 'value_focus_repair' }),
        ],
      },
    ] },
};

export const DATE_EVENTS = Object.fromEntries(
  Object.values(DATE_TEMPLATES).map((template) => [template.venueKey, template.phases])
);

export const getDateTemplate = (dateType, venueKey) => {
  if (dateType && DATE_TEMPLATES[dateType]) return DATE_TEMPLATES[dateType];
  return Object.values(DATE_TEMPLATES).find((template) => template.venueKey === venueKey)
    || DATE_TEMPLATES.coffee_date;
};
