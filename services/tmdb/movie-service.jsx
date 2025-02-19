import { getGenres, getMoviesByGenres, getPopularMovies, searchMovies, getMovieDetails } from "../../lib/tmdb/movie";

export const fetchGenres = async () => {
  const fetchedGenres = await getGenres();
  return [{ id: -1, name: "All" }, ...fetchedGenres]; // Add "All" genre
};

export const fetchMovies = async (selectedGenres, page = 1) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getMoviesByGenres(selectedGenres, page); // Pass `page`
  } else {
    return await getPopularMovies(page); // Also pass `page` for popular movies
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

export const fetchMovieDetails = async (movieId) => {
  return await getMovieDetails(movieId);
};