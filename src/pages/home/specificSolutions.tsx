import { motion } from "framer-motion";
import PartnerLogo from "./components/partnerLogo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
  const solutionCards = [
    {
      tag: "NEW | sensedata",
      title: "Now, I can go through the reconciliation process in three hours, not eight budget periods.",
      company: "Schneider Electric",
      role: "Head of Accounting",
      buttonText: "Read more ↓"
    },
    {
      tag: "GUIDE",
      title: "300+ SMBs learned travel and expense management",
      description: "Time and expense management is a massive undertaking.",
      buttonText: "Download ↓"
    },
    {
      tag: "REPORT",
      title: "How do existing companies go further?",
      description: "Enterprise travel isn't just an employee perk anymore. Discover the shift...",
      buttonText: "Read more ↓"
    },
    {
      tag: "CASE STUDY",
      title: "How to optimize overhead",
      description: "Take a tour for a look at our real-time reporting that lets track spend, control costs, and...",
      buttonText: "Watch ↓"
    },
    {
      tag: "WHITEPAPER",
      title: "Amps®",
      description: "Are your overhead costs out of control? The main value of the platform is in understanding our costs, the...",
      company: "Service Excellence Manager",
      buttonText: "Read more ↓"
    }
  ];

  return (
    <section className="py-20 px-6 bg-[#F5F5F5] min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main Title */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-8 text-[#1A2B3C]"
        >
          Optimizing work travel with Sensebase
        </motion.h2>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Cards Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4 flex-1"
          >
            {/* First large card */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 bg-[#1A2B3C] text-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div>
                <span className="inline-block bg-white text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {solutionCards[0].tag}
                </span>
                <h3 className="text-xl font-bold mb-4 leading-tight">
                  {solutionCards[0].title}
                </h3>
              </div>
              <div>
                <p className="text-sm mb-1 opacity-80">{solutionCards[0].company}</p>
                <p className="text-xs mb-3 opacity-60">{solutionCards[0].role}</p>
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors">
                  {solutionCards[0].buttonText}
                </button>
              </div>
            </motion.div>

            {/* Second card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div>
                <span className="inline-block bg-[#F5F5F5] text-[#1A2B3C] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {solutionCards[1].tag}
                </span>
                <h3 className="text-lg font-bold mb-3 leading-tight text-[#1A2B3C]">
                  {solutionCards[1].title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {solutionCards[1].description}
                </p>
              </div>
              <button className="bg-[#1A2B3C] text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#2D3D4D] transition-colors self-start">
                {solutionCards[1].buttonText}
              </button>
            </motion.div>

            {/* Third card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div>
                <span className="inline-block bg-[#F5F5F5] text-[#1A2B3C] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {solutionCards[2].tag}
                </span>
                <h3 className="text-lg font-bold mb-3 leading-tight text-[#1A2B3C]">
                  {solutionCards[2].title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {solutionCards[2].description}
                </p>
              </div>
              <button className="bg-[#1A2B3C] text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#2D3D4D] transition-colors self-start">
                {solutionCards[2].buttonText}
              </button>
            </motion.div>

            {/* Fourth card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div>
                <span className="inline-block bg-[#F5F5F5] text-[#1A2B3C] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {solutionCards[3].tag}
                </span>
                <h3 className="text-lg font-bold mb-3 leading-tight text-[#1A2B3C]">
                  {solutionCards[3].title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {solutionCards[3].description}
                </p>
              </div>
              <button className="bg-[#1A2B3C] text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#2D3D4D] transition-colors self-start">
                {solutionCards[3].buttonText}
              </button>
            </motion.div>

            {/* Fifth card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div>
                <span className="inline-block bg-[#F5F5F5] text-[#1A2B3C] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {solutionCards[4].tag}
                </span>
                <h3 className="text-2xl font-bold mb-3 leading-tight text-[#1A2B3C]">
                  Amps®
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {solutionCards[4].description}
                </p>
              </div>
              <button className="bg-[#1A2B3C] text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#2D3D4D] transition-colors self-start">
                {solutionCards[4].buttonText}
              </button>
            </motion.div>
          </motion.div>

          {/* Right side - Partners */}
          <motion.div variants={itemVariants} className="flex flex-col justify-start lg:w-[400px]">
            <h3 className="text-2xl font-bold mb-6">
              <span className="text-[#5BA89D]">Current</span>{" "}
              <span className="text-[#1A2B3C]">partners</span>
            </h3>
            <div className="flex flex-col gap-12">
              <PartnerLogo name="Schneider Electric" width={15} height={15} />
              <PartnerLogo name="UPC" height={15} />
            </div>
            
            {/* Navigation arrows */}
            <div className="flex gap-3 mt-12">
              <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="text-gray-600">←</span>
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="text-gray-600">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default SpecificSolutionsSection;