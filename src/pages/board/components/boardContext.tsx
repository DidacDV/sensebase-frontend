import { useState } from 'react';
import { motion } from 'framer-motion';
import AreaStackedGradient from '@src/pages/chartPOC/components/AreaStackedChart';
import { type TimeSeriesChartStructure } from '@src/models/chartModels';
import InfoCard, { type InfoCardProps } from '@src/components/boardInfoCard';

interface InsightItem {
  text: string;
}

interface BoardContextProps {
  description?: string;
  infoCards?: InfoCardProps[];
  chartData1?: TimeSeriesChartStructure;
  chartData2?: TimeSeriesChartStructure;
  chart1Label?: string;
  chart2Label?: string;
  insightsTitle?: string;
  insightsList?: InsightItem[];
  showInsights?: boolean;
}
//TODO this data should be obtained from board.tsx
const BoardContext = ({
  description = 'Monitor your facility\'s energy consumption patterns across different sources and usage types. The charts below provide detailed insights into your energy usage trends over time.',
  infoCards = [
    { 
      color: 'blueLight' as const, 
      description: 'Energy consumed from the power grid',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      color: 'blueLight' as const, 
      description: 'Energy from local generation sources',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      color: 'blueLight' as const, 
      description: 'Combined energy consumption',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ],
  chartData1,
  chartData2,
  chart1Label = 'Primary Chart',
  chart2Label = 'Secondary Chart',
  insightsTitle = 'Key Insights',
  insightsList = [
    { text: 'Compare energy consumption patterns across different time periods' },
    { text: 'Identify peak usage times to optimize energy efficiency' },
    { text: 'Track progress towards sustainability goals' },
    { text: '232W wasted by bla bla' },
  ],
  showInsights = true,
}: BoardContextProps) => {

    //todo modifier for this?
    const [granularity, setGranularity] = useState('hourly');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
        }
    };

    return (
        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-6"
        >
        {/* Text Content Section */}
        <motion.div
            variants={itemVariants as any}
            className="rounded-lg p-6 pb-1 pt-1"
        >
            <div className="space-y-4 text-black">
                <p className="leading-relaxed font-semibold">
                    {description}
                </p>
                {infoCards.length > 0 && (
                    <div className={`grid grid-cols-1 ${infoCards.length === 2 ? 'md:grid-cols-2' : infoCards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 mt-6`}>
                    {infoCards.map((card, index) => (
                        <InfoCard key={index} {...card} />
                    ))}
                    </div>
                )}
            </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 */}
            <motion.div variants={itemVariants as any}>
            {chartData1 ? (
                <AreaStackedGradient data={chartData1[granularity as keyof TimeSeriesChartStructure]} height="400px" />
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">{chart1Label}</p>
                    <p className="text-gray-400 text-sm mt-2">No data available</p>
                </div>
                </div>
            )}
            </motion.div>

            {/* Chart 2 */}
            <motion.div variants={itemVariants as any}>
            {chartData2 ? (
                <AreaStackedGradient data={chartData2[granularity as keyof TimeSeriesChartStructure]} height="400px" />
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">{chart2Label}</p>
                    <p className="text-gray-400 text-sm mt-2">No data available</p>
                </div>
                </div>
            )}
            </motion.div>
        </div>

        {/* Additional Insights Section */}
        {showInsights && insightsList.length > 0 && (
            <motion.div
                variants={itemVariants as any}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-sm p-4 border border-blue-100"
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-[#1A3D63] mb-2">
                            {insightsTitle}
                        </h3>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 w-full">
                            {insightsList.map((insight, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>{insight.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        )}
        </motion.div>
    );
};

export default BoardContext;