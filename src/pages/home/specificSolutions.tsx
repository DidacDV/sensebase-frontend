import { motion } from "framer-motion";
import PartnerLogo from "./components/partnerLogo";

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
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function SpecificSolutionsSection() {
  return (
    <section className="py-24 px-6 bg-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        className="max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main Title */}
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold text-center mb-8 leading-tight tracking-tight"
        >
          <span className="text-slate-950">Custom Solutions </span>
          <span className="text-[#2b39c0]">For Every</span>
          <br />
          <span className="text-[#2b39c0]">Partner</span>
        </motion.h2>

        {/* Description Paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[#5e69d2] text-xl md:text-2xl mb-24 max-w-4xl mx-auto leading-relaxed font-medium"
        >
          We create tailored solutions for your goals. Set up your board by
          choosing the intelligent model, selecting general solution modules,
          and adding specific options for your use case. Our platform adapts to
          your context to deliver tangible, measurable results.
        </motion.p>

        {/* Sub-heading */}
        <motion.h3
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="text-[#2b39c0]">Current</span>{" "}
          <span className="text-slate-950">partners</span>
        </motion.h3>

        {/* Logos Area */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
        >
          <PartnerLogo name="Schneider Electric" width={15} height={15} />
          <PartnerLogo name="UPC" height={15} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default SpecificSolutionsSection;