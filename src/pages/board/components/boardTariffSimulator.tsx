import { useState } from 'react';
import { motion } from 'framer-motion';

const TariffSimulator = () => {
    const [tariffType, setTariffType] = useState('indexed');
    const [accessToll, setAccessToll] = useState('2.1t');
    const [useRecommendations, setUseRecommendations] = useState(true);

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
                className="w-80 bg-white rounded-lg shadow-md p-6 flex flex-col gap-6"
            >
                <div>
                    <h3 className="text-lg font-semibold mb-4">Tariff X</h3>

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
                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Contracted power by period
                            </summary>
                            <div className="mt-2 text-sm text-gray-600">
                                {/* Add period inputs here */}
                                Configuration coming soon...
                            </div>
                        </details>

                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Variable cost by period
                            </summary>
                            <div className="mt-2 text-sm text-gray-600">
                                Configuration coming soon...
                            </div>
                        </details>

                        <details className="border-t pt-2">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                Fixed cost by period
                            </summary>
                            <div className="mt-2 text-sm text-gray-600">
                                Configuration coming soon...
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
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Costo Energético por Hora</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Hoy</button>
                            <button className="px-3 py-1 text-sm bg-gray-200 rounded">7 días</button>
                            <button className="px-3 py-1 text-sm bg-gray-200 rounded">30 días</button>
                        </div>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                        Chart will go here
                    </div>
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