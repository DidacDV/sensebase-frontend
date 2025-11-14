interface SolutionCardProps {
    icon: string;
    title: string;
    description: string;
}

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="w-16 h-16 bg-gradient-to-br from-[#B3CFE5] to-[#4A7FA7] rounded-lg flex items-center justify-center mb-6">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-[#0A1931] font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default SolutionCard;