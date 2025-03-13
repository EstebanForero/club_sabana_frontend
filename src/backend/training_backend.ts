import { BASE_URL, start_url, Uuid } from './common';
import { fetchJson } from './utils';

export interface Training {
  id_training: Uuid;
  name: string;
  id_category: Uuid;
  start_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // YYYY-MM-DD HH:MM:SS
  minimum_payment: number;
}

export interface TrainingCreation {
  name: string;
  id_category: Uuid;
  start_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // YYYY-MM-DD HH:MM:SS
  minimum_payment: number;
}

export interface TrainingRegistration {
  id_training: Uuid;
  id_user: Uuid;
  registration_datetime: string; // YYYY-MM-DD HH:MM:SS
  attended: boolean;
  attendance_datetime: string;   // YYYY-MM-DD HH:MM:SS
}

export async function createTraining(training: TrainingCreation): Promise<void> {
  await fetchJson(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(training),
  });
}

export async function listTrainings(): Promise<Training[]> {
  return fetchJson<Training[]>(`${BASE_URL}`);
}

export async function getTraining(id: Uuid): Promise<Training> {
  return fetchJson<Training>(`${BASE_URL}/${id}`);
}

export async function updateTraining(training: Training): Promise<void> {
  await fetchJson(`${BASE_URL}/${training.id_training}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(training),
  });
}

export async function deleteTraining(id: Uuid): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

export async function registerUser(registration: TrainingRegistration): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${registration.id_training}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export async function markAttendance(trainingId: Uuid, userId: Uuid, attended: boolean): Promise<string> {
  return fetchJson<string>(`/trainings/${trainingId}/attendance/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attended),
  });
}

export async function getEligibleTrainings(userId: Uuid): Promise<Training[]> {
  return fetchJson<Training[]>(`/users/${userId}/eligible-trainings`);
}
