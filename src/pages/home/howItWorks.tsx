import StepCard from "../../components/ui/StepCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" as const }
  }
};

const STEPS = [
  {
    number: "1",
    title: "Select a Data Provider",
    description: "Connect with multiple data providers and services with secure authentication and real-time synchronization.",
    color: "bg-[#5BA89D]"
  },
  {
    number: "2",
    title: "Set Up Your Board",
    description: "Choose the intelligence model that fits your objectives, select source data, and set specific parameters to visualize your use case.",
    color: "bg-[#4A7FA7]"
  },
  {
    number: "3",
    title: "Generate Solutions",
    description: "Watch as your dashboard comes to life with dynamic visualizations and automatic intelligence.",
    color: "bg-[#1A3D63]"
  }
];

const DECORATIVE_NUMBERS = [
  { num: "1", position: "top-1/4 left-[8%]", color: "#5BA89D" },
  { num: "2", position: "top-[65%] left-1/2 -translate-x-1/2", color: "#4A7FA7" },
  { num: "3", position: "top-1/4 right-[8%]", color: "#1A3D63" }
];

const DECORATIVE_CIRCLES = [
  { position: "top-[10%] left-[15%]", size: "w-20 h-20 md:w-32 md:h-32", color: "#5BA89D", delay: 0.3 },
  { position: "bottom-[5%] right-[5%]", size: "w-16 h-16 md:w-24 md:h-24", color: "#4A7FA7", delay: 0.6 }
];

function HowItWorksSection() {
  return (
    <section className="py-20 px-6 pb-55 bg-gradient-to-b from-white via-[#5BA89D]/5 to-white min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {DECORATIVE_NUMBERS.map(({ num, position, color }) => (
          <div 
            key={num}
            className={`absolute ${position} text-[180px] md:text-[280px] font-bold select-none`}
            style={{ color: `${color}33` }}
          >
            {num}
          </div>
        ))}
        
        <svg className="absolute top-1/2 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#5BA89D', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#4A7FA7', stopOpacity: 0.5 }} />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4A7FA7', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#1A3D63', stopOpacity: 0.5 }} />
            </linearGradient>
          </defs>
          <motion.path
            d="M 25% 50% Q 37.5% 35%, 50% 50%"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            d="M 50% 50% Q 62.5% 35%, 75% 50%"
            stroke="url(#lineGradient2)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </svg>
        
        {DECORATIVE_CIRCLES.map(({ position, size, color, delay }, idx) => (
          <motion.div 
            key={idx}
            className={`absolute ${position} ${size} rounded-full border-2`}
            style={{ borderColor: `${color}66` }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
          />
        ))}
      </div>

      <motion.div 
        className="max-w-7xl mx-auto w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#1A2B3C]">
          How It Works
        </motion.h2>
        <motion.p variants={itemVariants} className="text-center text-gray-600 mb-16 text-base md:text-lg max-w-2xl mx-auto">
          Three simple steps to transform your data into business value
        </motion.p>
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HowItWorksSection;