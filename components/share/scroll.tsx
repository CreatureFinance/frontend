"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogContainer,
} from "@/components/motion/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, CircleAlert } from "lucide-react";
import BlurFade from "../ui/blur-fade";
import { useTranslations } from "next-intl";

interface IProps {
  children: ReactNode;
}

const Scroll = ({ children }: IProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowScrollTop(scrollContainerRef.current.scrollTop > 100);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollToTopInScroll = scrollToTop;
    }
  }, []);

  return (
    <div className="relative h-screen">
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide h-full overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
      <div className="fixed bottom-8 right-8 flex items-center gap-2">
        <WhatsNew />

        {showScrollTop && (
          <BlurFade duration={0.3} yOffset={0}>
            <Button
              className="h-12 w-12 rounded-full"
              size="icon"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </BlurFade>
        )}
      </div>
    </div>
  );
};

export default Scroll;

const WhatsNew = () => {
  const t = useTranslations("System");
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="min-h-12 rounded-3xl">
          <div className="mx-2 flex items-center gap-2">
            <CircleAlert /> {t("whats-new-title")}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="relative h-[500px] w-[500px] rounded-lg border border-foreground/20 bg-foreground text-background">
          <div className="mx-4 flex h-20 items-center justify-between">
            <DialogTitle className="text-3xl font-semibold">
              Something NEW !!!
            </DialogTitle>
            <DialogClose className="static text-zinc-500" />
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
};
