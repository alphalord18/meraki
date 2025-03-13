import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePassword(): string {
  const length = 12;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  // Ensure at least one character from each category
  password += chars.slice(0, 26).charAt(Math.floor(Math.random() * 26)); // lowercase
  password += chars.slice(26, 52).charAt(Math.floor(Math.random() * 26)); // uppercase
  password += chars.slice(52, 62).charAt(Math.floor(Math.random() * 10)); // number
  password += chars.slice(62).charAt(Math.floor(Math.random() * (chars.length - 62))); // special

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}