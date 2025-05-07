import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

// UserCategory here matches the one from entities::report
export interface ReportUserCategory { // Renamed to avoid conflict if another UserCategory type is used
  category_name: string;
  user_level: string;
}

export interface TrainingSummary {
  total_registrations: number; // u32 in Rust
  total_attendances: number;   // u32 in Rust
  most_recent_attendance: string | null; // NaiveDate in Rust
}

export interface TournamentSummary {
  total_registrations: number; // u32 in Rust
  total_attendances: number;   // u32 in Rust
  most_recent_attendance: string | null;   // NaiveDate in Rust
  most_recent_registration: string | null; // NaiveDate in Rust
}

export interface TuitionSummary {
  last_payment_amount: number; // f64 in Rust
  last_payment_date: string;   // NaiveDate in Rust
  days_until_next_payment: number; // i64 in Rust
  total_payments: number;      // f64 in Rust
}

export interface ReportUserRequest { // Renamed
  request_id: Uuid;
  requested_command: string;
  state: string;
}

export interface Report {
  full_name: string;
  email: string;
  phone_number: string;
  birth_date: string;        // NaiveDate in Rust
  registration_date: string; // NaiveDate in Rust
  categories: ReportUserCategory[];
  training_summary: TrainingSummary;
  tournament_summary: TournamentSummary;
  tuition_summary: TuitionSummary;
  requests: ReportUserRequest[];
}

const reportsBaseUrl = `${BASE_URL}/reports`;

export async function getUserReport(userId: Uuid): Promise<Report> {
  const url = `${reportsBaseUrl}/user/${userId}`;
  return fetchJson<Report>(url);
}
