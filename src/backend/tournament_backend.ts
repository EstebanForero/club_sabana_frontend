import { convertLocalToUtcString, displayUtcAsLocal, getCurrentLocalDateTimeString } from '@/lib/utils'; // Assuming getCurrentLocalDateTimeString is for local defaults if needed elsewhere
import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tournament {
  id_tournament: Uuid;
  name: string;
  id_category: Uuid;
  start_datetime: string; // Will be local after fetch, UTC before send
  end_datetime: string;   // Will be local after fetch, UTC before send
}

export interface TournamentCreationPayload {
  name: string;
  id_category: Uuid;
  start_datetime: string; // Expects UTC string from caller
  end_datetime: string;   // Expects UTC string from caller
  id_court?: Uuid;
}

export interface TournamentUpdatePayload {
  name: string;
  id_category: Uuid;
  start_datetime: string; // Expects UTC string from caller
  end_datetime: string;   // Expects UTC string from caller
  id_court?: Uuid;
}

export interface TournamentRegistration {
  id_tournament: Uuid;
  id_user: Uuid;
  registration_datetime: string; // Will be local after fetch
}

export interface TournamentRegistrationPayload {
  id_user: Uuid;
  // registration_datetime is set by backend
}

export interface TournamentAttendance {
  id_tournament: Uuid;
  id_user: Uuid;
  attendance_datetime: string; // Will be local after fetch
  position: number;
}

export interface TournamentAttendancePayload {
  id_user: Uuid;
  position: number;
  // attendance_datetime is set by backend
}

export interface UpdatePositionPayload {
  position: number;
}

const tournamentsBaseUrl = `${BASE_URL}/tournaments`;

