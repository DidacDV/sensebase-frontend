import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    type FormState,
    mockAnomalies,
    mockPatterns,
    mockRecommendations,
} from "@src/types/costOptimizationModel.ts";
import {useBoardTariffBlueprints, useOptimizeTariff} from "@src/services/tariffService.ts";

interface CostOptimizationProps {
    boardId: string;
}

const CostOptimization = ({ boardId }: CostOptimizationProps) => {
    // Form State
    const [formState, setFormState] = useState<FormState>({
        tariffId: '',
        selectedAnomalies: [],
        selectedRecommendations: ['rec-1', 'rec-2', 'rec-3'],
        consumption: {}
    });

    const [optimizationResult, setOptimizationResult] = useState<any>(null);

    const { data: blueprints, isLoading: isLoadingTariffs } = useBoardTariffBlueprints(boardId);

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
        onSuccess: (data) => {
            setOptimizationResult(data);
        }
    });

    const handleOptimize = () => {
        if (!formState.tariffId) {
            alert('Please select a tariff first');
            return;
        }

        // Map your UI state to the backend-expected format
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
                className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 overflow-y-auto"
            >
                {/* Tariff Selector */}
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold">Tariff Blueprint</h3>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Tariff
                    </label>
                    {isLoadingTariffs ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500">
                            Loading tariffs...
                        </div>
                    ) : (
                        <select
                            value={formState.tariffId}
                            onChange={(e) => setFormState(prev => ({ ...prev, tariffId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a tariff...</option>
                            {blueprints?.map((tariff) => (
                                <option key={tariff.id} value={tariff.id}>
                                    {tariff.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Anomalies Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Anomalies</h4>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            {mockAnomalies.length} detected
                        </span>
                    </div>
                    <div className="space-y-2">
                        {mockAnomalies.map((anomaly) => (
                            <div key={anomaly.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <div className={`w-1 h-full rounded ${
                                    anomaly.severity === 'high' ? 'bg-red-500' :
                                        anomaly.severity === 'medium' ? 'bg-orange-500' :
                                            'bg-blue-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{anomaly.title}</p>
                                    <p className="text-xs text-gray-600">{anomaly.description}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={formState.selectedAnomalies.includes(anomaly.id)}
                                    onChange={(e) => {
                                        setFormState(prev => ({
                                            ...prev,
                                            selectedAnomalies: e.target.checked
                                                ? [...prev.selectedAnomalies, anomaly.id]
                                                : prev.selectedAnomalies.filter(id => id !== anomaly.id)
                                        }));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Recommendations</h4>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            {mockRecommendations.length} actions
                        </span>
                    </div>
                    <div className="space-y-2">
                        {mockRecommendations.map((rec) => (
                            <div key={rec.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <span className="text-lg">{rec.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                                    <p className="text-xs text-gray-600">{rec.description}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={formState.selectedRecommendations.includes(rec.id)}
                                    onChange={(e) => {
                                        setFormState(prev => ({
                                            ...prev,
                                            selectedRecommendations: e.target.checked
                                                ? [...prev.selectedRecommendations, rec.id]
                                                : prev.selectedRecommendations.filter(id => id !== rec.id)
                                        }));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Patterns Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Patterns</h4>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            Stable
                        </span>
                    </div>
                    <div className="space-y-2">
                        {mockPatterns.map((pattern) => (
                            <div key={pattern.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <span className={`${
                                        pattern.trend === 'up' ? 'text-green-500' :
                                            pattern.trend === 'down' ? 'text-blue-500' :
                                                'text-purple-500'
                                    }`}>
                                        {pattern.trend === 'up' ? '↑' : pattern.trend === 'down' ? '↓' : '→'}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{pattern.title}</p>
                                        <p className="text-xs text-gray-600">{pattern.timeRange}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold ${
                                    pattern.trend === 'up' ? 'text-green-600' :
                                        pattern.trend === 'down' ? 'text-blue-600' :
                                            'text-purple-600'
                                }`}>{pattern.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optimize Button */}
                <button
                    onClick={handleOptimize}
                    disabled={!formState.tariffId || isOptimizing}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Cost'}
                </button>

                {/* Footer Text */}
                <div className="mt-auto pt-4 border-t">
                    <p className="text-xs text-gray-600">
                        Select recommendations and anomalies to view their <span className="font-semibold">impact on the cost</span>
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
                            <div className="text-4xl font-bold text-red-500">
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
                            <div className="text-4xl font-bold text-green-500">
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
                            <div className="text-3xl font-bold text-blue-600">
                                {optimizationResult?.costAnalysis?.savings?.monthlyAbsolute?.toFixed(2) ?? '0.00'}
                                <span className="text-xl">€</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Yearly Savings</span>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">
                                {optimizationResult?.costAnalysis?.savings?.yearlyAbsolute?.toFixed(2) ?? '0.00'}
                                <span className="text-xl">€</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Reduction</span>
                            </div>
                            <div className="text-3xl font-bold text-purple-600">
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
                                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r">
                                    <h4 className="font-semibold capitalize text-blue-900">
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
            </motion.div>
        </motion.div>
    );
};

export default CostOptimization;