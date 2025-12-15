import {useState, useEffect, useMemo} from 'react';
import { motion } from 'framer-motion';
import {useBoardTariffBlueprints} from "@src/services/tariffService.ts";
import type {TariffBlueprint} from "@src/types/tariffModel.ts";
import ReactECharts from "echarts-for-react";

interface TariffSimulatorProps {
    boardId: string;
}

const TariffSimulator = ({ boardId }: TariffSimulatorProps) => {
    const [tariffType, setTariffType] = useState('indexed');
    const [accessToll, setAccessToll] = useState('2.1t');
    const [useRecommendations, setUseRecommendations] = useState(true);
    const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day');
    // Fetch tariff blueprints
    const { data: blueprints, isLoading, error } = useBoardTariffBlueprints(boardId);
    const [selectedBlueprint, setSelectedBlueprint] = useState<TariffBlueprint | null>(null);

    // Form state for all fields
    const [formData, setFormData] = useState({
        contracted_power_p1: '',
        contracted_power_p2: '',
        contracted_power_p3: '',
        contracted_power_p4: '',
        contracted_power_p5: '',
        contracted_power_p6: '',
        peaje_power_p1: '',
        peaje_power_p2: '',
        peaje_power_p3: '',
        peaje_power_p4: '',
        peaje_power_p5: '',
        peaje_power_p6: '',
        cargo_power_p1: '',
        cargo_power_p2: '',
        cargo_power_p3: '',
        cargo_power_p4: '',
        cargo_power_p5: '',
        cargo_power_p6: '',
        peaje_energy_p1: '',
        peaje_energy_p2: '',
        peaje_energy_p6: '',
        cargo_energy_p1: '',
        cargo_energy_p2: '',
        cargo_energy_p6: '',
        electricity_tax_percentage: '5.11269632',
        social_bonus_financing_daily: '0.006282',
        meter_rental_daily: '2.098361',
    });

    // Populate form when blueprint is selected
    useEffect(() => {
        if (selectedBlueprint) {
            setFormData({
                contracted_power_p1: selectedBlueprint.contracted_power_p1,
                contracted_power_p2: selectedBlueprint.contracted_power_p2,
                contracted_power_p3: selectedBlueprint.contracted_power_p3,
                contracted_power_p4: selectedBlueprint.contracted_power_p4,
                contracted_power_p5: selectedBlueprint.contracted_power_p5,
                contracted_power_p6: selectedBlueprint.contracted_power_p6,
                peaje_power_p1: selectedBlueprint.peaje_power_p1,
                peaje_power_p2: selectedBlueprint.peaje_power_p2,
                peaje_power_p3: selectedBlueprint.peaje_power_p3,
                peaje_power_p4: selectedBlueprint.peaje_power_p4,
                peaje_power_p5: selectedBlueprint.peaje_power_p5,
                peaje_power_p6: selectedBlueprint.peaje_power_p6,
                cargo_power_p1: selectedBlueprint.cargo_power_p1,
                cargo_power_p2: selectedBlueprint.cargo_power_p2,
                cargo_power_p3: selectedBlueprint.cargo_power_p3,
                cargo_power_p4: selectedBlueprint.cargo_power_p4,
                cargo_power_p5: selectedBlueprint.cargo_power_p5,
                cargo_power_p6: selectedBlueprint.cargo_power_p6,
                peaje_energy_p1: selectedBlueprint.peaje_energy_p1,
                peaje_energy_p2: selectedBlueprint.peaje_energy_p2,
                peaje_energy_p6: selectedBlueprint.peaje_energy_p6,
                cargo_energy_p1: selectedBlueprint.cargo_energy_p1,
                cargo_energy_p2: selectedBlueprint.cargo_energy_p2,
                cargo_energy_p6: selectedBlueprint.cargo_energy_p6,
                electricity_tax_percentage: selectedBlueprint.electricity_tax_percentage,
                social_bonus_financing_daily: selectedBlueprint.social_bonus_financing_daily,
                meter_rental_daily: selectedBlueprint.meter_rental_daily,
            });
        }
    }, [selectedBlueprint]);

    const handleBlueprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const blueprintId = parseInt(e.target.value);

        if (!blueprintId || isNaN(blueprintId)) {
            setSelectedBlueprint(null);
            setFormData({
                contracted_power_p1: '',
                contracted_power_p2: '',
                contracted_power_p3: '',
                contracted_power_p4: '',
                contracted_power_p5: '',
                contracted_power_p6: '',
                peaje_power_p1: '',
                peaje_power_p2: '',
                peaje_power_p3: '',
                peaje_power_p4: '',
                peaje_power_p5: '',
                peaje_power_p6: '',
                cargo_power_p1: '',
                cargo_power_p2: '',
                cargo_power_p3: '',
                cargo_power_p4: '',
                cargo_power_p5: '',
                cargo_power_p6: '',
                peaje_energy_p1: '',
                peaje_energy_p2: '',
                peaje_energy_p6: '',
                cargo_energy_p1: '',
                cargo_energy_p2: '',
                cargo_energy_p6: '',
                electricity_tax_percentage: '5.11269632',
                social_bonus_financing_daily: '0.006282',
                meter_rental_daily: '2.098361',
            });
            return;
        }

        const blueprint = blueprints?.find(b => b.id === blueprintId);
        setSelectedBlueprint(blueprint || null);
    };

    const calculateCosts = useMemo(() => {
        if (!formData.contracted_power_p1) return null;

        const days = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : 30;

        // Fixed costs (power) per period
        const fixedCosts = [
            {
                name: 'P1 Power',
                peaje: parseFloat(formData.contracted_power_p1) * parseFloat(formData.peaje_power_p1) * days,
                cargo: parseFloat(formData.contracted_power_p1) * parseFloat(formData.cargo_power_p1) * days
            },
            {
                name: 'P2 Power',
                peaje: parseFloat(formData.contracted_power_p2) * parseFloat(formData.peaje_power_p2) * days,
                cargo: parseFloat(formData.contracted_power_p2) * parseFloat(formData.cargo_power_p2) * days
            },
            {
                name: 'P3 Power',
                peaje: parseFloat(formData.contracted_power_p3) * parseFloat(formData.peaje_power_p3) * days,
                cargo: parseFloat(formData.contracted_power_p3) * parseFloat(formData.cargo_power_p3) * days
            },
            {
                name: 'P4 Power',
                peaje: parseFloat(formData.contracted_power_p4) * parseFloat(formData.peaje_power_p4) * days,
                cargo: parseFloat(formData.contracted_power_p4) * parseFloat(formData.cargo_power_p4) * days
            },
            {
                name: 'P5 Power',
                peaje: parseFloat(formData.contracted_power_p5) * parseFloat(formData.peaje_power_p5) * days,
                cargo: parseFloat(formData.contracted_power_p5) * parseFloat(formData.cargo_power_p5) * days
            },
            {
                name: 'P6 Power',
                peaje: parseFloat(formData.contracted_power_p6) * parseFloat(formData.peaje_power_p6) * days,
                cargo: parseFloat(formData.contracted_power_p6) * parseFloat(formData.cargo_power_p6) * days
            }
        ];

        // Other fixed costs
        const otherCosts = {
            socialBonus: parseFloat(formData.social_bonus_financing_daily) * days,
            meterRental: parseFloat(formData.meter_rental_daily) * days
        };

        const totalFixedPeajes = fixedCosts.reduce((sum, item) => sum + item.peaje, 0);
        const totalFixedCargos = fixedCosts.reduce((sum, item) => sum + item.cargo, 0);
        const totalOther = otherCosts.socialBonus + otherCosts.meterRental;
        const subtotal = totalFixedPeajes + totalFixedCargos + totalOther;
        const electricityTax = subtotal * (parseFloat(formData.electricity_tax_percentage) / 100);
        const total = subtotal + electricityTax;

        return {
            fixedCosts,
            totalFixedPeajes,
            totalFixedCargos,
            otherCosts,
            totalOther,
            electricityTax,
            subtotal,
            total,
            days
        };
    }, [formData, timePeriod]);

    const chartOption = useMemo(() => {
        if (!calculateCosts) return null;

        return {
            title: {
                text: `Tariff Cost Breakdown - ${timePeriod === 'day' ? 'Daily' : timePeriod === 'week' ? 'Weekly' : 'Monthly'}`,
                left: 'center',
                textStyle: {
                    color: '#1A3D63',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    let tooltip = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
                    params.forEach((param: any) => {
                        tooltip += `
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px; border-radius: 50%;"></span>
                            <span>${param.seriesName}: </span>
                            <span style="font-weight: bold; margin-left: 8px;">${param.value.toFixed(2)} €</span>
                        </div>
                    `;
                    });
                    return tooltip;
                }
            },
            legend: {
                data: ['Peajes', 'Cargos'],
                top: 30,
                textStyle: { color: '#374151' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: 80,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
                axisLabel: { color: '#6B7280' },
                axisLine: { lineStyle: { color: '#D1D5DB' } }
            },
            yAxis: {
                type: 'value',
                name: 'Cost (€)',
                nameTextStyle: { color: '#374151' },
                axisLabel: {
                    formatter: '{value} €',
                    color: '#6B7280'
                },
                axisLine: { lineStyle: { color: '#D1D5DB' } },
                splitLine: { lineStyle: { color: '#E5E7EB', type: 'dashed' } }
            },
            series: [
                {
                    name: 'Peajes',
                    type: 'bar',
                    stack: 'total',
                    data: calculateCosts.fixedCosts.map(c => c.peaje.toFixed(2)),
                    itemStyle: { color: '#3B82F6' }
                },
                {
                    name: 'Cargos',
                    type: 'bar',
                    stack: 'total',
                    data: calculateCosts.fixedCosts.map(c => c.cargo.toFixed(2)),
                    itemStyle: { color: '#8B5CF6' }
                }
            ]
        };
    }, [calculateCosts, timePeriod]);

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

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-full flex gap-4"
        >
            {/* LEFT SIDEBAR - Configuration Panel */}
            <motion.div
                variants={itemVariants as any}
                className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col gap-6 overflow-y-auto max-h-screen"
            >
                <div>
                    <h3 className="text-lg font-semibold mb-4">Tariff Configuration</h3>

                    {/* Blueprint Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Blueprint
                        </label>
                        {isLoading ? (
                            <div className="text-sm text-gray-500">Loading blueprints...</div>
                        ) : error ? (
                            <div className="text-sm text-red-500">Error loading blueprints</div>
                        ) : (
                            <select
                                onChange={handleBlueprintChange}
                                value={selectedBlueprint?.id || ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select a blueprint --</option>
                                {blueprints?.map((blueprint) => (
                                    <option key={blueprint.id} value={blueprint.id}>
                                        {blueprint.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {selectedBlueprint && (
                            <p className="mt-1 text-xs text-gray-500">
                                {selectedBlueprint.description}
                            </p>
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Auto complete with your bill
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Tariff Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tariff type
                        </label>
                        <select
                            value={tariffType}
                            onChange={(e) => setTariffType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="indexed">Indexed tariffs</option>
                            <option value="fixed">Fixed tariffs</option>
                        </select>
                    </div>

                    {/* Access Toll */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access toll
                        </label>
                        <select
                            value={accessToll}
                            onChange={(e) => setAccessToll(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="2.1t">2.1t</option>
                            <option value="2.0td">2.0td</option>
                            <option value="3.0td">3.0td</option>
                        </select>
                    </div>

                    {/* Use Recommendations */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={useRecommendations}
                                onChange={(e) => setUseRecommendations(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Use recommendations</span>
                        </label>
                    </div>

                    {/* Collapsible Sections */}
                    <div className="space-y-2">
                        {/* Contracted Power by Period */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Contracted power by period (kW)
                            </summary>
                            <div className="mt-2 space-y-2">
                                {['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((period) => (
                                    <div key={period}>
                                        <label className="text-xs text-gray-600">Period {period.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData[`contracted_power_${period}` as keyof typeof formData]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [`contracted_power_${period}`]: e.target.value
                                            })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Fixed Cost by Period - Peajes */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Fixed cost - Peajes (€/kW día)
                            </summary>
                            <div className="mt-2 space-y-2">
                                {['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((period) => (
                                    <div key={period}>
                                        <label className="text-xs text-gray-600">Period {period.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData[`peaje_power_${period}` as keyof typeof formData]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [`peaje_power_${period}`]: e.target.value
                                            })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Fixed Cost by Period - Cargos */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Fixed cost - Cargos (€/kW día)
                            </summary>
                            <div className="mt-2 space-y-2">
                                {['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((period) => (
                                    <div key={period}>
                                        <label className="text-xs text-gray-600">Period {period.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData[`cargo_power_${period}` as keyof typeof formData]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [`cargo_power_${period}`]: e.target.value
                                            })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Variable Cost - Peajes Energy */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Variable cost - Peajes (€/kWh)
                            </summary>
                            <div className="mt-2 space-y-2">
                                {['p1', 'p2', 'p6'].map((period) => (
                                    <div key={period}>
                                        <label className="text-xs text-gray-600">Period {period.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData[`peaje_energy_${period}` as keyof typeof formData]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [`peaje_energy_${period}`]: e.target.value
                                            })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Variable Cost - Cargos Energy */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Variable cost - Cargos (€/kWh)
                            </summary>
                            <div className="mt-2 space-y-2">
                                {['p1', 'p2', 'p6'].map((period) => (
                                    <div key={period}>
                                        <label className="text-xs text-gray-600">Period {period.toUpperCase()}</label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData[`cargo_energy_${period}` as keyof typeof formData]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [`cargo_energy_${period}`]: e.target.value
                                            })}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Other Costs */}
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Other costs
                            </summary>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <label className="text-xs text-gray-600">Electricity Tax (%)</label>
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        value={formData.electricity_tax_percentage}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            electricity_tax_percentage: e.target.value
                                        })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Social Bonus (€/día)</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.social_bonus_financing_daily}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            social_bonus_financing_daily: e.target.value
                                        })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Meter Rental (€/día)</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.meter_rental_daily}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meter_rental_daily: e.target.value
                                        })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                        SAVE
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
                        TEST
                    </button>
                </div>
            </motion.div>

            {/* RIGHT CONTENT AREA */}
            <motion.div
                variants={itemVariants as any}
                className="flex-1 space-y-6"
            >
                {/* Chart Section */}
                {/* Chart Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Tariff Cost Analysis</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimePeriod('day')}
                                className={`px-3 py-1 text-sm rounded ${timePeriod === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setTimePeriod('week')}
                                className={`px-3 py-1 text-sm rounded ${timePeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setTimePeriod('month')}
                                className={`px-3 py-1 text-sm rounded ${timePeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Month
                            </button>
                        </div>
                    </div>

                    {chartOption && calculateCosts ? (
                        <>
                            <ReactECharts
                                option={chartOption}
                                style={{ height: '300px', width: '100%' }}
                                opts={{ renderer: 'canvas' }}
                            />

                            {/* Cost Summary */}
                            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm text-gray-600">Total Peajes</p>
                                    <p className="text-lg font-semibold text-blue-600">{calculateCosts.totalFixedPeajes.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Cargos</p>
                                    <p className="text-lg font-semibold text-purple-600">{calculateCosts.totalFixedCargos.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Other Costs</p>
                                    <p className="text-lg font-semibold text-gray-600">{calculateCosts.totalOther.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Electricity Tax</p>
                                    <p className="text-lg font-semibold text-orange-600">{calculateCosts.electricityTax.toFixed(2)} €</p>
                                </div>
                                <div className="col-span-2 pt-2 border-t">
                                    <p className="text-sm text-gray-600">Total Cost ({calculateCosts.days} day{calculateCosts.days > 1 ? 's' : ''})</p>
                                    <p className="text-2xl font-bold text-blue-900">{calculateCosts.total.toFixed(2)} €</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                            Select a blueprint or configure tariff parameters to see cost analysis
                        </div>
                    )}
                </div>

                {/* Future Events Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Future events</h3>

                    {/* Placeholder for timeline */}
                    <div className="h-24 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                        Timeline will go here
                    </div>
                </div>

                {/* View Full Insights Button */}
                <div className="flex justify-center">
                    <button className="px-8 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors">
                        View full insights
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TariffSimulator;