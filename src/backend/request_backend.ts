import { BASE_URL, base_url, start_url, Uuid } from './common';
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
  requested_command: string; // Title of the request, or main requesting function
  justification: string; // Information of the request.
}

const base_url = `${BASE_URL}/requests`

export async function createRequest(request: RequestCreation): Promise<void> {
  await fetchJson(`${base_url}`, {
    method: 'POST',
    body: JSON.stringify({
      ...request,
    }),
  });
}

export async function listRequests(): Promise<Request[]> {
  return fetchJson<Request[]>(`${base_url}`);
}

export async function getRequest(id: Uuid): Promise<Request> {
  return fetchJson<Request>(`${base_url}/${id}`);
}

export async function completeRequest(id: Uuid, approved: boolean, token: string): Promise<void> {
  await fetchJson(`${base_url}/${id}/complete/${approved}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function listUserRequests(userId: Uuid): Promise<Request[]> {
  return fetchJson<Request[]>(`${base_url}/user/${userId}`);
}

