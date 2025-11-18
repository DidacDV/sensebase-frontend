// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

//to use it later,  make title and descrpition optional 
function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1A3D63] to-[#4A7FA7] flex items-center justify-center mb-8 shadow-lg">
        <span className="text-white text-5xl font-bold">{number}</span>
      </div>
      <h3 className="text-[#0A1931] font-bold text-2xl md:text-3xl mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-lg md:text-xl max-w-sm">
        {description}
      </p>
    </div>
  );
}

export default StepCard;