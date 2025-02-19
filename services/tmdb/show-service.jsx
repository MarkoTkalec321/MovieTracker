import { getShowGenres, getPopularShows, getShowDetails, searchShows, getShowsByGenres } from "../../lib/tmdb/show";

export const fetchShowGenres = async () => {
  const fetchedGenres = await getShowGenres();
  return [{ id: -1, name: "All" }, ...fetchedGenres];
};

export const fetchShows = async (selectedGenres, page = 1) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getShowsByGenres(selectedGenres, page);
  } else {
    return await getPopularShows(page);
  }
};

export const handleShowSearch = async (searchQuery, page = 1) => {
  if (searchQuery) {
    const results = await searchShows(searchQuery, page);
    return results.length === 0
      ? { results: [], message: `Sorry, we couldn't find the TV show: ${searchQuery}` }
      : { results, message: "" };
  } else {
    return { results: await getPopularShows(page), message: "" };
  }
};

export const fetchShowDetails = async (showId) => {
  return await getShowDetails(showId);
};