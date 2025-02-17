import { getShowGenres, getPopularShows, getShowDetails, searchShows, getShowsByGenres } from "../lib/api-tmdb/show";

// Fetch TV show genres (if available)
export const fetchShowGenres = async () => {
  // Assuming you have a function to fetch TV show genres
  const fetchedGenres = await getShowGenres(); // Replace with the actual function to fetch TV show genres
  return [{ id: -1, name: "All" }, ...fetchedGenres]; // Add "All" genre
};

// Fetch TV shows based on selected genres
export const fetchShows = async (selectedGenres) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getShowsByGenres(selectedGenres); // Fetch shows by selected genres
  } else {
    return await getPopularShows(); // Fetch popular shows if no genres are selected
  }
};

// Handle TV show search
export const handleShowSearch = async (searchQuery) => {
  if (searchQuery) {
    const results = await searchShows(searchQuery); // Search for TV shows
    return results.length === 0
      ? { results: [], message: `Sorry, we couldn't find the TV show: ${searchQuery}` }
      : { results, message: "" };
  } else {
    return { results: await getPopularShows(), message: "" }; // Reset to default shows if search query is empty
  }
};

// Fetch details for a specific TV show
export const fetchShowDetails = async (showId) => {
  const details = await getShowDetails(showId); // Fetch TV show details
  return details;
};