import { motion } from "framer-motion";

function GeneralSolutionsSection () {
  const solutions = [
    {
      icon: "hexagon-nodes",
      title: "Contextualization",
      description: "Relate your data with external sources, trends, and news to unveil in-depth analysis."
    },
    {
      icon: "clipboard-list",
      title: "Strategies",
      description: "Generate expert plans and recommendations based on your current context."
    },
    {
      icon: "laptop-code",
      title: "Automation",
      description: "Set up automatic actions to take your strategies into real, tangible results."
    }
  ];

  const stats = [
    {
      value: "100+",
      label: "DATA SOURCES",
      description: "Connect with multiple data providers and services with secure authentication and real-time synchronization across all your business platforms."
    },
    {
      value: "24/7",
      label: "INSIGHTS",
      description: "Generate expert plans and recommendations based on your current context with continuous monitoring and instant intelligence updates."
    },
    {
      value: "Real-time",
      label: "AUTOMATION",
      description: "Set up automatic actions to take your strategies into real, tangible results with seamless workflow integration and execution."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-[#5BA89D]/5 to-white min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#1A2B3C]">
            COMPREHENSIVE<br/>INTELLIGENCE PLATFORM
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Sensebase powers data-driven insights for
          </p>
          <div className="flex justify-center gap-6 mt-4 text-xs md:text-sm text-gray-700 font-medium">
            <span>Energy Sector</span>
            <span>Analytics</span>
            <span>Business Intelligence</span>
            <span>Data Science</span>
            <span>Enterprise Solutions</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Icon grid */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              {/* Dashboard mockup */}
              <div className="space-y-6">
                {/* Header with metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "2.4k", label: "Active Sources", color: "#5BA89D" },
                    { value: "89%", label: "Accuracy", color: "#4A7FA7" },
                    { value: "Real-time", label: "Updates", color: "#1A3D63" }
                  ].map((metric, idx) => (
                    <motion.div
                      key={metric.label}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <div className="text-2xl font-bold" style={{ color: metric.color }}>
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart visualization */}
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[65, 45, 80, 55, 90, 70, 85, 60].map((height, idx) => (
                      <motion.div
                        key={idx}
                        className="flex-1 rounded-t-lg"
                        style={{
                          background: `linear-gradient(to top, ${['#5BA89D', '#4A7FA7', '#1A3D63'][idx % 3]}, ${['#5BA89D', '#4A7FA7', '#1A3D63'][idx % 3]}dd)`,
                          height: `${height}%`
                        }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-500">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </motion.div>

                {/* Data sources indicators */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Energy Data", status: "Active", color: "#5BA89D" },
                    { label: "Market Trends", status: "Syncing", color: "#4A7FA7" }
                  ].map((source, idx) => (
                    <motion.div
                      key={source.label}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700">{source.label}</div>
                        <div className="text-xs text-gray-500">{source.status}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Stats */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="border-l-4 border-[#5BA89D] pl-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl md:text-7xl font-bold text-[#1A2B3C]">{stat.value}</span>
                  <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom section - Solutions cards */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        > 
        </motion.div>
      </div>
    </section>
  );
}

export default GeneralSolutionsSection;