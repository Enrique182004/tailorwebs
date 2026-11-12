import { MotionConfig } from "motion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ContactDraftProvider } from "@/components/ContactDraftProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <ContactDraftProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ContactDraftProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
