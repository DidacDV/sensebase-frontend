// Partner Logo Component
function PartnerLogo({ name, bgColor }: { name: string; bgColor: string }) {
  return (
    <div className={`${bgColor} rounded-xl p-8 flex items-center justify-center h-32 shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <span className="text-white font-bold text-2xl">{name}</span>
    </div>
  );
}

export default PartnerLogo;