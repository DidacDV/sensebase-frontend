import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

interface EChartsBarData {
  isHourly: boolean;
  xAxis: string[];
  series: {
    name: string;
    type: "bar";
    data: number[];
  }[];
}

interface BarChartProps {
  data?: EChartsBarData;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { isHourly, xAxis, series }  = {
  isHourly: true,
  xAxis: [
    "2025-11-01 00:00",
    "2025-11-01 01:00",
    "2025-11-01 02:00"
  ],
  series: [
    {
      name: "Lighting",
      type: "bar",
      data: [12, 18, 20],
    },
    {
      name: "HVAC",
      type: "bar",
      data: [5, 10, 7],
    }
  ]
};;

  // Extract available days for hourly data
  const availableDays = useMemo(() => {
    if (!isHourly) return [];
    const days = new Set<string>();
    xAxis.forEach((timestamp) => {
      const day = timestamp.split(" ")[0]; // "2025-11-01 23:00" => "2025-11-01"
      days.add(day);
    });
    return Array.from(days).sort();
  }, [xAxis, isHourly]);

  const [selectedDay, setSelectedDay] = useState(availableDays[0] || "");

  // Filter chart if it's hourly
  const filteredXAxis = useMemo(() => {
    if (!isHourly || !selectedDay) return xAxis;
    return xAxis.filter((x) => x.startsWith(selectedDay));
  }, [xAxis, isHourly, selectedDay]);

  const filteredSeries = useMemo(() => {
    if (!isHourly || !selectedDay) return series;

    return series.map((s) => ({
      ...s,
      data: s.data.filter((_, idx) => xAxis[idx].startsWith(selectedDay)),
    }));
  }, [series, isHourly, selectedDay, xAxis]);

  // Build ECharts options
  const options = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      textStyle: { color: "#fff" },
    },
    xAxis: {
      type: "category",
      data: filteredXAxis,
      axisLabel: {
        color: "#fff",
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#fff" },
    },
    series: filteredSeries,
    backgroundColor: "transparent",
  };

  return (
    <div>
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
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {new Date(day).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      <ReactECharts option={options} style={{ height: "400px" }} />
    </div>
  );
};
