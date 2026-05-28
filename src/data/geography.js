export const SETTLEMENTS = {
  Brockleigh: {
    id: "Brockleigh",
    name: "Brockleigh",
    rank: 1,
    type: "County Seat",
    popTier: "High",
    coords: [69, 58],
    desc: "The county seat of Brockleighshire. A bustling administrative hub with brick storefronts, stone plazas, and a grand neoclassical library. It sits at the center of the county's trade.",
    venues: ['university', 'library', 'office', 'club'],
    pubs: ["The County Arms", "The Crown & Anchor", "The Red Lion"],
    cafes: ["The Steam Mug", "Central Grind", "The Library Cafe", "The Velvet Drip"]
  },
  "Blackmere Heath": {
    id: "Blackmere Heath",
    name: "Blackmere Heath",
    rank: 2,
    type: "Heath Village",
    popTier: "Medium-High",
    coords: [42, 86],
    desc: "A sprawling heathland community sitting high on the exposed northern plains. Known for its historic turnpike post and windswept sheep pastures.",
    venues: [],
    pubs: ["The Windmill Inn", "The Heather Queen"],
    cafes: ["Heathside Brews"]
  },
  Bramblewick: {
    id: "Bramblewick",
    name: "Bramblewick",
    rank: 3,
    type: "Fen-Edge Village",
    popTier: "Medium",
    coords: [91, 82],
    desc: "A beautiful fen-edge village nestled in fertile, low-lying farm fields. Hosts the greenwood parkways and historic gardens.",
    venues: ['park', 'library'],
    pubs: ["The Swan & Cygnet", "The Fenman's Rest"],
    cafes: ["The Orchard Cafe"]
  },
  Harrowfen: {
    id: "Harrowfen",
    name: "Harrowfen",
    rank: 4,
    type: "Fenland Settlement",
    popTier: "Medium",
    coords: [108, 58],
    desc: "An engineered settlement surrounded by deep drainage channels, dykes, and dark peat fields. A community built on reclaimed ground.",
    venues: [],
    pubs: ["The Reclaimed Sluice", "The Dyke Keeper"],
    cafes: ["Peat & Bean"]
  },
  Stagborough: {
    id: "Stagborough",
    name: "Stagborough",
    rank: 5,
    type: "Market Town",
    popTier: "Medium-High",
    coords: [83, 33],
    desc: "A wealthy, ancient market town holding an old royal charter. Famous for its aristocratic hunting chase, old stone bridge, and high-society clubs.",
    venues: ['mall', 'gym', 'library', 'club'],
    pubs: ["The Stag's Head", "The Old Charter House", "The Gilded Archer"],
    cafes: ["The Market Square Cafe", "Charter Coffee"]
  },
  "Willow Fen": {
    id: "Willow Fen",
    name: "Willow Fen",
    rank: 6,
    type: "Fen Village",
    popTier: "Low-Medium",
    coords: [124, 45],
    desc: "A remote fen village accessible only by embanked causeways. The local economy revolves around reed cutting and seasonal marsh foraging.",
    venues: [],
    pubs: ["The Reed Cutter's Arms"],
    cafes: []
  },
  Durnthorne: {
    id: "Durnthorne",
    name: "Durnthorne",
    rank: 7,
    type: "Forest Village",
    popTier: "Low-Medium",
    coords: [39, 47],
    desc: "A quiet, shadowed village surrounded by dense old-growth woodland. Its narrow forest roads are lined with massive, ancient oak trees.",
    venues: [],
    pubs: ["The Shaded Oak"],
    cafes: ["Foragers Coffee House"]
  },
  Eldersley: {
    id: "Eldersley",
    name: "Eldersley",
    rank: 8,
    type: "Upland Hamlet",
    popTier: "Low",
    coords: [62, 22],
    desc: "A small hamlet built on steep, grassy hills overlooking the southern chase. Frequented by travelers heading toward the deeper forest.",
    venues: [],
    pubs: ["The Upland Shepherd"],
    cafes: []
  },
  "Stillwater-under-Barrow": {
    id: "Stillwater-under-Barrow",
    name: "Stillwater-under-Barrow",
    rank: 9,
    type: "Wetland Hamlet",
    popTier: "Low",
    coords: [32, 21],
    desc: "A damp, misty hamlet resting at the foot of ancient burial mounds. The atmosphere is quiet, heavy, and rich with local folklore.",
    venues: [],
    pubs: ["The Barrow & Spade"],
    cafes: []
  },
  Fallowmere: {
    id: "Fallowmere",
    name: "Fallowmere",
    rank: 10,
    type: "Wooded Hamlet",
    popTier: "Very Low",
    coords: [17, 68],
    desc: "An isolated settlement set within wet woodland margins. It borders the great western mires and heath tracks.",
    venues: [],
    pubs: ["The Woodman's Lodge"],
    cafes: []
  },
  Endleigh: {
    id: "Endleigh",
    name: "Endleigh",
    rank: 11,
    type: "Remote Bog Hamlet",
    popTier: "Very Low",
    coords: [9, 9],
    desc: "A tiny, waterlogged hamlet surrounded by deep bogs. Heavily isolated and remote, it represents the absolute edge of Brockleighshire. Your journey begins here.",
    venues: [],
    pubs: ["The Bog & Bottle"],
    cafes: []
  }
};

