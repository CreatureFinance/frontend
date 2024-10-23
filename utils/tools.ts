import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import copy from "copy-to-clipboard";
import { toast } from "sonner";

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
