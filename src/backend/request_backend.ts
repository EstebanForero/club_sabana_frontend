import { BASE_URL, start_url, Uuid } from './common';
import { fetchJson } from './utils';

export interface Request {
  id: Uuid;
  requester_id: Uuid;
  requested_command: string;
  justification: string;
  approved: boolean | null;
  approver_id: Uuid | null;
}

export interface RequestCreation {
  requester_id: Uuid;
  requested_command: string;
  justification: string;
}

export async function createRequest(request: RequestCreation): Promise<void> {
  await fetchJson(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...request,
    }),
  });
}

export async function listRequests(): Promise<Request[]> {
  return fetchJson<Request[]>(`${BASE_URL}`);
}

export async function getRequest(id: Uuid): Promise<Request> {
  return fetchJson<Request>(`${BASE_URL}/${id}`);
}

export async function completeRequest(id: Uuid, approved: boolean, token: string): Promise<void> {
  await fetchJson(`${BASE_URL}/${id}/complete/${approved}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function listUserRequests(userId: Uuid): Promise<Request[]> {
  return fetchJson<Request[]>(`${BASE_URL}/user/${userId}`);
}
