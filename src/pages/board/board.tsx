import {useState, useEffect, useCallback} from "react";
import BoardTabs from "./components/boardTabs";
import Context from "./components/boardContext";
import {useBoardContext} from "@src/services/boardService.ts";
import {useParams} from "react-router";
import ContextSkeleton from "@src/pages/board/components/boardContextSkeleton.tsx";
import Sidebar from "@src/components/layout/sidebar.tsx";
import type {SidebarNode} from "@src/types/sidebar.ts";
import type {DataSourcesResponse} from "@src/types/boardModel.ts";
import TariffSimulator from "@src/pages/board/components/boardTariffSimulator.tsx";
import CostOptimization from "@src/pages/board/components/boardCostOptimization.tsx";
import { useQueryClient } from "@tanstack/react-query";



const createDynamicPayload = (
    selectedIds: Set<string>,
    dataSourcesResponse: DataSourcesResponse | undefined
) => {
  //TODO this is tightly coupled to schneider too.
  if (!dataSourcesResponse || !dataSourcesResponse.dataSources) {
    return { data_sources: [] };
  }

  const allDataSources = dataSourcesResponse.dataSources;
  const defaultTenantId = dataSourcesResponse.tenantId; // Use the actual tenant ID

  const dataSourcesMap = new Map<string, SidebarNode>();

  const flattenNodes = (nodes: SidebarNode[]) => {
    for (const node of nodes) {
      dataSourcesMap.set(node.id, node);
      if (node.children) {
        flattenNodes(node.children);
      }
    }
  };
  flattenNodes(allDataSources);

  const dynamicSources = Array.from(selectedIds)
      .map(id => dataSourcesMap.get(id))
      .filter((node): node is SidebarNode => !!node && (node.type === 'site' || node.buildingId !== null)) // Filter for measurable nodes
      .map(node => ({
        tenant_id: node.tenantId ?? defaultTenantId,
        site_id: node.siteId ?? null,
        building_id: node.buildingId ?? null,
        start_date: "2025-11-23",
        end_date: "2025-11-24",
        aggregation: "DAY",
        timezone: "Europe/Madrid"
      }));

  // Return the full array for multi-source support
  return {
    data_sources: dynamicSources
  };
};


const BoardPage = () => {
    const [activeTab, setActiveTab] = useState("Context");
    const { id } = useParams<{ id: string }>();
    const { mutate: getContext, data: boardContext, isPending: loading } = useBoardContext();

    const [currentSelectedIds, setCurrentSelectedIds] = useState<Set<string>>();
    const [allDataSources, setAllDataSources] = useState<DataSourcesResponse | undefined>(undefined);

    const handleSelectionChange = useCallback((ids: Set<string>, sources: DataSourcesResponse | undefined) => {
        setCurrentSelectedIds(ids);
        setAllDataSources(sources);
    }, []);

const queryClient = useQueryClient();

useEffect(() => {
    if (id && currentSelectedIds && currentSelectedIds?.size > 0 && allDataSources) {
        const payload = createDynamicPayload(currentSelectedIds, allDataSources);

        if (payload.data_sources.length > 0) {
            //check cache first
            const cacheKey = ['board-context', id, JSON.stringify(payload)];
            const cachedData = queryClient.getQueryData(cacheKey);

            if (!cachedData) {
                //only fetch if not in cache
                getContext({ id: id, data: payload });
            }
        }
    }
}, [activeTab, allDataSources, currentSelectedIds, getContext, id, queryClient]);

    return (
        <div className="flex flex-row bg-gradient-to-b from-white to-blue-200 overflow-hidden p-4 gap-4" style={{ height: 'calc(100vh - 72px)' }}>
            <Sidebar activeBoardId={id ?? ""} onSelectionChange={handleSelectionChange} />
            <main className="flex-1 flex flex-col h-full min-w-0 relative">
                <div className="px-10 pt-4 shrink-0 z-10">
                    <BoardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 px-6 pb-6 pt-4">
                    {loading && activeTab === "Context" &&<ContextSkeleton />}

                    {!loading && activeTab === "Context" && boardContext && (
                        <Context context={boardContext} />
                    )}

                    {activeTab === "Tariff simulator" && (
                        <TariffSimulator />
                    )}
                    {activeTab === "Cost optimization" && (
                        <CostOptimization />
                    )}
                </div>
            </main>
        </div>
    );
};

export default BoardPage;
