import {useState, useEffect, useMemo} from 'react';
import { motion } from 'framer-motion';
import {
    useBoardTariffBlueprints,
    useCreateTariffBlueprint,
    useExtractTariffFromPDF
} from "@src/services/tariffService.ts";
import type {CreateTariffBlueprintPayload, TariffBlueprint} from "@src/types/tariffModel.ts";
import ReactECharts from "echarts-for-react";
import {Save} from 'lucide-react';
import BlueprintModal from "@src/components/modals/blueprintModal.tsx";

const INITIAL_FORM_DATA = {
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
};

const getPeriodForHour = (date: Date): string => {
    const hour = date.getHours();
    const day = date.getDay(); 
    const month = date.getMonth(); 

    if (day === 0 || day === 6) return 'p6';

    // P6: 00-08
    if (hour < 8) return 'p6';
    // P2: 08-10, 14-18, 22-24
    if ((hour >= 8 && hour < 10) || (hour >= 14 && hour < 18) || (hour >= 22)) return 'p2';
    // P1: 10-14, 18-22
    if ((hour >= 10 && hour < 14) || (hour >= 18 && hour < 22)) return 'p1';

    return 'p6'; 
};

interface TariffSimulatorProps {
    boardId: string;
    consumptionSeries?: any[];
}

const TariffSimulator = ({ boardId, consumptionSeries = [] }: TariffSimulatorProps) => {
    const [tariffType, setTariffType] = useState('indexed');
    const [accessToll, setAccessToll] = useState('2.1t');
    const [useRecommendations, setUseRecommendations] = useState(true);
    const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day');
    // Fetch tariff blueprints
    const { data: blueprints, isLoading, error } = useBoardTariffBlueprints(boardId);
    const extractFromPDF = useExtractTariffFromPDF();
    const createBlueprint = useCreateTariffBlueprint();
    const [selectedBlueprint, setSelectedBlueprint] = useState<TariffBlueprint | null>(null);

    // Form state for all fields
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // Modal
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [modalBlueprintName, setModalBlueprintName] = useState('New Custom Blueprint');
    const [modalBlueprintDescription, setModalBlueprintDescription] = useState('Saved from Tariff Simulator');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveMessage, setSaveMessage] = useState('');
    
    const energyByPeriod = useMemo(() => {
        if (!consumptionSeries || consumptionSeries.length === 0) return null;

        const totals = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 };
        
        consumptionSeries.forEach((point: any) => {
            const val = point.value || 0;
            const date = new Date(point.startTime);
            const durationHours = (new Date(point.endTime).getTime() - date.getTime()) / (1000 * 60 * 60);

            // IF DATA IS DAILY (Duration > 1 hour), SPLIT IT
            if (durationHours > 1) {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                if (isWeekend) {
                    totals.p6 += val / 1000;
                } else {
                    totals.p1 += (val * 0.40) / 1000; // 40% to P1
                    totals.p2 += (val * 0.40) / 1000; // 40% to P2
                    totals.p6 += (val * 0.20) / 1000; // 20% to P6
                }
            } 
            // IF DATA IS HOURLY, KEEP EXISTING LOGIC
            else {
                const period = getPeriodForHour(date);
                if (totals[period] !== undefined) {
                    totals[period] += val / 1000;
                }
            }
        });
        console.log(totals)
        return totals;
    }, [consumptionSeries, timePeriod]);

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
            setFormData(INITIAL_FORM_DATA);
            return;
        }

        const blueprint = blueprints?.find(b => b.id === blueprintId);
        setSelectedBlueprint(blueprint || null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.pdf')) return;

        try {
            const extractedData = await extractFromPDF.mutateAsync(file);
            setFormData({
                ...INITIAL_FORM_DATA,
                ...extractedData,
            });
            setSelectedBlueprint(null);
            e.target.value = '';
        } catch (error) {
            console.error('Failed to extract tariff from PDF:', error);
        }
    };

    const handleCloseModal = () => {
        setIsSaveModalOpen(false);
        setSaveStatus('idle'); // Reset status when closing
        setModalBlueprintName('New Custom Blueprint');
        setModalBlueprintDescription('Saved from Tariff Simulator');
    };


    const handleConfirmSaveBlueprint = () => {
        if (!modalBlueprintName.trim()) {
            return; // Remove the alert
        }
        if (!formData.contracted_power_p1) return;

        const boardIdNumber = Number(boardId);

        const payload: CreateTariffBlueprintPayload = {
            ...formData,
            board_id: boardIdNumber,
            name: modalBlueprintName.trim(),
            description: modalBlueprintDescription.trim(),
        };

        createBlueprint.mutate(payload, {
            onSuccess: (newBlueprint) => {
                setSaveStatus('success');
                setSaveMessage(`Blueprint "${newBlueprint.name}" saved successfully!`); // FIX: Add parentheses
                setSelectedBlueprint(newBlueprint);
            },
            onError: (error: any) => {
                setSaveStatus('error');
                setSaveMessage(`Failed to save blueprint. Error: ${error.message || 'Unknown network error.'}`); // FIX: Add parentheses
                console.error('Save Blueprint Failed:', error);
            }
        });
    };

