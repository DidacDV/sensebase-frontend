import { type SourceData, type TimeSeriesValue } from "@src/types/energyIntensity";
import { whToKwh } from "./energyBarChartFormatter";
import { detectGranularity } from "@src/helpers/utils/dateGranularity";

export interface NivoCalendarDay {
  day: string;
  value: number;
}

/** OUTPUT example
[
  { "day": "2025-11-01", "value": 22.3 },
  { "day": "2025-11-02", "value": 19.7 },
  { "day": "2025-11-03", "value": 21.4 }
]
 */

export const transformToTimeRangeData = (
  source: SourceData,
  categories: string[]
): NivoCalendarDay[] => {
  const dayMap: Record<string, number> = {};

  categories.forEach(category => {
    const energyData = source[category as keyof SourceData]?.["Active energy delivered"];
    if (!energyData || energyData.length === 0) return;

    const values = energyData[0].timeSeriesValues;
    if (values.length === 0) return;

    const granularity = detectGranularity(
      values[0].startTime,
      values[0].endTime
    );

    values.forEach((ts: TimeSeriesValue) => {
      let dayString: string;

      if (granularity === "hour") {
        //always group by day
        dayString = ts.startTime.split("T")[0];
      } else if (granularity === "day") {
        //already a day → format cleanly
        dayString = ts.startTime.split("T")[0];
      } else {
        //monthly → convert to the first day of the month
        const d = new Date(ts.startTime);
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        dayString = `${year}-${String(month).padStart(2, "0")}-01`;
      }

      const kwh = whToKwh(ts.value ?? 0);
      dayMap[dayString] = (dayMap[dayString] ?? 0) + kwh;
    });
  });

  return Object.entries(dayMap)
    .map(([day, value]) => ({ day, value }))
    .sort((a, b) => a.day.localeCompare(b.day));
};