// EnergyConsumptionChart.tsx
import React, { useEffect, useState } from 'react';
import { energyService } from '@src/services/energyIntensity';
import { type ConsumptionData, type SourceData } from '@src/types/energyIntensity';

import { BarChart } from '@src/pages/chartPOC/components/BarChart';
import { PolarChart } from '@src/pages/chartPOC/components/PolarChart';
import LineChart from './components/LineChart';
import TimeRangeChart from './components/TimeRangeChart';
import { HeatmapChart } from './components/HeatChart';

type SourceType = keyof ConsumptionData;

const CATEGORY_LIST: (keyof SourceData)[] = [
  "Lighting",
  "IT",
  "Mixed usages",
  "No usage",
  "Total",
];



// Main Component
export const EnergyConsumptionChart: React.FC = () => {
  const [chartData, setChartData] = useState<SourceData>({} as SourceData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSource, setSelectedSource] = useState<SourceType>('ALL');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Lighting', 'IT', 'Mixed usages']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sourceData = await energyService.getConsumptionBySource(selectedSource, 'monthly');
        setChartData(sourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSource]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-[#4A7FA7] text-lg">Loading energy data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B3CFE5] via-[#4A7FA7] to-[#1A3D63] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Energy Consumption Analytics
          </h1>
          <p className="text-white/80 text-lg">
            Visualize and analyze your energy usage across different sources and categories
          </p>
        </div>

        {/* Main Chart Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
          {/* Source Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#1A3D63] mb-4 uppercase tracking-wider">
              Energy Source
            </h3>
            <div className="flex flex-wrap gap-3">
              {(['ALL', 'GRID', 'LOCAL'] as SourceType[]).map(source => (
                <button
                  key={source}
                  onClick={() => setSelectedSource(source)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedSource === source
                      ? 'bg-gradient-to-r from-[#4A7FA7] to-[#1A3D63] text-white shadow-lg scale-105'
                      : 'bg-[#B3CFE5]/30 text-[#1A3D63] hover:bg-[#B3CFE5]/50 hover:scale-102'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-[#1A3D63] mb-4 uppercase tracking-wider">
              Usage Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {CATEGORY_LIST.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategories.includes(category)
                      ? 'bg-gradient-to-r from-[#4A7FA7] to-[#2E5F87] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#4A7FA7]"></div>
              <p className="text-sm text-gray-600">
                {selectedCategories.length} of {CATEGORY_LIST.length} categories selected
              </p>
            </div>
          </div>

          {/* Chart Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A3D63]">
              {selectedSource} Energy Consumption
            </h2>
            <p className="text-gray-600 mt-1">Monthly breakdown in kilowatt-hours (kWh)</p>
          </div>

          {/*charts section*/}
          <div className='m-2 bg-slate-400 shadow-md'>
            <BarChart 
          />
          </div>
          <div className='m-2 bg-slate-400 shadow-md'>
            <PolarChart 
            data={chartData} 
            categories={selectedCategories} 
            />
          </div>
          <div className='m-2 bg-white shadow-md'>
            <LineChart 
            data={chartData} 
            categories={selectedCategories} 
            />
          </div>
          <div className='m-2 bg-white shadow-md'>
            <TimeRangeChart 
            source={chartData} 
            categories={selectedCategories} 
            />
          </div>
          <div className='m-2 bg-white shadow-md'>
            <HeatmapChart 
            source={chartData} 
            categories={selectedCategories} 
            />
          </div>
        </div>
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-[#4A7FA7] font-semibold text-sm uppercase tracking-wider mb-2">
              Data Source
            </div>
            <div className="text-2xl font-bold text-[#1A3D63]">{selectedSource}</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-[#4A7FA7] font-semibold text-sm uppercase tracking-wider mb-2">
              Time Period
            </div>
            <div className="text-2xl font-bold text-[#1A3D63]">Monthly</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-[#4A7FA7] font-semibold text-sm uppercase tracking-wider mb-2">
              Active Categories
            </div>
            <div className="text-2xl font-bold text-[#1A3D63]">{selectedCategories.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};