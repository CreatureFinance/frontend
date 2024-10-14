import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { ThemeProvider } from "@/components/providers/theme-provider";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <MeshProvider>
        <Component {...pageProps} />
      </MeshProvider>
    </ThemeProvider>
  );
}

export default App;
