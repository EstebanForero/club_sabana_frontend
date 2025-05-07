import { Uuid, IdType, URol, BASE_URL } from './common';
import { fetchJson } from './utils';

// User interface remains the same as it represents the full DB entity (including password)
// which might not be directly exposed or used in all frontend contexts.
export interface User {
  id_user: Uuid;
  first_name: string;
  last_name: string;
  birth_date: string; // YYYY-MM-DD
  registration_date: string; // YYYY-MM-DD HH:MM:SS
  email: string;
  email_verified: boolean;
  phone_number: string;
  country_code: string;
  password: string; // Sensitive, handle with care
  identification_number: string;
  identification_type: IdType;
  user_rol: URol;
}

// UserInfo is what's typically returned by GET requests (password omitted)
export interface UserInfo {
  id_user: Uuid;
  first_name: string;
  last_name: string;
  birth_date: string; // YYYY-MM-DD
  registration_date: string; // YYYY-MM-DD HH:MM:SS
  email: string;
  email_verified: boolean;
  phone_number: string;
  country_code: string;
  identification_number: string;
  identification_type: IdType;
  user_rol: URol;
}

// UserCreation remains largely the same for creating/updating user data
export interface UserCreation {
  first_name: string;
  last_name: string;
  birth_date: string; // YYYY-MM-DD
  email: string;
  phone_number: string;
  country_code: string;
  password: string; // For registration or password change
  identification_number: string;
  identification_type: IdType;
}

export interface UserLogInInfo {
  identifier: string;
  password: string;
}

// This matches the ApiLogInResponse from the backend
export interface OnLogInInfo {
  user_id: Uuid; // Changed from string to Uuid for consistency
  user_rol: URol;
  token: string;
}

export interface UpdateUserRolePayload {
  user_rol: URol;
}

export interface VerifyEmailPayload {
  code: string;
}


const usersBaseUrl = `${BASE_URL}/users`;

// registerUser now returns the created UserInfo
export async function registerUser(user: UserCreation): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/register`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

// updateUser now returns the updated UserInfo
export async function updateUser(userId: Uuid, userUpdate: UserCreation): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/${userId}`, { // Path updated
    method: 'PUT',
    body: JSON.stringify(userUpdate),
  });
}

// updateUserRol now returns the updated UserInfo
export async function updateUserRol(userId: Uuid, payload: UpdateUserRolePayload): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/${userId}/role`, { // Path updated
    method: 'PUT',
    body: JSON.stringify(payload), // Send payload in body
  });
}

export async function logInUser(logInInfo: UserLogInInfo): Promise<OnLogInInfo> {
  return fetchJson<OnLogInInfo>(`${usersBaseUrl}/login`, { // Path updated
    method: 'POST',
    body: JSON.stringify(logInInfo),
  });
}

export async function getAllUsers(): Promise<UserInfo[]> {
  return fetchJson<UserInfo[]>(`${usersBaseUrl}`);
}

export async function getUserById(id: Uuid): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/${id}`);
}

export async function verifyEmail(userId: Uuid, payload: VerifyEmailPayload): Promise<void> {
  await fetchJson(`${usersBaseUrl}/${userId}/verify-email`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
