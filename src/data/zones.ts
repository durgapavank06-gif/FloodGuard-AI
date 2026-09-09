import { Zone } from '../types';

export const mockZones: Zone[] = [
  {
    id: 'zone-14',
    code: 'Zone 14',
    name: 'Begumpet & Prakash Nagar Underpass',
    riskLevel: 'critical',
    floodProbability: 91,
    expectedOnsetMinutes: 27,
    estimatedDepthCm: 42,
    rainfallMmPerHour: 68,
    drainageUtilization: 94,
    elevationMeters: 498,
    surfaceRunoffPercent: 88,
    populationAtRisk: 14200,
    coordinates: {
      lat: 17.4447,
      lng: 78.4664,
      svgX: 470,
      svgY: 260,
    },
    polyPoints: '440,240 500,245 520,285 460,295 430,270',
    mainRiskFactors: [
      'Heavy radar-detected downpour (68 mm/hr)',
      'Low basin elevation relative to surrounding terrain (498m)',
      'High concrete imperviousness (88% runoff)',
      'Major storm conduit D-104 & D-089 surcharge backflow'
    ],
    recommendedActions: [
      'Close Begumpet Railway Underpass to all traffic',
      'Deploy two 500-HP dewatering high-volume pumps to Prakash Nagar culvert',
      'Broadcast Level-4 mobile flash alert to 14,000 residents',
      'Divert inbound traffic to Sanjeeva Reddy Nagar elevated corridor'
    ],
    lastUpdated: '2 min ago'
  },
  {
    id: 'zone-09',
    code: 'Zone 09',
    name: 'Tolichowki & Nadeem Colony Basin',
    riskLevel: 'critical',
    floodProbability: 84,
    expectedOnsetMinutes: 34,
    estimatedDepthCm: 38,
    rainfallMmPerHour: 62,
    drainageUtilization: 91,
    elevationMeters: 504,
    surfaceRunoffPercent: 82,
    populationAtRisk: 19500,
    coordinates: {
      lat: 17.4042,
      lng: 78.4128,
      svgX: 280,
      svgY: 370,
    },
    polyPoints: '250,340 310,350 320,400 260,410 240,370',
    mainRiskFactors: [
      'Persistent high-intensity cloud cell',
      'Natural depression basin with blocked nala feeder',
      'Encroached outlet into Shah Hatim Talab lake',
      'Surcharge backflow at Shaikpet junction'
    ],
    recommendedActions: [
      'Position NDRF and SDRF rubber rescue inflatables at Colony Main Gate',
      'Engage secondary emergency sluice gates at Langar Houz bypass',
      'Send SMS blast for ground floor evacuation'
    ],
    lastUpdated: '1 min ago'
  },
  {
    id: 'zone-10',
    code: 'Zone 10',
    name: 'Moosarambagh & Musi Riverfront Causeway',
    riskLevel: 'critical',
    floodProbability: 93,
    expectedOnsetMinutes: 18,
    estimatedDepthCm: 56,
    rainfallMmPerHour: 71,
    drainageUtilization: 98,
    elevationMeters: 485,
    surfaceRunoffPercent: 91,
    populationAtRisk: 28400,
    coordinates: {
      lat: 17.3752,
      lng: 78.5082,
      svgX: 630,
      svgY: 450,
    },
    polyPoints: '600,430 670,435 680,480 610,485 590,455',
    mainRiskFactors: [
      'Upstream Himayat Sagar / Osman Sagar discharge surge',
      'Severely silted stormwater trunk line outfalls',
      'Riverbank road elevation below 10-year flood line',
      'Zero hydraulic gradient remaining'
    ],
    recommendedActions: [
      'Immediate closure of Moosarambagh bridge and causeway',
      'Sound community siren in riverside colonies',
      'Direct emergency evacuation to Govt High School relief shelter'
    ],
    lastUpdated: 'Just now'
  },
  {
    id: 'zone-11',
    code: 'Zone 11',
    name: 'Malakpet Railway Underbridge & Chanchalguda',
    riskLevel: 'critical',
    floodProbability: 90,
    expectedOnsetMinutes: 22,
    estimatedDepthCm: 46,
    rainfallMmPerHour: 66,
    drainageUtilization: 95,
    elevationMeters: 492,
    surfaceRunoffPercent: 86,
    populationAtRisk: 16800,
    coordinates: {
      lat: 17.3768,
      lng: 78.4902,
      svgX: 580,
      svgY: 420,
    },
    polyPoints: '550,400 610,405 620,445 560,450 540,420',
    mainRiskFactors: [
      'Submerged railway underpass catchment trough',
      'Pump station automatic float switch trip warning',
      'Surface runoff overflow from Old City ridge'
    ],
    recommendedActions: [
      'Barricade Malakpet RUB and switch traffic signals to diversion loop',
      'Inspect auxiliary diesel pump generators',
      'Issue warning to TSRTC public bus control room'
    ],
    lastUpdated: '3 min ago'
  },
  {
    id: 'zone-15',
    code: 'Zone 15',
    name: 'Secunderabad Station & Keyes High School Rd',
    riskLevel: 'critical',
    floodProbability: 88,
    expectedOnsetMinutes: 30,
    estimatedDepthCm: 39,
    rainfallMmPerHour: 64,
    drainageUtilization: 89,
    elevationMeters: 512,
    surfaceRunoffPercent: 84,
    populationAtRisk: 31000,
    coordinates: {
      lat: 17.4399,
      lng: 78.5018,
      svgX: 590,
      svgY: 260,
    },
    polyPoints: '560,230 630,235 640,285 570,295 550,260',
    mainRiskFactors: [
      'High commuter density transit hub',
      'Underground stormwater conduit age > 45 years',
      'Heavy runoff from Marredpally higher ridge'
    ],
    recommendedActions: [
      'Station emergency tow trucks at Station Road entrance',
      'Clear trash grating at Keyes High School box drain',
      'Alert South Central Railway emergency cell'
    ],
    lastUpdated: '4 min ago'
  },
  {
    id: 'zone-21',
    code: 'Zone 21',
    name: 'Ameerpet & Mythrivanam Metro Junction',
    riskLevel: 'high',
    floodProbability: 79,
    expectedOnsetMinutes: 45,
    estimatedDepthCm: 29,
    rainfallMmPerHour: 54,
    drainageUtilization: 82,
    elevationMeters: 520,
    surfaceRunoffPercent: 85,
    populationAtRisk: 22000,
    coordinates: {
      lat: 17.4375,
      lng: 78.4483,
      svgX: 410,
      svgY: 270,
    },
    polyPoints: '380,240 440,245 450,290 390,300 370,270',
    mainRiskFactors: [
      'Dense urban commercial footfall and coaching centers',
      'Metro pillar construction runoff channeling',
      'Stormwater inlet blockage by commercial debris'
    ],
    recommendedActions: [
      'Deploy municipal rodding machine to unblock inlets',
      'Deploy traffic marshals at SR Nagar turn',
      'Keep backup flood barriers ready at Metro concourse entry'
    ],
    lastUpdated: '2 min ago'
  },
  {
    id: 'zone-17',
    code: 'Zone 17',
    name: 'Khairatabad & Raj Bhavan Road',
    riskLevel: 'high',
    floodProbability: 72,
    expectedOnsetMinutes: 52,
    estimatedDepthCm: 24,
    rainfallMmPerHour: 51,
    drainageUtilization: 78,
    elevationMeters: 516,
    surfaceRunoffPercent: 77,
    populationAtRisk: 15400,
    coordinates: {
      lat: 17.4123,
      lng: 78.4597,
      svgX: 450,
      svgY: 340,
    },
    polyPoints: '420,320 480,325 490,370 430,375 410,345',
    mainRiskFactors: [
      'Steep runoff from Banjara Hills slopes towards Hussain Sagar',
      'Inlet throttling along Raj Bhavan corridor'
    ],
    recommendedActions: [
      'Monitor Hussain Sagar weir surplus channel level',
      'Clear curb inlets along VV Statue roundabout'
    ],
    lastUpdated: '5 min ago'
  },
  {
    id: 'zone-12',
    code: 'Zone 12',
    name: 'Malkajgiri & Anandbagh Railway Vents',
    riskLevel: 'high',
    floodProbability: 76,
    expectedOnsetMinutes: 48,
    estimatedDepthCm: 32,
    rainfallMmPerHour: 56,
    drainageUtilization: 83,
    elevationMeters: 528,
    surfaceRunoffPercent: 79,
    populationAtRisk: 18900,
    coordinates: {
      lat: 17.4474,
      lng: 78.5312,
      svgX: 680,
      svgY: 230,
    },
    polyPoints: '650,210 710,215 720,260 660,265 640,235',
    mainRiskFactors: [
      'Railway embankment acting as natural dam',
      'Insufficient culvert cross-section capacity'
    ],
    recommendedActions: [
      'Commission diesel pumps at Anandbagh vents',
      'Divert light vehicles via Neredmet link road'
    ],
    lastUpdated: '4 min ago'
  },
  {
    id: 'zone-05',
    code: 'Zone 05',
    name: 'Kukatpally & Y-Junction Highway',
    riskLevel: 'high',
    floodProbability: 77,
    expectedOnsetMinutes: 40,
    estimatedDepthCm: 28,
    rainfallMmPerHour: 55,
    drainageUtilization: 80,
    elevationMeters: 535,
    surfaceRunoffPercent: 81,
    populationAtRisk: 26000,
    coordinates: {
      lat: 17.4933,
      lng: 78.3995,
      svgX: 250,
      svgY: 150,
    },
    polyPoints: '220,130 280,135 290,180 230,185 210,155',
    mainRiskFactors: [
      'NH-65 arterial highway bottlenecks',
      'KPHB storm nala receiving industrial estate overflow'
    ],
    recommendedActions: [
      'Pre-position quick-response crane for stalled vehicles',
      'Restrict right-hand lane through deep puddle zones'
    ],
    lastUpdated: '3 min ago'
  },
  {
    id: 'zone-18',
    code: 'Zone 18',
    name: 'Nampally Station & Abids Corridor',
    riskLevel: 'high',
    floodProbability: 74,
    expectedOnsetMinutes: 50,
    estimatedDepthCm: 26,
    rainfallMmPerHour: 52,
    drainageUtilization: 77,
    elevationMeters: 505,
    surfaceRunoffPercent: 83,
    populationAtRisk: 21000,
    coordinates: {
      lat: 17.3916,
      lng: 78.4719,
      svgX: 490,
      svgY: 400,
    },
    polyPoints: '460,380 520,385 530,430 470,435 450,405',
    mainRiskFactors: [
      'High business district imperviousness',
      'Slower discharge into Musi basin'
    ],
    recommendedActions: [
      'Inspect underground cellar parking storm sumps',
      'Deploy traffic police at Taj Island junction'
    ],
    lastUpdated: '6 min ago'
  },
  {
    id: 'zone-08',
    code: 'Zone 08',
    name: 'Hitec City & Cyber Towers Ring Road',
    riskLevel: 'moderate',
    floodProbability: 52,
    expectedOnsetMinutes: 75,
    estimatedDepthCm: 14,
    rainfallMmPerHour: 38,
    drainageUtilization: 65,
    elevationMeters: 554,
    surfaceRunoffPercent: 74,
    populationAtRisk: 35000,
    coordinates: {
      lat: 17.4504,
      lng: 78.3808,
      svgX: 200,
      svgY: 260,
    },
    polyPoints: '170,240 230,245 240,290 180,295 160,265',
    mainRiskFactors: [
      'Moderate water sheet flow on Mindspace underpass',
      'Curb water collection near Shilparamam junction'
    ],
    recommendedActions: [
      'Keep underpass pump station on manual standby',
      'Clear leaf debris from grates'
    ],
    lastUpdated: '7 min ago'
  },
  {
    id: 'zone-04',
    code: 'Zone 04',
    name: 'Banjara Hills Road No. 12 & Lotus Pond Valley',
    riskLevel: 'moderate',
    floodProbability: 48,
    expectedOnsetMinutes: 85,
    estimatedDepthCm: 12,
    rainfallMmPerHour: 36,
    drainageUtilization: 58,
    elevationMeters: 560,
    surfaceRunoffPercent: 68,
    populationAtRisk: 12500,
    coordinates: {
      lat: 17.4156,
      lng: 78.4312,
      svgX: 350,
      svgY: 330,
    },
    polyPoints: '320,310 380,315 390,360 330,365 310,335',
    mainRiskFactors: [
      'High velocity hill-slope runoff',
      'Valley-bottom water pooling at MLA Colony turn'
    ],
    recommendedActions: [
      'Inspect silt catch pits along hillside retainers',
      'Alert residential welfare societies'
    ],
    lastUpdated: '8 min ago'
  },
  {
    id: 'zone-06',
    code: 'Zone 06',
    name: 'Madhapur & Inorbit Mall Catchment',
    riskLevel: 'moderate',
    floodProbability: 45,
    expectedOnsetMinutes: 90,
    estimatedDepthCm: 10,
    rainfallMmPerHour: 34,
    drainageUtilization: 54,
    elevationMeters: 558,
    surfaceRunoffPercent: 70,
    populationAtRisk: 18000,
    coordinates: {
      lat: 17.4325,
      lng: 78.3874,
      svgX: 220,
      svgY: 300,
    },
    polyPoints: '190,280 250,285 260,330 200,335 180,305',
    mainRiskFactors: [
      'Durgam Cheruvu lake spillway proximity',
      'Mall feeder road depression'
    ],
    recommendedActions: [
      'Monitor Durgam Cheruvu cable bridge weir gauges',
      'Keep warning signage posted'
    ],
    lastUpdated: '10 min ago'
  },
  {
    id: 'zone-01',
    code: 'Zone 01',
    name: 'Jubilee Hills Checkpost & KBR Park Ridge',
    riskLevel: 'low',
    floodProbability: 18,
    expectedOnsetMinutes: 180,
    estimatedDepthCm: 4,
    rainfallMmPerHour: 22,
    drainageUtilization: 32,
    elevationMeters: 582,
    surfaceRunoffPercent: 55,
    populationAtRisk: 8000,
    coordinates: {
      lat: 17.4289,
      lng: 78.4112,
      svgX: 290,
      svgY: 300,
    },
    polyPoints: '260,280 320,285 330,330 270,335 250,305',
    mainRiskFactors: [
      'Minor street runoff; high natural elevation and gravity drainage'
    ],
    recommendedActions: [
      'Standard patrol monitoring only',
      'Designated safe transit corridor for rerouted traffic'
    ],
    lastUpdated: '12 min ago'
  },
  {
    id: 'zone-03',
    code: 'Zone 03',
    name: 'Gachibowli Stadium & ORR Interchange',
    riskLevel: 'low',
    floodProbability: 22,
    expectedOnsetMinutes: 160,
    estimatedDepthCm: 5,
    rainfallMmPerHour: 24,
    drainageUtilization: 36,
    elevationMeters: 568,
    surfaceRunoffPercent: 60,
    populationAtRisk: 9500,
    coordinates: {
      lat: 17.4435,
      lng: 78.3498,
      svgX: 110,
      svgY: 280,
    },
    polyPoints: '80,260 140,265 150,310 90,315 70,285',
    mainRiskFactors: [
      'Wide modern drainage culverts with ample retention capacity'
    ],
    recommendedActions: [
      'Maintain clear outflow flumes along Outer Ring Road'
    ],
    lastUpdated: '15 min ago'
  },
  {
    id: 'zone-02',
    code: 'Zone 02',
    name: 'Financial District & WaveRock Ridge',
    riskLevel: 'low',
    floodProbability: 15,
    expectedOnsetMinutes: 180,
    estimatedDepthCm: 2,
    rainfallMmPerHour: 18,
    drainageUtilization: 28,
    elevationMeters: 574,
    surfaceRunoffPercent: 52,
    populationAtRisk: 7200,
    coordinates: {
      lat: 17.4190,
      lng: 78.3421,
      svgX: 90,
      svgY: 340,
    },
    polyPoints: '60,320 120,325 130,370 70,375 50,345',
    mainRiskFactors: [
      'Engineered sponge parks and porous paving in IT campus zones'
    ],
    recommendedActions: [
      'Normal operational monitoring'
    ],
    lastUpdated: '15 min ago'
  }
];

export const cityOverviewStats = {
  city: 'Hyderabad Metropolitan Region',
  state: 'Telangana',
  totalZonesMonitored: 72,
  criticalZonesCount: 14,
  highRiskZonesCount: 32,
  moderateZonesCount: 18,
  lowZonesCount: 8,
  overallCityRiskScore: 68,
  earliestFloodOnsetMinutes: 27,
  activeAlertsCount: 9,
  radarNowcastTimestamp: '19:15 IST (Lead Time: 0-3h)',
  systemHealth: {
    radar: 'Operational (DWR Hyderabad)',
    hydrologyEngine: 'Coupled 2D-DEM + 1D-Drainage Active',
    iotSensors: '412 / 418 Online (98.5%)',
    leadTimeWindow: '0 - 180 Minutes'
  }
};
