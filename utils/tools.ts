import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCssVariableColor(colorKey: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(colorKey)
    .trim();
}
