import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { TranslationsProvider } from "@/context/TranslationsContext";
import { Locale } from "@/types/frontend";
import { cookies } from "next/headers";
import "./globals.css";
export const metadata: Metadata = {
  title: "Andrea larrumbide",
  description: "Illustrationd and photography porfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  return (
    <html lang={locale}>
      <body>
        <ToastContainer
          position="top-right"
        />
        <TranslationsProvider initialLocale={locale as Locale}>
          <main>
            {children}
          </main>

        </TranslationsProvider>
      </body>
    </html>
  );
}
