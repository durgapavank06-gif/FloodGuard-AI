import { DrainageConduit } from '../types';

// Chennai CMWSSB drainage — 253 real mains + 760 inferred hierarchical (800 manholes)
// DEM 6–24m (6-24m), flat coastal plain slopes 0.0005–0.0011, sewer_type hierarchy: lateral/house -> branch -> main -> trunk -> outfall
// Coordinates 13.0–13.08N, 80.225–80.255E, elevations 6–24m (6-24m), DWR Chennai

export const drainageOverview = {
  totalDrains: 1013, // 253 real CMWSSB mains + 760 inferred hierarchical
  realMains: 253,
  inferredHierarchical: 760,
  manholes: 800,
  inlets: 300,
  critical: 14,
  nearCapacity: 28,
  normal: 971,
  networkCapacityPercent: 81.2,
  totalFlowRateM3s: 198.5,
  surchargeNodesCount: 9,
  backflowAlertActive: true,
  elevationRange: '6–24m DEM',
  slopeRange: '0.0005–0.0011 (flat coastal plain)',
  sewerHierarchy: 'lateral/house -> branch -> main -> trunk -> outfall',
  source: 'CMWSSB 253 real + inferred 760 @ -10m invert + 800 manholes',
};

export const sewerTypeHierarchy = ['lateral/house', 'branch', 'main', 'trunk', 'outfall'] as const;

export const inferredNetworkStats = {
  totalInferred: 760,
  bySewerType: {
    'lateral/house': 412,
    branch: 198,
    main: 102,
    trunk: 38,
    outfall: 10,
  },
  connectionConfidenceAvg: 0.72,
  sewerTypeConfidenceAvg: 0.58,
};

export const mockDrainageConduits: DrainageConduit[] = [
  {
    id: 'drain-c104',
    code: 'Drain C-104',
    name: 'T. Nagar Bazullah Road Trunk (CMWSSB Real Main)',
    capacityPercent: 91,
    status: 'critical',
    flowRateM3s: 4.8,
    maxCapacityM3s: 5.2,
    connectedRoadsCount: 3,
    connectedRoads: ['Bazullah Road', 'G.N. Chetty Road', 'Usman Road'],
    location: 'Zone C01 - T. Nagar (7m basin)',
    diameterMm: 1800,
    slopePercent: 0.08,
    backflowRisk: true,
    coordinates: { x1: 420, y1: 380, x2: 470, y2: 410 }
  },
  {
    id: 'drain-c089',
    code: 'Drain C-089',
    name: 'Nungambakkam Sterling Road Branch Collector',
    capacityPercent: 82,
    status: 'near_limit',
    flowRateM3s: 3.6,
    maxCapacityM3s: 4.4,
    connectedRoadsCount: 4,
    connectedRoads: ['College Road', 'Sterling Road', 'Haddows Road', 'Seetha Nagar Lane'],
    location: 'Zone C02 - Nungambakkam (11m)',
    diameterMm: 1500,
    slopePercent: 0.09,
    backflowRisk: true,
    coordinates: { x1: 440, y1: 280, x2: 480, y2: 310 }
  },
  {
    id: 'drain-c072',
    code: 'Drain C-072',
    name: 'Anna Nagar 2nd Ave Inferred Branch (sewer_type: branch)',
    capacityPercent: 88,
    status: 'critical',
    flowRateM3s: 5.1,
    maxCapacityM3s: 5.8,
    connectedRoadsCount: 3,
    connectedRoads: ['Anna Nagar 2nd Avenue', 'Mogappair Road', 'Shanthi Colony'],
    location: 'Zone C03 - Anna Nagar (9m)',
    diameterMm: 1600,
    slopePercent: 0.07,
    backflowRisk: true,
    coordinates: { x1: 280, y1: 220, x2: 330, y2: 250 }
  },
  {
    id: 'drain-c128',
    code: 'Drain C-128',
    name: 'Velachery 100ft Low Collector (6m flat ponding)',
    capacityPercent: 94,
    status: 'surcharged',
    flowRateM3s: 6.2,
    maxCapacityM3s: 6.5,
    connectedRoadsCount: 4,
    connectedRoads: ['Velachery 100 Feet Road', 'Vijayanagar', 'Drivers Colony', 'Taramani Link'],
    location: 'Zone C04 - Velachery (6m low)',
    diameterMm: 2000,
    slopePercent: 0.05,
    backflowRisk: true,
    coordinates: { x1: 350, y1: 420, x2: 400, y2: 450 }
  },
  {
    id: 'drain-c055',
    code: 'Drain C-055',
    name: 'Thiruvanmiyur Adyar Outfall Trunk (sewer_type: outfall)',
    capacityPercent: 62,
    status: 'normal',
    flowRateM3s: 8.4,
    maxCapacityM3s: 13.5,
    connectedRoadsCount: 3,
    connectedRoads: ['Lattice Bridge Road', 'ECR Thiruvanmiyur', 'Old Mahabalipuram Road'],
    location: 'Zone C05 - Thiruvanmiyur (14m ridge)',
    diameterMm: 2800,
    slopePercent: 0.06,
    backflowRisk: false,
    coordinates: { x1: 520, y1: 300, x2: 570, y2: 330 }
  },
  {
    id: 'drain-c034',
    code: 'Drain C-034',
    name: 'Cooum Connector Inferred Lateral (sewer_type: lateral/house)',
    capacityPercent: 54,
    status: 'normal',
    flowRateM3s: 1.8,
    maxCapacityM3s: 3.4,
    connectedRoadsCount: 2,
    connectedRoads: ['Aminjikarai Canal Road', 'Padi Bridge'],
    location: 'Zone C03 - Anna Nagar inferred 760 network',
    diameterMm: 900,
    slopePercent: 0.10,
    backflowRisk: false,
    coordinates: { x1: 240, y1: 250, x2: 280, y2: 220 }
  },
  {
    id: 'drain-c019',
    code: 'Drain C-019',
    name: 'Buckingham Canal Branch Sewer',
    capacityPercent: 44,
    status: 'normal',
    flowRateM3s: 2.2,
    maxCapacityM3s: 5.0,
    connectedRoadsCount: 2,
    connectedRoads: ['Buckingham Canal Bank Road', 'Thiruvanmiyur Beach Road'],
    location: 'Zone C05 - Buckingham Canal (Adyar estuary)',
    diameterMm: 1200,
    slopePercent: 0.05,
    backflowRisk: false,
    coordinates: { x1: 540, y1: 280, x2: 560, y2: 310 }
  },
  {
    id: 'drain-c112',
    code: 'Drain C-112',
    name: 'G.N. Chetty Road Gravity Outfall (sewer_type: main)',
    capacityPercent: 41,
    status: 'normal',
    flowRateM3s: 2.0,
    maxCapacityM3s: 4.9,
    connectedRoadsCount: 2,
    connectedRoads: ['G.N. Chetty Road', 'Thyagaraya Nagar Link'],
    location: 'Zone C01 - T. Nagar higher spine (8m)',
    diameterMm: 1400,
    slopePercent: 0.11,
    backflowRisk: false,
    coordinates: { x1: 410, y1: 360, x2: 440, y2: 380 }
  },
];

