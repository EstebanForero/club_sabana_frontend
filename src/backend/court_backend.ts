import { convertLocalToUtcString, displayUtcAsLocal } from '@/lib/utils';
import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Court {
  id_court: Uuid;
  court_name: string;
}

export interface CourtCreation {
  court_name: string;
}

export interface CourtReservation {
  id_court_reservation: Uuid;
  id_court: Uuid;
  start_reservation_datetime: string;
  end_reservation_datetime: string;
  id_training: Uuid | null;
  id_tournament: Uuid | null;
}

const courtsBaseUrl = `${BASE_URL}/courts`;
const reservationsBaseUrl = `${BASE_URL}/court-reservations`;

export async function createCourt(court: CourtCreation): Promise<Court> {
  return fetchJson<Court>(`${courtsBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(court),
  });
}

export async function listCourts(): Promise<Court[]> {
  return fetchJson<Court[]>(`${courtsBaseUrl}`);
}

export async function getCourt(idCourt: Uuid): Promise<Court> {
  return fetchJson<Court>(`${courtsBaseUrl}/${idCourt}`);
}

export async function deleteCourt(idCourt: Uuid): Promise<void> {
  await fetchJson<string>(`${courtsBaseUrl}/${idCourt}`, { method: 'DELETE' });
}

// Interface for parameters when fetching reservations
export interface GetCourtReservationsParams {
  // These filters will be sent as local time strings from the frontend
  // and converted to UTC before being appended to the URL.
  start_datetime_filter?: string; // User inputs local time
  end_datetime_filter?: string;   // User inputs local time
}

export async function getReservationsForCourt(
  idCourt: Uuid,
  params?: GetCourtReservationsParams
): Promise<CourtReservation[]> {
  const queryParams = new URLSearchParams();

  if (params?.start_datetime_filter) {
    const utcStart = convertLocalToUtcString(params.start_datetime_filter);
    if (utcStart) {
      queryParams.append('start_datetime_filter', utcStart);
    }
  }
  if (params?.end_datetime_filter) {
    const utcEnd = convertLocalToUtcString(params.end_datetime_filter);
    if (utcEnd) {
      queryParams.append('end_datetime_filter', utcEnd);
    }
  }

  const queryString = queryParams.toString();
  const url = `${courtsBaseUrl}/${idCourt}/reservations${queryString ? `?${queryString}` : ''}`;

  console.log("Requesting Reservations URL with UTC filters:", url);
  const reservations = await fetchJson<CourtReservation[]>(url);

  return reservations.map(reservation => ({
    ...reservation,
    start_reservation_datetime: displayUtcAsLocal(reservation.start_reservation_datetime),
    end_reservation_datetime: displayUtcAsLocal(reservation.end_reservation_datetime),
  }));
}

export async function getReservationByTrainingId(trainingId: Uuid): Promise<CourtReservation | null> {
  try {
    const reservation = await fetchJson<CourtReservation>(`${reservationsBaseUrl}/by-training/${trainingId}`);
    if (!reservation) return null; // If fetchJson can return null directly on 404
    return {
      ...reservation,
      start_reservation_datetime: displayUtcAsLocal(reservation.start_reservation_datetime),
      end_reservation_datetime: displayUtcAsLocal(reservation.end_reservation_datetime),
    };
  } catch (error: any) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getReservationByTournamentId(tournamentId: Uuid): Promise<CourtReservation | null> {
  try {
    const reservation = await fetchJson<CourtReservation>(`${reservationsBaseUrl}/by-tournament/${tournamentId}`);
    if (!reservation) return null;
    return {
      ...reservation,
      start_reservation_datetime: displayUtcAsLocal(reservation.start_reservation_datetime),
      end_reservation_datetime: displayUtcAsLocal(reservation.end_reservation_datetime),
    };
  } catch (error: any) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
}
