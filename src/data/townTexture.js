import { getDaypart } from '../sim/time.js';

export const NPC_SCHEDULE = {
  elena: [
    { days: ['mon', 'wed'], time: 'evening', location: 'library', reveals: 'quiet_evenings' },
    { days: ['sat'], time: 'afternoon', location: 'park', reveals: 'reflective_walks' },
  ],
  brad: [
    { days: ['tue', 'thu'], time: 'morning', location: 'gym', reveals: 'training_routine' },
    { days: ['sun'], time: 'afternoon', location: 'park', reveals: 'public_fitness_anxiety' },
  ],
  sophia: [
    { days: ['fri'], time: 'night', location: 'club', reveals: 'status_fatigue' },
    { days: ['sun'], time: 'morning', location: 'park', reveals: 'relaxes_away_from_status' },
  ],
  marcus: [
    { days: ['mon', 'thu'], time: 'night', location: 'office', reveals: 'after_hours_overwork' },
    { days: ['wed'], time: 'morning', location: 'mall', reveals: 'coffee_before_work' },
  ],
  chloe: [
    { days: ['tue'], time: 'afternoon', location: 'park', reveals: 'outdoor_inspiration' },
    { days: ['sat'], time: 'evening', location: 'home', reveals: 'quiet_home_inspiration' },
  ],
  rina: [
    { days: ['fri', 'sat'], time: 'night', location: 'club', reveals: 'after_midnight_confidence' },
    { days: ['wed'], time: 'afternoon', location: 'mall', reveals: 'cafe_reset_ritual' },
  ],
  maya: [
    { days: ['mon'], time: 'afternoon', location: 'park', reveals: 'sketches_from_nature' },
    { days: ['thu'], time: 'evening', location: 'library', reveals: 'researches_art_history' },
  ],
  nora: [
    { days: ['tue', 'fri'], time: 'evening', location: 'office', reveals: 'professional_pressure' },
    { days: ['sat'], time: 'morning', location: 'mall', reveals: 'routine_efficiency' },
  ],
  // Phase 2 - New NPC Schedules
  liam: [
    { days: ['mon', 'wed', 'fri'], time: 'morning', location: 'gym', reveals: 'marathon_training' },
    { days: ['sat'], time: 'afternoon', location: 'park', reveals: 'competitive_spirit' },
  ],
  ava: [
    { days: ['tue', 'thu'], time: 'afternoon', location: 'library', reveals: 'philosophical_thoughts' },
    { days: ['sun'], time: 'morning', location: 'mall', reveals: 'intellectual_curiosity' },
  ],
  ethan: [
    { days: ['wed'], time: 'evening', location: 'mall', reveals: 'musical_inspiration' },
    { days: ['sat'], time: 'night', location: 'club', reveals: 'performance_nerves' },
  ],
  olivia: [
    { days: ['mon'], time: 'afternoon', location: 'art_gallery', reveals: 'artistic_vision' },
    { days: ['thu'], time: 'evening', location: 'library', reveals: 'creative_process' },
  ],
  noah: [
    { days: ['tue', 'thu'], time: 'morning', location: 'office', reveals: 'startup_ambition' },
    { days: ['sun'], time: 'afternoon', location: 'mall', reveals: 'entrepreneurial_mindset' },
  ],
  isabella: [
    { days: ['wed', 'fri'], time: 'afternoon', location: 'mall', reveals: 'fashion_sense' },
    { days: ['sat'], time: 'evening', location: 'art_gallery', reveals: 'design_philosophy' },
  ],
  james: [
    { days: ['mon', 'thu'], time: 'evening', location: 'office', reveals: 'legal_expertise' },
    { days: ['sun'], time: 'morning', location: 'library', reveals: 'justice_principles' },
  ],
  sofia: [
    { days: ['tue', 'sat'], time: 'evening', location: 'club', reveals: 'dance_artistry' },
    { days: ['thu'], time: 'afternoon', location: 'park', reveals: 'graceful_movement' },
  ],
  emma: [
    { days: ['wed', 'sat'], time: 'morning', location: 'park', reveals: 'nature_connection' },
    { days: ['sun'], time: 'afternoon', location: 'mall', reveals: 'community_spirit' },
  ],
  alexander: [
    { days: ['mon', 'fri'], time: 'afternoon', location: 'office', reveals: 'architectural_vision' },
    { days: ['sun'], time: 'morning', location: 'library', reveals: 'design_principles' },
  ],
};