export const FACTORS = {
  road_surface: {
    paved_road: 1.00,
    old_turnpike: 1.15,
    market_road: 1.25,
    lane: 1.65,
    forest_road: 2.05,
    drove_road: 2.20,
    causeway: 2.85,
    foot_track: 4.25,
    no_regular_road: 8.00
  },
  travel_environment: {
    ordinary_lowland: 1.00,
    enclosed_farmland: 1.05,
    exposed_heath: 1.12,
    rolling_chase: 1.15,
    maintained_fen_bank: 1.25,
    reed_fen_margin: 1.35,
    embanked_causeway: 1.40,
    wet_woodland_margin: 1.55,
    forest_enclosed: 1.70,
    deep_forest_holloway: 1.95,
    mire_edge: 2.10,
    bog_causeway: 2.25,
    unengineered_bog_track: 3.60,
    rough_moor_track: 1.90
  },
  terrain_region: {
    dry_lowland: 1.00,
    open_heath: 1.20,
    enclosed_farmland: 1.15,
    rolling_chase: 1.35,
    managed_fen: 1.85,
    reed_fen: 2.30,
    peat_marsh: 2.80,
    bog: 4.60,
    wet_woodland: 2.75,
    old_growth_forest: 3.60,
    steep_wooded_rise: 2.50,
    rough_upland: 2.10,
    chalk_rise: 1.30
  },
  crossing_penalties: {
    bridge: 0,
    old_stone_bridge: 1,
    toll_bridge: 2,
    ford: 5,
    ferry: 8,
    seasonal_ford: 14,
    marsh_causeway_gate: 6
  },
  blocked_crossing: {
    value: null,
    passable: false
  }
};

