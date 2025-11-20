import { type SourceData, type TimeSeriesValue } from "@src/types/energyIntensity";
import { whToKwh } from "./energyBarChartFormatter";  //todo, move this to a common utils file
import { formatByGranularity, detectGranularity } from "../utils/dateGranularity";

export interface NivoLineSeries {
  id: string;
  data: { x: string; y: number }[];
}

/**
 *OUTPUT example
[
  {
    "id": "Lighting",
    "data": [
      { "x": "01:00", "y": 12.5 },
      { "x": "02:00", "y": 10.1 },
      { "x": "03:00", "y": 9.3 }
    ]
  },
  {
    "id": "IT",
    "data": [
      { "x": "01:00", "y": 4.2 },
      { "x": "02:00", "y": 3.4 },
      { "x": "03:00", "y": 2.8 }
    ]
  }
]
 */

/**
 * Transform energy data into Nivo Line Chart format.
 * one line per category.
 */
export const transformToNivoLineData = (
  sourceData: SourceData,
  categories: (keyof SourceData)[] = ["Lighting", "IT", "Mixed usages"]
): NivoLineSeries[] => {
  const result: NivoLineSeries[] = [];

  categories.forEach(category => {
    const energyData = sourceData[category]?.["Active energy delivered"];
    
    const granularity = energyData[0].timeSeriesValues.length > 1 //incase of hourly
    ? detectGranularity(
        energyData[0].timeSeriesValues[0].startTime,
        energyData[0].timeSeriesValues[1].startTime
      )
    : detectGranularity(
        energyData[0].timeSeriesValues[0].startTime,
        energyData[0].timeSeriesValues[0].endTime
      );
    if (!energyData || energyData.length === 0) return;

    const lineSeries: NivoLineSeries = {
      id: category,
      data: [],
    };

    // each time series value becomes a point
    energyData[0].timeSeriesValues.forEach((tsValue: TimeSeriesValue) => {
      lineSeries.data.push({
        x: formatByGranularity(tsValue.startTime, granularity),  
        y: whToKwh(tsValue.value),          
      });
    });

    result.push(lineSeries);
  });

  return result;
};
