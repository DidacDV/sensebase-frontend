// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1A3D63] to-[#4A7FA7] flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white text-3xl font-bold">{number}</span>
      </div>
      <h3 className="text-[#0A1931] font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}

export default StepCard;