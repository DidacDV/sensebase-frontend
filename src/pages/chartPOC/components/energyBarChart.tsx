// Separated Bar Chart Component
import { ResponsiveBar } from '@nivo/bar';
import { type NivoBarData } from '@src/helpers/energyIntensity';

interface BarChartProps {
  data: NivoBarData[];
  categories: string[];
}

export const EnergyBarChart: React.FC<BarChartProps> = ({ data, categories }) => (
  <div style={{ height: '400px' }}>
    <ResponsiveBar
      data={data}
      keys={categories}
      indexBy="month"
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
        legend: 'Month',
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
            }
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
);