export const ROADS = [
  {
    name: "Great North Heath Road",
    from: "Brockleigh",
    to: "Blackmere Heath",
    kind: "old_turnpike",
    road_surface_key: "old_turnpike",
    travel_environment_key: "exposed_heath",
    distance_km: 39,
    normal_route: true,
    crossings: [
      { type: "bridge", name: "Brockleigh North Bridge", penalty_key: "bridge" }
    ],
    path: [[69, 58], [61, 68], [50, 78], [42, 86]]
  },
  {
    name: "Bramblewick Road",
    from: "Brockleigh",
    to: "Bramblewick",
    kind: "paved_road",
    road_surface_key: "paved_road",
    travel_environment_key: "ordinary_lowland",
    distance_km: 34,
    normal_route: true,
    crossings: [
      { type: "bridge", name: "Little Brock Bridge", penalty_key: "bridge" }
    ],
    path: [[69, 58], [78, 68], [86, 76], [91, 82]]
  },
  {
    name: "Harrowfen Causeway",
    from: "Brockleigh",
    to: "Harrowfen",
    kind: "causeway",
    road_surface_key: "causeway",
    travel_environment_key: "maintained_fen_bank",
    distance_km: 43,
    normal_route: true,
    crossings: [
      { type: "toll_bridge", name: "East Brock Toll", penalty_key: "toll_bridge" },
      { type: "marsh_causeway_gate", name: "Harrow Bank Gate", penalty_key: "marsh_causeway_gate" }
    ],
    path: [[69, 58], [84, 57], [96, 58], [108, 58]],
    notes: "This is not multiplied by the full managed_fen terrain factor. The road is engineered, but its environment still imposes maintenance, drainage, wind exposure, and seasonal delay costs."
  },
  {
    name: "Lower Fen Road",
    from: "Harrowfen",
    to: "Willow Fen",
    kind: "causeway",
    road_surface_key: "causeway",
    travel_environment_key: "embanked_causeway",
    distance_km: 26,
    normal_route: true,
    crossings: [
      { type: "marsh_causeway_gate", name: "Willow Bank", penalty_key: "marsh_causeway_gate" }
    ],
    path: [[108, 58], [116, 51], [124, 45]]
  },
  {
    name: "Stag Road",
    from: "Brockleigh",
    to: "Stagborough",
    kind: "old_turnpike",
    road_surface_key: "old_turnpike",
    travel_environment_key: "enclosed_farmland",
    distance_km: 32,
    normal_route: true,
    crossings: [
      { type: "old_stone_bridge", name: "South Brock Bridge", penalty_key: "old_stone_bridge" }
    ],
    path: [[69, 58], [75, 48], [80, 39], [83, 33]]
  },
  {
    name: "Durnthorne Forest Road",
    from: "Brockleigh",
    to: "Durnthorne",
    kind: "forest_road",
    road_surface_key: "forest_road",
    travel_environment_key: "forest_enclosed",
    distance_km: 41,
    normal_route: true,
    crossings: [
      { type: "ford", name: "Wold Ford", penalty_key: "ford" }
    ],
    path: [[69, 58], [58, 55], [48, 51], [39, 47]],
    notes: "Forest roads keep a high environmental factor because the road has not defeated the forest in the same way a causeway defeats wet ground. Narrowness, shade, mud, fallen timber, poor visibility, and holloways remain important."
  },
  {
    name: "Blackmere Western Road",
    from: "Blackmere Heath",
    to: "Fallowmere",
    kind: "lane",
    road_surface_key: "lane",
    travel_environment_key: "exposed_heath",
    distance_km: 38,
    normal_route: true,
    crossings: [
      { type: "seasonal_ford", name: "Blackmere Ford", penalty_key: "seasonal_ford" }
    ],
    path: [[42, 86], [31, 80], [22, 74], [17, 68]]
  },
  {
    name: "Fallowmere Wood Lane",
    from: "Fallowmere",
    to: "Durnthorne",
    kind: "forest_road",
    road_surface_key: "forest_road",
    travel_environment_key: "wet_woodland_margin",
    distance_km: 43,
    normal_route: true,
    crossings: [
      { type: "ford", name: "Carr Ford", penalty_key: "ford" }
    ],
    path: [[17, 68], [24, 59], [31, 52], [39, 47]]
  },
  {
    name: "Barrow Road",
    from: "Durnthorne",
    to: "Stillwater-under-Barrow",
    kind: "drove_road",
    road_surface_key: "drove_road",
    travel_environment_key: "deep_forest_holloway",
    distance_km: 34,
    normal_route: true,
    crossings: [
      { type: "ford", name: "Thorne Ford", penalty_key: "ford" }
    ],
    path: [[39, 47], [35, 38], [32, 29], [32, 21]]
  },
  {
    name: "Endleigh Causeway",
    from: "Stillwater-under-Barrow",
    to: "Endleigh",
    kind: "causeway",
    road_surface_key: "causeway",
    travel_environment_key: "bog_causeway",
    distance_km: 29,
    normal_route: true,
    crossings: [
      { type: "seasonal_ford", name: "Dead Mare Ford", penalty_key: "seasonal_ford" },
      { type: "marsh_causeway_gate", name: "Endleigh Gate", penalty_key: "marsh_causeway_gate" }
    ],
    path: [[32, 21], [24, 17], [16, 12], [9, 9]],
    notes: "This remains bad, but no longer absurd. The cost comes from the poor causeway surface, residual bog environment, seasonal ford, and gate delays, not from multiplying the full bog terrain penalty across the whole engineered route."
  },
  {
    name: "Eldersley Road",
    from: "Stagborough",
    to: "Eldersley",
    kind: "lane",
    road_surface_key: "lane",
    travel_environment_key: "rolling_chase",
    distance_km: 27,
    normal_route: true,
    crossings: [
      { type: "bridge", name: "Little Stag Bridge", penalty_key: "bridge" }
    ],
    path: [[83, 33], [73, 28], [62, 22]]
  },
  {
    name: "Mire Road",
    from: "Eldersley",
    to: "Stillwater-under-Barrow",
    kind: "drove_road",
    road_surface_key: "drove_road",
    travel_environment_key: "mire_edge",
    distance_km: 35,
    normal_route: true,
    crossings: [
      { type: "ford", name: "Elder Ford", penalty_key: "ford" },
      { type: "seasonal_ford", name: "Stillwater Ford", penalty_key: "seasonal_ford" }
    ],
    path: [[62, 22], [50, 21], [40, 20], [32, 21]],
    notes: "This is a poor but valid road. It should compete with the route through Durnthorne, not be made impossible by full peat-marsh multiplication."
  },
  {
    name: "Old South-West Track",
    from: "Eldersley",
    to: "Endleigh",
    kind: "foot_track",
    road_surface_key: "foot_track",
    travel_environment_key: "unengineered_bog_track",
    distance_km: 58,
    normal_route: false,
    passable: false,
    blocks_edge: true,
    routing_instruction: "Exclude from the normal travel graph. This is a broken historical track, not a valid route. Use only for narrative, local legend, failed journeys, or special routing profiles.",
    crossings: [
      { type: "seasonal_ford", name: "Mire Steps", penalty_key: "seasonal_ford" },
      { type: "blocked_crossing", name: "Lost Causeway", passable: false, blocks_edge: true }
    ],
    path: [[62, 22], [46, 17], [30, 11], [18, 8], [9, 9]]
  },
  {
    name: "Bramblewick Fen Road",
    from: "Bramblewick",
    to: "Harrowfen",
    kind: "market_road",
    road_surface_key: "market_road",
    travel_environment_key: "maintained_fen_bank",
    distance_km: 35,
    normal_route: true,
    crossings: [
      { type: "bridge", name: "Bramble Sluice Bridge", penalty_key: "bridge" }
    ],
    path: [[91, 82], [100, 72], [105, 64], [108, 58]]
  },
  {
    name: "Stag-Harrow Road",
    from: "Stagborough",
    to: "Harrowfen",
    kind: "market_road",
    road_surface_key: "market_road",
    travel_environment_key: "maintained_fen_bank",
    distance_km: 42,
    normal_route: true,
    crossings: [
      { type: "toll_bridge", name: "Stagbourne Toll", penalty_key: "toll_bridge" }
    ],
    path: [[83, 33], [94, 40], [101, 49], [108, 58]]
  }
];

