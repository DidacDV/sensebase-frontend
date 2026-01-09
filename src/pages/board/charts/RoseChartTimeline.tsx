import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { RoseChartData } from '@src/models/chartModels';

interface RoseChartTimelineProps {
  data: RoseChartData;
  height?: string;
}

const RoseChartTimeline: React.FC<RoseChartTimelineProps> = ({ data, height = '500px' }) => {
  
  const option = useMemo(() => {
    if (!data || !data.timeline || !data.options) return {};

    const timelineOptions = data.options.map((snapshot) => ({
      series: [
        {
          data: snapshot
        }
      ]
    }));

    return {
      baseOption: {
        timeline: {
          axisType: 'category',
          autoPlay: true,
          playInterval: 6000,
          data: data.timeline,
          left: '5%',
          right: '5%',
          bottom: -10,
          lineStyle: { color: '#D1D5DB' },
          label: { color: '#4B5563' },
          itemStyle: { color: '#9CA3AF' },
          controlStyle: { color: '#10B981', borderColor: '#10B981' },
          checkpointStyle: { color: '#22C55E', borderColor: '#111827' }
        },
        title: {
          text: `Energy Mix - ${data.granularity.charAt(0).toUpperCase() + data.granularity.slice(1)}`,
          top: 0,
          left: 'center',
          textStyle: { color: '#111827', fontSize: 14, fontWeight: 'bold'}
        },
        tooltip: {
          trigger: 'item',
          formatter: `{b}: {c} ${data.unit} ({d}%)`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#D1D5DB',
          borderWidth: 1,
          textStyle: { color: '#111827' }
        },
        legend: {
            top: -20,
            type: 'scroll',
            textStyle: { color: '#374151' }
        },
        calculable: true,
        series: [
          {
            name: 'Energy Source',
            type: 'pie',
            roseType: 'area', 
            radius: [30, '65%'], 
            center: ['50%', '45%'], 
            itemStyle: {
              borderRadius: 5,
              borderColor: '#FFFFFF',
              borderWidth: 2,
              opacity: 0.75,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            label: {
              show: true,
              formatter: '{b}',
              color: '#111827'
            },
            color: [
              '#10B981', // Grid - emerald
              '#6B7280', // Local - medium gray
              '#22C55E', // All/Total - green
              '#9CA3AF', // Mixed - light gray
              '#059669', // IT - darker emerald
              '#D1D5DB', // Additional - very light gray
              '#047857', // Additional - forest green
            ]
          }
        ]
      },
      options: timelineOptions
    };
  }, [data]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4 h-full border border-gray-200">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%', minHeight: height }} 
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default RoseChartTimeline;