import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/language-context';
import { ThemeProvider } from '@/lib/theme-context';
import { SiteConfigProvider } from '@/lib/site-config-context';
import LayoutContent from '@/components/LayoutContent';
import ClientOnly from '@/components/ClientOnly';
import PageLoader from '@/components/anim/PageLoader';
import CustomCursor from '@/components/anim/CustomCursor';
import SmoothScroll from '@/components/anim/SmoothScroll';
import MeshBackground from '@/components/anim/MeshBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hamadat Promotion Immobilière',
  description: 'Découvrez nos résidences de prestige en Algérie — La où le rêve prend toit.',
  keywords: ['immobilier', 'résidence', 'algérie', 'construction', 'promotion immobilière', 'luxe'],
  openGraph: {
    title: 'Hamadat Promotion Immobilière',
    description: 'Découvrez nos résidences de prestige en Algérie',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <ClientOnly>
          <PageLoader />
          <CustomCursor />
          <SmoothScroll />
          <MeshBackground />
          <ThemeProvider>
            <SiteConfigProvider>
              <LanguageProvider>
                <LayoutContent>{children}</LayoutContent>
              </LanguageProvider>
            </SiteConfigProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
