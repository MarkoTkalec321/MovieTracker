import { API_KEY, BASE_URL } from "./config";

export const getShowGenres = async () => {
    try {
        const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error("Error fetching TV show genres", error);
        return [];
    }
};

// Fetch popular TV shows with pagination
export const getPopularShows = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular TV shows:", error);
        return [];
    }
};

// Fetch details for a specific TV show
export const getShowDetails = async (showId) => {
    try {
        const response = await fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching TV show details:", error);
        return null;
    }
};

// Search for TV shows with pagination
export const searchShows = async (query, page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error searching for TV shows:", error);
        return [];
    }
};

// Fetch TV shows by genres with pagination
export const getShowsByGenres = async (genreIds, page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreIds.join(",")}&page=${page}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching TV shows by genres:", error);
        return [];
    }
};