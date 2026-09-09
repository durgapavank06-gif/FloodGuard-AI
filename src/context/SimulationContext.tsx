import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { SimulationParams, SimulationResults } from '../types';

interface SimulationContextType {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  results: SimulationResults;
  baselineResults: SimulationResults;
  isSimulating: boolean;
  runSimulation: () => void;
  loadScenario: (preset: SimulationParams['scenario']) => void;
  resetToDefault: () => void;
}

const defaultParams: SimulationParams = {
  rainfallIntensity: 68, // mm/hr
  forecastDuration: 90, // minutes
  drainageCapacity: 75, // %
  surfaceRunoff: 'high',
  scenario: 'custom'
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Baseline conditions (normal heavy rain condition)
  const baselineResults: SimulationResults = useMemo(() => ({
    criticalZones: 14,
    highRiskZones: 32,
    moderateZones: 18,
    lowZones: 8,
    affectedRoadsKm: 42.6,
    populationExposed: 185000,
    maxFloodDepthCm: 42,
    waterAccumulatedMl: 1420,
    pumpsRequired: 38
  }), []);

  // Compute reactive simulated results based on parameters
  const results: SimulationResults = useMemo(() => {
    const intensityFactor = params.rainfallIntensity / 68; // relative to baseline 68mm/hr
    const durationFactor = params.forecastDuration / 90;
    const capacityFactor = 100 / Math.max(params.drainageCapacity, 15);
    const runoffFactor = params.surfaceRunoff === 'high' ? 1.25 : params.surfaceRunoff === 'medium' ? 1.0 : 0.7;

    const stressIndex = (intensityFactor * 0.45 + durationFactor * 0.25 + (capacityFactor / 1.33) * 0.3) * runoffFactor;

    const critical = Math.min(Math.max(Math.round(14 * stressIndex), 1), 58);
    const high = Math.min(Math.max(Math.round(32 * (stressIndex * 0.95)), 4), 60);
    const moderate = Math.max(72 - critical - high, 2);
    const low = Math.max(72 - critical - high - moderate, 0);

    const roadsKm = Math.min(Math.round(42.6 * stressIndex * 10) / 10, 185);
    const population = Math.min(Math.round(185000 * stressIndex), 750000);
    const maxDepth = Math.min(Math.round(42 * stressIndex), 180);
    const waterMl = Math.round(1420 * stressIndex);
    const pumps = Math.min(Math.round(38 * stressIndex), 120);

    return {
      criticalZones: critical,
      highRiskZones: high,
      moderateZones: moderate,
      lowZones: low,
      affectedRoadsKm: roadsKm,
      populationExposed: population,
      maxFloodDepthCm: maxDepth,
      waterAccumulatedMl: waterMl,
      pumpsRequired: pumps
    };
  }, [params]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const loadScenario = (preset: SimulationParams['scenario']) => {
    switch (preset) {
      case 'cloudburst_2020':
        setParams({
          rainfallIntensity: 125,
          forecastDuration: 150,
          drainageCapacity: 45,
          surfaceRunoff: 'high',
          scenario: 'cloudburst_2020'
        });
        break;
      case 'monsoon_surge':
        setParams({
          rainfallIntensity: 85,
          forecastDuration: 120,
          drainageCapacity: 65,
          surfaceRunoff: 'high',
          scenario: 'monsoon_surge'
        });
        break;
      case 'drain_failure':
        setParams({
          rainfallIntensity: 55,
          forecastDuration: 90,
          drainageCapacity: 25,
          surfaceRunoff: 'medium',
          scenario: 'drain_failure'
        });
        break;
      case 'optimal_drainage':
        setParams({
          rainfallIntensity: 45,
          forecastDuration: 60,
          drainageCapacity: 95,
          surfaceRunoff: 'low',
          scenario: 'optimal_drainage'
        });
        break;
      default:
        setParams((prev) => ({ ...prev, scenario: 'custom' }));
        break;
    }
    runSimulation();
  };

  const resetToDefault = () => {
    setParams(defaultParams);
    runSimulation();
  };

  return (
    <SimulationContext.Provider
      value={{
        params,
        setParams,
        results,
        baselineResults,
        isSimulating,
        runSimulation,
        loadScenario,
        resetToDefault
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
