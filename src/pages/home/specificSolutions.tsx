import PartnerLogo from "./components/partnerLogo";

function SpecificSolutionsSection() {
return (
    <section className="py-20 px-6 bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          <span className="text-[#0A1931]">Custom Solutions For </span>
          <span className="text-[#1A3D63]">Every Partner</span>
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
          We create tailored solutions for your goals. Set up your board by choosing the intelligent model, selecting a partner solution, and adding specific options for your use case. Our platform adapts to your context to deliver tangible, measurable results.
        </p>
        
        <h3 className="text-3xl font-bold text-center mb-12">
          <span className="text-[#1A3D63]">Current partners</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <PartnerLogo name="Schneider Electric" bgColor="bg-gradient-to-br from-[#1A3D63] to-[#0A1931]" />
          <PartnerLogo name="UPC" bgColor="bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63]" />
        </div>
      </div>
    </section>
  );
}

export default SpecificSolutionsSection;