import { API_KEY, BASE_URL } from "./config";

export async function fetchCredits(type, id) {
    try {
      const endpoint =
        type === "movie"
          ? `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
          : `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`;
  
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch credits for ${type} ${id}`);
      }
      const data = await response.json();
      // This object has shape { id, cast: [...], crew: [...] }
      return data.cast; // or return the full data if you also need crew
    } catch (error) {
      console.error("Error fetching credits:", error);
      throw error;
    }
  }