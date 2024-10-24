import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { WalletType } from "@/types/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCssVariableColor(colorKey: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(colorKey)
    .trim();
}

export function handleCopy(text: string, t: (key: string) => string) {
  const success = copy(text);
  toast[success ? "success" : "error"](
    t(success ? "copy-success" : "copy-fail"),
  );
}

export function getNetworks(network: WalletType): {
  current: string;
  opposite: string;
} {
  const current = network === WalletType.MAINNET ? "mainnet" : "testnet";
  const opposite = network === WalletType.MAINNET ? "testnet" : "mainnet";
  return { current, opposite };
}

export function getErrorInfo(error: Error): string {
  try {
    const match = error.message.match(/\{.*\}/);
    if (match) {
      const errorObj = JSON.parse(match[0]);
      return errorObj.info || "未知錯誤";
    }
    return error.message;
  } catch {
    return error.message || "未知錯誤";
  }
}
