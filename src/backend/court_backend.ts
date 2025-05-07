import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Court {
  id_court: Uuid;
  court_name: string;
}

export interface CourtCreation {
  court_name: string;
}

// CourtReservation interface might be useful if you fetch reservation details directly,
// though currently, they are mostly side-effects.
export interface CourtReservation {
  id_court_reservation: Uuid;
  id_court: Uuid;
  start_reservation_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_reservation_datetime: string;   // YYYY-MM-DD HH:MM:SS
  id_training: Uuid | null;
  id_tournament: Uuid | null;
}


const courtsBaseUrl = `${BASE_URL}/courts`;

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

export async function deleteCourt(idCourt: Uuid): Promise<void> { // Backend returns string message
  await fetchJson<string>(`${courtsBaseUrl}/${idCourt}`, { method: 'DELETE' });
}
