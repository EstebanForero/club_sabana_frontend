import { AuthManager } from "./auth";

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {

  const token = AuthManager.getToken() ?? ''

  console.log('The url is: ', url)

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  let jsonResponse;

  try {
    jsonResponse = await response.json()
  } catch (error) {
    console.log("Catching error")
  }

  console.log(`The json response is: ${jsonResponse}`)

  return jsonResponse
}

export async function modifyInner<T>(promise: Promise<T>, middleWare: (value: T) => T): Promise<T> {
  try {
    const promiseValue = await promise
    return middleWare(promiseValue)
  } catch (error) {
    throw error
  }
}
