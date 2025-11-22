import React from "react";
import { type SourceData } from "@src/types/energyIntensity";

//THIS CHART ONLY WORKS PROPERLY WITH DAILY DATA (EVEN BETTER IF IT CONTAINS MULTIPLE MONTHS)

interface TimeRangeChartProps {
  source: SourceData;
  categories: string[];
}

const TimeRangeChart: React.FC<TimeRangeChartProps> = ({ source, categories }) => {

  return (
    <p>a</p>
  );
};

export default TimeRangeChart;
