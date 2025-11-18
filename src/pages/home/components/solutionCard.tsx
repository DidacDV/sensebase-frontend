import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SolutionCardProps {
  icon: string;
  title: string;
  description: string;
}

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <div className="bg-white rounded-3xl p-12 w-96 md:p-16 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[400px] flex flex-col">
      <div className="w-28 h-28 bg-gradient-to-br from-[#B3CFE5] to-[#4A7FA7] rounded-2xl flex items-center justify-center mb-8 shadow-md">
        <FontAwesomeIcon icon={["fas", icon] as any} className="text-white text-5xl" />
      </div>
      <h3 className="text-[#0A1931] font-bold text-2xl md:text-3xl mb-6">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-lg md:text-xl flex-grow">{description}</p>
    </div>
  );
}

export default SolutionCard;