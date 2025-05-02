import { Uuid, LevelName, BASE_URL } from './common';
import { fetchJson } from './utils';

export interface Category {
  id_category: Uuid;
  name: string;
  min_age: number;
  max_age: number;
}

export interface CategoryCreation {
  name: string;
  min_age: number;
  max_age: number;
}

export interface Level {
  level_name: LevelName;
}

export interface CategoryRequirement {
  id_category_requirement: Uuid;
  id_category: Uuid;
  requirement_description: string;
  required_level: LevelName;
}

export interface UserCategory {
  id_user: Uuid;
  id_category: Uuid;
  user_level: LevelName;
}

export async function createCategory(category: CategoryCreation): Promise<void> {
  await fetchJson(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
}

export async function listCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/categories`);
}

export async function updateCategory(category: Category): Promise<Category> {
  return fetchJson<Category>(`${BASE_URL}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
}

export async function getCategory(id: Uuid): Promise<Category> {
  return fetchJson<Category>(`${BASE_URL}/${id}`);
}

export async function deleteCategory(id: Uuid): Promise<string> {
  return fetchJson<string>(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
}

export async function addRequirement(requirement: CategoryRequirement): Promise<CategoryRequirement> {
  return fetchJson<CategoryRequirement>(`${BASE_URL}/categories/${requirement.id_category}/requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requirement),
  });
}

export type DeleteParams = {
  categoryId: Uuid,
  categoryReqId: Uuid
}

export async function deleteRequirement({ categoryId, categoryReqId }: DeleteParams) {
  fetch(`${BASE_URL}/categories/${categoryId}/requirements/${categoryReqId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getRequirements(categoryId: Uuid): Promise<CategoryRequirement[]> {
  return fetchJson<CategoryRequirement[]>(`${BASE_URL}/categories/${categoryId}/requirements`);
}

export async function getUserCategory(categoryId: Uuid, userId: Uuid): Promise<UserCategory | null> {
  return fetchJson<UserCategory | null>(`${BASE_URL}/categories/${categoryId}/users/${userId}`);
}

export async function getUserCategories(userId: Uuid): Promise<UserCategory[] | null> {
  return fetchJson<UserCategory[] | null>(`${BASE_URL}/categories/user/${userId}`);
}
