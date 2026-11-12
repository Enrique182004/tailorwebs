import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageFade } from "@/components/LanguageFade";
import { Showcase } from "@/components/Showcase";
import { SkipLink } from "@/components/SkipLink";
import { VersionSwitcher } from "@/components/VersionSwitcher";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CursorRing } from "./CursorRing";
import { HorizontalServices } from "./HorizontalServices";
import { useSectionTone } from "./hooks/use-section-tone";
import { Manifesto } from "./Manifesto";
import { RevealCta } from "./RevealCta";
import { BuildScene } from "./scene/BuildScene";
import { StackedWhy } from "./StackedWhy";
import { V2Hero } from "./V2Hero";
import { VelocityMarquee } from "./VelocityMarquee";

export function V2Page() {
  const tone = useSectionTone();

  return (
    <div className="min-h-dvh">
      <SkipLink />
      <Header tone={tone} />
      <LanguageFade>
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <V2Hero />
          <Manifesto />
          <BuildScene />
          <VelocityMarquee />
          <Showcase />
          <HorizontalServices />
          <StackedWhy />
          <RevealCta />
          <FaqSection />
          <ContactSection />
        </main>
        <Footer />
      </LanguageFade>
      <WhatsAppButton />
      <VersionSwitcher current={2} />
      <CursorRing />
    </div>
  );
}
