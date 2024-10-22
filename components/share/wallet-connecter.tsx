import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Wallet } from "@meshsdk/common";
import { useWallet, useWalletList } from "@meshsdk/react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  ChevronRightIcon,
  LogOut,
  Settings as SettingIcon,
  Wallet as WalletIcon,
} from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { useTranslations } from "next-intl";
import ShinyButton from "../ui/shiny-button";
import { RainbowButton } from "../ui/rainbow-button";
import LocaleSelector from "./locale-selector";

interface IProps {
  className?: string;
}

const WalletConnecter = ({ className }: IProps) => {
  const t = useTranslations("Wallet");
  const { connected } = useWallet();
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const walletName = useStore((state) => state.wallet.walletName);

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <ShinyButton className="px-2 py-2">
            <SettingIcon />
          </ShinyButton>
        </SheetTrigger>
        <Settings />
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <RainbowButton
            className={`flex items-center gap-2 px-4 py-2 ${className}`}
          >
            <div className="flex items-center justify-center">
              {connected ? (
                <Avatar className="h-6 w-6 shrink-0 text-foreground">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{walletName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ) : (
                <WalletIcon className="h-5 w-5 shrink-0" />
              )}
            </div>
            <span className="max-w-32 truncate">
              {connected ? walletAddress : t("connect")}
            </span>
          </RainbowButton>
        </SheetTrigger>
        {connected ? <ConnectedWalletUI /> : <DisconnectedWalletUI />}
      </Sheet>
    </div>
  );
};

export default WalletConnecter;

const Option = ({ wallet }: { wallet: Wallet }) => {
  const { id, name, icon } = wallet;
  const { connect, connecting } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect(id);
    setIsConnecting(false);
  };

  return (
    <Button
      variant="ghost"
      className="flex h-12 w-full items-center justify-between"
      onClick={handleConnect}
      disabled={connecting || isConnecting}
    >
      <div className="flex items-center gap-2">
        <Image src={icon} alt={id} width={28} height={28} />
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
      </div>
      {isConnecting ? <Loader /> : <ChevronRightIcon />}
    </Button>
  );
};

const DisconnectedWalletUI = () => {
  const t = useTranslations("Wallet");
  const { connected } = useWallet();
  const wallets = useWalletList();
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t("connect")}</SheetTitle>
        <SheetDescription className="sr-only">!connected</SheetDescription>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
        {!connected &&
          wallets.map((item) => <Option key={item.id} wallet={item} />)}
      </div>
    </SheetContent>
  );
};

const ConnectedWalletUI = () => {
  const { wallet, disconnect, name } = useWallet();
  const walletName = name.charAt(0).toUpperCase() + name.slice(1);
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const setWalletAddress = useStore((state) => state.wallet.setWalletAddress);
  const setWalletName = useStore((state) => state.wallet.setWalletName);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addr = await wallet.getChangeAddress();
        setWalletName(walletName);
        setWalletAddress(addr);
      } catch (error) {
        setWalletName("");
        setWalletAddress("");
      }
    };

    fetchAddress();
  }, [wallet]);

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Wallet</SheetTitle>
        <SheetDescription className="sr-only">connected</SheetDescription>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
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
          <Button
            className="ml-2 shrink-0"
            onClick={disconnect}
            variant="outline"
            size="icon"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-8 h-80 bg-red-100"></div>
    </SheetContent>
  );
};

const Settings = () => {
  const t = useTranslations("Settings");

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t("title")}</SheetTitle>
        <SheetDescription className="sr-only">settings</SheetDescription>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
        <SheetTitle>{t("language")}</SheetTitle>
        <LocaleSelector />
      </div>
    </SheetContent>
  );
};
