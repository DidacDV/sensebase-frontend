import { useState, useMemo } from 'react';
import { useBoardTariffBlueprints } from "@src/services/tariffService.ts";
import ReactECharts from "echarts-for-react";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, BarChart3, Wallet } from 'lucide-react';

interface TariffComparatorProps {
    boardId: string;
    consumptionSeries?: any[];
}


const THEME = {
  planA: {
    base: '#1D4ED8',   
    dark: '#1E40AF',  
    bg: '#EFF6FF',    
    border: '#BFDBFE' 
  },
  planB: {
    base: '#6D28D9',
    dark: '#5B21B6', 
    bg: '#F5F3FF',   
    border: '#DDD6FE'  
  },
  success: {
    base: '#14B8A6',
    dark: '#0F766E',
    bg: '#F0FDFA',  
    border: '#CCFBF1' 
  },
  neutral: {
    text: '#334155',   
    subtext: '#64748B',
    border: '#E2E8F0'   
  }
};

const getPeriodForHour = (date: Date): string => {
    const hour = date.getHours();
    const day = date.getDay();

    if (day === 0 || day === 6) return 'p6';
    if (hour < 8) return 'p6';
    if ((hour >= 8 && hour < 10) || (hour >= 14 && hour < 18) || (hour >= 22)) return 'p2';
    if ((hour >= 10 && hour < 14) || (hour >= 18 && hour < 22)) return 'p1';
    return 'p6';
};

