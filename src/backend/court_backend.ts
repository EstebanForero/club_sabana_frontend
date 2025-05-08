import { BASE_URL, Uuid } from './common'; // Added string
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

export interface GetCourtReservationsParams {
  start_datetime_filter?: string;
  end_datetime_filter?: string;
}

export async function getReservationsForCourt(
  idCourt: Uuid,
  params?: GetCourtReservationsParams
): Promise<CourtReservation[]> {
  const queryParams = new URLSearchParams();

  if (params?.start_datetime_filter) {
    queryParams.append('start_datetime_filter', params.start_datetime_filter);
  }
  if (params?.end_datetime_filter) {
    queryParams.append('end_datetime_filter', params.end_datetime_filter);
  }

  const queryString = queryParams.toString();
  const url = `${courtsBaseUrl}/${idCourt}/reservations${queryString ? `?${queryString}` : ''}`;

  console.log("Requesting URL:", url);
  return fetchJson<CourtReservation[]>(url);
}


// --- New Functions ---

/**
 * Fetches the specific court reservation associated with a training ID.
 * Returns null if no reservation exists or if the fetch fails with a 404.
 * Throws for other errors.
 */
export async function getReservationByTrainingId(trainingId: Uuid): Promise<CourtReservation | null> {
  try {
    return await fetchJson<CourtReservation>(`${reservationsBaseUrl}/by-training/${trainingId}`);
  } catch (error: any) {
    if (error?.status === 404) { // Assuming fetchJson throws an error object with status
      return null;
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Fetches the specific court reservation associated with a tournament ID.
 * Returns null if no reservation exists or if the fetch fails with a 404.
 * Throws for other errors.
 */
export async function getReservationByTournamentId(tournamentId: Uuid): Promise<CourtReservation | null> {
  try {
    return await fetchJson<CourtReservation>(`${reservationsBaseUrl}/by-tournament/${tournamentId}`);
  } catch (error: any) {
    if (error?.status === 404) { // Assuming fetchJson throws an error object with status
      return null;
    }
    throw error; // Re-throw other errors
  }
}
