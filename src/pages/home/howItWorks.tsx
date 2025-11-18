import StepCard from "../../components/ui/StepCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, //delays each child by 0.2s
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" as const },
  },
};

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Select a Data Provider",
      description: "Connect with multiple data providers and services with secure authentication and real-time synchronization."
    },
    {
      number: "2",
      title: "Set Up Your Board",
      description: "Choose the intelligence model that fits your objectives, select source data, and set specific parameters to visualize your use case."
    },
    {
      number: "3",
      title: "Generate Solutions",
      description: "Watch as your dashboard comes to life with dynamic visualizations and automatic intelligence."
    }
  ];

  return (
    <section className="py-32 px-6 bg-white min-h-screen flex items-center justify-center">
      <motion.div className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}>
        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight tracking-tight">
          <motion.span className="text-[#0A1931]">How It </motion.span>
          <motion.span className="text-[#1A3D63]">Works</motion.span>
        </motion.h2>
        <motion.p variants={itemVariants} className="text-center text-gray-600 mb-20 text-xl md:text-2xl max-w-3xl mx-auto">
          Three simple steps to transform your data into business value
        </motion.p>
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-16 lg:gap-20">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HowItWorksSection;