import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tuition {
  id_tuition: Uuid;
  id_user: Uuid;
  amount: number; // f64 in Rust
  payment_date: string; // YYYY-MM-DD HH:MM:SS
}

// For paying tuition, only amount is needed if user_id comes from auth token
// The backend endpoint /tuitions/pay/{amount} implies amount is a path param.
// If user_id is also needed and not from auth, the endpoint/payload would differ.
// Assuming user_id is from auth for payTuition.

const tuitionsBaseUrl = `${BASE_URL}/tuitions`;

// payTuition now returns the created Tuition object
export async function payTuition(amount: number): Promise<Tuition> { // Amount is a path param
  return fetchJson<Tuition>(`${tuitionsBaseUrl}/pay/${amount}`, {
    method: 'POST',
    // No body if amount is in path and user from auth.
  });
}

export async function listTuitions(): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${tuitionsBaseUrl}`);
}

export async function listUserTuitions(userId: Uuid): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${tuitionsBaseUrl}/${userId}`);
}

export async function hasActiveTuition(userId: Uuid): Promise<boolean> {
  return fetchJson<boolean>(`${tuitionsBaseUrl}/active/${userId}`);
}