// Vehicles profiles mapping speed (km/h) and energy consumption factor (per cost unit)
export const VEHICLE_PROFILES = {
  foot: { id: "foot", name: "On Foot", speed: 5, energy_per_km: 0.60 },
  bicycle: { id: "bicycle", name: "Bicycle", speed: 12, energy_per_km: 0.30 },
  scooter: { id: "scooter", name: "Electric Scooter", speed: 25, energy_per_km: 0.12 },
  sedan: { id: "sedan", name: "Used Sedan", speed: 65, energy_per_km: 0.06 },
  sports_car: { id: "sports_car", name: "Luxury Sports Car", speed: 95, energy_per_km: 0.04 }
};

export const calculateEdgeCost = (road, profile = 'normal_travel', state = {}) => {
  // Check if passable for profile
  let isPassable = true;
  
  if (road.passable === false || road.blocks_edge === true) {
    isPassable = false;
  }

  if (road.crossings) {
    for (const crossing of road.crossings) {
      if (crossing.passable === false || crossing.blocks_edge === true) {
        isPassable = false;
      }
    }
  }

  if (profile === 'normal_travel') {
    if (road.normal_route === false) {
      isPassable = false;
    }
    if (road.kind === 'foot_track' && road.normal_route === false) {
      isPassable = false;
    }
  }

  if (!isPassable) return null;

  const roadSurfaceFactor = FACTORS.road_surface[road.road_surface_key] || 1.0;
  const travelEnvFactor = FACTORS.travel_environment[road.travel_environment_key] || 1.0;
  
  let crossingPenaltiesSum = 0;
  if (road.crossings) {
    for (const crossing of road.crossings) {
      crossingPenaltiesSum += FACTORS.crossing_penalties[crossing.penalty_key] || 0;
    }
  }

  const seasonalModifier = 0;
  const isolationModifier = 0;

  // Formula:
  // edge_cost = distance_km * road_surface_factor * travel_environment_factor + sum(crossing_penalties) + seasonal_modifier + isolation_modifier
  const cost = road.distance_km * roadSurfaceFactor * travelEnvFactor + crossingPenaltiesSum + seasonalModifier + isolationModifier;
  return cost;
};

