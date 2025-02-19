import { getShowGenres, getPopularShows, getShowDetails, searchShows, getShowsByGenres } from "../../lib/tmdb/show";

// Fetch TV show genres
export const fetchShowGenres = async () => {
  const fetchedGenres = await getShowGenres();
  return [{ id: -1, name: "All" }, ...fetchedGenres]; // Add "All" genre
};

// Fetch TV shows with paging support
export const fetchShows = async (selectedGenres, page = 1) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getShowsByGenres(selectedGenres, page); // Pass `page`
  } else {
    return await getPopularShows(page); // Fetch paginated popular shows
  }
};

// Handle TV show search with paging
export const handleShowSearch = async (searchQuery, page = 1) => {
  if (searchQuery) {
    const results = await searchShows(searchQuery, page);
    return results.length === 0
      ? { results: [], message: `Sorry, we couldn't find the TV show: ${searchQuery}` }
      : { results, message: "" };
  } else {
    return { results: await getPopularShows(page), message: "" }; // Reset to default shows if search query is empty
  }
};

// Fetch details for a specific TV show
export const fetchShowDetails = async (showId) => {
  return await getShowDetails(showId);
};