export const mockDrainageGraphNodes = [
  { id: 'MH-TNGR-A', label: 'MH-C01-A (Bazullah Rd trunk)', x: 420, y: 380, depth: 3.8, status: 'surcharge', waterLevelM: 3.7, invertElev: 7.2 },
  { id: 'MH-TNGR-B', label: 'MH-C01-B (G.N. Chetty outfall)', x: 470, y: 410, depth: 3.4, status: 'surcharge', waterLevelM: 3.3, invertElev: 7.0 },
  { id: 'MH-NGMB-A', label: 'MH-C02-A (Sterling Rd branch)', x: 440, y: 280, depth: 2.9, status: 'near_limit', waterLevelM: 2.6, invertElev: 11.0 },
  { id: 'MH-ANNA-A', label: 'MH-C03-A (Anna Nagar 2nd Ave)', x: 280, y: 220, depth: 3.2, status: 'surcharge', waterLevelM: 3.0, invertElev: 9.1 },
  { id: 'MH-VLCH-A', label: 'MH-C04-A (Velachery 100ft low)', x: 350, y: 420, depth: 4.6, status: 'critical', waterLevelM: 4.5, invertElev: 6.2 },
  { id: 'MH-VLCH-B', label: 'MH-C04-B (Drivers Colony)', x: 400, y: 450, depth: 4.2, status: 'surcharge', waterLevelM: 4.0, invertElev: 6.0 },
  { id: 'MH-THIR-A', label: 'MH-C05-A (Lattice Bridge outfall)', x: 520, y: 300, depth: 2.1, status: 'normal', waterLevelM: 1.1, invertElev: 14.0 },
  { id: 'MH-CANAL-A', label: 'MH-C05-B (Buckingham Canal)', x: 560, y: 310, depth: 2.0, status: 'normal', waterLevelM: 1.0, invertElev: 13.5 },
];
