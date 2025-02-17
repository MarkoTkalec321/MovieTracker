import { getGenres, getMoviesByGenres, getPopularMovies, searchMovies } from "../lib/api-tmdb/movie";

export const fetchGenres = async () => {
  const fetchedGenres = await getGenres();
  return [{ id: -1, name: "All" }, ...fetchedGenres]; // Add "All" genre
};

export const fetchMovies = async (selectedGenres) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getMoviesByGenres(selectedGenres);
  } else {
    return await getPopularMovies(); // Fetch popular movies if no genres are selected
  }
};

export const handleSearch = async (searchQuery) => {
  if (searchQuery) {
    const results = await searchMovies(searchQuery);
    return results.length === 0 ? { results: [], message: `Sorry, we couldn't find the title: ${searchQuery}` } : { results, message: "" };
  } else {
    return { results: await getPopularMovies(), message: "" }; // Reset to default movies if search query is empty
  }
};