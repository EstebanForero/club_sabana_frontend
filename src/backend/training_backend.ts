import { BASE_URL, Uuid } from './common';
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
  await fetchJson(`${BASE_URL}/trainings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(training),
  });
}

export async function listTrainings(): Promise<Training[]> {
  return fetchJson<Training[]>(`${BASE_URL}/trainings`);
}

export async function getTraining(id: Uuid): Promise<Training> {
  return fetchJson<Training>(`${BASE_URL}/trainings/${id}`);
}

export async function updateTraining(training: Training): Promise<void> {
  await fetchJson(`${BASE_URL}/trainings/${training.id_training}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(training),
  });
}

export async function deleteTraining(id: Uuid): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/trainings/${id}`, { method: 'DELETE' });
}

export async function registerUser(registration: TrainingRegistration): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/${registration.id_training}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export async function markAttendance(trainingId: Uuid, userId: Uuid, attended: boolean): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/trainings/${trainingId}/attendance/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attended),
  });
}

export async function getEligibleTrainings(userId: Uuid): Promise<Training[]> {
  return fetchJson<Training[]>(`${BASE_URL}/users/${userId}/eligible-trainings`);
}

export async function getUserTrainingRegistrations(userId: Uuid): Promise<TrainingRegistration[]> {
  return fetchJson<TrainingRegistration[]>(`${BASE_URL}/users/${userId}/training-registrations`);
}

export async function getTrainingRegistrations(trainingId: Uuid): Promise<TrainingRegistration[]> {
  return fetchJson<TrainingRegistration[]>(`${BASE_URL}/trainings/${trainingId}/registrations`);
}

export async function deleteTrainingRegistration(trainingId: Uuid, userId: Uuid): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/trainings/${trainingId}/registrations/${userId}`, {
    method: 'DELETE',
  });
}
