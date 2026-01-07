import { type ChartStructure } from "@src/models/chartModels";

export type Sentiment = 'positive' | 'negative' | 'neutral';
export type InsightType = 'alert' | 'tip' | 'stat';

export interface MainSummary {
  title: string;
  content: string;
  sentiment: Sentiment;
}

export interface Insight {
  title: string;
  subtitle?: string;
  briefDescription: string;
  type: InsightType;
}

export interface Recommendation {
  title: string;
  subtitle?: string;
  briefDescription: string;
  type: InsightType;
}

export interface Anomaly {
  type: 'peak' | 'nighttime' | 'irregular' | 'trend';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  value: number;
  timestamp: string;
}

export interface Keypoint {
  label: string;
  text: string;
}

export interface DeepDive {
  description: string;
  keyPoints: Keypoint[];
}

export interface BoardContext {
  consumption_series: never[];
  chart1: ChartStructure;
  chart2: ChartStructure;
  mainSummary: MainSummary;
  insights: Insight[];
  deepDive: DeepDive;
  recommendations?: Recommendation[];
  anomalies?: Anomaly[];
}