import { motion } from 'framer-motion';

// Hero Section Component
function HeroSection() {
  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      animate={{
        background: [
          'linear-gradient(to bottom right, #B3CFE5, #4A7FA7)',
          'linear-gradient(to bottom right, #4A7FA7, #1A3D63)',
          'linear-gradient(to bottom right, #1A3D63, #0A1931)',
          'linear-gradient(to bottom right, #0A1931, #4A7FA7)',
          'linear-gradient(to bottom right, #B3CFE5, #4A7FA7)',
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="max-w-8xl mx-auto text-center">
        <motion.h1 
          className="text-5xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-white">Data is just information</span>
          <br />
          <motion.span 
            className="text-white"
            animate={{
              textShadow: [
                '0 0 20px rgba(179, 207, 229, 0.8)',
                '0 0 30px rgba(179, 207, 229, 1)',
                '0 0 20px rgba(179, 207, 229, 0.8)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            sensebase makes it mean more
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-white text-lg md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Create powerful AI-driven dashboards in minutes. Connect your data sources, select intelligence models, and generate actionable insights with our cutting-edge visualization platform.
          <br/> 
          Solutions for businesses.
        </motion.p>
        
        <motion.button 
          className="bg-white text-[#1A3D63] font-semibold px-8 py-4 rounded-full text-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.2, ease: "easeOut" }  
          }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: { duration: 0.15, ease: "easeOut" },
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
        >
          Create your first board
        </motion.button>
      </div>
      
      {/*background circles */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #B3CFE5, transparent)' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #4A7FA7, transparent)' }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.section>
  );
}

export default HeroSection;