import { useState, useEffect } from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import Recommendations from "./components/boardRecommendations";
import { type TimeSeriesChartStructure } from "@src/models/chartModels";
import { energyService } from "@src/services/energyIntensity"

// TODO in reallity it would be one of all types 
const BoardPage = () => {
  const [activeTab, setActiveTab] = useState("Context");
  const [chartData, setChartsData] = useState<TimeSeriesChartStructure | undefined>(undefined); 

  // Fetch energy data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await energyService.getEnergyData();
        setChartsData(data);
      } catch (error) {
        console.error("Error loading energy data", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="w-full h-full flex flex-col pr-10 pl-10 bg-gradient-to-b from-white to-blue-200">
      <BoardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {activeTab === "Context" && <Context chartData1={chartData} chartData2={chartData} />}
        {activeTab === "Recommendations" && <Recommendations />}
        {/*activeTab === "Tariff calculator" && <TariffCalculator />*/}
      </div>
    </div>
  );
};

export default BoardPage;
