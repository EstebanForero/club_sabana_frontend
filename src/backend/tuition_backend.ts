import { BASE_URL, start_url, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tuition {
  id_tuition: Uuid;
  id_user: Uuid;
  amount: number;
  payment_date: string; // YYYY-MM-DD HH:MM:SS
}

export async function payTuition(amount: number, token: string): Promise<void> {
  await fetchJson(`${BASE_URL}/pay/${amount}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function listTuitions(): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${BASE_URL}`);
}

export async function listUserTuitions(userId: Uuid): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${BASE_URL}/${userId}`);
}

export async function hasActiveTuition(userId: Uuid): Promise<boolean> {
  return fetchJson<boolean>(`${BASE_URL}/active/${userId}`);
}
