import { motion } from 'framer-motion'

export interface InfoCardProps {
  color: 'blueLight' | 'blueSky' | 'blueOcean' | 'blueRoyal' | 'blueMid' | 'blueDeep';
  description: string;
  icon?: React.ReactNode;
}

// TODO USE PALETTE PASSED BY PROPS
const InfoCard = ({ color, description, icon }: InfoCardProps) => {
  const colorClasses = {
    blueLight: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      shadow: 'hover:shadow-blue-200/50',
      iconBg: 'bg-blue-300'
    },
    blueSky: {
      bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      border: 'border-blue-300',
      shadow: 'hover:shadow-blue-300/50',
      iconBg: 'bg-blue-400'
    },
    blueOcean: {
      bg: 'bg-gradient-to-br from-blue-200 to-blue-300',
      border: 'border-blue-400',
      shadow: 'hover:shadow-blue-400/50',
      iconBg: 'bg-blue-500'
    },
    blueRoyal: {
      bg: 'bg-gradient-to-br from-blue-300 to-blue-400',
      border: 'border-blue-500',
      shadow: 'hover:shadow-blue-500/50',
      iconBg: 'bg-blue-600'
    },
    blueMid: {
      bg: 'bg-gradient-to-br from-blue-400 to-blue-500',
      border: 'border-blue-600',
      shadow: 'hover:shadow-blue-600/50',
      iconBg: 'bg-blue-700'
    },
    blueDeep: {
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      border: 'border-blue-800',
      shadow: 'hover:shadow-blue-800/50',
      iconBg: 'bg-blue-900'
    },
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${classes.bg} rounded-xl p-2 shadow-md ${classes.shadow} h-20 transition-shadow duration-300 cursor-default`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`${classes.iconBg} rounded-lg p-1 flex-shrink-0 shadow-sm`}>
            {icon}
          </div>
        )}
        <p className="text-black font-medium leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
