import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Training {
  id_training: Uuid;
  name: string;
  id_category: Uuid;
  trainer_id: Uuid; // Added
  start_datetime: string; // YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // YYYY-MM-DD HH:MM:SS
  minimum_payment: number | null; // Matches Option<f64>
}

// This DTO is sent to the backend for creation
export interface TrainingCreationPayload {
  name: string;
  id_category: Uuid;
  trainer_id: Uuid; // Added
  start_datetime: string;
  end_datetime: string;
  minimum_payment?: number | null; // Optional, matches Option<f64>
  id_court?: Uuid; // Optional court ID
}

// This DTO is sent to the backend for updates
export interface TrainingUpdatePayload {
  name: string;
  id_category: Uuid;
  trainer_id: Uuid; // Added
  start_datetime: string;
  end_datetime: string;
  minimum_payment?: number | null;
  id_court?: Uuid; // Optional court ID
}

export interface TrainingRegistration {
  id_training: Uuid;
  id_user: Uuid;
  registration_datetime: string; // YYYY-MM-DD HH:MM:SS
  attended: boolean;
  attendance_datetime: string | null;   // YYYY-MM-DD HH:MM:SS
}

// For registering, only user_id might be needed if id_training is in path
export interface TrainingRegistrationPayload {
  id_user: Uuid;
  // id_training will be part of the path
  // registration_datetime, attended, attendance_datetime are set by backend on creation/update
}

export interface MarkAttendancePayload {
  attended: boolean;
}

const trainingsBaseUrl = `${BASE_URL}/trainings`;

// createTraining now expects TrainingCreationPayload and returns the created Training
export async function createTraining(payload: TrainingCreationPayload): Promise<Training> {
  return fetchJson<Training>(`${trainingsBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listTrainings(): Promise<Training[]> {
  return fetchJson<Training[]>(`${trainingsBaseUrl}`);
}

export async function getTraining(idTraining: Uuid): Promise<Training> { // Renamed id to idTraining
  return fetchJson<Training>(`${trainingsBaseUrl}/${idTraining}`);
}

// updateTraining now expects TrainingUpdatePayload and returns the updated Training
export async function updateTraining(idTraining: Uuid, payload: TrainingUpdatePayload): Promise<Training> {
  return fetchJson<Training>(`${trainingsBaseUrl}/${idTraining}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteTraining(idTraining: Uuid): Promise<void> { // Backend returns string message
  await fetchJson<string>(`${trainingsBaseUrl}/${idTraining}`, { method: 'DELETE' });
}

// registerUserForTraining now returns the created TrainingRegistration
export async function registerUserForTraining(idTraining: Uuid, payload: TrainingRegistrationPayload): Promise<TrainingRegistration> {
  return fetchJson<TrainingRegistration>(`${trainingsBaseUrl}/${idTraining}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// markAttendance now expects a payload for 'attended'
export async function markTrainingAttendance(trainingId: Uuid, userId: Uuid, payload: MarkAttendancePayload): Promise<void> {
  await fetchJson<string>(`${trainingsBaseUrl}/${trainingId}/attendance/${userId}`, {
    method: 'POST',
    body: JSON.stringify(payload), // Send payload with attended status
  });
}

export async function getEligibleTrainingsForUser(userId: Uuid): Promise<Training[]> { // Renamed
  return fetchJson<Training[]>(`${BASE_URL}/users/${userId}/eligible-trainings`);
}

export async function getUserTrainingRegistrations(userId: Uuid): Promise<TrainingRegistration[]> {
  return fetchJson<TrainingRegistration[]>(`${BASE_URL}/users/${userId}/training-registrations`);
}

export async function getTrainingRegistrations(trainingId: Uuid): Promise<TrainingRegistration[]> {
  return fetchJson<TrainingRegistration[]>(`${trainingsBaseUrl}/${trainingId}/registrations`);
}

export async function deleteTrainingRegistration(trainingId: Uuid, userId: Uuid): Promise<void> { // Backend returns string message
  await fetchJson<string>(`${trainingsBaseUrl}/${trainingId}/registrations/${userId}`, {
    method: 'DELETE',
  });
}

export async function getTrainingsByTrainer(trainerId: Uuid): Promise<Training[]> {
  return fetchJson<Training[]>(`${BASE_URL}/trainers/${trainerId}/trainings`);
}
