import { useState, useEffect } from "react";
import { fetchShowGenres, fetchShows, handleShowSearch } from "../services/tmdb/show-service";

export const useShows = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      const fetched = await fetchShowGenres();
      setGenres(fetched);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching page:", page);
        const newShows = await fetchShows(selectedGenres, page);
        setShows((prevShows) => {
          const combined = page === 1 ? newShows : [...prevShows, ...newShows];
          const uniqueShows = Array.from(
            new Map(combined.map(show => [show.id, show])).values()
          );
          return uniqueShows;
        });
        if (newShows.length === 0 && page === 1) {
          setHasMore(false);
        }
      } catch (error) {
        setError("Failed to load shows.");
      } finally {
        setLoading(false);
      }
    };

    if (!searchQuery) {
      loadShows();
    }
  }, [selectedGenres, page, searchQuery]);

  const loadMoreShows = () => {
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
    const fetchedGenres = await fetchShowGenres();
    const defaultShows = await fetchShows([]);
    setGenres(fetchedGenres);
    setShows(defaultShows);
    setRefreshing(false);
  };

  const onSearch = async () => {
    const { results, message } = await handleShowSearch(searchQuery);
    setShows(results);
    setNoResultsMessage(message);
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchShows(selectedGenres).then(setShows);
    setNoResultsMessage("");
  };

  const handleGenrePress = (genreId) => {
    if (genreId === -1) {
      setSelectedGenres([]);
    } else {
      const updated = selectedGenres.includes(-1)
        ? [genreId]
        : selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];
      setSelectedGenres(updated);
    }
    setPage(1);
    setHasMore(true);
  };

  return {
    genres,
    selectedGenres,
    shows,
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
    loadMoreShows,
    onRefresh,
    handleGenrePress,
  };
};