const TariffComparator = ({ boardId, consumptionSeries = [] }: TariffComparatorProps) => {
    const { data: blueprints, isLoading, error } = useBoardTariffBlueprints(boardId);
    
    const [selectedBlueprintIdA, setSelectedBlueprintIdA] = useState<string>('');
    const [selectedBlueprintIdB, setSelectedBlueprintIdB] = useState<string>('');
    const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month');

    const hasData = useMemo(() => consumptionSeries && consumptionSeries.length > 0, [consumptionSeries]);

    const energyByPeriod = useMemo(() => {
        if (!hasData) return null;

        const totals = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 };
        
        consumptionSeries?.forEach((point: any) => {
            const val = point.value || 0;
            const date = new Date(point.startTime);
            const durationHours = (new Date(point.endTime).getTime() - date.getTime()) / (1000 * 60 * 60);

            if (durationHours > 1) {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                if (isWeekend) {
                    totals.p6 += val / 1000;
                } else {
                    totals.p1 += (val * 0.40) / 1000;
                    totals.p2 += (val * 0.40) / 1000;
                    totals.p6 += (val * 0.20) / 1000;
                }
            } else {
                const period = getPeriodForHour(date);
                if (totals[period as keyof typeof totals] !== undefined) {
                    totals[period as keyof typeof totals] += val / 1000;
                }
            }
        });
        return totals;
    }, [consumptionSeries, hasData]);

    const calculateBlueprintCosts = (blueprintId: string) => {
        if (!blueprintId || !blueprints || !energyByPeriod) return null;

        const blueprint = blueprints.find(b => b.id.toString() === blueprintId);
        if (!blueprint) return null;

        const days = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : 30;

        const fixedCosts = [
            { period: 'P1', peaje: parseFloat(blueprint.contracted_power_p1) * parseFloat(blueprint.peaje_power_p1) * days, cargo: parseFloat(blueprint.contracted_power_p1) * parseFloat(blueprint.cargo_power_p1) * days },
            { period: 'P2', peaje: parseFloat(blueprint.contracted_power_p2) * parseFloat(blueprint.peaje_power_p2) * days, cargo: parseFloat(blueprint.contracted_power_p2) * parseFloat(blueprint.cargo_power_p2) * days },
            { period: 'P3', peaje: parseFloat(blueprint.contracted_power_p3) * parseFloat(blueprint.peaje_power_p3) * days, cargo: parseFloat(blueprint.contracted_power_p3) * parseFloat(blueprint.cargo_power_p3) * days },
            { period: 'P4', peaje: parseFloat(blueprint.contracted_power_p4) * parseFloat(blueprint.peaje_power_p4) * days, cargo: parseFloat(blueprint.contracted_power_p4) * parseFloat(blueprint.cargo_power_p4) * days },
            { period: 'P5', peaje: parseFloat(blueprint.contracted_power_p5) * parseFloat(blueprint.peaje_power_p5) * days, cargo: parseFloat(blueprint.contracted_power_p5) * parseFloat(blueprint.cargo_power_p5) * days },
            { period: 'P6', peaje: parseFloat(blueprint.contracted_power_p6) * parseFloat(blueprint.peaje_power_p6) * days, cargo: parseFloat(blueprint.contracted_power_p6) * parseFloat(blueprint.cargo_power_p6) * days }
        ];

        const variableCosts = [
            { period: 'P1', peaje: energyByPeriod.p1 * parseFloat(blueprint.peaje_energy_p1 || '0'), cargo: energyByPeriod.p1 * parseFloat(blueprint.cargo_energy_p1 || '0') },
            { period: 'P2', peaje: energyByPeriod.p2 * parseFloat(blueprint.peaje_energy_p2 || '0'), cargo: energyByPeriod.p2 * parseFloat(blueprint.cargo_energy_p2 || '0') },
            { period: 'P3', peaje: energyByPeriod.p3 * parseFloat(blueprint.peaje_energy_p2 || '0'), cargo: energyByPeriod.p3 * parseFloat(blueprint.cargo_energy_p2 || '0') },
            { period: 'P4', peaje: energyByPeriod.p4 * parseFloat(blueprint.peaje_energy_p2 || '0'), cargo: energyByPeriod.p4 * parseFloat(blueprint.cargo_energy_p2 || '0') },
            { period: 'P5', peaje: energyByPeriod.p5 * parseFloat(blueprint.peaje_energy_p2 || '0'), cargo: energyByPeriod.p5 * parseFloat(blueprint.cargo_energy_p2 || '0') },
            { period: 'P6', peaje: energyByPeriod.p6 * parseFloat(blueprint.peaje_energy_p6 || '0'), cargo: energyByPeriod.p6 * parseFloat(blueprint.cargo_energy_p6 || '0') }
        ];

        const totalFixedPeajes = fixedCosts.reduce((sum, item) => sum + item.peaje, 0);
        const totalFixedCargos = fixedCosts.reduce((sum, item) => sum + item.cargo, 0);
        const totalVariablePeajes = variableCosts.reduce((sum, item) => sum + item.peaje, 0);
        const totalVariableCargos = variableCosts.reduce((sum, item) => sum + item.cargo, 0);

        const otherCosts = {
            socialBonus: parseFloat(blueprint.social_bonus_financing_daily) * days,
            meterRental: parseFloat(blueprint.meter_rental_daily) * days
        };

        const totalOther = otherCosts.socialBonus + otherCosts.meterRental;
        const subtotal = totalFixedPeajes + totalFixedCargos + totalVariablePeajes + totalVariableCargos + totalOther;
        const electricityTax = subtotal * (parseFloat(blueprint.electricity_tax_percentage) / 100);
        const total = subtotal + electricityTax;

        return {
            blueprint,
            fixedCosts,
            variableCosts,
            totalFixedPeajes,
            totalFixedCargos,
            totalVariablePeajes,
            totalVariableCargos,
            totalOther,
            electricityTax,
            total,
            days
        };
    };

    const costsA = useMemo(() => calculateBlueprintCosts(selectedBlueprintIdA), [selectedBlueprintIdA, blueprints, energyByPeriod, timePeriod]);
    const costsB = useMemo(() => calculateBlueprintCosts(selectedBlueprintIdB), [selectedBlueprintIdB, blueprints, energyByPeriod, timePeriod]);

    const savings = useMemo(() => {
        if (!costsA || !costsB) return null;
        const diff = costsA.total - costsB.total;
        const isA_Cheaper = diff < 0;
        
        return {
            amount: Math.abs(diff),
            percentage: (Math.abs(diff) / Math.max(costsA.total, costsB.total)) * 100,
            winnerId: isA_Cheaper ? selectedBlueprintIdA : selectedBlueprintIdB,
            winnerName: isA_Cheaper ? costsA.blueprint.name : costsB.blueprint.name,
        };
    }, [costsA, costsB, selectedBlueprintIdA, selectedBlueprintIdB]);

    const comparisonChartOption = useMemo(() => {
        if (!costsA || !costsB) return null;

        const categories = ['Fixed Power', 'Fixed Cargos', 'Variable Energy', 'Variable Cargos', 'Other', 'Tax'];
        
        return {
            grid: { top: 40, right: 20, bottom: 30, left: 50, containLabel: true },
            tooltip: { 
                trigger: 'axis', 
                backgroundColor: '#fff',
                borderColor: '#e5e7eb',
                textStyle: { color: '#334155' },
                axisPointer: { type: 'line', lineStyle: { type: 'dashed' } }
            },
            legend: { 
                data: [costsA.blueprint.name, costsB.blueprint.name],
                bottom: 0,
                icon: 'circle',
                itemGap: 24,
                textStyle: { color: '#64748B' }
            },
            xAxis: { 
                type: 'category', 
                data: categories,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#64748B', fontSize: 11, margin: 12 }
            },
            yAxis: { 
                type: 'value', 
                splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
                axisLabel: { formatter: '€{value}', color: '#94A3B8' }
            },
            series: [
                {
                    name: costsA.blueprint.name,
                    type: 'bar',
                    barGap: '15%',
                    barCategoryGap: '45%',
                    itemStyle: { 
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [{ offset: 0, color: savings?.winnerId === selectedBlueprintIdA ? '#7DD3FC' : 'black' }, { offset: 1, color: savings?.winnerId === selectedBlueprintIdA ? '#7DD3FC' : 'black' }]
                        },
                        borderRadius: [4, 4, 0, 0] 
                    },
                    data: [costsA.totalFixedPeajes, costsA.totalFixedCargos, costsA.totalVariablePeajes, costsA.totalVariableCargos, costsA.totalOther, costsA.electricityTax]
                },
                {
                    name: costsB.blueprint.name,
                    type: 'bar',
                    itemStyle: { 
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [{ offset: 0, color: savings?.winnerId === selectedBlueprintIdB ? '#2563EB' : 'black' }, { offset: 1, color: savings?.winnerId === selectedBlueprintIdB ? '#2563EB' : 'black' }]
                        },
                        borderRadius: [4, 4, 0, 0] 
                    },
                    data: [costsB.totalFixedPeajes, costsB.totalFixedCargos, costsB.totalVariablePeajes, costsB.totalVariableCargos, costsB.totalOther, costsB.electricityTax]
                }
            ]
        };
    }, [costsA, costsB]);

    if (!hasData) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-orange-100 max-w-md">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="text-blue-900 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No Consumption Data</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        Tariff comparison requires real energy consumption data. Please connect a valid data source to proceed.
                    </p>
                </div>
            </div>
        );
    }

    const isComparisonActive = Boolean(costsA && costsB);

    return (
        <div className="w-full h-full bg-slate-50/50 flex flex-col overflow-hidden font-sans">
            {/* 1. Header & Controls */}
            <div className="flex-none bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-slate-400" />
                        Tariff Comparator
                    </h1>
                </div>
                
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {(['day', 'week', 'month'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimePeriod(period)}
                            className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                                timePeriod === period 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    
                    {/* The Comparison Arena */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden relative">
                        
                        {/* Divider */}
                        <div className="absolute left-1/2 top-8 bottom-8 w-px bg-slate-100 -translate-x-1/2 hidden md:block" />

                        {/* Plan A Side */}
                        <div
                        className={`p-8 relative transition-colors duration-300 ${
                            !isComparisonActive
                            ? 'bg-[#7DD3FC] text-white'
                            : savings?.winnerId === selectedBlueprintIdA
                                ? 'bg-[#7DD3FC] text-white'
                                : 'bg-white text-slate-900'
                        }`}
                        >
                            <div className="flex flex-col h-full">
                                <label className="text-xs font-bold uppercase text-black tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: THEME.planA.base }}></div>
                                    Baseline Plan
                                </label>
                                <select
                                    value={selectedBlueprintIdA}
                                    onChange={(e) => setSelectedBlueprintIdA(e.target.value)}
                                    className="w-full text-lg font-medium text-slate-900 bg-transparent border-0 border-b focus:border-blue-600 focus:ring-0 px-0 py-2 cursor-pointer hover:border-gray-300 transition-colors"
                                >
                                    <option value="">Select Plan A</option>
                                    {blueprints?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                
                                {costsA ? (
                                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-baseline gap-1.5 mb-6">
                                            <span className="text-4xl font-bold text-slate-900 tracking-tight">€{costsA.total.toFixed(2)}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-500">Fixed Costs</span>
                                                <span className="font-semibold text-slate-700">€{(costsA.totalFixedPeajes + costsA.totalFixedCargos).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-500">Variable Costs</span>
                                                <span className="font-semibold text-slate-700">€{(costsA.totalVariablePeajes + costsA.totalVariableCargos).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-12 text-center text-black text-sm py-8 border-2 border-dashed border-black rounded-lg">
                                        Select a plan to view costs
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Plan B Side */}
                        <div
                        className={`p-8 relative transition-colors duration-300 ${
                            !isComparisonActive
                            ? 'bg-[#2563EB] text-white'
                            : savings?.winnerId === selectedBlueprintIdB
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-white text-slate-900'
                        }`}
                        >
                            <div className="flex flex-col h-full">
                                <label className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'white'}}></div>
                                    Comparison Plan
                                </label>
                                <select
                                    value={selectedBlueprintIdB}
                                    onChange={(e) => setSelectedBlueprintIdB(e.target.value)}
                                    className="w-full text-lg font-medium text-white bg-transparent border-0 border-b border-gray-200 focus:border-violet-600 focus:ring-0 px-0 py-2 cursor-pointer hover:border-gray-300 transition-colors"
                                >
                                    <option value="" className="text-black">Select Plan B</option>
                                    {blueprints?.map((b) => (
                                        <option key={b.id} value={b.id} className="text-black bg-white">
                                            {b.name}
                                        </option>
                                    ))}
                                </select>

                                {costsB ? (
                                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-baseline gap-1.5 mb-6">
                                            <span className="text-4xl font-bold text-white tracking-tight">€{costsB.total.toFixed(2)}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-500">Fixed Costs</span>
                                                <span className="font-semibold text-slate-700">€{(costsB.totalFixedPeajes + costsB.totalFixedCargos).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-500">Variable Costs</span>
                                                <span className="font-semibold text-slate-700">€{(costsB.totalVariablePeajes + costsB.totalVariableCargos).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-12 text-center text-slate-300 text-sm py-8 border-2 border-dashed border-slate-100 rounded-lg">
                                        Select a plan to view costs
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Analysis Section */}
                    <AnimatePresence>
                        {savings && costsA && costsB && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                {/* Results Card - Styled with the "ALL-Mixed usages" Teal */}
                                <div className="lg:col-span-1">
                                    <div 
                                        className="h-full rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${THEME.planA.base} 0%, ${THEME.success.dark} 100%)`,
                                            color: 'white'
                                        }}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4 opacity-90">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Recommendation</span>
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold mb-1 leading-tight">{savings.winnerName}</h3>
                                            <p className="text-teal-100 text-sm mb-8 opacity-90">is the optimal choice.</p>
                                            
                                            <div className="mb-6">
                                                <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Potential Savings</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-bold tracking-tighter">€{savings.amount.toFixed(2)}</span>
                                                </div>
                                                <div className="mt-4 bg-white/20 h-1.5 rounded-full overflow-hidden w-full max-w-[200px]">
                                                    <div className="bg-white h-full rounded-full" style={{ width: `${savings.percentage}%` }}></div>
                                                </div>
                                                <p className="text-xs text-teal-100 mt-2 font-medium">{savings.percentage.toFixed(1)}% cost reduction</p>
                                            </div>
                                        </div>

                                        {/* Decorative elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
                                    </div>
                                </div>

                                {/* Chart Card */}
                                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-slate-400" />
                                            Cost Composition
                                        </h3>
                                    </div>
                                    <ReactECharts
                                        option={comparisonChartOption}
                                        style={{ height: '300px', width: '100%' }}
                                        opts={{ renderer: 'canvas' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TariffComparator;