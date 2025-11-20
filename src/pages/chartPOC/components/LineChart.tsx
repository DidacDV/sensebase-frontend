import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { type SourceData } from "../../../types/energyIntensity";
import { transformToNivoLineData } from "../../../helpers/charts/energyLineChartFormatter";
import { useMemo, useState } from "react";

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
  const nivoData = transformToNivoLineData(data, categories as (keyof SourceData)[]);

  // Detect if data is hourly
  const isHourly = nivoData.length > 0 && 
    nivoData[0].data.length > 0 && 
    nivoData[0].data[0].x.includes(':');
  
  // Extract unique days from hourly data
  const availableDays = useMemo(() => {
    if (!isHourly || nivoData.length === 0) return [];
    const days = new Set<string>();
    nivoData.forEach(series => {
      series.data.forEach(point => {
        const day = String(point.x).split(' ')[0];
        days.add(day);
      });
    });
    return Array.from(days).sort();
  }, [nivoData, isHourly]);
  
  const [selectedDay, setSelectedDay] = useState<string>(availableDays[0] || '');
  
  // Filter data for selected day if hourly
  const filteredData = useMemo(() => {
    if (!isHourly || !selectedDay) return nivoData;
    return nivoData.map(series => ({
      ...series,
      data: series.data.filter(point => String(point.x).startsWith(selectedDay))
    }));
  }, [nivoData, isHourly, selectedDay]);

  return (
    <div>
      {/* Day Picker for Hourly Data */}
      {isHourly && availableDays.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-semibold text-[#1A3D63]">
            Select Day:
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#1A3D63] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A7FA7]"
          >
            {availableDays.map(day => (
              <option key={day} value={day}>
                {new Date(day).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ height: "400px", width: "100%" }}>
        <ResponsiveLine
          data={filteredData}
          margin={{ top: 50, right: 60, bottom: 60, left: 80 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickRotation: -35,
            legend: isHourly ? "Hour" : "Month",
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
    </div>
  );
};

export default LineChart;
