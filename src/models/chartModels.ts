export interface TimeSeriesChartStructure {
  type: "timeseries";
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

export type ChartStructure = TimeSeriesChartStructure | BarChartData;

//this is just to simulate the chartstructure type for now
export interface BarChartData {
  type: "bar";
  categories: string[];
  unit: string;
}