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
import { getServerConfig } from '@/lib/get-server-config';
import './globals.css';

export const dynamic = 'force-dynamic';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverConfig = await getServerConfig();

  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        {/* Inject server config so client picks it up instantly */}
        {serverConfig && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__SITE_CONFIG__=${JSON.stringify(serverConfig)};`,
            }}
          />
        )}
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
