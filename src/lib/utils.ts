import { URol } from "@/backend/common"
import { UseNavigateResult } from "@tanstack/react-router"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function navigateToRol(user_rol: URol, navigate: UseNavigateResult<string>) {
  console.log('URol is: ', user_rol)
  if (user_rol == URol.USER) {
    navigate({
      to: '/dashboard_user'
    })
  } else if (user_rol == URol.TRAINER) {
    navigate({
      to: '/dashboard_trainer'
    })
  } else if (user_rol == URol.ADMIN) {
    navigate({
      to: '/dashboard_admin'
    })
  }
}

export function getCurrentDateTimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 19).replace('T', ' ');
  return localISOTime; // Format: YYYY-MM-DD HH:MM:SS
}
