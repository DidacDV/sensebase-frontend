import { type TimeSeriesValue, type SourceData } from '../../types/energyIntensity.ts';
import { detectGranularity, formatByGranularity } from '@src/helpers/utils/dateGranularity.ts';

export interface NivoBarData {
  bucket: string;
  [key: string]: number | string; //dynamic keys for different categories
}

/**
 * OUTPUT example
[
  {
    "bucket": "2025-11-01",
    "Lighting": 12.5,
    "IT": 4.2,
    "Mixed usages": 7.1
  },
  {
    "bucket": "2025-11-02",
    "Lighting": 10.0,
    "IT": 3.0,
    "Mixed usages": 6.5
  }
]
 * 
 */

//TODO make a common and reusable converter, not only for kW
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
    
    const granularity = energyData[0].timeSeriesValues.length > 1 //incase of hourly
    ? detectGranularity(
        energyData[0].timeSeriesValues[0].startTime,
        energyData[0].timeSeriesValues[1].startTime
      )
    : detectGranularity(
        energyData[0].timeSeriesValues[0].startTime,
        energyData[0].timeSeriesValues[0].endTime
      );
    if (energyData && energyData.length > 0) {
      energyData[0].timeSeriesValues.forEach((tsValue: TimeSeriesValue) => {

        const bucket = formatByGranularity(tsValue.startTime, granularity);
        
        if (!dataMap.has(bucket)) {
          dataMap.set(bucket, { bucket } as NivoBarData);
        }
        
        const data = dataMap.get(bucket)!;
        data[category] = whToKwh(tsValue.value);
      });
    }
  });

  return Array.from(dataMap.values());
};

/**
 * Transform total consumption data for simple bar chart, not divided by category

export const transformTotalConsumption = (
  energyData: EnergyData[]
): NivoBarData[] => {
  if (!energyData || energyData.length === 0) return [];

  return energyData[0].timeSeriesValues
    .filter(tsValue => tsValue.value !== null && tsValue.value !== 0)
    .map(tsValue => ({
      bucket: formatMonth(tsValue.startTime),
      consumption: whToKwh(tsValue.value),
    }));
};

 * Calculate energy intensity (consumption per unit, e.g., per m²)
 * @param energyData - Energy consumption data
 * @param area - Area in m² (or other unit)

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
 */
