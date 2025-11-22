export interface TimeSeriesChartStructure {
  hourly: TimeSeriesChartData;
  daily: TimeSeriesChartData;
  monthly: TimeSeriesChartData;
}

export interface TimeSeriesChartData {
  xAxis: string[];
  series: TimeSeries[];
  unit: string;
  granularity: string;
}

export interface TimeSeries {
  name: string;
  category: string;
  usageType: string;
  thingLabel: string;
  data: number[];
}