import { ContentProvider } from './content';
import type { SiteContent } from './content/types';
import { MotionProvider } from './lib/motion';
import { AppRoutes } from './site/routes';
import { AskIP3 } from './site/components/AskIP3';
import { Footer } from './site/components/Footer';
import { Header } from './site/components/Header';
import { ScrollManager } from './site/components/ScrollManager';

export default function App({ content }: { content?: SiteContent }) {
  return (
    <ContentProvider initial={content}>
      <MotionProvider>
        <ScrollManager />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-midnight"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <AppRoutes />
        </main>
        <Footer />
        <AskIP3 />
      </MotionProvider>
    </ContentProvider>
  );
}
