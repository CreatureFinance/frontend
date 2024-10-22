"use client";

import React from "react";
import Loader from "@/components/ui/loader";
import { cn } from "@/utils/tools";

interface LoadingProp {
  className?: string;
  isLoading: boolean;
}

const Loading = ({ isLoading, className }: LoadingProp) => {
  if (!isLoading) return null;

  return (
    <div className={cn(className)}>
      <Loader />
    </div>
  );
};

export default Loading;
