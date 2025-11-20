// EnergyPolarChart.tsx
import React from 'react';
import { ResponsivePolarBar } from '@nivo/polar-bar';
import { transformToNivoBarData } from '@src/helpers/charts/energyBarChartFormatter';
import type { SourceData } from '@src/types/energyIntensity';

interface EnergyPolarChartProps {
  data: SourceData;
  categories: string[];
}

export const PolarChart: React.FC<EnergyPolarChartProps> = ({ 
  data, 
  categories,  
}) => {
  const nivoBarData = transformToNivoBarData(data, categories as (keyof SourceData)[]);
  return (
    <div style={{ height: '500px' }}>
      <ResponsivePolarBar
        data={nivoBarData}
        keys={categories}
        indexBy="bucket"
        valueFormat=">-.2f"
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.3}
        cornerRadius={3}
        borderWidth={2}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        colors={{ scheme: 'blues' }}
        arcLabelsSkipRadius={32}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['brighter', 2]]
        }}
        radialAxis={{
          angle: 180,
          ticksPosition: 'after',
          tickSize: 5,
          tickPadding: 8,
          tickRotation: 0
        }}
        circularAxisOuter={{
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 60,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 10,
            symbolSize: 16,
            symbolShape: 'circle',
            itemTextColor: '#1A3D63',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#4A7FA7'
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
};