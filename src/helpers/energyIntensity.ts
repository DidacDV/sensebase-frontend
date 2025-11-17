import { type EnergyData, type TimeSeriesValue, type SourceData } from '../types/energyIntensity.ts';

export interface NivoBarData {
  month: string;
  [key: string]: number | string; //dynamic keys for different categories
}

/**
 * Format date to readable month name
 */
export const formatMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
}; 

export const whToKwh = (wh: number | null): number => {
  return wh ? wh / 1000 : 0;
};

/**
 * transform energy data for demo nivo bar chart
 * grouping multiple usage categories by month
 */
export const transformToNivoBarData = (
  sourceData: SourceData,
  categories: (keyof SourceData)[] = ['Lighting', 'IT', 'Mixed usages']
): NivoBarData[] => {
  const dataMap = new Map<string, NivoBarData>();

  categories.forEach(category => {
    const energyData = sourceData[category]["Active energy delivered"];
    
    if (energyData && energyData.length > 0) {
      energyData[0].timeSeriesValues.forEach((tsValue: TimeSeriesValue) => {
        const month = formatMonth(tsValue.startTime);
        
        if (!dataMap.has(month)) {
          dataMap.set(month, { month });
        }
        
        const monthData = dataMap.get(month)!;
        monthData[category] = whToKwh(tsValue.value);
      });
    }
  });

  return Array.from(dataMap.values());
};

/**
 * Transform total consumption data for simple bar chart, not divided by category
 */
export const transformTotalConsumption = (
  energyData: EnergyData[]
): NivoBarData[] => {
  if (!energyData || energyData.length === 0) return [];

  return energyData[0].timeSeriesValues
    .filter(tsValue => tsValue.value !== null && tsValue.value !== 0)
    .map(tsValue => ({
      month: formatMonth(tsValue.startTime),
      consumption: whToKwh(tsValue.value),
    }));
};

/**
 * Calculate energy intensity (consumption per unit, e.g., per m²)
 * @param energyData - Energy consumption data
 * @param area - Area in m² (or other unit)
 */
export const calculateEnergyIntensity = (
  energyData: EnergyData[],
  area: number
): NivoBarData[] => {
  if (!energyData || energyData.length === 0 || area <= 0) return [];

  return energyData[0].timeSeriesValues
    .filter(tsValue => tsValue.value !== null && tsValue.value !== 0)
    .map(tsValue => ({
      month: formatMonth(tsValue.startTime),
      intensity: whToKwh(tsValue.value) / area,
    }));
};
