import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Tuition {
  id_tuition: Uuid;
  id_user: Uuid;
  amount: number;
  payment_date: string; // YYYY-MM-DD HH:MM:SS
}

const base_url = `${BASE_URL}/tuitions`

export async function payTuition(amount: number): Promise<void> {
  await fetchJson(`${base_url}/pay/${amount}`, {
    method: 'POST',
  });
}

export async function listTuitions(): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${base_url}`);
}

export async function listUserTuitions(userId: Uuid): Promise<Tuition[]> {
  return fetchJson<Tuition[]>(`${base_url}/${userId}`);
}

export async function hasActiveTuition(userId: Uuid): Promise<boolean> {
  return fetchJson<boolean>(`${base_url}/active/${userId}`);
}
