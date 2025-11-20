import { ResponsiveHeatMap } from "@nivo/heatmap";
import { transformToNivoHeatmapData } from "@src/helpers/charts/energyHeatChartFormatter";
import { type SourceData } from "@src/types/energyIntensity";

interface HeatMapProps {
  source: SourceData;
  categories: string[];
}

export const HeatmapChart: React.FC<HeatMapProps> = ({ source, categories}) => {
  const data = transformToNivoHeatmapData(
    source,
    categories as (keyof SourceData)[],
  );

  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div style={{ height: 450 }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 120 }}
        valueFormat=">-.2s"
        colors={{
          type: "sequential",
          scheme: "blues"
        }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: '',
          legendOffset: 46
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Category',
          legendPosition: 'middle',
          legendOffset: -100
        }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        legends={[
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            title: 'Value →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
        emptyColor="#eeeeee"
      />
    </div>
  );
};