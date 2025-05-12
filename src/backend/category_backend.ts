import { Uuid, LevelName, BASE_URL } from './common';
import { fetchJson } from './utils';

export interface Category {
  id_category: Uuid;
  name: string;
  min_age: number; // Rust uses i32, TS number is fine
  max_age: number; // Rust uses i32, TS number is fine
}

export interface CategoryCreation {
  name: string;
  min_age: number;
  max_age: number;
}

export interface Level { // This seems to match the Rust Level struct
  level_name: LevelName;
}

export interface CategoryRequirement {
  id_category_requirement: Uuid;
  id_category: Uuid;
  requirement_description: string; // Rust String
  required_level: LevelName;
}

export interface UserCategory { // This matches the Rust UserCategory in entities::user
  id_user: Uuid;
  id_category: Uuid;
  user_level: LevelName;
}

// Note: The UserCategory in entities::report is different. If you need that too, define it separately.

const categoriesBaseUrl = `${BASE_URL}/categories`;

export async function createCategory(category: CategoryCreation): Promise<void> { // Backend returns 200 OK with string
  await fetchJson(`${categoriesBaseUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
}

export async function listCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${categoriesBaseUrl}`);
}

export async function updateCategory(category: Category): Promise<Category> { // Backend returns the updated category
  return fetchJson<Category>(`${categoriesBaseUrl}`, { // Endpoint for update is just /categories with PUT
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
}

export async function getCategory(id: Uuid): Promise<Category> {
  return fetchJson<Category>(`${categoriesBaseUrl}/${id}`);
}

export async function deleteCategory(id: Uuid): Promise<string> { // Backend returns a string message
  return fetchJson<string>(`${categoriesBaseUrl}/${id}`, { method: 'DELETE' });
}

export async function addRequirement(requirement: CategoryRequirement): Promise<CategoryRequirement> { // Backend returns the added requirement
  return fetchJson<CategoryRequirement>(`${categoriesBaseUrl}/${requirement.id_category}/requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requirement),
  });
}

export type DeleteRequirementParams = { // Renamed for clarity
  categoryId: Uuid,
  requirementId: Uuid // Renamed for clarity
}

export async function deleteRequirement({ categoryId, requirementId }: DeleteRequirementParams): Promise<void> { // Backend returns 200 OK (empty or message)
  await fetchJson(`${categoriesBaseUrl}/${categoryId}/requirements/${requirementId}`, {
    method: 'DELETE',
    // No body needed for DELETE if IDs are in path
  });
}

export async function getRequirements(categoryId: Uuid): Promise<CategoryRequirement[]> {
  return fetchJson<CategoryRequirement[]>(`${categoriesBaseUrl}/${categoryId}/requirements`);
}

export async function getUserCategory(categoryId: Uuid, userId: Uuid): Promise<UserCategory | null> {
  return fetchJson<UserCategory | null>(`${categoriesBaseUrl}/${categoryId}/users/${userId}`);
}

export async function getUserCategories(userId: Uuid): Promise<UserCategory[] | null> { // Backend returns Vec<UserCategory>
  return fetchJson<UserCategory[] | null>(`${categoriesBaseUrl}/user/${userId}`);
}


export async function registerUserInCategory(categoryId: Uuid, userId: Uuid): Promise<void> { // Backend returns 200 OK with string
  await fetchJson<string>(`${categoriesBaseUrl}/${categoryId}/users/${userId}`, {
    method: 'POST',
  });
}

export async function checkUserEligibility(categoryId: Uuid, userId: Uuid): Promise<boolean> { // Backend returns Json<bool>
  // The backend returns Json(true) on success, or an error.
  // fetchJson will throw on error status codes. If it resolves, eligibility is true.
  // This might need adjustment based on how fetchJson handles non-JSON "true" responses.
  // Assuming fetchJson can parse a simple `true` boolean response.
  try {
    await fetchJson<boolean>(`${categoriesBaseUrl}/${categoryId}/users/${userId}/eligible`);
    return true; // If fetchJson resolves without error (e.g. 200 OK), it's eligible
  } catch (error) {
    // Handle specific error types if needed, otherwise assume not eligible or error.
    // Depending on backend, a 4xx error might mean not eligible.
    console.error("Eligibility check failed or user not eligible:", error);
    return false;
  }
}

export async function updateUserCategoryLevel(
  categoryId: Uuid,
  userId: Uuid,
  levelName: LevelName
): Promise<void> {
  const url = `${categoriesBaseUrl}/${categoryId}/user/${userId}/level/${levelName}`;

  await fetchJson<string>(url, {
    method: 'PUT',
  });
}
