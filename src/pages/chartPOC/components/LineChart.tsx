import React from "react";
import { type SourceData } from "../../../types/energyIntensity";

interface EnergyLineChartProps {
  data: SourceData;
  categories: string[];
  selectedOption?: string;
}

/**
 * Displays a line chart of energy consumption over time using Nivo.
 */
const LineChart: React.FC<EnergyLineChartProps> = ({
  data,
  categories,
}) => {

  return (
    <p>a</p>
  );
};

export default LineChart;
