import { type ChartStructure } from "@src/models/chartModels";

export interface Insights {
  insight1: string;
  insight2: string;
  insight3: string;
}

export interface Keypoint {
    title: string;
    description: string;
}

export interface Keypoints {
    keypoint1: Keypoint;
    keypoint2: Keypoint;
    keypoint3: Keypoint;
}

export interface BoardContext {
  chart1: ChartStructure;
  chart2: ChartStructure;
  mainContextDescription: string;
  secondaryContextDescription: string;
  insights: Insights;
  keypoints: Keypoints;
}
