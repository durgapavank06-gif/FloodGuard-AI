import { HistoricalFloodEvent } from '../types';

// Chennai historical floods — coords 13.0–13.08N (13.0-13.08), 80.225–80.255E (80.225-80.255), DEM 6–24m (6-24m), DWR Chennai 0–3h (0-3h)
// 253 real CMWSSB mains + 760 inferred hierarchical (800 manholes), sewer_type lateral->outfall hierarchy (lateral/house -> branch -> main -> trunk -> outfall)

export const mockHistoricalEvents: HistoricalFloodEvent[] = [
  {
    id: 'hist-01',
    date: 'Dec 01-02, 2015',
    title: 'Catastrophic Chennai Floods — Northeast Monsoon & Adyar Breach',
    peakRainfallMm: 494.0,
    durationHours: 48,
    affectedZonesCount: 12,
    maxDepthCm: 210,
    economicImpact: '₹ 14,602 Crore',
    description: 'Record 494mm in 24h (Nungambakkam observatory). Chembarambakkam reservoir release + Adyar River breach inundated T. Nagar, Nungambakkam, Anna Nagar, Velachery (6m low) and Thiruvanmiyur Adyar estuary for 10 days. 800 CMWSSB manholes surcharged.',
    severity: 'critical',
    pumpsDeployed: 120
  },
  {
    id: 'hist-02',
    date: 'Dec 04-05, 2023',
    title: 'Cyclone Michaung — Buckingham Canal & Cooum Overflow',
    peakRainfallMm: 330.0,
    durationHours: 24,
    affectedZonesCount: 10,
    maxDepthCm: 140,
    economicImpact: '₹ 2,040 Crore',
    description: 'Cyclone Michaung dumped 330mm over Chennai DEM 6–24m plain. Velachery Drivers Colony (6m) and T. Nagar Bazullah basin (7m) saw 100–140cm; 253 real CMWSSB mains surcharged, 760 inferred laterals backed up.',
    severity: 'critical',
    pumpsDeployed: 96
  },
  {
    id: 'hist-03',
    date: 'Nov 07-08, 2021',
    title: 'Northeast Monsoon Depression — Velachery & T. Nagar Waterlogging',
    peakRainfallMm: 215.0,
    durationHours: 18,
    affectedZonesCount: 8,
    maxDepthCm: 78,
    economicImpact: '₹ 420 Crore',
    description: 'Deep depression over Bay of Bengal stalled over DWR Chennai radar zone; Velachery 100ft Road and Anna Nagar 2nd Ave recorded 70–78cm sheet flow on flat 0.0005 slope.',
    severity: 'high',
    pumpsDeployed: 64
  },
  {
    id: 'hist-04',
    date: 'Oct 27, 2020',
    title: 'Pre-Monsoon Convective Burst — Nungambakkam Flash',
    peakRainfallMm: 92.0,
    durationHours: 6,
    affectedZonesCount: 5,
    maxDepthCm: 42,
    economicImpact: '₹ 85 Crore',
    description: 'Isolated convective cell tracked by DWR Chennai burst over Nungambakkam–T. Nagar corridor; moderate ponding handled via 300 inlets / 800 manholes clearing.',
    severity: 'moderate',
    pumpsDeployed: 32
  }
];

export const mockFloodHistoryTimeframes = {
  '7 Days': {
    eventsCount: 2,
    avgRainfallMm: 38.5,
    avgDurationHours: 3.2,
    maxDepthRecordedCm: 38,
    chartData: [
      { label: 'Sep 03', rainfall: 12, events: 0, avgDepthCm: 0 },
      { label: 'Sep 04', rainfall: 8, events: 0, avgDepthCm: 0 },
      { label: 'Sep 05', rainfall: 34, events: 1, avgDepthCm: 16 },
      { label: 'Sep 06', rainfall: 22, events: 0, avgDepthCm: 6 },
      { label: 'Sep 07', rainfall: 48, events: 1, avgDepthCm: 28 },
      { label: 'Sep 08', rainfall: 62, events: 2, avgDepthCm: 38 },
      { label: 'Today', rainfall: 68, events: 3, avgDepthCm: 42 },
    ]
  },
  '30 Days': {
    eventsCount: 9,
    avgRainfallMm: 52.4,
    avgDurationHours: 4.6,
    maxDepthRecordedCm: 42,
    chartData: [
      { label: 'Week 1', rainfall: 95, events: 1, avgDepthCm: 18 },
      { label: 'Week 2', rainfall: 165, events: 3, avgDepthCm: 42 },
      { label: 'Week 3', rainfall: 88, events: 1, avgDepthCm: 14 },
      { label: 'Week 4', rainfall: 210, events: 4, avgDepthCm: 38 },
    ]
  },
  '3 Months': {
    eventsCount: 22,
    avgRainfallMm: 285,
    avgDurationHours: 5.8,
    maxDepthRecordedCm: 78,
    chartData: [
      { label: 'Jul 2026', rainfall: 310, events: 8, avgDepthCm: 58 },
      { label: 'Aug 2026', rainfall: 255, events: 7, avgDepthCm: 38 },
      { label: 'Sep 2026', rainfall: 285, events: 7, avgDepthCm: 42 },
    ]
  },
  '1 Year': {
    eventsCount: 44,
    avgRainfallMm: 1420,
    avgDurationHours: 7.1,
    maxDepthRecordedCm: 140,
    chartData: [
      { label: 'Q4 2025', rainfall: 820, events: 12, avgDepthCm: 68 },
      { label: 'Q1 2026', rainfall: 22, events: 0, avgDepthCm: 0 },
      { label: 'Q2 2026', rainfall: 85, events: 2, avgDepthCm: 18 },
      { label: 'Q3 2026', rainfall: 495, events: 18, avgDepthCm: 42 },
    ]
  }
};

export const mostFloodProneZonesRanked = [
  { rank: 1, code: 'Zone C04', name: 'Velachery Drivers Colony Low (6m)', historicalEvents: 36, avgRecededHours: 6.8, riskIndex: 96 },
  { rank: 2, code: 'Zone C01', name: 'T. Nagar Bazullah Road Basin (7m)', historicalEvents: 32, avgRecededHours: 5.4, riskIndex: 93 },
  { rank: 3, code: 'Zone C03', name: 'Anna Nagar Aminjikarai (9m)', historicalEvents: 27, avgRecededHours: 4.9, riskIndex: 89 },
  { rank: 4, code: 'Zone C02', name: 'Nungambakkam Seetha Nagar (11m)', historicalEvents: 22, avgRecededHours: 3.2, riskIndex: 81 },
  { rank: 5, code: 'Zone C05', name: 'Thiruvanmiyur Adyar Estuary (14m)', historicalEvents: 18, avgRecededHours: 2.8, riskIndex: 74 },
  { rank: 6, code: 'Zone C02b', name: 'Sterling Road / College Road (11m)', historicalEvents: 16, avgRecededHours: 2.5, riskIndex: 71 },
  { rank: 7, code: 'Zone C05b', name: 'Buckingham Canal Bank (13m)', historicalEvents: 14, avgRecededHours: 2.1, riskIndex: 68 },
];
