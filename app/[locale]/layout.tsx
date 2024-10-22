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
import dynamic from "next/dynamic";
import Navbar from "@/components/share/navbar";
import { ZustandProvider } from "@/providers/store-provider";
import Loading from "@/components/share/loading";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

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
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-screen flex-col">
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
                <div className="flex flex-grow flex-col pt-20">
                  <Navbar />
                  <main className="flex-grow">{children}</main>
                </div>
                <Toaster richColors closeButton />
              </ZustandProvider>
            </NextIntlClientProvider>
          </MeshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
