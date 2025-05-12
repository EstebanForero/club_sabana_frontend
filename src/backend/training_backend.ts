// src/backend/training_backend.ts
import { convertLocalToUtcString, displayUtcAsLocal } from '@/lib/utils';
import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Training {
  id_training: Uuid;
  name: string;
  id_category: Uuid;
  trainer_id: Uuid;
  start_datetime: string; // Will be local after fetch, UTC before send
  end_datetime: string;   // Will be local after fetch, UTC before send
  minimum_payment: number | null;
}

export interface TrainingCreationPayload {
  name: string;
  id_category: Uuid;
  trainer_id: Uuid;
  start_datetime: string; // Expects local datetime string from form
  end_datetime: string;   // Expects local datetime string from form
  minimum_payment?: number | null; // Keep optionality from original
  id_court?: Uuid;
}

export interface TrainingUpdatePayload {
  name: string;
  id_category: Uuid;
  trainer_id: Uuid;
  start_datetime: string; // Expects local datetime string from form
  end_datetime: string;   // Expects local datetime string from form
  minimum_payment?: number | null;
  id_court?: Uuid;
}

export interface TrainingRegistration {
  id_training: Uuid;
  id_user: Uuid;
  registration_datetime: string; // Will be local after fetch
  attended: boolean;
  attendance_datetime: string | null; // Will be local after fetch, if present
}

export interface TrainingRegistrationPayload {
  id_user: Uuid;
  // registration_datetime, attended, attendance_datetime are set/updated by backend
}

export interface MarkAttendancePayload {
  attended: boolean;
  // attendance_datetime is set by backend when attended is true
}

const trainingsBaseUrl = `${BASE_URL}/trainings`;

export async function createTraining(payload: TrainingCreationPayload): Promise<Training> {
  const utcPayload = {
    ...payload,
    start_datetime: convertLocalToUtcString(payload.start_datetime) ?? '',
    end_datetime: convertLocalToUtcString(payload.end_datetime) ?? '',
  };
  const createdTraining = await fetchJson<Training>(`${trainingsBaseUrl}`, {
    method: 'POST',
    body: JSON.stringify(utcPayload),
  });
  createdTraining.start_datetime = displayUtcAsLocal(createdTraining.start_datetime);
  createdTraining.end_datetime = displayUtcAsLocal(createdTraining.end_datetime);
  return createdTraining;
}

export async function listTrainings(): Promise<Training[]> {
  const trainings = await fetchJson<Training[]>(`${trainingsBaseUrl}`);
  return trainings.map(training => ({
    ...training,
    start_datetime: displayUtcAsLocal(training.start_datetime),
    end_datetime: displayUtcAsLocal(training.end_datetime),
  }));
}

export async function getTraining(idTraining: Uuid): Promise<Training> {
  const training = await fetchJson<Training>(`${trainingsBaseUrl}/${idTraining}`);
  return {
    ...training,
    start_datetime: displayUtcAsLocal(training.start_datetime),
    end_datetime: displayUtcAsLocal(training.end_datetime),
  };
}

export async function updateTraining(idTraining: Uuid, payload: TrainingUpdatePayload): Promise<Training> {
  console.log(JSON.stringify(payload))
  const utcPayload = {
    ...payload,
    start_datetime: convertLocalToUtcString(payload.start_datetime) ?? '',
    end_datetime: convertLocalToUtcString(payload.end_datetime) ?? '',
  };
  const updatedTraining = await fetchJson<Training>(`${trainingsBaseUrl}/${idTraining}`, {
    method: 'PUT',
    body: JSON.stringify(utcPayload),
  });
  updatedTraining.start_datetime = displayUtcAsLocal(updatedTraining.start_datetime);
  updatedTraining.end_datetime = displayUtcAsLocal(updatedTraining.end_datetime);
  return updatedTraining;
}

export async function deleteTraining(idTraining: Uuid): Promise<void> {
  await fetchJson<string>(`${trainingsBaseUrl}/${idTraining}`, { method: 'DELETE' });
}

export async function registerUserForTraining(idTraining: Uuid, payload: TrainingRegistrationPayload): Promise<TrainingRegistration> {
  const registration = await fetchJson<TrainingRegistration>(`${trainingsBaseUrl}/${idTraining}/register/${payload.id_user}`, {
    method: 'POST',
  });
  return {
    ...registration,
    registration_datetime: displayUtcAsLocal(registration.registration_datetime),
    attendance_datetime: registration.attendance_datetime ? displayUtcAsLocal(registration.attendance_datetime) : null,
  };
}

export async function markTrainingAttendance(trainingId: Uuid, userId: Uuid, payload: MarkAttendancePayload): Promise<void> {
  // This function might return the updated TrainingRegistration or just a success message.
  // Assuming it returns void based on your backend type (Promise<void> after fetchJson<string>).
  // If it returned TrainingRegistration, we'd convert dates here too.
  await fetchJson<string>(`${trainingsBaseUrl}/${trainingId}/attendance/${userId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEligibleTrainingsForUser(userId: Uuid): Promise<Training[]> {
  const trainings = await fetchJson<Training[]>(`${BASE_URL}/users/${userId}/eligible-trainings`);
  return trainings.map(training => ({
    ...training,
    start_datetime: displayUtcAsLocal(training.start_datetime),
    end_datetime: displayUtcAsLocal(training.end_datetime),
  }));
}

export async function getUserTrainingRegistrations(userId: Uuid): Promise<TrainingRegistration[]> {
  const registrations = await fetchJson<TrainingRegistration[]>(`${BASE_URL}/users/${userId}/training-registrations`);
  return registrations.map(reg => ({
    ...reg,
    registration_datetime: displayUtcAsLocal(reg.registration_datetime),
    attendance_datetime: reg.attendance_datetime ? displayUtcAsLocal(reg.attendance_datetime) : null,
  }));
}

export async function getTrainingRegistrations(trainingId: Uuid): Promise<TrainingRegistration[]> {
  const registrations = await fetchJson<TrainingRegistration[]>(`${trainingsBaseUrl}/${trainingId}/registrations`);
  return registrations.map(reg => ({
    ...reg,
    registration_datetime: displayUtcAsLocal(reg.registration_datetime),
    attendance_datetime: reg.attendance_datetime ? displayUtcAsLocal(reg.attendance_datetime) : null,
  }));
}

export async function deleteTrainingRegistration(trainingId: Uuid, userId: Uuid): Promise<void> {
  await fetchJson<string>(`${trainingsBaseUrl}/${trainingId}/registrations/${userId}`, {
    method: 'DELETE',
  });
}

export async function getTrainingsByTrainer(trainerId: Uuid): Promise<Training[]> {
  const trainings = await fetchJson<Training[]>(`${BASE_URL}/trainers/${trainerId}/trainings`);
  return trainings.map(training => ({
    ...training,
    start_datetime: displayUtcAsLocal(training.start_datetime),
    end_datetime: displayUtcAsLocal(training.end_datetime),
  }));
}
