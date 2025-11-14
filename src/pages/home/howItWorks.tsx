import StepCard from "../../components/ui/StepCard";

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Select a data provider",
      description: "Connect with multiple data providers and services with secure authentication and real-time synchronization."
    },
    {
      number: "2",
      title: "Setup Your Board",
      description: "Choose the intelligence model that fits your objectives, select source data, and start specific parameters to visualize your use case."
    },
    {
      number: "3",
      title: "Generate Solutions",
      description: "Watch as your dashboard comes to life with dynamic visualizations and automattic intelligence."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#0A1931]">How It </span>
          <span className="text-[#1A3D63]">works</span>
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          Three simple steps to transform your data into business value
        </p>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;