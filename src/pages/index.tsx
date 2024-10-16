import Head from "next/head";
import WalletConnecter from "@/components/share/wallet-connecter";
import { getI18nProps } from "@/utils/i18n";

export default function Home() {
  return (
    <div className="w-full bg-gray-900 text-center text-white">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center pt-20">
        <nav className="fixed left-0 right-0 top-0 flex h-20 items-center justify-between px-8">
          <div className="h-10 w-10 rounded-full bg-red-500"></div>
          <WalletConnecter className="" />
        </nav>
      </main>
      <footer className="flex justify-center border-t border-gray-300 p-8"></footer>
    </div>
  );
}

export const getStaticProps = getI18nProps;
