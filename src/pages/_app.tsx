import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { appWithTranslation } from "next-i18next";
import { RootStoreProvider } from "@/components/providers/store-provider";
import { Toaster } from "sonner";
import nextI18NextConfig from "../../next-i18next.config.js";

function App({ Component, pageProps }: AppProps) {
  return (
    <RootStoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <MeshProvider>
          <Component {...pageProps} />
          <Toaster richColors closeButton />
        </MeshProvider>
      </ThemeProvider>
    </RootStoreProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
