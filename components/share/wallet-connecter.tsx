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
import { useNetwork, useWallet, useWalletList } from "@meshsdk/react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  ChevronRightIcon,
  Copy,
  LogOut,
  Settings as SettingIcon,
  Wallet as WalletIcon,
} from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { useTranslations } from "next-intl";
import ShinyButton from "../ui/shiny-button";
import { RainbowButton } from "../ui/rainbow-button";
import LocaleSelector from "./locale-selector";
import { Link } from "@/i18n/routing";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { getNetworks, handleCopy } from "@/utils/tools";
import { WalletType } from "@/types/wallet";
import { toast } from "sonner";

interface WalletUIProps {
  setIsOpen: (bool: boolean) => void;
}

const WalletConnecter = () => {
  const t = useTranslations("Wallet");
  const { connected, disconnect } = useWallet();
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const walletName = useStore((state) => state.wallet.walletName);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const isConnecting = useStore((state) => state.wallet.isConnecting);
  const setIsConnecting = useStore((state) => state.wallet.setIsConnecting);
  const accountNetwork = useNetwork();
  const envNetwork = process.env.NEXT_PUBLIC_CARDANO_NETWORK;
  const network =
    accountNetwork !== undefined
      ? getNetworks(accountNetwork as WalletType)
      : null;

  useEffect(() => {
    if (!envNetwork) {
      toast.warning("Please set your network in .env file");
      return;
    }
    if (!isConnecting || !network) return;

    if (connected && network.current === envNetwork) {
      toast.success(t("connect-success"));
      setIsConnecting(false);
    } else if (connected && network.current !== envNetwork) {
      disconnect();
      toast.error(
        t("wrong-network", {
          value: t(`network-${network.opposite}`),
        }),
      );
      setIsConnecting(false);
    }
  }, [
    connected,
    disconnect,
    envNetwork,
    isConnecting,
    network,
    setIsConnecting,
    t,
  ]);

  return (
    <div className="flex items-center gap-2">
      <Sheet open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <SheetTrigger asChild>
          <ShinyButton
            className="px-2 py-2"
            onClick={() => setIsPreferencesOpen(true)}
          >
            <SettingIcon />
          </ShinyButton>
        </SheetTrigger>
        <Settings />
      </Sheet>
      <Sheet open={isWalletOpen} onOpenChange={setIsWalletOpen}>
        <SheetTrigger asChild>
          <RainbowButton className="flex items-center gap-2 px-4 py-2">
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
        <WalletUI setIsOpen={setIsWalletOpen} />
      </Sheet>
    </div>
  );
};

export default WalletConnecter;

const Option = ({ wallet }: { wallet: Wallet }) => {
  const { id, name, icon } = wallet;
  const { connect, connecting } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);
  const setIsConnecting = useStore((state) => state.wallet.setIsConnecting);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect(id);
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

const DisconnectedWalletUI = ({ setIsOpen }: WalletUIProps) => {
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

const ConnectedWalletUI = ({ setIsOpen }: WalletUIProps) => {
  const { wallet, disconnect, name } = useWallet();
  const walletName = name.charAt(0).toUpperCase() + name.slice(1);
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const setWalletAddress = useStore((state) => state.wallet.setWalletAddress);
  const setWalletName = useStore((state) => state.wallet.setWalletName);
  const t = useTranslations("System");

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
  }, [setWalletAddress, setWalletName, wallet, walletName]);

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Wallet</SheetTitle>
        <SheetDescription className="sr-only">connected</SheetDescription>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{walletName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2>{walletName}</h2>
            <Tooltip delayDuration={0.1}>
              <TooltipTrigger
                className="flex w-full items-center"
                onClick={() => handleCopy(walletAddress, t)}
              >
                <p className="max-w-[75%] truncate text-sm text-muted-foreground">
                  {walletAddress}
                </p>
                <Copy className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {walletAddress}
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            className="shrink-0"
            onClick={disconnect}
            variant="outline"
            size="icon"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <Link href="/portfolio">
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="h-10 w-full"
          >
            View Portfolio
          </Button>
        </Link>
        <div className="h-80 bg-red-100"></div>
      </div>
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

const WalletUI = ({ setIsOpen }: WalletUIProps) => {
  const { connected } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);

  if (isConnecting) return <DisconnectedWalletUI setIsOpen={setIsOpen} />;
  if (connected) return <ConnectedWalletUI setIsOpen={setIsOpen} />;
  return <DisconnectedWalletUI setIsOpen={setIsOpen} />;
};
