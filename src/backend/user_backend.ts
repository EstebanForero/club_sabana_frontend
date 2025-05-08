import { Uuid, IdType, URol, BASE_URL } from './common';
import { fetchJson } from './utils';

export interface User {
  id_user: Uuid;
  first_name: string;
  last_name: string;
  birth_date: string;
  registration_date: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  country_code: string;
  password: string;
  identification_number: string;
  identification_type: IdType;
  user_rol: URol;
}

export interface UserInfo {
  id_user: Uuid;
  first_name: string;
  last_name: string;
  birth_date: string;
  registration_date: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  country_code: string;
  identification_number: string;
  identification_type: IdType;
  user_rol: URol;
}

export interface UserCreation {
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  phone_number: string;
  country_code: string;
  password: string;
  identification_number: string;
  identification_type: IdType;
}

export interface UserLogInInfo {
  identifier: string;
  password: string;
}

export interface OnLogInInfo {
  user_id: Uuid;
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

export async function registerUser(user: UserCreation): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/register`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function updateUser(userId: Uuid, userUpdate: UserCreation): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userUpdate),
  });
}

export async function updateUserRol(userId: Uuid, payload: UpdateUserRolePayload): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${usersBaseUrl}/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function logInUser(logInInfo: UserLogInInfo): Promise<OnLogInInfo> {
  return fetchJson<OnLogInInfo>(`${usersBaseUrl}/login`, {
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
