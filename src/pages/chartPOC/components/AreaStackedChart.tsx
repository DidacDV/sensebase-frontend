import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import type { TimeSeriesChartData } from '@src/models/chartModels';

interface AreaStackedGradientProps {
  data: TimeSeriesChartData;
  height?: string;
}

const AreaStackedGradient: React.FC<AreaStackedGradientProps> = ({ 
  data, 
  height = '500px' 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  //should be pivcked from the board config
  const colorPalette: Record<string, [string, string]> = {
    'ALL-No usage': ['#80FFA5', '#01BFEC'],
    'ALL-Total': ['#00CED1', '#0099CC'],
    'ALL-Lighting': ['#00DDFF', '#4D77FF'],
    'ALL-IT': ['#37A2FF', '#1E40AF'],
    'ALL-Mixed usages': ['#FF0087', '#C2185B'],
    
    'GRID-Total': ['#FFD700', '#FFA500'],
    'GRID-Lighting': ['#FFBF00', '#FF8C00'],
    'GRID-IT': ['#FFA500', '#FF6F00'],
    'GRID-Mixed usages': ['#FF7F50', '#FF4500'],
    
    'LOCAL-Total': ['#9333EA', '#7E22CE'],
    'LOCAL-Lighting': ['#7C3AED', '#6D28D9'],
    'LOCAL-IT': ['#8B5CF6', '#7C3AED'],
    'LOCAL-Mixed usages': ['#A78BFA', '#8B5CF6'],
  };

  const getGradientColor = (category: string, usageType: string): [string, string] => {
    const key = `${category}-${usageType}`;

    return colorPalette[key] || ['#999999', '#666666'];
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const series: LineSeriesOption[] = data.series.map((s) => {
      const [color1, color2] = getGradientColor(s.category, s.usageType);
      
      return {
        name: s.name,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
          color: color1
        },
        showSymbol: false,
        itemStyle: {
          color: color1
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: s.data
      } as LineSeriesOption;
    });

    //extract legend data using data series names
    const legendData = data.series.map(s => s.name);

    const option: EChartsOption = {
      title: {
        text: `Energy Consumption - ${data.granularity.charAt(0).toUpperCase() + data.granularity.slice(1)}`,
        left: 'center',
        textStyle: {
          color: '#1A3D63',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          
          let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          
          params.forEach((param: any) => {
            const value = param.value ?? 0; // Handle null/undefined
            tooltip += `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px; border-radius: 50%;"></span>
                <span>${param.seriesName}: </span>
                <span style="font-weight: bold; margin-left: 8px;">${value.toLocaleString()} ${data.unit}</span>
              </div>
            `;
          });
          
          return tooltip;
        }
      },
      legend: {
        data: legendData,
        top: 50,
        type: 'scroll',
        textStyle: {
          color: '#374151'
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save as Image'
          },
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: 'Zoom',
              back: 'Reset Zoom'
            }
          },

          magicType: {
            type: ['line', 'bar', 'stack'],
            title: {
              line: 'Line',
              bar: 'Bar',
              stack: 'Stack'
            }
          }
        },
        right: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 100,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xAxis,
        axisLabel: {
          color: '#6B7280',
          rotate: data.xAxis.length > 20 ? 45 : 0
        },
        axisLine: {
          lineStyle: {
            color: '#D1D5DB'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: `Energy (${data.unit})`,
        nameTextStyle: {
          color: '#374151',
          padding: [0, 0, 0, 10]
        },
        axisLabel: {
          formatter: '{value}',
          color: '#6B7280'
        },
        axisLine: {
          lineStyle: {
            color: '#D1D5DB'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#E5E7EB',
            type: 'dashed'
          }
        }
      },
      series: series
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  if (!data || !data.series || data.series.length === 0) {
    return (
      <div className="flex items-center justify-center bg-white rounded-lg shadow-md p-8" style={{ height }}>
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default AreaStackedGradient;