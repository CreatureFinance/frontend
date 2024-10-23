"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/providers/store-provider";

const Account = () => {
  const walletName = useStore((state) => state.wallet.walletName);
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  return (
    <>
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{walletName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2>{walletName}</h2>
          <p className="max-w-[75%] truncate text-sm text-gray-500">
            {walletAddress}
          </p>
        </div>
      </div>
    </>
  );
};

export default Account;
