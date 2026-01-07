import { motion } from 'framer-motion';
import { type BoardContext as BoardContextModel } from '@src/models/boardModel';
import InfoCard, { type InfoCardType } from '@src/components/boardInfoCard';
import KeypointCard from '@src/components/keypointCard';
import { ChartRenderer } from './chartRenderer';

interface BoardContextProps {
  context: BoardContextModel;
}

/** Board color system – aligned with charts */
const BOARD_COLORS = {
  grid: '#1D4ED8',   // Grid – royal blue
  local: '#6D28D9',  // Local – indigo
  all: '#06B6D4',    // All / Total – cyan
  mixed: '#4F46E5',  // Mixed – blue-indigo
  it: '#0F3DCC',     // IT – deep tech blue
};

const Context = ({ context }: BoardContextProps) => {
  // helpers
  const getInsightType = (type: string): InfoCardType => {
    switch (type) {
      case 'alert': return 'alert';
      case 'tip': return 'tip';
      case 'stat': return 'stat';
      default: return 'neutral';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${BOARD_COLORS.all}1A`, color: BOARD_COLORS.all }}
          >
            Positive Outlook
          </span>
        );
      case 'negative':
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Attention Required
          </span>
        );
      default:
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${BOARD_COLORS.mixed}1A`, color: BOARD_COLORS.mixed }}
          >
            Neutral Analysis
          </span>
        );
    }
  };

  // animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const bentoItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const bentoCardClass =
    'bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full pb-12"
    >
      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">

        {/* SUMMARY */}
        <motion.div
          variants={bentoItemVariants as any}
          className="md:col-span-12 relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${BOARD_COLORS.all}22, transparent)`
            }}
          />
          <div className="relative z-10">
            <div className="mb-4">{getSentimentBadge(context.mainSummary.sentiment)}</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: BOARD_COLORS.mixed }}>
              {context.mainSummary.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-5xl">
              {context.mainSummary.content}
            </p>
          </div>
        </motion.div>

        {/* PRIMARY PERFORMANCE */}
        <motion.div
          variants={bentoItemVariants as any}
          className={`md:col-span-12 lg:col-span-8 ${bentoCardClass}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1A3D63] flex items-center gap-2">
              <span
                className="w-2 h-6 rounded-full"
                style={{ backgroundColor: BOARD_COLORS.grid }}
              />
              Primary Performance
            </h3>
          </div>
          <div className="flex-grow min-h-[350px]">
            {context.chart1?.data ? (
              <ChartRenderer
                data={context.chart1}
                granularity="daily"
                height="350px"
              />
            ) : (
              <EmptyState icon="📊" />
            )}
          </div>
        </motion.div>

        {/* KEY INSIGHTS */}
        <motion.div
          variants={bentoItemVariants as any}
          className={`md:col-span-12 lg:col-span-4 ${bentoCardClass} bg-gray-50/50 flex`}
        >
          <h3 className="text-lg font-bold text-[#1A3D63] mb-4 flex items-center gap-2">
            <span
              className="w-2 h-6 rounded-full"
            />
            Key Insights
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar mx-auto">
            {context.insights?.map((insight, i) => (
              <InfoCard
                key={i}
                type={getInsightType(insight.type)}
                title={insight.title}
                description={insight.briefDescription}
              />
            ))}
            {(!context.insights || context.insights.length === 0) && (
              <p className="text-gray-400 text-center py-10">
                No specific insights available.
              </p>
            )}
          </div>
        </motion.div>

        {/* SECONDARY TRENDS */}
        <motion.div
          variants={bentoItemVariants as any}
          className={`md:col-span-12 lg:col-span-6 ${bentoCardClass}`}
        >
          <h3 className="text-xl font-bold text-[#1A3D63] mb-2 flex items-center gap-2">
            <span
              className="w-2 h-6 rounded-full"
              style={{ backgroundColor: BOARD_COLORS.local }}
            />
            Secondary Trends
          </h3>
          <div className="flex-grow min-h-[350px]">
            {context.chart2?.data ? (
              <ChartRenderer
                data={context.chart2}
                granularity="daily"
                height="350px"
              />
            ) : (
              <EmptyState icon="📈" />
            )}
          </div>
        </motion.div>

        {/* DEEP DIVE */}
        {context.deepDive && (
          <motion.div
            variants={bentoItemVariants as any}
            className="md:col-span-12 lg:col-span-6 flex flex-col gap-4"
          >
            <div
              className="rounded-3xl p-8 text-white shadow-sm flex-grow"
              style={{ backgroundColor: BOARD_COLORS.it }}
            >
              <h3 className="text-xl font-bold mb-4">
                Deep Dive Analysis
              </h3>
              <p className="text-white leading-relaxed text-sm md:text-base">
                {context.deepDive.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {context.deepDive.keyPoints?.slice(0, 4).map((kp, i) => (
                <KeypointCard
                  key={i}
                  index={i}
                  title={kp.label}
                  description={kp.text}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Empty chart helper
const EmptyState = ({ icon }: { icon: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 min-h-[250px]">
    <span className="text-4xl mb-2 opacity-50">{icon}</span>
    <p className="text-sm font-medium">No data available</p>
  </div>
);

export default Context;