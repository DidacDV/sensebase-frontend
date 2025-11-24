import { useState, useEffect } from 'react';
import AreaStackedGradient from './components/AreaStackedChart';
import formattedData from '../../../mockData/formatted_output.json';
import { type TimeSeriesChartStructure } from '@src/models/chartModels';

function EnergyDashboard() {
  const [chartData, setChartData] = useState<TimeSeriesChartStructure | null>(null);
  const [granularity, setGranularity] = useState('hourly'); //'hourly', 'daily', 'monthly'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //this should call energy service to get data
    setTimeout(() => {
      setChartData(formattedData as TimeSeriesChartStructure);
      console.log(formattedData)
      setLoading(false);
    }, 500);
  }, []);

  {loading ? (
    <div className="flex justify-center p-8">
      <p>Loading chart data...</p>
    </div>
  ) : chartData && chartData[granularity as keyof TimeSeriesChartStructure] ? (
    <AreaStackedGradient 
      data={chartData[granularity as keyof TimeSeriesChartStructure]} 
      height="600px"
    />
  ) : (
    <p>No data available</p>
  )}

  return (
    <div className="p-6">
      {/* Chart Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A3D63]">
          Energy Consumption
        </h2>
        <p className="text-gray-600 mt-1">
          {granularity === 'monthly' && 'Monthly breakdown in kilowatt-hours (kWh)'}
          {granularity === 'daily' && 'Daily breakdown in kilowatt-hours (kWh)'}
          {granularity === 'hourly' && 'Hourly breakdown in kilowatt-hours (kWh)'}
        </p>
      </div>

      {/* TODO IMPROVE THIS SECTION VISUALLY */}
      {/* Granularity Selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setGranularity('hourly')}
          className={`px-4 py-2 rounded ${granularity === 'hourly' ? 'bg-[#1A3D63] text-white' : 'bg-gray-200'}`}
        >
          Hourly
        </button>
        <button
          onClick={() => setGranularity('daily')}
          className={`px-4 py-2 rounded ${granularity === 'daily' ? 'bg-[#1A3D63] text-white' : 'bg-gray-200'}`}
        >
          Daily
        </button>
        <button
          onClick={() => setGranularity('monthly')}
          className={`px-4 py-2 rounded ${granularity === 'monthly' ? 'bg-[#1A3D63] text-white' : 'bg-gray-200'}`}
        >
          Monthly
        </button>
      </div>

      {/* Charts section */}
      <div className="m-2">
        {chartData && chartData[granularity as keyof TimeSeriesChartStructure] && (
          <AreaStackedGradient 
            data={chartData[granularity as keyof TimeSeriesChartStructure]} 
            height="600px"
          />
        )}
      </div>
    </div>
  );
}

export default EnergyDashboard;