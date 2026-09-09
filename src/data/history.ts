import { HistoricalFloodEvent } from '../types';

export const mockHistoricalEvents: HistoricalFloodEvent[] = [
  {
    id: 'hist-01',
    date: 'Oct 13-14, 2020',
    title: 'Historic Deep Depression Cloudburst',
    peakRainfallMm: 191.8,
    durationHours: 14,
    affectedZonesCount: 28,
    maxDepthCm: 140,
    economicImpact: '₹ 670 Crore',
    description: 'Unprecedented convective cloudburst over Central & South Hyderabad. Surcharge across entire Musi riverfront and Tolichowki basins.',
    severity: 'critical',
    pumpsDeployed: 64
  },
  {
    id: 'hist-02',
    date: 'Jul 24, 2023',
    title: 'Monsoon Low Pressure Inundation Surge',
    peakRainfallMm: 114.2,
    durationHours: 8,
    affectedZonesCount: 19,
    maxDepthCm: 78,
    economicImpact: '₹ 180 Crore',
    description: 'Back-to-back squalls paralyzed Begumpet, Ameerpet, and Secunderabad railway corridors for 7 consecutive hours.',
    severity: 'critical',
    pumpsDeployed: 48
  },
  {
    id: 'hist-03',
    date: 'Sep 02, 2024',
    title: 'Flash Downpour & Drainage Surcharge',
    peakRainfallMm: 88.5,
    durationHours: 4.5,
    affectedZonesCount: 12,
    maxDepthCm: 52,
    economicImpact: '₹ 75 Crore',
    description: 'High-intensity isolated convective storm cell over Begumpet underpass and Moosarambagh causeway.',
    severity: 'high',
    pumpsDeployed: 32
  },
  {
    id: 'hist-04',
    date: 'Aug 17, 2025',
    title: 'Southwest Monsoon Active Surge',
    peakRainfallMm: 72.0,
    durationHours: 5,
    affectedZonesCount: 8,
    maxDepthCm: 35,
    economicImpact: '₹ 38 Crore',
    description: 'Moderate localized waterlogging on arterial roads, handled via prompt early warning and mobile pump units.',
    severity: 'moderate',
    pumpsDeployed: 20
  }
];

export const mockFloodHistoryTimeframes = {
  '7 Days': {
    eventsCount: 3,
    avgRainfallMm: 42.5,
    avgDurationHours: 2.8,
    maxDepthRecordedCm: 42,
    chartData: [
      { label: 'Sep 03', rainfall: 18, events: 0, avgDepthCm: 0 },
      { label: 'Sep 04', rainfall: 12, events: 0, avgDepthCm: 0 },
      { label: 'Sep 05', rainfall: 38, events: 1, avgDepthCm: 18 },
      { label: 'Sep 06', rainfall: 25, events: 0, avgDepthCm: 5 },
      { label: 'Sep 07', rainfall: 54, events: 2, avgDepthCm: 32 },
      { label: 'Sep 08', rainfall: 68, events: 3, avgDepthCm: 42 },
      { label: 'Today', rainfall: 71, events: 4, avgDepthCm: 56 },
    ]
  },
  '30 Days': {
    eventsCount: 11,
    avgRainfallMm: 58.2,
    avgDurationHours: 4.1,
    maxDepthRecordedCm: 56,
    chartData: [
      { label: 'Week 1', rainfall: 120, events: 2, avgDepthCm: 25 },
      { label: 'Week 2', rainfall: 185, events: 4, avgDepthCm: 48 },
      { label: 'Week 3', rainfall: 95, events: 1, avgDepthCm: 15 },
      { label: 'Week 4', rainfall: 240, events: 5, avgDepthCm: 56 },
    ]
  },
  '3 Months': {
    eventsCount: 26,
    avgRainfallMm: 310,
    avgDurationHours: 5.4,
    maxDepthRecordedCm: 78,
    chartData: [
      { label: 'Jul 2026', rainfall: 340, events: 10, avgDepthCm: 78 },
      { label: 'Aug 2026', rainfall: 285, events: 8, avgDepthCm: 45 },
      { label: 'Sep 2026', rainfall: 310, events: 8, avgDepthCm: 56 },
    ]
  },
  '1 Year': {
    eventsCount: 48,
    avgRainfallMm: 980,
    avgDurationHours: 6.2,
    maxDepthRecordedCm: 114,
    chartData: [
      { label: 'Q4 2025', rainfall: 180, events: 4, avgDepthCm: 28 },
      { label: 'Q1 2026', rainfall: 25, events: 0, avgDepthCm: 0 },
      { label: 'Q2 2026', rainfall: 140, events: 3, avgDepthCm: 22 },
      { label: 'Q3 2026', rainfall: 635, events: 22, avgDepthCm: 78 },
    ]
  }
};

export const mostFloodProneZonesRanked = [
  { rank: 1, code: 'Zone 14', name: 'Begumpet Underpass', historicalEvents: 34, avgRecededHours: 4.6, riskIndex: 96 },
  { rank: 2, code: 'Zone 10', name: 'Moosarambagh Causeway', historicalEvents: 31, avgRecededHours: 6.2, riskIndex: 94 },
  { rank: 3, code: 'Zone 09', name: 'Tolichowki Nadeem Colony', historicalEvents: 28, avgRecededHours: 5.8, riskIndex: 91 },
  { rank: 4, code: 'Zone 11', name: 'Malakpet RUB', historicalEvents: 26, avgRecededHours: 3.9, riskIndex: 88 },
  { rank: 5, code: 'Zone 21', name: 'Ameerpet Metro Junction', historicalEvents: 21, avgRecededHours: 2.7, riskIndex: 82 },
  { rank: 6, code: 'Zone 12', name: 'Malkajgiri Anandbagh', historicalEvents: 19, avgRecededHours: 3.4, riskIndex: 79 },
  { rank: 7, code: 'Zone 05', name: 'Kukatpally Highway', historicalEvents: 17, avgRecededHours: 2.1, riskIndex: 75 },
];
