import { useState, useEffect } from "react";
import { fetchGenres, fetchMovies, handleSearch } from "../services/tmdb/movie-service";

export const useMovies = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
  
      try {
        console.log("Fetching page:", page);
        const newMovies = await fetchMovies(selectedGenres, page);
  
        setMovies((prevMovies) => {
          const combined = page === 1 ? newMovies : [...prevMovies, ...newMovies];
          const uniqueMovies = Array.from(
            new Map(combined.map(movie => [movie.id, movie])).values()
          );
          return uniqueMovies;
        });
  
        if (newMovies.length === 0 && page === 1) {
          setHasMore(false);
        }
      } catch (error) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
  
    loadMovies();
  }, [selectedGenres, page]);

  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedGenres([]);
    setPage(1);
    setHasMore(true);
    clearSearch();
    const fetchedGenres = await fetchGenres();
    const defaultMovies = await fetchMovies([]);
    setGenres(fetchedGenres);
    setMovies(defaultMovies);
    setRefreshing(false);
  };

  const onSearch = async () => {
    const { results, message } = await handleSearch(searchQuery);
    setMovies(results);
    setNoResultsMessage(message);
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchMovies(selectedGenres).then(setMovies);
    setNoResultsMessage("");
  };

  const handleGenrePress = (genreId) => {
    if (genreId === -1) {
      setSelectedGenres([]);
    } else {
      const updatedGenres = selectedGenres.includes(-1)
        ? [genreId]
        : selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];
      setSelectedGenres(updatedGenres);
    }
    setPage(1);
    setHasMore(true);
  };

  return {
    genres,
    selectedGenres,
    movies,
    searchQuery,
    noResultsMessage,
    loading,
    refreshing,
    error,
    hasMore,
    setSearchQuery,
    setSelectedGenres,
    onSearch,
    clearSearch,
    loadMoreMovies,
    onRefresh,
    handleGenrePress,
  };
};
