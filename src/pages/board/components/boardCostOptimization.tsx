import { motion } from 'framer-motion';

const CostOptimization = () => {
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
            {/* LEFT SIDEBAR - Parameters Panel */}
            <motion.div
                variants={itemVariants as any}
                className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 overflow-y-auto"
            >
                {/* Tariff X Parameters Header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold">Tariff X Parameters</h3>
                    <button className="text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Anomalies Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Anomalies</h4>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            3 detected
                        </span>
                    </div>
                    <div className="space-y-2">
                        {[
                            { title: 'Pico anómalo', subtitle: '14:30h - 2.4 kW sobre media', severity: 'orange' },
                            { title: 'Consumo nocturno', subtitle: '02:00-05:00h - Elevado >180%', severity: 'red' },
                            { title: 'Patrón irregular', subtitle: 'Picos de semana variables', severity: 'blue' }
                        ].map((anomaly, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <div className={`w-1 h-full bg-${anomaly.severity}-500 rounded`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{anomaly.title}</p>
                                    <p className="text-xs text-gray-600">{anomaly.subtitle}</p>
                                </div>
                                <input type="checkbox" className="mt-1" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Recomendations</h4>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            3 actions
                        </span>
                    </div>
                    <div className="space-y-2">
                        {[
                            { icon: '💰', title: 'Cambio de tarifa', subtitle: '2.0TD ahorro estimado €30/mes' },
                            { icon: '⚡', title: 'Desplazar consumo', subtitle: 'A valle: 00:00-08:00h' },
                            { icon: '📦', title: 'Almacenamiento', subtitle: 'BOI estimado: 4.2 años' }
                        ].map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <span className="text-lg">{rec.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                                    <p className="text-xs text-gray-600">{rec.subtitle}</p>
                                </div>
                                <input type="checkbox" className="mt-1" defaultChecked />
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
                        {[
                            { icon: '↑', title: 'Mañana', time: '08:00-12:00h', value: '3.2 kW', color: 'green' },
                            { icon: '↓', title: 'Mediodía', time: '14:00-16:00h', value: '1.8 kW', color: 'blue' },
                            { icon: '↑', title: 'Tarde', time: '19:00-21:00h', value: '3.8 kW', color: 'purple' }
                        ].map((pattern, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <span className={`text-${pattern.color}-500`}>{pattern.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{pattern.title}</p>
                                        <p className="text-xs text-gray-600">{pattern.time}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold text-${pattern.color}-600`}>{pattern.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

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
                        {/* Current Costs */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">↑ Current costs</span>
                            </div>
                            <div className="text-4xl font-bold text-red-500">1827.12<span className="text-2xl">€</span></div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>

                        {/* Optimized Costs */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">↓ Optimized costs</span>
                            </div>
                            <div className="text-4xl font-bold text-green-500">1527.12<span className="text-2xl">€</span></div>
                        </div>
                    </div>
                </div>

                {/* Total Savings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Total savings</h3>
                    <div className="flex gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">↑ Last month</span>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">1827.12<span className="text-xl">€</span></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">↑↑ Yearly</span>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">25205.23<span className="text-xl">€</span></div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Standard vs Optimal cost</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded font-medium">Hoy</button>
                            <button className="px-3 py-1 text-sm bg-gray-200 rounded">7 días</button>
                            <button className="px-3 py-1 text-sm bg-gray-200 rounded">30 días</button>
                        </div>
                    </div>
                    {/* Placeholder for chart */}
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                        Bar chart comparing standard (red) vs optimal (green) costs by hour
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                    <div className="space-y-3">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold">Cambio de tarifa</h4>
                            <p className="text-sm text-gray-600">- 32.12€ saved per day</p>
                            <p className="text-sm text-blue-600 italic">If hover → view on graph?</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold">Evitar x i y</h4>
                            <p className="text-sm text-gray-600">- 32.12€ saved per day</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                <li>...</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Other Changes Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Other changes applied to the optimal tariff</h3>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            Power in contract reduced
                        </button>
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            Deleted fixed cost X
                        </button>
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            blablabla
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            Power in contract reduced
                        </button>
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            Deleted fixed cost X
                        </button>
                        <button className="px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium">
                            blablabla
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CostOptimization;