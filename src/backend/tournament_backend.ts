import { start_url, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tournament {
  id_tournament: Uuid;
  name: string;
  id_category: Uuid;
  start_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // YYYY-MM-DD HH:MM:SS
}

export interface TournamentCreation {
  name: string;
  id_category: Uuid;
  start_datetime: string;
  end_datetime: string;
}

export interface TournamentRegistration {
  id_tournament: Uuid;
  id_user: Uuid;
  registration_datetime: string; // YYYY-MM-DD HH:MM:SS
}

export interface TournamentAttendance {
  id_tournament: Uuid;
  id_user: Uuid;
  attendance_datetime: string; // YYYY-MM-DD HH:MM:SS
  position: number;
}

const BASE_URL = `${start_url}/tournaments`;

export async function createTournament(tournament: TournamentCreation): Promise<void> {
  await fetchJson(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tournament),
  });
}

export async function listTournaments(): Promise<Tournament[]> {
  return fetchJson<Tournament[]>(`${BASE_URL}`);
}

export async function getTournament(id: Uuid): Promise<Tournament> {
  return fetchJson<Tournament>(`${BASE_URL}/${id}`);
}

export async function updateTournament(tournament: Tournament): Promise<void> {
  await fetchJson(`${BASE_URL}/${tournament.id_tournament}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tournament),
  });
}

export async function deleteTournament(id: Uuid): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

export async function registerUser(registration: TournamentRegistration): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${registration.id_tournament}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export async function recordAttendance(attendance: TournamentAttendance): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${attendance.id_tournament}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendance),
  });
}

export async function updatePosition(tournamentId: Uuid, userId: Uuid, position: number): Promise<string> {
  return fetchJson<string>(`/tournaments/${tournamentId}/position/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(position),
  });
}

export async function getEligibleTournaments(userId: Uuid): Promise<Tournament[]> {
  return fetchJson<Tournament[]>(`/users/${userId}/eligible-tournaments`);
}
