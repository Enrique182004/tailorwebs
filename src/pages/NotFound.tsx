import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Header";
import { useLanguage } from "@/hooks/use-language";

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <main id="main-content" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <Wordmark />
      <h1 className="text-4xl font-medium text-ink">{t.notFound.title}</h1>
      <p className="text-ink-muted">{t.notFound.body}</p>
      <Link to="/" className="rounded-full bg-rust px-6 py-3 font-semibold text-white hover:bg-rust-dark">{t.notFound.back}</Link>
    </main>
  );
};

export default NotFound;
