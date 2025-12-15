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
  briefDescription: string;
  type: InsightType;
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
  chart1: ChartStructure;
  chart2: ChartStructure;
  mainSummary: MainSummary;
  insights: Insight[];
  deepDive: DeepDive;
}