// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  color?: string;
}

//to use it later,  make title and descrpition optional 
function StepCard({ number, title, description, color = "bg-[#5BA89D]" }: StepCardProps) {
  return (
    <div className={`${color} rounded-3xl p-8 shadow-xl text-white flex flex-col min-h-[450px] relative overflow-hidden`}>
      {/* Icon placeholder at top */}
      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
        <div className="w-6 h-6 border-2 border-white rounded"></div>
      </div>
      
      {/* Title and description */}
      <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
      <p className="text-white text-opacity-90 leading-relaxed text-base mb-6 flex-grow">
        {description}
      </p>
      
      {/* Learn more link */}
      <button className="text-white font-semibold text-left underline mb-8">
        Learn more
      </button>
      
      {/* Single white rectangle */}
      <div className="mt-auto h-40 bg-white rounded-xl"></div>
    </div>
  );
}

export default StepCard;