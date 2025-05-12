import { URol } from "@/backend/common"
import { UseNavigateResult } from "@tanstack/react-router"
import { clsx, type ClassValue } from "clsx"
import { format, parse } from "date-fns"
import { twMerge } from "tailwind-merge"
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';

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

export const formatDate = (dateString: string | null | undefined, formatString = 'PPP'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString || 'N/A';
    return format(date, formatString);
  } catch (error) {
    return dateString || 'N/A';
  }
};

export function getCurrentDateTimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 19).replace('T', ' ');
  return localISOTime; // Format: YYYY-MM-DD HH:MM:SS
}


const LOCAL_DATETIME_INPUT_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const UTC_DATETIME_OUTPUT_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export function convertLocalToUtcString(
  localDateTimeString: string | null | undefined
): string | null {
  if (!localDateTimeString) {
    return null;
  }

  try {
    const localDate = parse(localDateTimeString, LOCAL_DATETIME_INPUT_FORMAT, new Date());

    if (isNaN(localDate.getTime())) {
      console.warn('Invalid local date string for UTC conversion:', localDateTimeString);
      return null;
    }

    // 2. Get the user's current IANA timezone name.
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 3. Use `fromZonedTime` to get the UTC equivalent.
    //    `fromZonedTime` takes a date that represents local time in `userTimeZone`
    //    and returns a Date instance whose timestamp is the equivalent UTC time.
    const utcDate = fromZonedTime(localDate, userTimeZone);

    // 4. Format this UTC Date object into your "YYYY-MM-DD HH:MM:SS" string.
    //    `formatInTimeZone` with 'UTC' ensures the output numbers represent UTC.
    return formatInTimeZone(utcDate, 'UTC', UTC_DATETIME_OUTPUT_FORMAT);

  } catch (error) {
    console.error('Error converting local to UTC string:', error);
    return null;
  }
}

/**
 * Converts a UTC datetime string (from backend, "YYYY-MM-DD HH:MM:SS" format, where numbers represent UTC)
 * to a string formatted for display in the user's local timezone.
 *
 * @param utcDateTimeString The UTC datetime string from the backend.
 * @param displayFormat The desired output format for display (date-fns format).
 * @returns The formatted local datetime string, or 'N/A'.
 */

export function displayUtcAsLocal(
  utcDateTimeString: string | null | undefined,
  displayFormat = 'yyyy-MM-dd HH:mm:ss' // MODIFIED: Default format changed
): string {
  if (!utcDateTimeString) {
    return 'N/A';
  }
  try {
    // 1. Parse the incoming naive string as if its numbers were already UTC.
    //    Appending 'Z' makes it an ISO UTC string.
    const dateRepresentingUtc = new Date(utcDateTimeString.replace(' ', 'T') + 'Z');

    if (isNaN(dateRepresentingUtc.getTime())) {
      console.warn('Invalid UTC date string from backend for display:', utcDateTimeString);
      return utcDateTimeString;
    }

    // 2. Get user's local IANA timezone name.
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 3. Use `toZonedTime` to get a Date object whose values represent local time in `userTimeZone`.
    const localDateRepresentation = toZonedTime(dateRepresentingUtc, userTimeZone);

    // 4. Format this local representation for display using the specified displayFormat.
    return format(localDateRepresentation, displayFormat);

  } catch (error) {
    console.error('Error formatting UTC date for display:', error, utcDateTimeString);
    return utcDateTimeString;
  }
}
