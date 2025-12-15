import AreaStackedGradient from "@src/pages/board/charts/AreaStackedChart.tsx"
import { type ChartStructure, type RoseChartStructure, type TimeSeriesChartStructure } from "@src/models/chartModels"
import type { TimeGranularity } from "@src/types/energyIntensity";
import RoseChartTimeline from "../charts/RoseChartTimeline";

export function ChartRenderer({ data, granularity, height }: { data: ChartStructure, granularity: TimeGranularity, height?: string }) {
  console.log("Rendering chart of type:", data.type);
  switch (data.type) {
    case "timeseries":
      {
        const timeSeriesData = data.data as TimeSeriesChartStructure;
        return (
          <AreaStackedGradient
              data={timeSeriesData[granularity]}
              height={height || '400px'}
          />
        );
      }
    case "rose":
      {
        const roseData = data.data as RoseChartStructure;
        // Safety check
        const chartData = roseData[granularity];
        if (!chartData) return <div>No data for {granularity}</div>;

        return (
          <RoseChartTimeline
            data={chartData}
            height={height || '400px'}
          />
        );
      }

    default:
      return <div>Unsupported chart type</div>;
  }
}
