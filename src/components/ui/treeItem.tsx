import type {SidebarNode} from "@src/types/sidebar.ts";
import React, {useState} from "react";
import {Building2, ChevronRight, FolderOpen, MapPin, Server} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {cn} from "@src/utils.ts";

interface TreeItemProps {
    node: SidebarNode;
    level?: number;
    selectedIds: Set<string>;
    toggleSelection: (id: string) => void;
}

export const TreeItem = ({ node, level = 0, selectedIds, toggleSelection }: TreeItemProps) => {
    const [isExpanded, setIsExpanded] = useState(node.isOpen || false);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedIds.has(node.id);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleCheck = () => toggleSelection(node.id);

    const getIcon = () => {
        switch (node.type) {
            case 'provider': return <Server size={14} className="text-blue-500" />;
            case 'group': return <FolderOpen size={14} className="text-blue-400" />;
            case 'site': return <MapPin size={14} className="text-slate-400" />;
            default: return <Building2 size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="select-none relative whitespace-nowrap">
            {level > 0 && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"
                    style={{ left: `${level * 16 + 11}px` }}
                />
            )}
            <motion.div
                className={cn(
                    "group flex items-center gap-2 py-2 pr-2 rounded-lg cursor-pointer transition-colors relative z-10",
                    level === 0 ? "mb-1" : "my-0.5",
                    isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
                <div
                    onClick={hasChildren ? handleExpand : undefined}
                    className={cn(
                        "w-5 h-5 flex items-center justify-center rounded-md transition-colors",
                        hasChildren ? "hover:bg-slate-200 text-slate-500 cursor-pointer" : "opacity-0 pointer-events-none"
                    )}
                >
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                        <ChevronRight size={14} />
                    </motion.div>
                </div>

                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheck}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                />

                <div className="flex-1 flex items-center gap-2 min-w-0" onClick={handleCheck}>
                    {getIcon()}
                    <span className={cn(
                        "text-sm truncate transition-colors",
                        level === 0 ? "font-semibold text-slate-800" : "font-medium text-slate-600",
                        isSelected && "text-blue-700"
                    )}>
                        {node.label}
                    </span>
                    {node.status === 'Active' && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">
                            Active
                        </span>
                    )}
                </div>
            </motion.div>

            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children!.map((child) => (
                            <TreeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                selectedIds={selectedIds}
                                toggleSelection={toggleSelection}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
