import { Uuid, IdType, URol, BASE_URL } from './common';
import { fetchJson } from './utils';

export interface User {
  id_user: Uuid;
  first_name: string;
  last_name: string;
  birth_date: string;      // YYYY-MM-DD
  registration_date: string; // YYYY-MM-DD HH:MM:SS
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
  birth_date: string;      // YYYY-MM-DD
  registration_date: string; // YYYY-MM-DD HH:MM:SS
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
  birth_date: string; // YYYY-MM-DD
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
  user_id: string,
  user_rol: URol,
  token: string
}

export async function registerUser(user: UserCreation): Promise<void> {
  await fetchJson(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function updateUser(user: UserCreation, userId: string): Promise<void> {
  await fetchJson(`${BASE_URL}/update/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}

export async function updateUserRol(userId: Uuid, userRol: URol): Promise<void> {
  await fetchJson(`${BASE_URL}/update/${userId}/role/${userRol}`, {
    method: 'PUT',
  });
}

export async function logInUser(logInInfo: UserLogInInfo): Promise<OnLogInInfo> {
  return fetchJson<OnLogInInfo>(`${BASE_URL}/logIn`, {
    method: 'POST',
    body: JSON.stringify(logInInfo),
  });
}

export async function getAllUsers(): Promise<UserInfo[]> {
  return fetchJson<UserInfo[]>(`${BASE_URL}/users`);
}

export async function getUserById(id: Uuid): Promise<UserInfo> {
  return fetchJson<UserInfo>(`${BASE_URL}/users/${id}`);
}