export const LOCATION_EVENTS = {
  library: {
    id: 'library_book_sale',
    title: 'Library Book Sale',
    times: ['afternoon', 'evening'],
    effect: 'Reveals who lingers over marginalia, research, and quiet volunteer work.',
    romanceHooks: ['patient_attention', 'personal_recommendations'],
  },
  gym: {
    id: 'gym_challenge_day',
    title: 'Gym Challenge Day',
    times: ['morning', 'afternoon'],
    effect: 'Public events can reveal confidence, competitiveness, or anxiety.',
    romanceHooks: ['public_boundaries', 'body_respect'],
  },
  park: {
    id: 'park_market',
    title: 'Park Market',
    times: ['morning', 'afternoon'],
    effect: 'Stalls and walking paths reveal whether someone restores in crowds or quiet.',
    romanceHooks: ['nature_restoration', 'crowd_energy'],
  },
  mall: {
    id: 'mall_discount_weekend',
    title: 'Mall Discount Weekend',
    times: ['afternoon', 'evening'],
    effect: 'Crowds test patience and status pressure without rewarding affection purchases.',
    romanceHooks: ['status_comfort_tension', 'routine_patience'],
  },
  office: {
    id: 'office_networking_mixer',
    title: 'Office Networking Mixer',
    times: ['evening'],
    effect: 'After-hours office life reveals ambition, overwork, and social fatigue.',
    romanceHooks: ['overwork', 'professional_boundaries'],
  },
  club: {
    id: 'nightclub_guest_list_night',
    title: 'Nightclub Guest-List Night',
    times: ['night'],
    effect: 'The door, dance floor, and after-air reveal boundaries around visibility.',
    romanceHooks: ['spotlight_consent', 'safe_exit'],
  },
  home: {
    id: 'rainy_evening_at_home',
    title: 'Rainy Evening at Home',
    times: ['evening', 'night'],
    effect: 'Bad weather makes home style, decompression, and shared routines matter.',
    romanceHooks: ['home_identity', 'quiet_decompression'],
  },
};

export const TIME_OF_DAY_LOCATION_TEXTURE = {
  library: {
    morning: 'Focused students and retirees make the reading room bright and orderly.',
    evening: 'Late lamps and closing carts make quiet conversations feel personal.',
  },
  gym: {
    morning: 'Regulars move through familiar routines before work.',
    evening: 'Challenge boards and crowded equipment make boundaries more important.',
  },
  park: {
    morning: 'Joggers and market vendors give the paths a gentle bustle.',
    evening: 'The pond trail empties out and invites slower honesty.',
  },
  office: {
    evening: 'Networking mixers blur work ambition with private exhaustion.',
    night: 'After-hours lights reveal who is overworking again.',
  },
  club: {
    evening: 'The room is still warming up and easier to navigate.',
    night: 'Guest lists, music, and streetlight exits heighten social choices.',
  },
  home: {
    evening: 'Furniture, lighting, and routine turn the apartment into identity.',
    night: 'Quiet activities reveal whether shared silence feels comfortable.',
  },
};

const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const getDayName = (day) => dayNames[(Math.max(1, day) - 1) % dayNames.length];

export const getTimeOfDay = (hour) => {
  return getDaypart(hour);
};

export const getNpcEncounters = (time, locationKey) => {
  const dayName = getDayName(time.day || 1);
  const timeOfDay = getTimeOfDay(time.hour ?? 8);
  return Object.entries(NPC_SCHEDULE).flatMap(([npcId, entries]) => (
    entries
      .filter((entry) => (
        entry.location === locationKey
          && entry.days.includes(dayName)
          && entry.time === timeOfDay
      ))
      .map((entry) => ({ npcId, ...entry }))
  ));
};