const calculateCosts = useMemo(() => {
        if (!formData.contracted_power_p1) return null;

        const days = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : 30;

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

        const e = energyByPeriod || { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 };
        
        const variableCosts = [
            {
                name: 'P1 Energy',
                peaje: e.p1 * parseFloat(formData.peaje_energy_p1 || '0'),
                cargo: e.p1 * parseFloat(formData.cargo_energy_p1 || '0')
            },
            {
                name: 'P2 Energy',
                peaje: e.p2 * parseFloat(formData.peaje_energy_p2 || '0'),
                cargo: e.p2 * parseFloat(formData.cargo_energy_p2 || '0')
            },

            {
                name: 'P3 Energy',
                peaje: e.p3 * parseFloat(formData.peaje_energy_p2 || '0'), // Using P2 price as fallback/example
                cargo: e.p3 * parseFloat(formData.cargo_energy_p2 || '0')
            },
            {
                name: 'P4 Energy',
                peaje: e.p4 * parseFloat(formData.peaje_energy_p2 || '0'),
                cargo: e.p4 * parseFloat(formData.cargo_energy_p2 || '0')
            },
            {
                name: 'P5 Energy',
                peaje: e.p5 * parseFloat(formData.peaje_energy_p2 || '0'),
                cargo: e.p5 * parseFloat(formData.cargo_energy_p2 || '0')
            },
            {
                name: 'P6 Energy',
                peaje: e.p6 * parseFloat(formData.peaje_energy_p6 || '0'),
                cargo: e.p6 * parseFloat(formData.cargo_energy_p6 || '0')
            },
        ];
        const otherCosts = {
            socialBonus: parseFloat(formData.social_bonus_financing_daily) * days,
            meterRental: parseFloat(formData.meter_rental_daily) * days
        };

        const totalFixedPeajes = fixedCosts.reduce((sum, item) => sum + item.peaje, 0);
        const totalFixedCargos = fixedCosts.reduce((sum, item) => sum + item.cargo, 0);
        
        // New Variable Totals
        const totalVariablePeajes = variableCosts.reduce((sum, item) => sum + item.peaje, 0);
        const totalVariableCargos = variableCosts.reduce((sum, item) => sum + item.cargo, 0);

        const totalOther = otherCosts.socialBonus + otherCosts.meterRental;
        
        // Sum Fixed + Variable
        const subtotal = totalFixedPeajes + totalFixedCargos + totalVariablePeajes + totalVariableCargos + totalOther;
        
        const electricityTax = subtotal * (parseFloat(formData.electricity_tax_percentage) / 100);
        const total = subtotal + electricityTax;

        return {
            fixedCosts,
            variableCosts, 
            totalFixedPeajes,
            totalFixedCargos,
            totalVariablePeajes,
            totalVariableCargos, 
            otherCosts,
            totalOther,
            electricityTax,
            subtotal,
            total,
            days
        };
    }, [formData, timePeriod, energyByPeriod]);

    const barChartOption = useMemo(() => {
        if (!calculateCosts) return null;

        const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
        const peajesPowerData = calculateCosts.fixedCosts.map(c => parseFloat(c.peaje.toFixed(2)));
        const cargosPowerData = calculateCosts.fixedCosts.map(c => parseFloat(c.cargo.toFixed(2)));
        const peajesEnergyData = calculateCosts.variableCosts.map(c => parseFloat(c.peaje.toFixed(2)));
        const cargosEnergyData = calculateCosts.variableCosts.map(c => parseFloat(c.cargo.toFixed(2)));

        return {
            title: {
                text: `Cost Breakdown (Fixed + Variable)`,
                left: 'center',
                textStyle: { color: '#1A3D63', fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['Power Peajes', 'Power Cargos', 'Energy Peajes', 'Energy Cargos'],
                top: 30
            },
            xAxis: {
                type: 'category',
                data: periods
            },
            yAxis: {
                type: 'value',
                name: 'Cost (€)'
            },
            series: [
                {
                    name: 'Power Peajes',
                    type: 'bar',
                    stack: 'total',
                    data: peajesPowerData,
                    itemStyle: { color: '#93C5FD' } // Light Blue
                },
                {
                    name: 'Power Cargos',
                    type: 'bar',
                    stack: 'total',
                    data: cargosPowerData,
                    itemStyle: { color: '#C4B5FD' } // Light Purple
                },
                {
                    name: 'Energy Peajes',
                    type: 'bar',
                    stack: 'total',
                    data: peajesEnergyData,
                    itemStyle: { color: '#2563EB' } // Dark Blue
                },
                {
                    name: 'Energy Cargos',
                    type: 'bar',
                    stack: 'total',
                    data: cargosEnergyData,
                    itemStyle: { color: '#7C3AED' } // Dark Purple
                }
            ]
        };
    }, [calculateCosts, timePeriod]);

    const pieChartOption = useMemo(() => {
        if (!calculateCosts) return null;

        const totalFixedPower = calculateCosts.totalFixedPeajes + calculateCosts.totalFixedCargos;
        const totalTax = calculateCosts.electricityTax;

        const pieData = [];

        // Only include components that have a non-negligible cost (using 0.001 as a tolerance)
        if (totalFixedPower > 0.001) {
            pieData.push({ name: 'Fixed Power (Peajes + Cargos)', value: parseFloat(totalFixedPower.toFixed(2)) });
        }
        if (calculateCosts.otherCosts.meterRental > 0.001) {
            pieData.push({ name: 'Meter Rental', value: parseFloat(calculateCosts.otherCosts.meterRental.toFixed(2)) });
        }
        if (calculateCosts.otherCosts.socialBonus > 0.001) {
            pieData.push({ name: 'Social Bonus Financing', value: parseFloat(calculateCosts.otherCosts.socialBonus.toFixed(2)) });
        }
        // Tax is calculated on the subtotal, so it should be included if the subtotal is non-zero
        if (totalTax > 0.001) {
            pieData.push({ name: 'Electricity Tax', value: parseFloat(totalTax.toFixed(2)) });
        }

        if (pieData.length === 0) {
            return null;
        }

        return {
            title: {
                text: `Total Fixed Cost Breakdown - ${timePeriod === 'day' ? 'Daily' : timePeriod === 'week' ? 'Weekly' : 'Monthly'}`,
                subtext: `Total: ${calculateCosts.total.toFixed(2)} €`,
                left: 'center',
                textStyle: {
                    color: '#1A3D63',
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                subtextStyle: {
                    color: '#374151',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} € ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle',
                bottom: '20',
                data: pieData.map(d => d.name)
            },
            series: [
                {
                    name: 'Cost Breakdown',
                    type: 'pie',
                    radius: '50%',
                    center: ['65%', '55%'],
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {c} €',
                        color: '#1A3D63'
                    },
                    labelLine: {
                        length: 10
                    },
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    color: ['#4C51BF', '#3B82F6', '#10B981', '#F59E0B']
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
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Fill with PDF Bill
                        </label>

                        <div
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                extractFromPDF.isPending
                                    ? 'bg-blue-50 border-blue-400'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            } disabled:cursor-not-allowed`}
                        >
                            <input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={extractFromPDF.isPending}
                                className="hidden"
                            />

                            {extractFromPDF.isPending ? (
                                <div className="text-center">
                                    <span className="inline-block animate-spin text-blue-600 text-3xl">⏳</span>
                                    <p className="text-sm text-blue-600 mt-2 font-medium">
                                        Extracting data... Please wait.
                                    </p>
                                </div>
                            ) : (
                                <label
                                    htmlFor="pdf-upload"
                                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4"
                                >
                                    <svg
                                        className="w-8 h-8 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2a2 2 0 01-2 2h-4M15 19l-3-3m0 0l-3 3m3-3v8"></path>
                                    </svg>
                                    <p className="text-sm text-gray-600 mt-2">
                                        <span className="font-medium text-blue-600 hover:text-blue-500">
                                            Click to upload
                                        </span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF file only (e.g., utility bill, invoice)
                                    </p>
                                </label>
                            )}
                        </div>

                        {extractFromPDF.isError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-2 mt-2 rounded-md flex items-center gap-2">
                                <span className="text-lg">❌</span>
                                <p className="text-sm font-medium">
                                    Extraction Failed: Please ensure the document is a readable bill/invoice PDF.
                                </p>
                            </div>
                        )}
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
                    <button
                        onClick={() => {
                            setIsSaveModalOpen(true);
                            setSaveStatus('idle');
                        }}
                        disabled={!formData.contracted_power_p1}
                        className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-600 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Save Blueprint
                    </button>
                </div>
            </motion.div>

            {/* RIGHT CONTENT AREA */}
            <motion.div
                variants={itemVariants as any}
                className="flex-1 space-y-6"
            >
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

                    {/* Dynamic Visualization Logic: Render Bar Chart OR Pie Chart */}
                    {(barChartOption || pieChartOption) && calculateCosts ? (
                        <>
                            {/* 1. Bar Chart: Renders only if there are non-zero Fixed Power Costs */}
                            {barChartOption && (
                                <ReactECharts
                                    option={barChartOption}
                                    style={{ height: '300px', width: '100%' }}
                                    opts={{ renderer: 'canvas' }}
                                />
                            )}

                            {/* 2. Pie Chart: Renders if the Bar Chart is empty OR if only Fixed Power Costs are zero */}
                            {!barChartOption && pieChartOption && (
                                <ReactECharts
                                    option={pieChartOption}
                                    style={{ height: '300px', width: '100%' }}
                                    opts={{ renderer: 'canvas' }}
                                />
                            )}

                            {/* Cost Summary (remains the same) */}
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

                    <div className="h-24 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                        Timeline will go here
                    </div>
                </div>

            </motion.div>

            {isSaveModalOpen && (
                <BlueprintModal
                    isOpen={isSaveModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmSaveBlueprint}
                    blueprintName={modalBlueprintName}
                    setBlueprintName={setModalBlueprintName}
                    blueprintDescription={modalBlueprintDescription}
                    setBlueprintDescription={setModalBlueprintDescription}
                    saveStatus={saveStatus}
                    saveMessage={saveMessage}
                    isPending={createBlueprint.isPending}
                />
            )}
        </motion.div>
    );
};

export default TariffSimulator;