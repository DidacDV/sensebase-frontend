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

export interface RoseChartStructure {
  type: "rose";
  hourly: RoseChartData;
  daily: RoseChartData;
  monthly: RoseChartData;
}

export interface RoseChartData {
  timeline: string[];
  options: RoseSeriesItem[][]; 
  unit: string;
  granularity: string;
}

export interface RoseSeriesItem {
  name: string;
  value: number;
  category?: string;
  usageType?: string;
}

export interface ChartStructure {
  type: string;
  data: TimeSeriesChartStructure | BarChartData | RoseChartStructure;
}

//this is just to simulate the chartstructure type for now
export interface BarChartData {
  type: "bar";
  categories: string[];
  unit: string;
}