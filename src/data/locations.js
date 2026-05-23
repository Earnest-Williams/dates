export const LOCATIONS = {
  home: { name: "Home", desc: "Your cozy sanctuary.", energyCost: 0, gated: false },
  gym: { name: "Peak Fitness Gym", desc: "Workout, build muscle, meet athletes.", energyCost: 5, gated: false },
  library: { name: "Grand Library", desc: "Study, read, meet scholars.", energyCost: 2, gated: false },
  club: { name: "Neon Beats Nightclub", desc: "Party, dance, meet socialites.", energyCost: 15, gated: true, reqStyle: 50, reqDesc: "Requires 50+ Style or a Sports Car." },
  mall: { name: "Avenue Shopping Mall", desc: "Buy gifts, vehicle assets, and designer outfits.", energyCost: 2, gated: false },
  office: { name: "OmniCorp Headquarters", desc: "Work hard, advance career, meet executives.", energyCost: 10, gated: false },
  park: { name: "Greenwood Park", desc: "A lush, quiet park with a serene pond and scenic paths.", energyCost: 3, gated: false }
};
