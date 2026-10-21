import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BagDrawer } from "@/components/bag";
import { getCatalogue } from "@/lib/catalogue";
import "./globals.css";
import "./brand.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "YK Polish Co. — Your Nails. Your Mood. Your Moment.",
    template: "%s | YK Polish Co.",
  },
  description:
    "Handmade press-on nails and personalised nail art. Explore the collections, find your mood, and create your set with YK Polish Co.",
  openGraph: {
    type: "website",
    siteName: "YK Polish Co.",
    images: [
      {
        url: "/logo-original.png",
        width: 502,
        height: 502,
        alt: "YK Polish Co.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/logo-original.png",
    shortcut: "/logo-original.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings, demo, products } = await getCatalogue();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header settings={settings} demo={demo} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
        <BagDrawer settings={settings} products={products} />
      </body>
    </html>
  );
}
