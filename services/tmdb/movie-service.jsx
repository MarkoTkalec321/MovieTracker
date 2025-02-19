import { getGenres, getMoviesByGenres, getPopularMovies, searchMovies, getMovieDetails } from "../../lib/tmdb/movie";

export const fetchGenres = async () => {
  const fetchedGenres = await getGenres();
  return [{ id: -1, name: "All" }, ...fetchedGenres];
};

export const fetchMovies = async (selectedGenres, page = 1) => {
  if (selectedGenres.length > 0 && !selectedGenres.includes(-1)) {
    return await getMoviesByGenres(selectedGenres, page);
  } else {
    return await getPopularMovies(page);
  }
};


export const handleSearch = async (searchQuery) => {
  if (searchQuery) {
    const results = await searchMovies(searchQuery);
    return results.length === 0 ? { results: [], message: `Sorry, we couldn't find the title: ${searchQuery}` } : { results, message: "" };
  } else {
    return { results: await getPopularMovies(), message: "" };
  }
};

export const fetchMovieDetails = async (movieId) => {
  return await getMovieDetails(movieId);
};