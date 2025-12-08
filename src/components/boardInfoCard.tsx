import { motion } from 'framer-motion';

export type InfoCardType = 'alert' | 'tip' | 'stat' | 'neutral';

export interface InfoCardProps {
  type: InfoCardType;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const InfoCard = ({ type, title, description, icon }: InfoCardProps) => {
  const styles = {
    alert: {
      border: 'border-l-4 border-amber-500',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    tip: {
      border: 'border-l-4 border-[#5BA89D]', // Teal
      iconBg: 'bg-[#5BA89D]/10 text-[#5BA89D]',
    },
    stat: {
      border: 'border-l-4 border-[#4A7FA7]', // Blue
      iconBg: 'bg-[#4A7FA7]/10 text-[#4A7FA7]',
    },
    neutral: {
      border: 'border-l-4 border-[#1A3D63]', // Navy
      iconBg: 'bg-[#1A3D63]/10 text-[#1A3D63]',
    }
  };

  const currentStyle = styles[type] || styles.neutral;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${currentStyle.border}`}
    >
      <div className="flex items-start gap-4">
        {/* If you pass an icon, it renders here, otherwise we use a default based on type */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStyle.iconBg}`}>
          {icon || (
            <span className="font-bold text-lg">
              {type === 'alert' ? '!' : type === 'stat' ? '%' : 'i'}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-1">
            {title}
          </h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoCard;