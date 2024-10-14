import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wallet } from "@meshsdk/common";
import { useWallet, useWalletList } from "@meshsdk/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronRightIcon, LogOut } from "lucide-react";
import Loader from "../ui/loader";

interface IProps {
  className?: string;
}

const WalletConnecter = ({ className }: IProps) => {
  const { connected } = useWallet();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Connect wallet</Button>
      </SheetTrigger>
      {connected ? <ConnectedWalletUI /> : <DisconnectedWalletUI />}
    </Sheet>
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
        <span>{name}</span>
      </div>
      {isConnecting ? <Loader /> : <ChevronRightIcon />}
    </Button>
  );
};

const DisconnectedWalletUI = () => {
  const { connected } = useWallet();
  const wallets = useWalletList();
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Connect wallet</SheetTitle>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
        {!connected &&
          wallets.map((item) => <Option key={item.id} wallet={item} />)}
      </div>
    </SheetContent>
  );
};

const ConnectedWalletUI = () => {
  const { wallet, disconnect } = useWallet();

  console.log(wallet.getBalance());
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Wallet</SheetTitle>
      </SheetHeader>
      <div className="mt-8 flex flex-col gap-2">
        <Button onClick={disconnect} variant="outline" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </SheetContent>
  );
};
