import { BASE_URL, Uuid } from './common';
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

const base_url = `${BASE_URL}/tournaments`;

export async function createTournament(tournament: TournamentCreation): Promise<void> {
  await fetchJson(`${base_url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tournament),
  });
}

export async function listTournaments(): Promise<Tournament[]> {
  return fetchJson<Tournament[]>(`${base_url}`);
}

export async function getTournament(id: Uuid): Promise<Tournament> {
  return fetchJson<Tournament>(`${base_url}/${id}`);
}

export async function updateTournament(tournament: Tournament): Promise<void> {
  await fetchJson(`${base_url}/${tournament.id_tournament}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tournament),
  });
}

export async function deleteTournament(id: Uuid): Promise<string> {
  return fetchJson<string>(`${base_url}/${id}`, { method: 'DELETE' });
}

export async function registerUser(registration: TournamentRegistration): Promise<string> {
  return fetchJson<string>(`${base_url}/${registration.id_tournament}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export async function recordAttendance(attendance: TournamentAttendance): Promise<string> {
  return fetchJson<string>(`${base_url}/${attendance.id_tournament}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendance),
  });
}

// Updates the position of a given user in the tournament
export async function updatePosition(tournamentId: Uuid, userId: Uuid, position: number): Promise<string> {
  return fetchJson<string>(`${base_url}/tournaments/${tournamentId}/position/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(position),
  });
}

export async function getEligibleTournaments(userId: Uuid): Promise<Tournament[]> {
  return fetchJson<Tournament[]>(`${base_url}/users/${userId}/eligible-tournaments`);
}

export async function getUserRegistrations(userId: Uuid): Promise<TournamentRegistration[]> {
  return fetchJson<TournamentRegistration[]>(`${base_url}/registrations/user/${userId}`);
}

export async function getTournamentRegistrations(tournamentId: Uuid): Promise<TournamentRegistration[]> {
  return fetchJson<TournamentRegistration[]>(`${base_url}/registrations/tournament/${tournamentId}`);
}

