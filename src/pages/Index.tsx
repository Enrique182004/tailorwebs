import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LanguageFade } from "@/components/LanguageFade";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { Showcase } from "@/components/Showcase";
import { SkipLink } from "@/components/SkipLink";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhySection } from "@/components/WhySection";

const Index = () => (
  <div className="min-h-dvh">
    <SkipLink />
    <Header />
    <LanguageFade>
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Showcase />
        <ServicesSection />
        <ProcessSection />
        <WhySection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </LanguageFade>
    <WhatsAppButton />
  </div>
);

export default Index;
