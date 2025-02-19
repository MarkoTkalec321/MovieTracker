import { useState, useEffect } from "react";
import { fetchGenres, fetchMovies, handleSearch } from "../services/tmdb/movie-service";

export const useMovies = () => {
  // States for movies data, search, and genres
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  // Paging and loading states
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres);
    };
    loadGenres();
  }, []);

  // Fetch movies whenever selected genres or page change (if not searching)
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
  
      try {
        console.log("Fetching page:", page);
        const newMovies = await fetchMovies(selectedGenres, page);
  
        setMovies((prevMovies) => {
          // If it's page 1, start fresh; otherwise merge previous with newMovies
          const combined = page === 1 ? newMovies : [...prevMovies, ...newMovies];
          // Deduplicate by movie id
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

  // Load more movies (pagination)
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Handle pull-to-refresh
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

  // Handle search submission
  const onSearch = async () => {
    const { results, message } = await handleSearch(searchQuery);
    setMovies(results);
    setNoResultsMessage(message);
  };

  // Clear search and reset movies to default (based on genres)
  const clearSearch = () => {
    setSearchQuery("");
    fetchMovies(selectedGenres).then(setMovies);
    setNoResultsMessage("");
  };

  // Handle genre selection
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
