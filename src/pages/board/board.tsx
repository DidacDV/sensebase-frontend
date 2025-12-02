import { useState, useEffect } from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import {useBoardContext} from "@src/services/boardService.ts";
import {useParams} from "react-router";
import ContextSkeleton from "@src/pages/board/components/boardContextSkeleton.tsx";
import Sidebar from "@src/components/layout/sidebar.tsx";


const PAYLOAD = {
  data_sources: [
    {
      tenant_id: 149180,
      site_id: 845436,
      building_id: 1048544,
      start_date: "2025-11-23",
      end_date: "2025-11-24",
      aggregation: "DAY",
      timezone: "Europe/Madrid"
    }
  ]
};

const BoardPage = () => {
  const [activeTab, setActiveTab] = useState("Context");
  const { id } = useParams<{ id: string }>();
  const { mutate: getContext, data: boardContext, isPending: loading } = useBoardContext();

  useEffect(() => {
    if (id) {
      getContext({ id, data: PAYLOAD });
    }
  }, [activeTab, id, getContext]);


  return (
      <div className="flex h-full w-full bg-gradient-to-b from-white to-blue-200 overflow-hidden p-4 gap-4">
        <Sidebar activeBoardId={id ?? ""}/>
        <main className="flex-1 flex flex-col h-full w-full min-w-0 relative">
          <div className="pt-6 px-10 shrink-0 z-10">
            <BoardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 p-6">

            {loading && <ContextSkeleton />}

            {!loading && activeTab === "Context"  && boardContext && (
                <Context context={boardContext}  />
            )}

            {/*!loading && activeTab === "Recommendations" && (
          <Recommendations chartData={chartData ?? undefined} />
            )*/}

          </div>
        </main>
    </div>
  );
};

export default BoardPage;
