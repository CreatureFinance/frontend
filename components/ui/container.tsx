import { cn } from "@/utils/tools";
import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: IProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-screen-xl space-y-6 md:space-y-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
