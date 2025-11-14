import SolutionCard from "./components/solutionCard";

function GeneralSolutionsSection () {
  const solutions = [
    {
      icon: "iconHere",
      title: "Contextualization",
      description: "Relate your data with external sources, trends, and news to unveil in-depth analysis."
    },
    {
      icon: "iconHere",
      title: "Strategies",
      description: "Generate expert plans and recommendations based on your current context."
    },
    {
      icon: "iconHere",
      title: "Automation",
      description: "Set up automatic actions to take your strategies into real, tangible results."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63] min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-white">Our </span>
          <span className="text-[#B3CFE5]">General Solutions</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <SolutionCard key={solution.title} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default GeneralSolutionsSection;