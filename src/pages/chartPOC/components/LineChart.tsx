import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { type SourceData } from "../../../types/energyIntensity";
import { transformToNivoLineData } from "../../../helpers/charts/energyLineChartFormatter";

interface EnergyLineChartProps {
  data: SourceData;
  categories: string[];
  selectedOption?: string;
}

/**
 * Displays a line chart of energy consumption over time using Nivo.
 */
const LineChart: React.FC<EnergyLineChartProps> = ({
  data,
  categories,
}) => {
  //transforms raw energy data into nivo-compatible line data
  const nivoData = transformToNivoLineData(data, categories as (keyof SourceData)[]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ResponsiveLine
        data={nivoData}
        margin={{ top: 50, right: 60, bottom: 60, left: 80 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickRotation: -35,
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Energy (kWh)",
          legendPosition: "middle",
          legendOffset: -60,
        }}
        enableGridX={false}
        enableGridY={true}
        enablePoints={true}
        pointSize={6}
        colors={{ scheme: "set2" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 80,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
