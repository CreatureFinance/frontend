import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProps } from "@/types/locale";
import dynamic from "next/dynamic";
import Navbar from "@/components/share/navbar";
import { ZustandProvider } from "@/providers/store-provider";
import Loading from "@/components/share/loading";
import Scroll from "@/components/share/scroll";
import { TooltipProvider } from "@/components/ui/tooltip";

interface IProps extends LocaleProps {
  children: ReactNode;
}

const MeshProvider = dynamic(
  () => import("@/providers/mesh-provider").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Loading
        isLoading={true}
        className="fixed inset-0 grid place-content-center bg-background/50 backdrop-blur-sm"
      />
    ),
  },
);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<IProps, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: IProps) {
  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="relative box-border overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MeshProvider>
            <NextIntlClientProvider messages={messages}>
              <ZustandProvider>
                <TooltipProvider>
                  <Scroll>
                    <main>
                      <Navbar />
                      <section className="px-4 py-6 md:px-6 md:py-8">
                        {children}
                      </section>
                    </main>
                    <Toaster richColors closeButton position="top-center" />
                  </Scroll>
                </TooltipProvider>
              </ZustandProvider>
            </NextIntlClientProvider>
          </MeshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
