const FIRST_NAMES = [
  'Aiden', 'Amira', 'Ben', 'Cora', 'Dylan', 'Esha', 'Farah', 'Gavin', 'Hana', 'Imran',
  'Jade', 'Kai', 'Lena', 'Mason', 'Nia', 'Owen', 'Priya', 'Quinn', 'Rafi', 'Sana',
  'Theo', 'Uma', 'Vera', 'Wes', 'Yara', 'Zane',
];

const LAST_NAMES = [
  'Abbott', 'Bennett', 'Clarke', 'Davies', 'Ellis', 'Farley', 'Griffin', 'Hughes', 'Ibrahim', 'Jordan',
  'Khan', 'Lewis', 'Miller', 'Nolan', 'Olsen', 'Patel', 'Quade', 'Reed', 'Shaw', 'Turner',
  'Usman', 'Vance', 'Walsh', 'Xu', 'Young', 'Zimmer',
];

const ROLE_POOLS = {
  grocery: ['Store Manager', 'Duty Manager', 'Section Lead', 'Senior Cashier'],
  supermarket: ['Floor Manager', 'Shift Manager', 'Stock Team Lead', 'Service Desk Lead'],
  petrol_station: ['Forecourt Supervisor', 'Station Manager', 'Night Shift Lead'],
  takeaway: ['Kitchen Shift Lead', 'Counter Supervisor', 'Operations Lead'],
  pub: ['Bar Manager', 'Shift Supervisor', 'Cellar Lead'],
  cafe: ['Cafe Manager', 'Front-of-House Lead', 'Bar Lead'],
  post_office: ['Post Office Supervisor', 'Counter Lead'],
  pharmacy: ['Pharmacy Counter Lead', 'Store Supervisor'],
  hardware: ['Yard Supervisor', 'Shop Floor Lead'],
  retail: ['Retail Supervisor', 'Floor Manager'],
  gym: ['Front Desk Supervisor', 'Operations Lead'],
  office_admin: ['Office Supervisor', 'Operations Coordinator'],
  software_studio: ['Support Team Lead', 'Product Ops Lead'],
  design_studio: ['Studio Coordinator', 'Creative Ops Lead'],
  law_firm: ['Practice Coordinator', 'Office Supervisor'],
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createWorkforcePool = () => {
  const pool = [];
  let index = 0;
  for (const first of FIRST_NAMES) {
    for (const last of LAST_NAMES) {
      pool.push({
        id: `work_npc_${index}`,
        name: `${first} ${last}`,
      });
      index += 1;
    }
  }
  return pool;
};

export const WORKFORCE_NPCS = createWorkforcePool();

const pickDistinctWorkers = (seedKey, count) => {
  const seed = hashString(seedKey);
  const picks = [];
  for (let i = 0; i < count; i += 1) {
    const offset = (seed + (i * 97)) % WORKFORCE_NPCS.length;
    picks.push(WORKFORCE_NPCS[offset]);
  }
  return picks;
};

export const getBusinessStaff = (business) => {
  if (!business) return null;
  const picks = pickDistinctWorkers(`${business.id}:${business.type}`, 4);
  const supervisorRolePool = ROLE_POOLS[business.type] || ['Shift Supervisor'];
  const supervisorRole = supervisorRolePool[hashString(`${business.id}:role`) % supervisorRolePool.length];
  return {
    supervisor: {
      ...picks[0],
      role: supervisorRole,
      businessId: business.id,
    },
    coworkers: picks.slice(1).map((worker, index) => ({
      ...worker,
      role: `Coworker ${index + 1}`,
      businessId: business.id,
    })),
  };
};

