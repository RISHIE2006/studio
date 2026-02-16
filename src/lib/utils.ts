import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate a random number within a range
export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
