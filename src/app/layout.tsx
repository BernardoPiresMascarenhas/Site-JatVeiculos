import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { site } from "@/config/site";
import { defaultTheme, palette, themeInitScript } from "@/config/theme";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "JAT Veículos — Novos e seminovos, nacionais e importados, desde 1995",
    template: "%s · JAT Veículos",
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["JAT Veículos", "seminovos BH", "carros premium Belo Horizonte", "consignação", "financiamento"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [{ url: "/Porsche%20-%20911%20GT3%20-%202026/porsche_Principal.jpg", width: 1280, height: 854 }],
  },
  twitter: { card: "summary_large_image" },
  // Conceito de portfólio: não indexar para não competir com o site oficial.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: palette.carbon,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // O script do <head> pode trocar data-theme antes da hidratação.
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${plexMono.variable}`}
      data-theme={defaultTheme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="grain min-h-dvh">
        <a
          href="#conteudo"
          className="eyebrow sr-only z-[70] bg-brand px-4 py-3 text-on-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <Navbar />
          <main id="conteudo">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
