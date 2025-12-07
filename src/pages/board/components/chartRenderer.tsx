import AreaStackedGradient from "@src/pages/board/charts/AreaStackedChart.tsx"
import { type ChartStructure, type TimeSeriesChartStructure } from "@src/models/chartModels"
import type { TimeGranularity } from "@src/types/energyIntensity";

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

    default:
      return <div>Unsupported chart type</div>;
  }
}
