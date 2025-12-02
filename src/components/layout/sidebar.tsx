import { useState } from 'react';
import {
    MapPin,
    Server,
    BrainCircuit,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import {SIDEBAR_DATA, type SidebarNode} from "@src/types/sidebar.ts";
import {cn} from "@src/utils.ts";
import {TreeItem} from "@src/components/ui/treeItem.tsx";
import {useBoardDataSources} from "@src/services/boardService.ts";

interface SidebarProps {
    activeBoardId: string;
}

export const Sidebar = ({ activeBoardId }: SidebarProps) => {
    const { data: dataSources, isLoading, isError } = useBoardDataSources(activeBoardId);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1', '1-1', '1-1-1', '1-1-2']));

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };
    const renderTreeContent = () => {
        if (isLoading) {
            return <div className="p-4 text-center text-sm text-slate-500">Loading sources...</div>;
        }

        if (isError) {
            return <div className="p-4 text-center text-sm text-red-500">Error loading data sources.</div>;
        }

        // Use the fetched dataSources instead of the local SIDEBAR_DATA
        if (dataSources && dataSources.length > 0) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full overflow-visible"
                >
                    {dataSources.map((node: SidebarNode) => (
                        <TreeItem
                            key={node.id}
                            node={node}
                            selectedIds={selectedIds}
                            toggleSelection={toggleSelection}
                        />
                    ))}
                </motion.div>
            );
        }

        return <div className="p-4 text-center text-sm text-slate-500">No data sources available.</div>;
    };

    return (
        <motion.div
            animate={{ width: isCollapsed ? 60 : 320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full rounded-2xl border border-slate-200 bg-white flex flex-col font-sans shadow-lg relative shrink-0 z-20 overflow-hidden"
        >
            {/* Header / Toggle */}
            <div className={cn("p-4 border-b border-slate-100 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                        <h2 className="font-bold text-slate-800 text-sm">Data Sources</h2>
                    </motion.div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-50"
                >
                    {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>

            {/* Scrollable Tree Content - Only visible when expanded */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {!isCollapsed ? (
                    renderTreeContent()
                ) : (
                    <div className="flex flex-col items-center gap-4 mt-4 opacity-50">
                        <Server size={20} className="text-slate-400" />
                        <MapPin size={20} className="text-slate-400" />
                    </div>
                )}
            </div>

            {/* Footer / Intelligence Model */}
            <div className="p-4 bg-white border-t border-slate-100 overflow-hidden">
                {!isCollapsed ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <BrainCircuit size={16} className="text-slate-700" />
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Intelligence</span>
                        </div>

                        <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-default"
                        >
                            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Sensebase Core</span>
                            <div className="flex items-center gap-2 bg-white/60 px-2 py-1 rounded-full border border-blue-100 ml-2">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="flex justify-center">
                        <div className="relative flex h-3 w-3">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Sidebar;