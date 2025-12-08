import { motion } from "framer-motion";

interface KeypointCardProps {
  title: string;
  description: string;
  index?: number;
}

const KeypointCard = ({ title, description, index = 0 }: KeypointCardProps) => {
  // Cycle through the palette for variety if needed, or stick to one accent
  const borderColors = ["border-[#5BA89D]", "border-[#4A7FA7]", "border-[#1A3D63]"];
  const accentColor = borderColors[index % borderColors.length];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white p-5 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
      border-l-4 ${accentColor} h-full flex flex-col`}
    >
      <h4 className="font-bold text-[#1A3D63] mb-2 text-lg">
        {title}
      </h4>

      <p className="text-gray-600 text-sm leading-relaxed flex-grow">
        {description}
      </p>
    </motion.div>
  );
};

export default KeypointCard;