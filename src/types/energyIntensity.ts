// TODO delete or move to models
export interface TimeSeriesValue {
  startTime: string;
  endTime: string;
  value: number | null;
}

export interface Measure {
  urn: string;
  name: string;
  label: string;
  unit: {
    symbol: string;
  };
}

export interface EnergyData {
  thingId: number;
  thingLabel: string;
  measure: Measure;
  timeSeriesValues: TimeSeriesValue[];
}

export interface UsageCategory {
  "Active energy delivered": EnergyData[];
}

export interface SourceData {
  "No usage": UsageCategory;
  "Total": UsageCategory;
  "Lighting": UsageCategory;
  "IT": UsageCategory;
  "Mixed usages": UsageCategory;
}

export interface ConsumptionData {
  ALL: SourceData;
  GRID: SourceData;
  LOCAL: SourceData;
}

export interface EnergyResponse {
  CONSUMPTION: ConsumptionData;
}

export type TimeGranularity = 'hourly' | 'daily' | 'monthly';