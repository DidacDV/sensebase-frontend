import { useState, useEffect } from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import {useBoardContext} from "@src/services/boardService.ts";
import {useParams} from "react-router";
import ContextSkeleton from "@src/pages/board/components/boardContextSkeleton.tsx";

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

  const { 
    data: boardContext, 
    isLoading: loading, 
    isError 
  } = useBoardContext({ 
    id, 
    data: PAYLOAD 
  });



  return (
    <div className="pr-10 pl-10">
       <BoardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
       
       <div className="mt-6">
          {loading && <ContextSkeleton />}
          
          {!loading && activeTab === "Context" && boardContext && (
             <Context context={boardContext} />
          )}
       </div>
    </div>
  );
};

export default BoardPage;