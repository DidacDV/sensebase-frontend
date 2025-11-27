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
    <section className="py-20 px-6 bg-gradient-to-br from-[#E8EBF0] to-[#F5F5F5] min-h-screen flex items-center justify-center">
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
            <div className="bg-white rounded-3xl p-12 shadow-xl relative overflow-hidden">
              {/* Grid of crypto icons */}
              <div className="grid grid-cols-6 gap-4 relative z-10">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: [
                        '#FF6B35', '#F7931A', '#627EEA', '#26A17B', 
                        '#8247E5', '#E84142', '#2775CA', '#F0B90B',
                        '#003366', '#5BA89D', '#4A7FA7', '#1A3D63'
                      ][idx % 12]
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: idx * 0.02,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
                  </motion.div>
                ))}
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