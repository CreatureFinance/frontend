import Head from "next/head";
import WalletConnecter from "@/components/share/wallet-connecter";

export default function Home() {
  return (
    <div className="w-full bg-gray-900 text-center text-white">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <WalletConnecter className="w-[200px]" />
      </main>
      <footer className="flex justify-center border-t border-gray-300 p-8"></footer>
    </div>
  );
}
