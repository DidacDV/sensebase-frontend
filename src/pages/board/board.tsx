import { useState, useEffect } from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import { type ChartStructure } from "@src/models/chartModels";
import { boardService } from "@src/services/boardService";

const PROVIDER = "schneider";

const BoardPage = () => {
  const [activeTab, setActiveTab] = useState("Context");
  const [chartData, setChartData] = useState<ChartStructure | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data: ChartStructure;

        if (activeTab === "Context") {
          data = await boardService.getContextData(PROVIDER);
        } 
        // change to each correct tab when implemented
        else if (activeTab === "Recommendations") {
          data = await boardService.getContextData(PROVIDER);
        }
        else {
          data = await boardService.getContextData(PROVIDER);
        }

        setChartData(data);
      } catch (err) {
        console.error(err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col pr-10 pl-10 bg-gradient-to-b from-white to-blue-200">
      <BoardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {loading && <div className="text-gray-500">Loading...</div>}

        {!loading && activeTab === "Context" && (
          <Context chartData1={chartData ?? undefined} chartData2={chartData ?? undefined} />
        )}

        {/*!loading && activeTab === "Recommendations" && (
          <Recommendations chartData={chartData ?? undefined} />
        )*/}

      </div>
    </div>
  );
};

export default BoardPage;
