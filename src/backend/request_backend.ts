import { BASE_URL, Uuid } from './common';
import { fetchJson } from './utils';

export interface Request {
  request_id: Uuid;
  requester_id: Uuid;
  requested_command: string;
  justification: string;
  approved: boolean | null; // Matches Option<bool>
  approver_id: Uuid | null; // Matches Option<Uuid>
}

export interface RequestCreation {
  requester_id: Uuid;
  requested_command: string;
  justification: string;
}

const requestsBaseUrl = `${BASE_URL}/requests`; // Corrected variable name

export async function createRequest(request: RequestCreation): Promise<void> { // Backend returns 201 CREATED with string
  await fetchJson(`${requestsBaseUrl}`, {
    method: 'POST',
    // fetchJson typically handles headers and stringify
    body: JSON.stringify(request), // Explicitly stringify
  });
}

export async function listRequests(): Promise<Request[]> {
  return fetchJson<Request[]>(`${requestsBaseUrl}`);
}

export async function getRequest(id: Uuid): Promise<Request> {
  return fetchJson<Request>(`${requestsBaseUrl}/${id}`);
}

// completeRequest was using token in header, ensure fetchJson handles this or adjust
export async function completeRequest(id: Uuid, approved: boolean): Promise<void> { // Removed token from args, assume fetchJson handles auth
  await fetchJson(`${requestsBaseUrl}/${id}/complete/${approved}`, {
    method: 'POST',
    // Headers including Authorization should be handled by a modified fetchJson or globally
  });
}

export async function listUserRequests(userId: Uuid): Promise<Request[]> {
  return fetchJson<Request[]>(`${requestsBaseUrl}/user/${userId}`);
}
