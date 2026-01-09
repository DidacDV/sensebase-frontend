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
  grid: '#10B981',   // Grid – emerald green
  local: '#22C55E',  // Local – lime green
  all: '#34D399',    // All / Total – light green
  mixed: '#059669',  // Mixed – darker green
  it: '#047857',     // IT – forest green
};

const Context = ({ context }: BoardContextProps) => {
  const hideScrollbarStyle = `
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .hide-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
  `;
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
    'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full pb-12"
    >
      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

        {/* SUMMARY - Minimal */}
        <motion.div
          variants={bentoItemVariants as any}
          className="md:col-span-12 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1" style={{ color: BOARD_COLORS.local }}>
                {context.mainSummary.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {context.mainSummary.content}
              </p>
            </div>
            <div className="shrink-0">
              {getSentimentBadge(context.mainSummary.sentiment)}
            </div>
          </div>
        </motion.div>

        {/* PRIMARY PERFORMANCE - Full Width */}
        <motion.div
          variants={bentoItemVariants as any}
          className="md:col-span-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-1.5 h-5 rounded-full"
              style={{ backgroundColor: BOARD_COLORS.grid }}
            />
            <h3 className="text-lg font-semibold text-gray-900">Primary Performance</h3>
          </div>
          <div className="min-h-[300px]">
            {context.chart1?.data ? (
              <ChartRenderer
                data={context.chart1}
                granularity="daily"
                height="300px"
              />
            ) : (
              <EmptyState icon="📊" />
            )}
          </div>
        </motion.div>

        {/* SECONDARY TRENDS & INSIGHTS ROW */}
        {/* SECONDARY TRENDS + QUICK STATS - Left Column */}
        <motion.div
          variants={bentoItemVariants as any}
          className="md:col-span-12 lg:col-span-8 flex flex-col gap-4"
        >
          {/* SECONDARY TRENDS */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-[410px]">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-4 rounded-full"
                style={{ backgroundColor: BOARD_COLORS.local }}
              />
              <h3 className="text-sm font-semibold text-gray-900">Secondary Trends</h3>
            </div>
            <div className="h-[calc(100%-30px)]">
              {context.chart2?.data ? (
                <ChartRenderer
                  data={context.chart2}
                  granularity="daily"
                  height="100%"
                />
              ) : (
                <EmptyState icon="📈" />
              )}
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-1.5 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
              />
              <h3 className="text-sm font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Peak Hour</p>
                <p className="text-lg font-bold text-gray-900">18:00</p>
                <p className="text-xs text-emerald-600 mt-1">↑ Highest usage</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Avg. Daily</p>
                <p className="text-lg font-bold text-gray-900">294 kWh</p>
                <p className="text-xs text-gray-600 mt-1">Last 7 days</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Efficiency</p>
                <p className="text-lg font-bold text-gray-900">87%</p>
                <p className="text-xs text-emerald-600 mt-1">↑ +3% vs prev</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1">Cost/Day</p>
                <p className="text-lg font-bold text-gray-900">€42.50</p>
                <p className="text-xs text-gray-600 mt-1">Estimated</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* INSIGHTS & DEEP DIVE - Right Column */}
        <motion.div
          variants={bentoItemVariants as any}
          className="md:col-span-12 lg:col-span-4 flex flex-col gap-6"
        >
          {/* KEY INSIGHTS */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 shadow-sm border border-gray-100 h-[300px] overflow-y-auto hide-scrollbar">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-1.5 h-4 rounded-full"
                style={{ backgroundColor: BOARD_COLORS.all }}
              />
              <h3 className="text-sm font-semibold text-gray-900">Key Insights</h3>
            </div>
            <div className="space-y-2">
              {context.insights?.slice(0, 3).map((insight, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <p className="font-medium text-xs text-gray-900 mb-1">{insight.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{insight.briefDescription}</p>
                </div>
              ))}
              {(!context.insights || context.insights.length === 0) && (
                <p className="text-gray-400 text-center py-4 text-xs">No insights</p>
              )}
            </div>
          </div>

          {/* DEEP DIVE */}
          {context.deepDive && (
            <div
              className="rounded-2xl p-5 shadow-sm text-white"
              style={{ backgroundColor: BOARD_COLORS.it }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-white/90" />
                <h3 className="text-sm font-semibold">Deep Dive</h3>
              </div>
              <p className="text-xs leading-relaxed mb-3 opacity-95 line-clamp-3">
                {context.deepDive.description}
              </p>
              {context.deepDive.keyPoints && context.deepDive.keyPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {context.deepDive.keyPoints.slice(0, 4).map((kp, i) => (
                    <KeypointCard
                      key={i}
                      index={i}
                      title={kp.label}
                      description={kp.text}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Empty chart helper
const EmptyState = ({ icon }: { icon: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400 min-h-[200px]">
    <span className="text-3xl mb-2 opacity-40">{icon}</span>
    <p className="text-xs font-medium">No data available</p>
  </div>
);

export default Context;