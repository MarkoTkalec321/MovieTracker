import { API_KEY, BASE_URL } from "./config";

export async function fetchPersonDetails(personId) {
    const response = await fetch(
      `${BASE_URL}/person/${personId}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch person details for ID: ${personId}`);
    }
    return await response.json();
}

export async function fetchPersonCredits(personId) {
    const response = await fetch(
      `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch person credits for ID: ${personId}`);
    }
    return await response.json();
}
  