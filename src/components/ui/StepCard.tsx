import { Icon } from '@iconify/react';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  color?: string;
}

const STEP_ICONS: Record<string, string> = {
  "1": "mdi:database-check",
  "2": "mdi:chart-bar",
  "3": "mdi:lightning-bolt"
};

function StepCard({ number, title, description, color = "bg-[#5BA89D]" }: StepCardProps) {
  return (
    <div className={`${color} rounded-3xl p-6 md:p-8 shadow-xl text-white flex flex-col min-h-[400px] md:min-h-[450px] relative overflow-hidden`}>
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg">
        <Icon icon={STEP_ICONS[number] || "mdi:help-circle"} className="w-12 h-12 text-[#1A2B3C]" />
      </div>
      
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">{title}</h3>
      <p className="text-white/90 leading-relaxed text-sm md:text-base mb-4 md:mb-6 flex-grow">
        {description}
      </p>
      
      <button className="text-white font-semibold text-left underline hover:text-white/80 transition-colors">
        Learn more
      </button>
    </div>
  );
}

export default StepCard;