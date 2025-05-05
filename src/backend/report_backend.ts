import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface UserCategory {
  category_name: string;
  user_level: string; // e.g., "BEGINNER", "AMATEUR", "PROFESSIONAL"
}

export interface TrainingSummary {
  total_registrations: number;
  total_attendances: number;
  most_recent_attendance: string | null;
}

export interface TournamentSummary {
  total_registrations: number;
  total_attendances: number;
  most_recent_attendance: string | null;
  most_recent_registration: string | null;
}

export interface TuitionSummary {
  last_payment_amount: number;
  last_payment_date: string;
  days_until_next_payment: number;
  total_payments: number;
}

export interface UserRequest {
  request_id: Uuid; // Uuid as string
  requested_command: string;
  state: string; // e.g., "PENDING", "APPROVED", "REJECTED"
}

export interface Report {
  full_name: string;
  email: string;
  phone_number: string;
  birth_date: string;
  registration_date: string;
  categories: UserCategory[];
  training_summary: TrainingSummary;
  tournament_summary: TournamentSummary;
  tuition_summary: TuitionSummary;
  requests: UserRequest[];
}

export async function getUserReport(userId: Uuid): Promise<Report> {
  const url = `${BASE_URL}/reports/user/${userId}`;
  return fetchJson<Report>(url);
}
