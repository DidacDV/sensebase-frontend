import { type SourceData } from "@src/types/energyIntensity";

interface HeatMapProps {
  source: SourceData;
  categories: string[];
}

export const HeatmapChart: React.FC<HeatMapProps> = ({ source, categories}) => {
  return (
    <p>a</p>
  );
};