export const findShortestPath = (fromPlace, toPlace, profile = 'normal_travel', state = {}) => {
  if (fromPlace === toPlace) {
    return { path: [fromPlace], cost: 0, distance: 0, roads: [] };
  }

  const adjacencyList = {};
  for (const name of Object.keys(SETTLEMENTS)) {
    adjacencyList[name] = [];
  }

  for (const road of ROADS) {
    const cost = calculateEdgeCost(road, profile, state);
    if (cost === null) continue;

    adjacencyList[road.from].push({ node: road.to, cost, distance: road.distance_km, road });
    adjacencyList[road.to].push({ node: road.from, cost, distance: road.distance_km, road });
  }

  const distances = {};
  const prev = {};
  const distancesKm = {};
  const edgeUsed = {};
  const queue = new Set();

  for (const node of Object.keys(SETTLEMENTS)) {
    distances[node] = Infinity;
    distancesKm[node] = 0;
    prev[node] = null;
    edgeUsed[node] = null;
    queue.add(node);
  }

  distances[fromPlace] = 0;

  while (queue.size > 0) {
    let minNode = null;
    for (const node of queue) {
      if (minNode === null || distances[node] < distances[minNode]) {
        minNode = node;
      }
    }

    if (distances[minNode] === Infinity) {
      break;
    }

    queue.delete(minNode);

    if (minNode === toPlace) {
      break;
    }

    for (const neighbor of adjacencyList[minNode]) {
      if (!queue.has(neighbor.node)) continue;
      const alt = distances[minNode] + neighbor.cost;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        distancesKm[neighbor.node] = distancesKm[minNode] + neighbor.distance;
        prev[neighbor.node] = minNode;
        edgeUsed[neighbor.node] = neighbor.road;
      }
    }
  }

  if (distances[toPlace] === Infinity) {
    return null; // unreachable
  }

  const path = [];
  const pathRoads = [];
  let curr = toPlace;
  while (curr !== null) {
    path.unshift(curr);
    if (edgeUsed[curr]) {
      pathRoads.unshift(edgeUsed[curr]);
    }
    curr = prev[curr];
  }

  return {
    path,
    cost: distances[toPlace],
    distance: distancesKm[toPlace],
    roads: pathRoads
  };
};

export const computeSettlementMetrics = (place) => {
  const powerCenters = ["Brockleigh", "Blackmere Heath", "Bramblewick", "Harrowfen", "Stagborough"];
  
  let totalCost = 0;
  let count = 0;
  for (const center of powerCenters) {
    const result = findShortestPath(place, center, 'normal_travel');
    if (result) {
      totalCost += result.cost;
      count++;
    }
  }
  
  const isolation_index = count > 0 ? (totalCost / count) : 999;
  const accessibility_score = 1 / (1 + isolation_index);
  
  const resultBrockleigh = findShortestPath("Brockleigh", place, 'normal_travel');
  const resultStagborough = findShortestPath("Stagborough", place, 'normal_travel');
  
  const remoteness = (resultBrockleigh ? resultBrockleigh.cost : 999) + (resultStagborough ? resultStagborough.cost : 999);
  
  return {
    isolation_index,
    accessibility_score,
    remoteness
  };
};

export const calculateTravelStats = (fromSettlement, toSettlement, ownedVehicles = []) => {
  const shortestPath = findShortestPath(fromSettlement, toSettlement, 'normal_travel');
  if (!shortestPath) return null;

  // Determine active vehicle (best one available in player's list)
  let activeVehicle = VEHICLE_PROFILES.foot;
  if (ownedVehicles.includes('sports_car')) {
    activeVehicle = VEHICLE_PROFILES.sports_car;
  } else if (ownedVehicles.includes('sedan')) {
    activeVehicle = VEHICLE_PROFILES.sedan;
  } else if (ownedVehicles.includes('scooter')) {
    activeVehicle = VEHICLE_PROFILES.scooter;
  } else if (ownedVehicles.includes('bicycle')) {
    activeVehicle = VEHICLE_PROFILES.bicycle;
  }

  const path_cost = shortestPath.cost;
  const distance_km = shortestPath.distance;

  // Travel time in hours based on path cost and speed
  const travel_time_hours = path_cost / activeVehicle.speed;
  const ticks = Math.max(1, Math.ceil(travel_time_hours * 6)); // 1 tick = 10 mins, so 6 ticks = 1 hour
  const energyCost = Math.max(1, Math.round(path_cost * activeVehicle.energy_per_km));
  
  let fitnessBonus = 0;
  if (activeVehicle.id === 'bicycle') {
    fitnessBonus = Math.min(5, Math.ceil(distance_km / 10)); // 1 fitness per 10km, max 5
  }

  return {
    ticks,
    energyCost,
    fitnessBonus,
    path: shortestPath.path,
    roads: shortestPath.roads,
    cost: path_cost,
    distance: distance_km,
    vehicleUsed: activeVehicle.name,
    vehicleId: activeVehicle.id
  };
};
