import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LiveRates from "@/components/LiveRates";
import Calculator from "@/components/Calculator";
import Comparator from "@/components/Comparator";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveRates />
      </div>
      <Calculator />
      <Comparator />
      <Features />
      <Footer />
    </div>
  );
}
