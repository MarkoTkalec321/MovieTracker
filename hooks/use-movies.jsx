import { useState, useEffect } from "react";
import { fetchGenres, fetchMovies, handleSearch } from "../services/movie-service";

export const useMovies = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  // Fetch genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      const genres = await fetchGenres();
      setGenres(genres);
    };
    loadGenres();
  }, []);

  // Fetch movies when selected genres change
  useEffect(() => {
    if (!searchQuery) {
      const loadMovies = async () => {
        const movies = await fetchMovies(selectedGenres);
        setMovies(movies);
      };
      loadMovies();
    }
  }, [selectedGenres]);

  // Handle search
  const onSearch = async () => {
    const { results, message } = await handleSearch(searchQuery);
    setMovies(results);
    setNoResultsMessage(message);
  };

  // Clear search query and reset movies
  const clearSearch = () => {
    setSearchQuery("");
    fetchMovies(selectedGenres).then(setMovies);
    setNoResultsMessage("");
  };

  return {
    genres,
    selectedGenres,
    movies,
    searchQuery,
    noResultsMessage,
    setGenres,
    setMovies,
    setSearchQuery,
    setSelectedGenres,
    onSearch,
    clearSearch,
    fetchMovies,
    fetchGenres
  };
};