import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import IntegrationStrip from "@/components/IntegrationStrip";
import OperationsPanel from "@/components/OperationsPanel";
import Allies from "@/components/Allies";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <IntegrationStrip />
      <OperationsPanel />
      <Allies />
      <Features />
      <Showcase />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
