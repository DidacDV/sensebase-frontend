import { motion } from "framer-motion";

interface KeypointCardProps {
  title: string;
  description: string;
}

const KeypointCard = ({ title, description }: KeypointCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-gradient-to-br from-blue-300 to-blue-400 p-2 rounded-xl shadow-md h-26 overflow-hidden"
    >
      <h4 className="font-semibold text-[#061e37] mb-2">
        {title}
      </h4>

      <p className="text-gray-900 text-sm whitespace-normal wrap-break-word leading-snug">
        {description}
      </p>
    </motion.div>
  );
};

export default KeypointCard;
