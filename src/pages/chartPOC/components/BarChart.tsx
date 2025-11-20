// Separated Bar Chart Component
import { ResponsiveBar } from '@nivo/bar';
import { transformToNivoBarData } from '@src/helpers/charts/energyBarChartFormatter';
import type { SourceData } from '@src/types/energyIntensity';
import { useMemo, useState } from 'react';

interface BarChartProps {
  data: SourceData;
  categories: string[];
}

export const BarChart: React.FC<BarChartProps> = ({ data, categories }) => { 
  const nivoBarData = transformToNivoBarData(data, categories as (keyof SourceData)[]);
  
  // Detect if data is hourly (check if bucket format contains time)
  const isHourly = nivoBarData.length > 0 && nivoBarData[0].bucket.includes(':');
  console.log('First bucket:', nivoBarData[0]?.bucket);
console.log('isHourly:', nivoBarData.length > 0 && nivoBarData[0]?.bucket.includes(':'));
  // Extract unique days from hourly data
  const availableDays = useMemo(() => {
    if (!isHourly) return [];
    const days = new Set<string>();
    nivoBarData.forEach(item => {
      const day = item.bucket.split(' ')[0]; // "2025-11-01 23:00" -> "2025-11-01"
      days.add(day);
    });
    return Array.from(days).sort();
  }, [nivoBarData, isHourly]);
  
  const [selectedDay, setSelectedDay] = useState<string>(availableDays[0] || '');
  
  // Filter data for selected day if hourly
  const filteredData = useMemo(() => {
    if (!isHourly || !selectedDay) return nivoBarData;
    return nivoBarData.filter(item => item.bucket.startsWith(selectedDay));
  }, [nivoBarData, isHourly, selectedDay, availableDays]);

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
          <span className="text-sm text-gray-600">
            ({filteredData.length} hours)
          </span>
        </div>
      )}
      
      {/* Chart */}
      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={filteredData}
          keys={categories}
          indexBy="bucket"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'blues' }}
          theme={{
            text: {
                fill: "#FFFFFF" 
            }
          }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: isHourly ? 'Hour' : 'Month',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Energy (kWh)',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 2.8]]
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                },
              ]
            }
          ]}
          role="application"
          ariaLabel="Energy consumption bar chart"
          tooltip={({ id, value, indexValue }) => (
            <div
              style={{
                padding: '12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <strong>{indexValue}</strong>
              <br />
              {id}: {value.toLocaleString()} kWh
            </div>
          )}
        />
      </div>
    </div>
  );
};