import { motion } from "framer-motion";

interface KeypointCardProps {
  title: string;
  description: string;
  index?: number;
}

const KeypointCard = ({ title, description, index = 0 }: KeypointCardProps) => {
  // Green color palette matching the board theme
  const borderColors = ["border-[#10B981]", "border-[#22C55E]", "border-[#059669]"];
  const accentColor = borderColors[index % borderColors.length];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white/10 backdrop-blur-sm p-3 rounded-lg border-l-2 ${accentColor} h-full flex flex-col`}
    >
      <h4 className="font-semibold text-white mb-1 text-sm leading-tight">
        {title}
      </h4>

      <p className="text-white text-sm leading-relaxed flex-grow">
        {description}
      </p>
    </motion.div>
  );
};

export default KeypointCard;