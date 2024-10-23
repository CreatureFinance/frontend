"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Icon from "@/assets/icon.webp";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter, usePathname } from "@/i18n/routing";
import { cn } from "@/utils/tools";

const WalletConnecter = dynamic(() => import("./wallet-connecter"), {
  ssr: false,
});

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (
      pathname === path &&
      typeof window !== "undefined" &&
      window.scrollToTopInScroll
    ) {
      window.scrollToTopInScroll();
    } else if (pathname !== path) {
      router.push(path);
    }
  };

  return (
    <header className="sticky top-0 min-h-[78px] space-x-4 border-b border-foreground/20 bg-background/50 px-8 py-4 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src={Icon} alt="icon" className="h-10 w-10 object-fill" />

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => handleNavigation("/")}
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                >
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => handleNavigation("/")}
                  className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                >
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <WalletConnecter />
      </div>
    </header>
  );
};

export default Navbar;
