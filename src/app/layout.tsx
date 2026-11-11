import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UIProvider } from "@/context/UIContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalPopups } from "@/components/GlobalPopups";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "Navya Grand | Multi-Cuisine Restaurant, Fine Dining & Banquet Hall in Guntur",
    template: "%s | Navya Grand, Guntur",
  },
  description:
    "Navya Grand in Vidyanagar, Guntur – Authentic Andhra specialities, signature dum biryanis, multi-cuisine fine dining, online food ordering, and grand banquet hall.",
  keywords: [
    "Navya Grand Guntur",
    "Best Biryani in Guntur",
    "Multi-Cuisine Restaurant Guntur",
    "Banquet Hall Vidyanagar Guntur",
    "Andhra Thali Guntur",
    "Order Food Online Guntur",
  ],
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = getSiteContent();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-dvh">
        <CartProvider>
          <UIProvider>
            <SiteHeader contact={siteContent.contact} />
            <main className="flex-1 w-full">{children}</main>
            <SiteFooter contact={siteContent.contact} />
            <GlobalPopups contact={siteContent.contact} />
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  );
}
