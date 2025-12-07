import HeroSection from "./hero";
import HowItWorksSection from "./howItWorks";
import SolutionsSection from "./gereneralSolutions";
import SpecificSolutionsSection from "./specificSolutions";
import Footer from "../../components/layout/footer";

// Main Home Component, each section takes 100% of screen height (taking into account the header)
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <SolutionsSection />
      <SpecificSolutionsSection />
      <Footer />
    </div>
  );
}