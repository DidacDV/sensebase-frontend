import { type SourceData, type TimeSeriesValue } from "@src/types/energyIntensity";
import { detectGranularity } from "@src/helpers/utils/dateGranularity";

export interface NivoHeatMapRow {
  id: string; // row label (category or day)
  data: { x: string; y: number }[];
}

export const transformToNivoHeatmapData = (
  sourceData: SourceData,
  categories: (keyof SourceData)[],
  convert: (value: number | null) => number = v => v ?? 0
): NivoHeatMapRow[] => {
  // Get first valid data to detect granularity
  let granularity: string | null = null;
  for (const category of categories) {
    const energy = sourceData[category]?.["Active energy delivered"];
    if (energy && energy.length > 0 && energy[0].timeSeriesValues.length > 1) {
      const values = energy[0].timeSeriesValues;
      granularity = detectGranularity(values[0].startTime, values[1].startTime);
      break;
    }
  }

  if (!granularity) return [];

  if (granularity === "month") {
    // For monthly: each row is a category, each column is a month
    return categories.map(category => {
      const energy = sourceData[category]?.["Active energy delivered"];
      if (!energy || energy.length === 0) {
        return { id: String(category), data: [] };
      }

      const values = energy[0].timeSeriesValues;
      const data = values.map((ts: TimeSeriesValue) => {
        const start = new Date(ts.startTime);
        const monthLabel = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return {
          x: monthLabel,
          y: convert(ts.value)
        };
      });

      return {
        id: String(category),
        data
      };
    });
  } else if (granularity === "day") {
    // For daily: each row is a category, each column is a day
    return categories.map(category => {
      const energy = sourceData[category]?.["Active energy delivered"];
      if (!energy || energy.length === 0) {
        return { id: String(category), data: [] };
      }

      const values = energy[0].timeSeriesValues;
      const data = values.map((ts: TimeSeriesValue) => {
        const dayLabel = ts.startTime.split("T")[0];
        return {
          x: dayLabel,
          y: convert(ts.value)
        };
      });

      return {
        id: String(category),
        data
      };
    });
  } else {
    // For hourly: each row is a day, each column is an hour, aggregated across categories
    const rowMap: Record<string, Record<string, number>> = {};

    categories.forEach(category => {
      const energy = sourceData[category]?.["Active energy delivered"];
      if (!energy || energy.length === 0) return;

      const values = energy[0].timeSeriesValues;
      values.forEach((ts: TimeSeriesValue) => {
        const start = new Date(ts.startTime);
        const rowId = ts.startTime.split("T")[0]; // day
        const colId = start.toISOString().substring(11, 16); // HH:mm

        if (!rowMap[rowId]) rowMap[rowId] = {};
        rowMap[rowId][colId] = (rowMap[rowId][colId] ?? 0) + convert(ts.value);
      });
    });

    return Object.entries(rowMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, cols]) => ({
        id: day,
        data: Object.entries(cols)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([col, y]) => ({ x: col, y }))
      }));
  }
};