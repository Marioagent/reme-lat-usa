import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import HeroNew from "@/components/HeroNew";
import InfoBanner from "@/components/InfoBanner";
import AIAssistant from "@/components/AIAssistant";

// Lazy load components for better performance
const LiveRates = dynamic(() => import("@/components/LiveRates"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl"></div>,
});

const CalculatorNew = dynamic(() => import("@/components/CalculatorNew"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl"></div>,
});

const ComparatorNew = dynamic(() => import("@/components/ComparatorNew"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl"></div>,
});

const Features = dynamic(() => import("@/components/Features"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-xl"></div>,
});

const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <InfoBanner />
      <Navigation />
      <HeroNew />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveRates />
      </div>
      <CalculatorNew />
      <ComparatorNew />
      <Features />
      <Footer />
      <AIAssistant />
    </div>
  );
}
