"use client";

import React from "react";
import dynamic from "next/dynamic";

const WalletConnecter = dynamic(() => import("./wallet-connecter"), {
  ssr: false,
});

const Navbar = () => {
  return (
    <div className="fixed left-0 right-0 top-0 flex h-20 items-center justify-between px-8">
      <div className="h-10 w-10 rounded-full bg-red-500" />
      <WalletConnecter />
    </div>
  );
};

export default Navbar;
