import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { RoseChartData } from '@src/models/chartModels';
import { PanelBottom } from 'lucide-react';

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
          playInterval: 2000,
          data: data.timeline,
          left: '5%',
          right: '5%',
          bottom: 10,
          lineStyle: { color: '#ccc' },
          label: { color: '#666' },
          itemStyle: { color: '#999' },
          controlStyle: { color: '#1A3D63', borderColor: '#1A3D63' },
          checkpointStyle: { color: '#3b82f6', borderColor: '#fff' }
        },
        title: {
          text: `Energy Mix - ${data.granularity.charAt(0).toUpperCase() + data.granularity.slice(1)}`,
          top: 10,
          left: 'center',
          textStyle: { color: '#1A3D63', fontSize: 18, fontWeight: 'bold'}
        },
        tooltip: {
          trigger: 'item',
          formatter: `{b}: {c} ${data.unit} ({d}%)`,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: { color: '#333' }
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
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: true,
              formatter: '{b}'
            },
            color: [
               '#FFD700', // Grid
               '#9333EA', // Local
               '#00CED1', // All/Total
               '#FF0087', // Mixed
               '#37A2FF', // IT
            ]
          }
        ]
      },
      options: timelineOptions
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%', minHeight: height }} 
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default RoseChartTimeline;