import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tournament {
  id_tournament: Uuid;
  name: string;
  id_category: Uuid;
  start_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // YYYY-MM-DD HH:MM:SS
}

// This DTO is sent to the backend for creation
export interface TournamentCreationPayload {
  name: string;
  id_category: Uuid;
  start_datetime: string;
  end_datetime: string;
  id_court?: Uuid; // Optional court ID
}

// This DTO is sent to the backend for updates
export interface TournamentUpdatePayload {
  name: string;
  id_category: Uuid;
  start_datetime: string;
  end_datetime: string;
  id_court?: Uuid; // Optional court ID
}


export interface TournamentRegistration {
  id_tournament: Uuid;
  id_user: Uuid;
  registration_datetime: string; // YYYY-MM-DD HH:MM:SS
}

// For registering, only user_id might be needed in payload if id_tournament is in path
export interface TournamentRegistrationPayload {
  id_user: Uuid;
  // registration_datetime is set by backend
}


export interface TournamentAttendance {
  id_tournament: Uuid;
  id_user: Uuid;
  attendance_datetime: string; // YYYY-MM-DD HH:MM:SS
  position: number; // i32 in Rust
}

// For recording attendance, user_id and position are needed in payload if id_tournament is in path
export interface TournamentAttendancePayload {
  id_user: Uuid;
  position: number;
  // attendance_datetime is set by backend
}

export interface UpdatePositionPayload {
  position: number;
}


const tournamentsBaseUrl = `${BASE_URL}/tournaments`;

// createTournament now expects TournamentCreationPayload and returns the created Tournament
export async function createTournament(payload: TournamentCreationPayload): Promise<Tournament> {
  return fetchJson<Tournament>(`${tournamentsBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listTournaments(): Promise<Tournament[]> {
  return fetchJson<Tournament[]>(`${tournamentsBaseUrl}`);
}

export async function getTournament(idTournament: Uuid): Promise<Tournament> { // Renamed id to idTournament
  return fetchJson<Tournament>(`${tournamentsBaseUrl}/${idTournament}`);
}

// updateTournament now expects TournamentUpdatePayload and returns the updated Tournament
export async function updateTournament(idTournament: Uuid, payload: TournamentUpdatePayload): Promise<Tournament> {
  return fetchJson<Tournament>(`${tournamentsBaseUrl}/${idTournament}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteTournament(idTournament: Uuid): Promise<void> { // Backend returns string message
  await fetchJson<string>(`${tournamentsBaseUrl}/${idTournament}`, { method: 'DELETE' });
}

// registerUser (for tournament) now returns the created TournamentRegistration
export async function registerUserForTournament(idTournament: Uuid, payload: TournamentRegistrationPayload): Promise<TournamentRegistration> {
  return fetchJson<TournamentRegistration>(`${tournamentsBaseUrl}/${idTournament}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// recordAttendance now returns the created TournamentAttendance
export async function recordTournamentAttendance(idTournament: Uuid, payload: TournamentAttendancePayload): Promise<TournamentAttendance> {
  return fetchJson<TournamentAttendance>(`${tournamentsBaseUrl}/${idTournament}/attendance`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// updatePosition now expects only position in the body
export async function updateTournamentPosition(tournamentId: Uuid, userId: Uuid, payload: UpdatePositionPayload): Promise<void> {
  await fetchJson<string>(`${tournamentsBaseUrl}/${tournamentId}/users/${userId}/position`, {
    method: 'PUT',
    body: JSON.stringify(payload), // Send only the position as per backend
  });
}

export async function getEligibleTournamentsForUser(userId: Uuid): Promise<Tournament[]> { // Renamed
  return fetchJson<Tournament[]>(`${BASE_URL}/users/${userId}/eligible-tournaments`); // Path updated
}

export async function getUserTournamentRegistrations(userId: Uuid): Promise<TournamentRegistration[]> { // Renamed and path updated
  return fetchJson<TournamentRegistration[]>(`${tournamentsBaseUrl}/registrations/user/${userId}`);
}

export async function getTournamentRegistrations(tournamentId: Uuid): Promise<TournamentRegistration[]> {
  return fetchJson<TournamentRegistration[]>(`${tournamentsBaseUrl}/registrations/tournament/${tournamentId}`);
}

export async function getTournamentAttendanceList( // Renamed
  tournamentId: Uuid
): Promise<TournamentAttendance[]> {
  return fetchJson<TournamentAttendance[]>(
    `${tournamentsBaseUrl}/${tournamentId}/attendance`
  );
}

export async function getUserTournamentAttendanceList( // Renamed
  userId: Uuid
): Promise<TournamentAttendance[]> {
  return fetchJson<TournamentAttendance[]>(
    `${BASE_URL}/users/${userId}/tournament-attendance` // Path updated
  );
}

export async function deleteUserAttendanceFromTournament( // Renamed
  tournamentId: Uuid,
  userId: Uuid
): Promise<void> { // Backend returns string message
  await fetchJson<string>(
    `${tournamentsBaseUrl}/${tournamentId}/attendance/${userId}`,
    { method: "DELETE" }
  );
}

export async function deleteUserRegistrationFromTournament( // Renamed
  tournamentId: Uuid,
  userId: Uuid
): Promise<void> { // Backend returns string message
  await fetchJson<string>(
    `${tournamentsBaseUrl}/${tournamentId}/registrations/${userId}`,
    { method: "DELETE" }
  );
}
