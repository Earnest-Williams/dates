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
