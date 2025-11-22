// EnergyPolarChart.tsx
import React from 'react';
import type { SourceData } from '@src/types/energyIntensity';

interface EnergyPolarChartProps {
  data: SourceData;
  categories: string[];
}

export const PolarChart: React.FC<EnergyPolarChartProps> = ({ 
  data, 
  categories,  
}) => {
  return (
    <p>a</p>
  );
};