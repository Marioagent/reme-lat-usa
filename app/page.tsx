import Navigation from "@/components/Navigation";
import HeroNew from "@/components/HeroNew";
import LiveRates from "@/components/LiveRates";
import CalculatorNew from "@/components/CalculatorNew";
import ComparatorNew from "@/components/ComparatorNew";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      <HeroNew />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveRates />
      </div>
      <CalculatorNew />
      <ComparatorNew />
      <Features />
      <Footer />
    </div>
  );
}
