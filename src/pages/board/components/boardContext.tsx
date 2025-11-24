import { useState } from 'react';
import { motion } from 'framer-motion';
import { type BoardContext as BoardContextModel } from '@src/models/boardModel';
import InfoCard from '@src/components/boardInfoCard';
import KeypointCard from '@src/components/keypointCard';
import { ChartRenderer } from './chartRenderer';
import type { TimeGranularity } from '@src/types/energyIntensity';

interface BoardContextProps {
  context: BoardContextModel;
}

const Context = ({ context }: BoardContextProps) => {

  const [granularity, setGranularity] = useState<TimeGranularity>('hourly');

  const insightCards = [
    { color: "blueLight", description: context.insights.insight1 },
    { color: "blueLight", description: context.insights.insight2 },
    { color: "blueLight", description: context.insights.insight3 }
  ];

  const keypoints = [
    context.keypoints.keypoint1,
    context.keypoints.keypoint2,
    context.keypoints.keypoint3
  ];

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
      className="w-full space-y-6"
    >

      {/* MAIN DESCRIPTION */}
      <motion.div variants={itemVariants as any} className="rounded-lg p-6 pb-0 pt-1 mb-5">
        <p className="leading-relaxed font-semibold text-gray-800">
          {context.mainContextDescription}
        </p>
      </motion.div>

      {/* INSIGHT CARDS */}
      <motion.div variants={itemVariants as any} className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightCards.map((card, i) => (
            <InfoCard key={i} color="blueOcean" description={card.description} />
          ))}
        </div>
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        <motion.div variants={itemVariants as any}>
          {context.chart1.data ? (
            <ChartRenderer data={context.chart1} granularity={granularity} height="350px" />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-[350px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants as any}>
          {context.chart2.data ? (
            <ChartRenderer data={context.chart2} granularity={granularity} height="350px" />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 h-[350px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </motion.div>
      </div>

      {/* KEYPOINT CARDS */}
      <motion.div variants={itemVariants as any}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {keypoints.map((kp, i) => (
            <KeypointCard
              key={i}
              title={kp.title}
              description={kp.description}
            />
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Context;
