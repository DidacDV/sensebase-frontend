import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    type FormState,
    mockAnomalies,
    mockPatterns,
    mockRecommendations,
} from "@src/types/costOptimizationModel.ts";
import {useBoardTariffBlueprints, useOptimizeTariff} from "@src/services/tariffService.ts";

/** BOARD_COLORS palette (match Context & Recommendations) */
const BOARD_COLORS = {
    grid: '#10B981',   // emerald green
    local: '#22C55E',  // lime green
    all: '#34D399',    // light green
    mixed: '#059669',  // darker green
    it: '#047857',     // forest green
};

interface CostOptimizationProps {
    boardId: string;
    onNavigateToComparator?: (tariffId: string) => void;
}

const CostOptimization = ({ boardId, onNavigateToComparator }: CostOptimizationProps) => {
    const queryClient = useQueryClient();
    // Form State
    const [formState, setFormState] = useState<FormState>({
        tariffId: '',
        selectedAnomalies: [],
        selectedRecommendations: ['rec-1', 'rec-2', 'rec-3'],
        consumption: {}
    });

    const [optimizationResult, setOptimizationResult] = useState<any>(null);
    const [newBlueprintId, setNewBlueprintId] = useState<string | null>(null);

    const { data: blueprints, isLoading: isLoadingTariffs, isFetching } = useBoardTariffBlueprints(boardId);
    const createdBlueprint = blueprints?.find(b => b.id === newBlueprintId);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const { mutate: optimize, isPending: isOptimizing } = useOptimizeTariff({
        onSuccess: async (data) => {
            setOptimizationResult(data);
            setNewBlueprintId(data.optimizedBlueprintId);
            await queryClient.invalidateQueries({
                queryKey: ['tariff-blueprints', 'board', boardId]
            });
        }
    });

    const handleOptimize = () => {
        if (!formState.tariffId) {
            alert('Please select a tariff first');
            return;
        }

        const payload = {
            tariffId: formState.tariffId,
            consumption: formState.consumption,
            recommendations: formState.selectedRecommendations.map(recId => {
                const rec = mockRecommendations.find(r => r.id === recId);
                return {
                    type: rec?.type || '',
                    parameters: rec?.parameters || {}
                };
            })
        };

        optimize(payload);
    };

    const handleCompareBlueprint = () => {
        if (newBlueprintId && onNavigateToComparator) {
            onNavigateToComparator(newBlueprintId);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-full flex gap-4"
        >
            {/* LEFT SIDEBAR - Parameters Panel */}
            <motion.div
                variants={itemVariants as any}
                className="w-72 bg-white rounded-lg shadow-md p-5 flex flex-col h-full max-h-[calc(100vh-2rem)]"
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                    <h3 className="text-lg font-semibold">Tariff Blueprint</h3>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 custom-scrollbar">
                    {/* Tariff Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Select Tariff
                        </label>
                        {isLoadingTariffs ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 text-sm italic">
                                Loading...
                            </div>
                        ) : (
                            <select
                                value={formState.tariffId}
                                onChange={(e) => setFormState(prev => ({ ...prev, tariffId: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Select a tariff...</option>
                                {blueprints?.map((tariff) => (
                                    <option key={tariff.id} value={tariff.id}>{tariff.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Anomalies Section - Collapsible */}
                    <details open className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none">
                            <h4 className="text-sm font-semibold text-gray-700">Anomalies</h4>
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    {mockAnomalies.length}
                </span>
                        </summary>
                        <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                            {mockAnomalies.map((anomaly) => (
                                <div key={anomaly.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded group/item">
                                    <div className={`w-1 shrink-0 self-stretch rounded ${anomaly.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{anomaly.title}</p>
                                        <p className="text-[10px] text-gray-500 leading-tight line-clamp-1">{anomaly.description}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 mt-0.5 rounded text-emerald-600"
                                        checked={formState.selectedAnomalies.includes(anomaly.id)}
                                        onChange={(e) => { /* logic */ }}
                                    />
                                </div>
                            ))}
                        </div>
                    </details>

                    {/* Recommendations Section - Collapsible */}
                    <details open className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none">
                            <h4 className="text-sm font-semibold text-gray-700">Recommendations</h4>
                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    {mockRecommendations.length}
                </span>
                        </summary>
                        <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                            {mockRecommendations.map((rec) => (
                                <div key={rec.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{rec.title}</p>
                                        <p className="text-[10px] text-gray-500 leading-tight line-clamp-1">{rec.description}</p>
                                    </div>
                                    <input type="checkbox" className="w-3 h-3 mt-0.5 rounded text-emerald-600" />
                                </div>
                            ))}
                        </div>
                    </details>

                    {/* Patterns Section - Compact */}
                    <div className="pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Patterns</h4>
                        <div className="grid grid-cols-1 gap-1">
                            {mockPatterns.slice(0, 2).map((pattern) => (
                                <div key={pattern.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                                    <span className="text-emerald-500 font-bold">{pattern.trend === 'up' ? '↑' : '↓'}</span>
                                    <span className="flex-1 ml-2 text-gray-700 truncate">{pattern.title}</span>
                                    <span className="font-bold">{pattern.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="shrink-0 space-y-3">
                    <button
                        onClick={handleOptimize}
                        disabled={!formState.tariffId || isOptimizing}
                        className="w-full bg-emerald-600 text-white py-2.5 rounded-md text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm disabled:bg-gray-200"
                    >
                        {isOptimizing ? 'Optimizing...' : 'Optimize Cost'}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center leading-tight">
                        Select items to view <span className="text-gray-600 font-medium">impact on cost</span>
                    </p>
                </div>
            </motion.div>

            {/* RIGHT CONTENT AREA */}
            <motion.div
                variants={itemVariants as any}
                className="flex-1 space-y-4 overflow-y-auto"
            >
                {/* Cost Optimization Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Cost optimization</h2>
                    <div className="flex gap-6">
                        {/* Costo Actual */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Current monthly cost</span>
                            </div>
                            <div className="text-4xl font-bold" style={{ color: BOARD_COLORS.mixed }}>
                                {optimizationResult?.costAnalysis?.current?.totalMonthly?.toFixed(2) ?? '0.00'}
                                <span className="text-2xl">€</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Annual: {optimizationResult?.costAnalysis?.current?.totalAnnual?.toFixed(2)}€
                            </p>
                        </div>

                        <div className="flex items-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>

                        {/* Costo Optimizado */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Optimized monthly cost</span>
                            </div>
                            <div className="text-4xl font-bold" style={{ color: BOARD_COLORS.grid }}>
                                {optimizationResult?.costAnalysis?.optimized?.totalMonthly?.toFixed(2) ?? '0.00'}
                                <span className="text-2xl">€</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Annual: {optimizationResult?.costAnalysis?.optimized?.totalAnnual?.toFixed(2)}€
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Savings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Total savings</h3>
                    <div className="flex gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Monthly Savings</span>
                            </div>
                            <div className="text-3xl font-bold" style={{ color: BOARD_COLORS.grid }}>
                                {optimizationResult?.costAnalysis?.savings?.monthlyAbsolute?.toFixed(2) ?? '0.00'}
                                <span className="text-xl">€</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Yearly Savings</span>
                            </div>
                            <div className="text-3xl font-bold" style={{ color: BOARD_COLORS.local }}>
                                {optimizationResult?.costAnalysis?.savings?.yearlyAbsolute?.toFixed(2) ?? '0.00'}
                                <span className="text-xl">€</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Reduction</span>
                            </div>
                            <div className="text-3xl font-bold" style={{ color: BOARD_COLORS.all }}>
                                {optimizationResult?.costAnalysis?.savings?.percentageReduction?.toFixed(1) ?? '0'}
                                <span className="text-xl">%</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Applied Recommendations</h3>
                    <div className="space-y-3">
                        {optimizationResult?.recommendationsApplied?.length > 0 ? (
                            optimizationResult.recommendationsApplied.map((rec: any, index: number) => (
                                <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r">
                                    <h4 className="font-semibold capitalize" style={{ color: BOARD_COLORS.it }}>
                                        {rec.type?.replace(/_/g, ' ') || 'Action'}
                                    </h4>
                                    {rec.parameters && Object.keys(rec.parameters).length > 0 && (
                                        <div className="mt-1 text-xs text-gray-600">
                                            {Object.entries(rec.parameters).map(([key, val]) => (
                                                <span key={key} className="inline-block mr-3">
                                    <span className="font-medium">{key}:</span> {String(val)}
                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No specific actions applied in this optimization.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Optimized Monthly Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {optimizationResult?.costAnalysis?.optimized?.breakdown &&
                            Object.entries(optimizationResult.costAnalysis.optimized.breakdown).map(([key, value]: [string, any]) => (
                                <div key={key} className="p-3 bg-gray-50 rounded border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold truncate">
                                        {key.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {value?.toFixed(2)}€
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {newBlueprintId && createdBlueprint && !isFetching && (
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg shadow-md p-6 border-2 border-emerald-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: BOARD_COLORS.it }}>New Optimized Blueprint Created!</h3>
                        </div>

                        <div className="bg-white rounded-lg p-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Blueprint Name</p>
                                <p className="text-lg font-bold text-gray-900">{createdBlueprint.name}</p>
                            </div>

                            {createdBlueprint.description && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Description</p>
                                    <p className="text-sm text-gray-700">{createdBlueprint.description}</p>
                                </div>
                            )}

                            <div className="flex gap-4 pt-3 border-t">
                                <button
                                    onClick={handleCompareBlueprint}
                                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Compare This Blueprint
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default CostOptimization;