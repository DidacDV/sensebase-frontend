import React from "react";
import { ResponsiveTimeRange } from "@nivo/calendar";
import { transformToTimeRangeData } from "@src/helpers/charts/energyTimeRangeChartFormatter";
import { type SourceData } from "@src/types/energyIntensity";

//THIS CHART ONLY WORKS PROPERLY WITH DAILY DATA (EVEN BETTER IF IT CONTAINS MULTIPLE MONTHS)

interface TimeRangeChartProps {
  source: SourceData;
  categories: string[];
}

const TimeRangeChart: React.FC<TimeRangeChartProps> = ({ source, categories }) => {
  const data = transformToTimeRangeData(source, categories);

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  // sorted "YYYY-MM-DD"
  const days = data.map(d => d.day);
  const from = days[0];
  const to = days[days.length - 1];

  return (
    <div style={{ height: "350px" }}>
      <ResponsiveTimeRange
        data={data}
        from={from}
        to={to}
        emptyColor="#eeeeee"
        colors={["#edf8ff", "#b3d8f2", "#6aa4d4", "#2c6a9f"]}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        daySpacing={2}
        dayBorderWidth={1}
        dayBorderColor="#ffffff"
        tooltip={({ day, value }) => (
          <div style={{ padding: 6, background: "#fff", borderRadius: 4 }}>
            <strong>{day}</strong><br />
            {value.toLocaleString()} kWh
          </div>
        )}
      />
    </div>
  );
};

export default TimeRangeChart;
