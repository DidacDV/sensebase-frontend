import { motion } from 'framer-motion';

// Hero Section Component
function HeroSection() {
  return (
    <motion.section 
      className="relative min-h-screen flex items-center px-6 lg:px-16 pb-32 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#1A2B3C]">Data is just information</span>
            <br />
            <motion.span 
              className="text-[#5BA89D] relative inline-block"
              animate={{
                textShadow: [
                  '0 0 20px rgba(91, 168, 157, 0.8)',
                  '0 0 30px rgba(91, 168, 157, 1)',
                  '0 0 20px rgba(91, 168, 157, 0.8)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              sensebase makes it mean more
              <motion.svg 
                className="absolute -right-2 top-1/2 -translate-y-1/2"
                width="80" 
                height="40" 
                viewBox="0 0 80 40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
              </motion.svg>
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-[#1A2B3C] text-lg md:text-2xl mb-8 max-w-4xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Create powerful AI-driven dashboards in minutes. Connect your data sources, select intelligence models, and generate actionable insights with our cutting-edge visualization platform.
            <br/> 
            Solutions for businesses.
          </motion.p>
          
          <motion.div 
            className="flex gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="bg-[#0066FF] text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.2, ease: "easeOut" }  
              }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,102,255,0.3)',
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              Create your first board
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default HeroSection;