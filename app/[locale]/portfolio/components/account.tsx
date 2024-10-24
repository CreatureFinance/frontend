"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/providers/store-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleCopy } from "@/utils/tools";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";

const Account = () => {
  const walletName = useStore((state) => state.wallet.walletName);
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const t = useTranslations("System");

  return (
    <>
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{walletName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2>{walletName}</h2>
          <Tooltip delayDuration={0.1}>
            <TooltipTrigger
              className="inline-flex items-center gap-2"
              onClick={() => handleCopy(walletAddress, t)}
            >
              <p className="truncate text-sm text-muted-foreground">
                {walletAddress}
              </p>
              <Copy className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="h-auto max-w-[300px] whitespace-pre-wrap break-all">
              {walletAddress}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Account;
