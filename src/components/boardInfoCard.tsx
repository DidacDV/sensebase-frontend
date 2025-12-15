import { motion } from 'framer-motion';

export type InfoCardType = 'alert' | 'tip' | 'stat' | 'neutral';

export interface InfoCardProps {
  type: InfoCardType;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/** Board-aligned colors */
const BOARD_COLORS = {
  grid: '#1D4ED8',  
  local: '#6D28D9', 
  all: '#06B6D4',  
  mixed: '#4F46E5',  
  it: '#0F3DCC',     
};

const InfoCard = ({ type, title, description, icon }: InfoCardProps) => {
  const styles = {
    alert: {
      borderWidth: 6,
      borderColor: BOARD_COLORS.it,
      iconBg: `${BOARD_COLORS.it}1A`,
      iconColor: BOARD_COLORS.it,
    },
    tip: {
      borderWidth: 6,
      borderColor: BOARD_COLORS.all,
      iconBg: `${BOARD_COLORS.all}1A`,
      iconColor: BOARD_COLORS.all,
    },
    stat: {
      borderWidth: 6,
      borderColor: BOARD_COLORS.grid,
      iconBg: `${BOARD_COLORS.grid}1A`,
      iconColor: BOARD_COLORS.grid,
    },
    neutral: {
      borderWidth: 6,
      borderColor: BOARD_COLORS.mixed,
      iconBg: `${BOARD_COLORS.mixed}1A`,
      iconColor: BOARD_COLORS.mixed,
    },
  };

  const currentStyle = styles[type] || styles.neutral;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      style={{ borderLeftWidth: currentStyle.borderWidth, borderLeftColor: currentStyle.borderColor }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
          style={{
            backgroundColor: currentStyle.iconBg,
            color: currentStyle.iconColor,
          }}
        >
          {icon || (
            <span>
              {type === 'alert'
                ? '!'
                : type === 'stat'
                ? '%'
                : type === 'tip'
                ? '✓'
                : 'i'}
            </span>
          )}
        </div>

        {/* Content */}
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