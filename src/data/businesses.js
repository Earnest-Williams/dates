export const BUSINESS_TYPES = {
  grocery: { label: 'Grocery Store', essentialFrom: 'Very Low' },
  petrol_station: { label: 'Petrol Station', essentialFrom: 'Very Low' },
  pub: { label: 'Pub', essentialFrom: 'Very Low' },
  takeaway: { label: 'Takeaway', essentialFrom: 'Very Low' },
  post_office: { label: 'Post Office Counter', essentialFrom: 'Low' },
  cafe: { label: 'Cafe', essentialFrom: 'Low-Medium' },
  pharmacy: { label: 'Pharmacy', essentialFrom: 'Medium' },
  hardware: { label: 'Hardware Shop', essentialFrom: 'Medium' },
  supermarket: { label: 'Supermarket', essentialFrom: 'Medium-High' },
  retail: { label: 'Retail Shop', essentialFrom: 'Medium-High' },
  gym: { label: 'Gym', essentialFrom: 'Medium-High' },
  office_admin: { label: 'Office', essentialFrom: 'High' },
  software_studio: { label: 'Software Studio', essentialFrom: 'High' },
  design_studio: { label: 'Design Studio', essentialFrom: 'High' },
  law_firm: { label: 'Law Firm', essentialFrom: 'High' },
};

export const BUSINESS_REPRESENTATION_POLICY = {
  'Very Low': { representedShare: 0.10, targetCount: 5 },
  Low: { representedShare: 0.10, targetCount: 5 },
  'Low-Medium': { representedShare: 0.10, targetCount: 6 },
  Medium: { representedShare: 0.10, targetCount: 8 },
  'Medium-High': { representedShare: 0.07, targetCount: 10 },
  High: { representedShare: 0.05, targetCount: 14 },
};

const starterJobs = {
  counter: { track: 'service', title: 'Counter Assistant', methods: ['job_center', 'beat_pavement', 'job_websites'] },
  shelf: { track: 'service', title: 'Shelf Stacker', methods: ['job_center', 'beat_pavement', 'job_websites'] },
  kitchen: { track: 'service', title: 'Kitchen Crew', methods: ['job_center', 'beat_pavement'] },
  bar: { track: 'service', title: 'Bar Back', methods: ['beat_pavement'] },
  support: { track: 'tech', title: 'Junior Support Assistant', methods: ['job_websites'] },
  design: { track: 'creative', title: 'Design Assistant', methods: ['job_websites'] },
  office: { track: 'corporate', title: 'Office Intern', methods: ['job_center', 'job_websites'] },
};

