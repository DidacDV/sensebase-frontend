import { useState, useEffect } from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import { boardFunctions } from "@src/services/boardFunctions";
import type { BoardContext } from "@src/models/boardModel";

const PROVIDER = "schneider";

const BoardPage = () => {
  const [activeTab, setActiveTab] = useState("Context");
  const [boardContext, setBoardContext] = useState<BoardContext | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === "Context") {
          const context: BoardContext = await boardFunctions.getContextData(PROVIDER);
          setBoardContext(context);
        } 
        // change to each correct tab when implemented
        else if (activeTab === "Recommendations") {
          const context: BoardContext = await boardFunctions.getContextData(PROVIDER);
          setBoardContext(context);
        }
        else {
          const context: BoardContext = await boardFunctions.getContextData(PROVIDER);
          setBoardContext(context);
        }
      } catch (err) {
        console.error(err);
        
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

        {!loading && activeTab === "Context"  && boardContext && (
          <Context context={boardContext}  />
        )}

        {/*!loading && activeTab === "Recommendations" && (
          <Recommendations chartData={chartData ?? undefined} />
        )*/}

      </div>
    </div>
  );
};

export default BoardPage;
