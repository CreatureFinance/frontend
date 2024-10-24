import React, { useCallback, useEffect, useState } from "react";
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
import { getErrorInfo, getNetworks, handleCopy } from "@/utils/tools";
import { LocalStorageKey, WalletType } from "@/types/enums";
import { toast } from "sonner";
import { useLocalStorage } from "@uidotdev/usehooks";

interface WalletUIProps {
  setIsOpen: (bool: boolean) => void;
  disconnect?: () => void;
}

const WalletConnecter = () => {
  const t = useTranslations("Wallet");
  const { wallet, name, error, connect, disconnect } = useWallet();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [walletProvider, setWalletProvider] = useLocalStorage<string | null>(
    LocalStorageKey.WALLET_PROVIDER,
    null,
  );
  const isConnecting = useStore((state) => state.wallet.isConnecting);
  const setIsConnecting = useStore((state) => state.wallet.setIsConnecting);
  const setConnectingId = useStore((state) => state.wallet.setConnectingId);
  const [accountNetwork, setAccountNetwork] = useState<WalletType>();
  const envNetwork = process.env.NEXT_PUBLIC_CARDANO_NETWORK;
  const network =
    accountNetwork !== undefined
      ? getNetworks(accountNetwork as WalletType)
      : null;

  const disconnectWallet = useCallback(() => {
    disconnect();
    setWalletProvider(null);
    setIsConnecting(false);
    setConnectingId("");
  }, [disconnect, setWalletProvider, setIsConnecting, setConnectingId]);

  useEffect(() => {
    if (error) {
      const message = getErrorInfo(error as Error);
      toast.error(message);
      setIsConnecting(false);
      setConnectingId("");
      setWalletProvider(null);
      return;
    }
  }, [error, setConnectingId, setIsConnecting, setWalletProvider]);

  useEffect(() => {
    if (!envNetwork) {
      toast.warning("Please set your network in .env file");
      return;
    }

    if (!isConnecting || !network) return;

    const connectWallet = async (): Promise<string> => {
      // 等待一小段時間，讓 network 更新，確保資料正確
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return new Promise((resolve, reject) => {
        if (network.current === envNetwork) {
          setWalletProvider(name);
          setIsConnecting(false);
          resolve(t("connect-success"));
        } else if (network.current !== envNetwork) {
          disconnectWallet();
          reject(
            new Error(
              t("wrong-network", {
                value: t(`network-${network.opposite}`),
              }),
            ),
          );
        }
      });
    };

    toast.promise(connectWallet(), {
      loading: t("connecting"),
      success: (message: string) => message,
      error: (error: Error) => error.message,
    });
  }, [
    disconnectWallet,
    envNetwork,
    isConnecting,
    name,
    network,
    setConnectingId,
    setIsConnecting,
    setWalletProvider,
    t,
  ]);

  useEffect(() => {
    // TODO 當 useNetworkId 修好的時候記得換成 hooks
    const fetchNetworkId = async () => {
      try {
        const networkId = await wallet.getNetworkId();
        setAccountNetwork(networkId);
      } catch (error) {
        setAccountNetwork(undefined);
      }
    };

    if (wallet) {
      fetchNetworkId();
    }
  }, [wallet]);

  useEffect(() => {
    if (walletProvider && !isConnecting) {
      setIsConnecting(true);
      connect(walletProvider);
    }
  }, []);

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
          <WalletButton setIsOpen={setIsWalletOpen} />
        </SheetTrigger>
        <WalletUI disconnect={disconnectWallet} setIsOpen={setIsWalletOpen} />
      </Sheet>
    </div>
  );
};

export default WalletConnecter;

const Option = ({ wallet }: { wallet: Wallet }) => {
  const { id, name, icon } = wallet;
  const { connect, connecting } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);
  const connectingId = useStore((state) => state.wallet.connectingId);
  const setIsConnecting = useStore((state) => state.wallet.setIsConnecting);
  const setConnectingId = useStore((state) => state.wallet.setConnectingId);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectingId(id);
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
      {isConnecting && id === connectingId ? <Loader /> : <ChevronRightIcon />}
    </Button>
  );
};

const DisconnectedWalletUI = () => {
  const t = useTranslations("Wallet");
  const wallets = useWalletList();
  const { connected } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t("connect")}</SheetTitle>
        <SheetDescription className="sr-only">!connected</SheetDescription>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
        {(!connected || isConnecting) &&
          wallets.map((item) => <Option key={item.id} wallet={item} />)}
      </div>
    </SheetContent>
  );
};

const ConnectedWalletUI = ({ setIsOpen, disconnect }: WalletUIProps) => {
  const { wallet, name } = useWallet();
  const walletName = name.charAt(0).toUpperCase() + name.slice(1);
  const walletAddress = useStore((state) => state.wallet.walletAddress);
  const setWalletName = useStore((state) => state.wallet.setWalletName);
  const setWalletAddress = useStore((state) => state.wallet.setWalletAddress);
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
          <div className="min-w-0">
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
              <TooltipContent className="h-auto max-w-[250px] whitespace-pre-wrap break-all">
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

const WalletUI = (props: WalletUIProps) => {
  const { connected } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);

  if (isConnecting) return <DisconnectedWalletUI />;
  if (connected) return <ConnectedWalletUI {...props} />;
  return <DisconnectedWalletUI />;
};

const WalletButton = ({ setIsOpen }: WalletUIProps) => {
  const t = useTranslations("Wallet");
  const { connected } = useWallet();
  const isConnecting = useStore((state) => state.wallet.isConnecting);
  const walletName = useStore((state) => state.wallet.walletName);
  const walletAddress = useStore((state) => state.wallet.walletAddress);

  if (isConnecting) {
    return (
      <RainbowButton disabled className="flex items-center gap-2 px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <Loader className="h-5 w-5 animate-spin text-background" />
        </div>
        <span className="max-w-32 truncate">{t("connecting")}</span>
      </RainbowButton>
    );
  }

  return (
    <RainbowButton
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 px-4 py-2"
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
  );
};