// --- Tournament CRUD ---
export async function createTournament(payload: TournamentCreationPayload): Promise<Tournament> {
  const utcPayload = {
    ...payload,
    start_datetime: convertLocalToUtcString(payload.start_datetime) ?? '',
    end_datetime: convertLocalToUtcString(payload.end_datetime) ?? '',
  };
  const createdTournament = await fetchJson<Tournament>(`${tournamentsBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(utcPayload),
  });
  // Convert datetimes to local for immediate use by frontend
  createdTournament.start_datetime = displayUtcAsLocal(createdTournament.start_datetime);
  createdTournament.end_datetime = displayUtcAsLocal(createdTournament.end_datetime);
  return createdTournament;
}

export async function listTournaments(): Promise<Tournament[]> {
  const tournaments = await fetchJson<Tournament[]>(`${tournamentsBaseUrl}`);
  return tournaments.map(tournament => ({
    ...tournament,
    start_datetime: displayUtcAsLocal(tournament.start_datetime),
    end_datetime: displayUtcAsLocal(tournament.end_datetime),
  }));
}

export async function getTournament(idTournament: Uuid): Promise<Tournament> {
  const tournament = await fetchJson<Tournament>(`${tournamentsBaseUrl}/${idTournament}`);
  return {
    ...tournament,
    start_datetime: displayUtcAsLocal(tournament.start_datetime),
    end_datetime: displayUtcAsLocal(tournament.end_datetime),
  };
}

export async function updateTournament(idTournament: Uuid, payload: TournamentUpdatePayload): Promise<Tournament> {
  const utcPayload = {
    ...payload,
    start_datetime: convertLocalToUtcString(payload.start_datetime) ?? '',
    end_datetime: convertLocalToUtcString(payload.end_datetime) ?? '',
  };
  const updatedTournament = await fetchJson<Tournament>(`${tournamentsBaseUrl}/${idTournament}`, {
    method: 'PUT',
    body: JSON.stringify(utcPayload),
  });
  // Convert datetimes to local for immediate use by frontend
  updatedTournament.start_datetime = displayUtcAsLocal(updatedTournament.start_datetime);
  updatedTournament.end_datetime = displayUtcAsLocal(updatedTournament.end_datetime);
  return updatedTournament;
}

export async function deleteTournament(idTournament: Uuid): Promise<void> {
  await fetchJson<string>(`${tournamentsBaseUrl}/${idTournament}`, { method: 'DELETE' });
}

// --- Registration Related ---
// For registering, the payload doesn't contain dates. Backend sets registration_datetime.
// The returned TournamentRegistration will have its datetime converted.
export async function registerUserForTournament(idTournament: Uuid, payload: TournamentRegistrationPayload): Promise<TournamentRegistration> {
  const registration = await fetchJson<TournamentRegistration>(`${tournamentsBaseUrl}/${idTournament}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return {
    ...registration,
    registration_datetime: displayUtcAsLocal(registration.registration_datetime),
  };
}

export async function getUserTournamentRegistrations(userId: Uuid): Promise<TournamentRegistration[]> {
  const registrations = await fetchJson<TournamentRegistration[]>(`${tournamentsBaseUrl}/registrations/user/${userId}`);
  return registrations.map(reg => ({
    ...reg,
    registration_datetime: displayUtcAsLocal(reg.registration_datetime),
  }));
}

export async function getTournamentRegistrations(tournamentId: Uuid): Promise<TournamentRegistration[]> {
  const registrations = await fetchJson<TournamentRegistration[]>(`${tournamentsBaseUrl}/registrations/tournament/${tournamentId}`);
  return registrations.map(reg => ({
    ...reg,
    registration_datetime: displayUtcAsLocal(reg.registration_datetime),
  }));
}

export async function deleteUserRegistrationFromTournament(tournamentId: Uuid, userId: Uuid): Promise<void> {
  await fetchJson<string>(`${tournamentsBaseUrl}/${tournamentId}/registrations/${userId}`, { method: "DELETE" });
}


// --- Attendance Related ---
// For recording attendance, the payload doesn't contain dates. Backend sets attendance_datetime.
// The returned TournamentAttendance will have its datetime converted.
export async function recordTournamentAttendance(idTournament: Uuid, payload: TournamentAttendancePayload): Promise<TournamentAttendance> {
  const attendance = await fetchJson<TournamentAttendance>(`${tournamentsBaseUrl}/${idTournament}/attendance`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return {
    ...attendance,
    attendance_datetime: displayUtcAsLocal(attendance.attendance_datetime),
  };
}

export async function getTournamentAttendanceList(tournamentId: Uuid): Promise<TournamentAttendance[]> {
  const attendances = await fetchJson<TournamentAttendance[]>(`${tournamentsBaseUrl}/${tournamentId}/attendance`);
  return attendances.map(att => ({
    ...att,
    attendance_datetime: displayUtcAsLocal(att.attendance_datetime),
  }));
}

export async function getUserTournamentAttendanceList(userId: Uuid): Promise<TournamentAttendance[]> {
  const attendances = await fetchJson<TournamentAttendance[]>(`${BASE_URL}/users/${userId}/tournament-attendance`);
  return attendances.map(att => ({
    ...att,
    attendance_datetime: displayUtcAsLocal(att.attendance_datetime),
  }));
}

export async function deleteUserAttendanceFromTournament(tournamentId: Uuid, userId: Uuid): Promise<void> {
  await fetchJson<string>(`${tournamentsBaseUrl}/${tournamentId}/attendance/${userId}`, { method: "DELETE" });
}

// --- Other Tournament Functions (no direct datetimes in their primary returned object or payload to convert here) ---
export async function updateTournamentPosition(tournamentId: Uuid, userId: Uuid, payload: UpdatePositionPayload): Promise<void> {
  await fetchJson<string>(`${tournamentsBaseUrl}/${tournamentId}/users/${userId}/position`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getEligibleTournamentsForUser(userId: Uuid): Promise<Tournament[]> {
  // This function returns Tournament[], which will be handled by listTournaments' mapping if called indirectly,
  // or needs its own mapping if called directly and the result is used.
  // Assuming the raw data from this endpoint has UTC strings for start/end_datetime.
  const tournaments = await fetchJson<Tournament[]>(`${BASE_URL}/users/${userId}/eligible-tournaments`);
  return tournaments.map(tournament => ({
    ...tournament,
    start_datetime: displayUtcAsLocal(tournament.start_datetime),
    end_datetime: displayUtcAsLocal(tournament.end_datetime),
  }));
}