export const BUSINESSES = [
  { id: 'endleigh_stores', settlementId: 'Endleigh', name: 'Endleigh Stores', type: 'grocery', district: 'Bog Lane', desc: 'A cramped village grocery with a post shelf, lottery terminal, and cold cabinet.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'moss_lane_service', settlementId: 'Endleigh', name: 'Moss Lane Service & Shop', type: 'petrol_station', district: 'Causeway Bend', desc: 'Two pumps, tyre air, paraffin, snacks, and a tiny till window.', jobs: [{ ...starterJobs.counter, title: 'Forecourt Assistant' }] },
  { id: 'cluck_and_chips', settlementId: 'Endleigh', name: 'Cluck & Chips', type: 'takeaway', district: 'High Street', desc: 'The fried chicken shop under your flat, busy whenever the buses come through.', jobs: [{ ...starterJobs.kitchen, title: 'Fryer Assistant' }] },
  { id: 'bog_bottle', settlementId: 'Endleigh', name: 'The Bog & Bottle', type: 'pub', district: 'Old Pump Road', desc: 'Low ceilings, regulars, darts, and a landlord who knows everyone.', jobs: [starterJobs.bar] },
  { id: 'endleigh_post_counter', settlementId: 'Endleigh', name: 'Endleigh Post Counter', type: 'post_office', district: 'Inside Endleigh Stores', desc: 'A part-time counter for parcels, forms, and pension day queues.', jobs: [{ ...starterJobs.counter, title: 'Post Counter Clerk' }] },

  { id: 'upland_corner_shop', settlementId: 'Eldersley', name: 'Eldersley Corner Shop', type: 'grocery', district: 'Shepherd Lane', desc: 'Basic groceries, newspapers, and hill-walker supplies.', jobs: [starterJobs.counter] },
  { id: 'eldersley_fuel', settlementId: 'Eldersley', name: 'Eldersley Fuel Stop', type: 'petrol_station', district: 'South Chase Road', desc: 'A rural fuel stop for vans, tractors, and walkers caught out by the weather.', jobs: [{ ...starterJobs.counter, title: 'Forecourt Assistant' }] },
  { id: 'upland_shepherd', settlementId: 'Eldersley', name: 'The Upland Shepherd', type: 'pub', district: 'The Rise', desc: 'A hill pub with rooms upstairs and lamb stew on the board.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'eldersley_post', settlementId: 'Eldersley', name: 'Eldersley Post & Parcels', type: 'post_office', district: 'Village Hall Annex', desc: 'A two-morning post counter run from the hall annex.', jobs: [starterJobs.counter] },
  { id: 'fell_path_cafe', settlementId: 'Eldersley', name: 'Fell Path Cafe', type: 'cafe', district: 'Trailhead', desc: 'Tea, toasties, and wet boots by the heater.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },

  { id: 'barrow_spade', settlementId: 'Stillwater-under-Barrow', name: 'The Barrow & Spade', type: 'pub', district: 'Mound Road', desc: 'A quiet pub near the old burial mounds.', jobs: [starterJobs.bar] },
  { id: 'stillwater_stores', settlementId: 'Stillwater-under-Barrow', name: 'Stillwater Stores', type: 'grocery', district: 'Fen End', desc: 'Small grocery, off-licence, and noticeboard.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'barrow_fuel', settlementId: 'Stillwater-under-Barrow', name: 'Barrow Fuel & Farm Supply', type: 'petrol_station', district: 'South Track', desc: 'Fuel pumps and feed bags under a corrugated canopy.', jobs: [starterJobs.counter] },
  { id: 'mist_kettle', settlementId: 'Stillwater-under-Barrow', name: 'The Mist Kettle', type: 'cafe', district: 'Causeway Corner', desc: 'A tiny cafe serving walkers and birders.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'stillwater_post', settlementId: 'Stillwater-under-Barrow', name: 'Stillwater Post Counter', type: 'post_office', district: 'Inside Stillwater Stores', desc: 'A parcel counter and forms drawer at the back of the shop.', jobs: [starterJobs.counter] },

  { id: 'woodmans_lodge', settlementId: 'Fallowmere', name: "The Woodman's Lodge", type: 'pub', district: 'Mire Road', desc: 'A lodge pub for forestry workers and wetland walkers.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'fallowmere_shop', settlementId: 'Fallowmere', name: 'Fallowmere Shop', type: 'grocery', district: 'Mire Road', desc: 'Groceries, logs, torches, and waterproof socks.', jobs: [starterJobs.counter] },
  { id: 'mire_edge_fuel', settlementId: 'Fallowmere', name: 'Mire Edge Fuel', type: 'petrol_station', district: 'West Track', desc: 'A single-pump garage with repair tools behind the counter.', jobs: [starterJobs.counter] },
  { id: 'fallowmere_post', settlementId: 'Fallowmere', name: 'Fallowmere Post Point', type: 'post_office', district: 'Inside Fallowmere Shop', desc: 'A basic parcel and bill-pay counter.', jobs: [starterJobs.counter] },
  { id: 'western_mire_works', settlementId: 'Fallowmere', name: 'Western Mire Works', type: 'hardware', district: 'Timber Yard', desc: 'Timber, tools, and bog-safe building supplies.', jobs: [{ ...starterJobs.shelf, title: 'Yard Assistant' }] },

  { id: 'reed_cutter_arms', settlementId: 'Willow Fen', name: "The Reed Cutter's Arms", type: 'pub', district: 'Lower Bank', desc: 'A fen pub serving reed cutters and causeway drivers.', jobs: [starterJobs.bar] },
  { id: 'willow_fen_stores', settlementId: 'Willow Fen', name: 'Willow Fen Stores', type: 'grocery', district: 'Causeway End', desc: 'A grocery and local produce counter.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'lower_bank_fuel', settlementId: 'Willow Fen', name: 'Lower Bank Fuel', type: 'petrol_station', district: 'Lower Fen Road', desc: 'Fuel, diesel cans, and emergency wiper blades.', jobs: [starterJobs.counter] },
  { id: 'willow_post', settlementId: 'Willow Fen', name: 'Willow Fen Post Counter', type: 'post_office', district: 'Village Hall', desc: 'A small counter open around school-run hours.', jobs: [starterJobs.counter] },
  { id: 'reed_and_bean', settlementId: 'Willow Fen', name: 'Reed & Bean', type: 'cafe', district: 'Marsh View', desc: 'A cafe selling coffee, cakes, and packed lunches.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'fen_cutters_coop', settlementId: 'Willow Fen', name: "Fen Cutters' Co-op", type: 'hardware', district: 'Reed Yard', desc: 'A working co-op for marsh tools and seasonal supplies.', jobs: [{ ...starterJobs.shelf, title: 'Yard Assistant' }] },

  { id: 'shaded_oak', settlementId: 'Durnthorne', name: 'The Shaded Oak', type: 'pub', district: 'Old Forest Road', desc: 'A dark timber pub with hikers by day and locals by night.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'durnthorne_foods', settlementId: 'Durnthorne', name: 'Durnthorne Foods', type: 'grocery', district: 'Mill Lane', desc: 'Village groceries and forest picnic supplies.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'forest_road_filling', settlementId: 'Durnthorne', name: 'Forest Road Filling Station', type: 'petrol_station', district: 'East Bend', desc: 'Fuel pumps and a workshop on the forest road.', jobs: [starterJobs.counter] },
  { id: 'foragers_coffee', settlementId: 'Durnthorne', name: 'Foragers Coffee House', type: 'cafe', district: 'Oak Yard', desc: 'Coffee, mushroom toast, and sketchbook tables.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'durnthorne_post', settlementId: 'Durnthorne', name: 'Durnthorne Post Counter', type: 'post_office', district: 'Inside Durnthorne Foods', desc: 'A reliable parcel desk beside the grocery till.', jobs: [starterJobs.counter] },
  { id: 'oak_ironmongers', settlementId: 'Durnthorne', name: 'Oak Ironmongers', type: 'hardware', district: 'Mill Lane', desc: 'Tools, nails, waterproofing, and stove parts.', jobs: [{ ...starterJobs.shelf, title: 'Shop Floor Assistant' }] },

  { id: 'swan_cygnet', settlementId: 'Bramblewick', name: 'The Swan & Cygnet', type: 'pub', district: 'Green Lane', desc: 'A garden pub beside the parkway.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'bramblewick_foodhall', settlementId: 'Bramblewick', name: 'Bramblewick Foodhall', type: 'grocery', district: 'Orchard Row', desc: 'A larger village grocery with local produce.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'orchard_cafe', settlementId: 'Bramblewick', name: 'The Orchard Cafe', type: 'cafe', district: 'Orchard Row', desc: 'A bright cafe by the gardens.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'fenmans_rest', settlementId: 'Bramblewick', name: "The Fenman's Rest", type: 'pub', district: 'Fen Road', desc: 'A lower, louder pub near the drainage cut.', jobs: [starterJobs.bar] },
  { id: 'bramblewick_pharmacy', settlementId: 'Bramblewick', name: 'Bramblewick Pharmacy', type: 'pharmacy', district: 'Market Nook', desc: 'Prescriptions, plasters, and queue diplomacy.', jobs: [{ ...starterJobs.counter, title: 'Pharmacy Counter Assistant' }] },
  { id: 'green_lane_fuel', settlementId: 'Bramblewick', name: 'Green Lane Fuel', type: 'petrol_station', district: 'Green Lane', desc: 'A clean forecourt on the road toward Brockleigh.', jobs: [starterJobs.counter] },
  { id: 'bramblewick_post', settlementId: 'Bramblewick', name: 'Bramblewick Post Office', type: 'post_office', district: 'Market Nook', desc: 'Parcels, passports, and local notices.', jobs: [starterJobs.counter] },
  { id: 'garden_gate_hardware', settlementId: 'Bramblewick', name: 'Garden Gate Hardware', type: 'hardware', district: 'Orchard Row', desc: 'Paint, tools, plant food, and fence panels.', jobs: [{ ...starterJobs.shelf, title: 'Shop Floor Assistant' }] },

  { id: 'harrowfen_stores', settlementId: 'Harrowfen', name: 'Harrowfen Stores', type: 'grocery', district: 'Sluice Road', desc: 'A practical grocery beside the bus stop.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'reclaimed_sluice', settlementId: 'Harrowfen', name: 'The Reclaimed Sluice', type: 'pub', district: 'Sluice Road', desc: 'A pub by the old drainage works.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'dyke_keeper', settlementId: 'Harrowfen', name: 'The Dyke Keeper', type: 'pub', district: 'East Bank', desc: 'A workers pub with muddy boots by the fire.', jobs: [starterJobs.bar] },
  { id: 'peat_and_bean', settlementId: 'Harrowfen', name: 'Peat & Bean', type: 'cafe', district: 'East Bank', desc: 'Strong coffee for early shifts.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'harrowfen_fuel', settlementId: 'Harrowfen', name: 'Harrowfen Causeway Fuel', type: 'petrol_station', district: 'Causeway Gate', desc: 'A busy fuel stop where causeway traffic slows down.', jobs: [starterJobs.counter] },
  { id: 'harrowfen_pharmacy', settlementId: 'Harrowfen', name: 'Harrowfen Pharmacy', type: 'pharmacy', district: 'Sluice Road', desc: 'A small pharmacy serving the eastern fen.', jobs: [starterJobs.counter] },
  { id: 'harrowfen_post', settlementId: 'Harrowfen', name: 'Harrowfen Post Office', type: 'post_office', district: 'Sluice Road', desc: 'A proper village post office with a queue most mornings.', jobs: [starterJobs.counter] },
  { id: 'fen_bank_hardware', settlementId: 'Harrowfen', name: 'Fen Bank Hardware', type: 'hardware', district: 'Causeway Gate', desc: 'Pumps, pipework, tools, and work gloves.', jobs: [{ ...starterJobs.shelf, title: 'Yard Assistant' }] },

  { id: 'heathside_brews', settlementId: 'Blackmere Heath', name: 'Heathside Brews', type: 'cafe', district: 'Turnpike Yard', desc: 'A windswept cafe at the coach stop.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'windmill_inn', settlementId: 'Blackmere Heath', name: 'The Windmill Inn', type: 'pub', district: 'Old Turnpike', desc: 'A coaching inn with rooms and Sunday roasts.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'heather_queen', settlementId: 'Blackmere Heath', name: 'The Heather Queen', type: 'pub', district: 'North Common', desc: 'A lively pub for farmers, drivers, and hikers.', jobs: [starterJobs.bar] },
  { id: 'blackmere_foods', settlementId: 'Blackmere Heath', name: 'Blackmere Foods', type: 'supermarket', district: 'Turnpike Yard', desc: 'A mid-sized supermarket serving the heath villages.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'blackmere_fuel', settlementId: 'Blackmere Heath', name: 'Blackmere Heath Services', type: 'petrol_station', district: 'Great North Heath Road', desc: 'A forecourt, shop, and car wash on the old turnpike.', jobs: [starterJobs.counter] },
  { id: 'blackmere_pharmacy', settlementId: 'Blackmere Heath', name: 'Blackmere Pharmacy', type: 'pharmacy', district: 'Market Strip', desc: 'A compact pharmacy beside the clinic rooms.', jobs: [starterJobs.counter] },
  { id: 'blackmere_post', settlementId: 'Blackmere Heath', name: 'Blackmere Post Office', type: 'post_office', district: 'Market Strip', desc: 'The local sorting desk for the heath.', jobs: [starterJobs.counter] },
  { id: 'heath_hardware', settlementId: 'Blackmere Heath', name: 'Heath Hardware', type: 'hardware', district: 'Turnpike Yard', desc: 'Outdoor paint, animal feed, buckets, and tools.', jobs: [{ ...starterJobs.shelf, title: 'Shop Floor Assistant' }] },
  { id: 'blackmere_outfitters', settlementId: 'Blackmere Heath', name: 'Blackmere Outfitters', type: 'retail', district: 'Market Strip', desc: 'Workwear, waterproofs, and school shoes.', jobs: [starterJobs.counter] },
  { id: 'heath_admin_services', settlementId: 'Blackmere Heath', name: 'Heath Admin Services', type: 'office_admin', district: 'Old Turnpike', desc: 'A small office handling invoices for farms and hauliers.', jobs: [starterJobs.office] },

  { id: 'stag_food_market', settlementId: 'Stagborough', name: 'Stagborough Food Market', type: 'supermarket', district: 'Market Square', desc: 'A polished food market below old stone arcades.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'charter_coffee', settlementId: 'Stagborough', name: 'Charter Coffee', type: 'cafe', district: 'Market Square', desc: 'Espresso, laptops, and quiet status anxiety.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'old_charter_house', settlementId: 'Stagborough', name: 'The Old Charter House', type: 'pub', district: 'Bridge Street', desc: 'A smart pub with polished brass and old money regulars.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'stag_head', settlementId: 'Stagborough', name: "The Stag's Head", type: 'pub', district: 'Market Square', desc: 'The reliable town pub under the old sign.', jobs: [starterJobs.bar] },
  { id: 'stagborough_services', settlementId: 'Stagborough', name: 'Stagborough Services', type: 'petrol_station', district: 'Stag Road', desc: 'Fuel, coffee machines, and motorway-priced snacks.', jobs: [starterJobs.counter] },
  { id: 'stagborough_pharmacy', settlementId: 'Stagborough', name: 'Stagborough Pharmacy', type: 'pharmacy', district: 'Bridge Street', desc: 'A busy chemist with beauty shelves and prescriptions.', jobs: [starterJobs.counter] },
  { id: 'avenue_outfitters', settlementId: 'Stagborough', name: 'Avenue Outfitters', type: 'retail', district: 'Avenue Mall', desc: 'A high-street fashion shop in the mall.', jobs: [starterJobs.counter] },
  { id: 'peak_fitness_stagborough', settlementId: 'Stagborough', name: 'Peak Fitness Stagborough', type: 'gym', district: 'Avenue Mall', desc: 'A glossy gym for commuters and status lifters.', jobs: [{ ...starterJobs.counter, title: 'Front Desk Assistant' }] },
  { id: 'gilded_archer', settlementId: 'Stagborough', name: 'The Gilded Archer', type: 'pub', district: 'Old Chase', desc: 'A premium bar that pretends it is still a hunting lodge.', jobs: [starterJobs.bar] },
  { id: 'stag_creative', settlementId: 'Stagborough', name: 'Stag Creative Workshop', type: 'design_studio', district: 'Bridge Street', desc: 'A small design studio making ads for local brands.', jobs: [starterJobs.design] },

  { id: 'brockleigh_central_foods', settlementId: 'Brockleigh', name: 'Brockleigh Central Foods', type: 'supermarket', district: 'Station Road', desc: 'The biggest supermarket in the county seat.', jobs: [starterJobs.counter, starterJobs.shelf] },
  { id: 'county_arms', settlementId: 'Brockleigh', name: 'The County Arms', type: 'pub', district: 'Stone Plaza', desc: 'Council workers, lawyers, and students under one roof.', jobs: [starterJobs.bar, starterJobs.kitchen] },
  { id: 'steam_mug', settlementId: 'Brockleigh', name: 'The Steam Mug', type: 'cafe', district: 'Station Road', desc: 'A commuter cafe with constant takeaway orders.', jobs: [{ ...starterJobs.counter, title: 'Cafe Assistant' }] },
  { id: 'central_grind', settlementId: 'Brockleigh', name: 'Central Grind', type: 'cafe', district: 'Stone Plaza', desc: 'Laptop tables, loyalty cards, and stressed students.', jobs: [{ ...starterJobs.counter, title: 'Barista Trainee' }] },
  { id: 'brockleigh_services', settlementId: 'Brockleigh', name: 'Brockleigh Services', type: 'petrol_station', district: 'North Bridge', desc: 'A large petrol station at the edge of the county seat.', jobs: [starterJobs.counter] },
  { id: 'brockleigh_pharmacy', settlementId: 'Brockleigh', name: 'Brockleigh Pharmacy', type: 'pharmacy', district: 'High Street', desc: 'A busy town pharmacy with long counters.', jobs: [starterJobs.counter] },
  { id: 'county_post_office', settlementId: 'Brockleigh', name: 'County Post Office', type: 'post_office', district: 'High Street', desc: 'The main post office for the county.', jobs: [starterJobs.counter, starterJobs.office] },
  { id: 'brockleigh_hardware', settlementId: 'Brockleigh', name: 'Brockleigh Hardware', type: 'hardware', district: 'Station Road', desc: 'A large hardware shop for town and villages.', jobs: [{ ...starterJobs.shelf, title: 'Shop Floor Assistant' }] },
  { id: 'omnicorp_hq', settlementId: 'Brockleigh', name: 'OmniCorp Headquarters', type: 'office_admin', district: 'Civic Quarter', desc: 'Glass meeting rooms, long hours, and performance reviews.', jobs: [starterJobs.office] },
  { id: 'little_brock_software', settlementId: 'Brockleigh', name: 'Little Brock Software', type: 'software_studio', district: 'Station Road', desc: 'A small software firm above an accountant.', jobs: [starterJobs.support] },
  { id: 'civic_design_room', settlementId: 'Brockleigh', name: 'Civic Design Room', type: 'design_studio', district: 'Stone Plaza', desc: 'Branding, council leaflets, and local web design.', jobs: [starterJobs.design] },
  { id: 'red_lion', settlementId: 'Brockleigh', name: 'The Red Lion', type: 'pub', district: 'High Street', desc: 'An old pub with a loud lunch trade.', jobs: [starterJobs.bar] },
  { id: 'brockleigh_legal', settlementId: 'Brockleigh', name: 'Brockleigh Legal', type: 'law_firm', district: 'Civic Quarter', desc: 'A proper law firm near the courts, mostly not hiring teenagers.', jobs: [starterJobs.office] },
  { id: 'peak_fitness_brockleigh', settlementId: 'Brockleigh', name: 'Peak Fitness Brockleigh', type: 'gym', district: 'Station Road', desc: 'The county seat branch of Peak Fitness.', jobs: [{ ...starterJobs.counter, title: 'Front Desk Assistant' }] },
];

export const getBusinessesForSettlement = (settlementId) => (
  BUSINESSES.filter((business) => business.settlementId === settlementId)
);

export const getBusinessById = (businessId) => (
  BUSINESSES.find((business) => business.id === businessId) || null
);

export const getJobOpeningsForSettlement = (settlementId, methodId) => (
  getBusinessesForSettlement(settlementId).flatMap((business) => (
    (business.jobs || [])
      .filter((job) => !methodId || job.methods?.includes(methodId))
      .map((job) => ({
        businessId: business.id,
        businessName: business.name,
        settlementId: business.settlementId,
        businessType: business.type,
        title: job.title,
        track: job.track,
      }))
  ))
);
