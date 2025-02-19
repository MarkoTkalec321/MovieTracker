import { useEffect, useState, useCallback } from "react";
import { getMovieWatchlistForUser } from "../services/appwrite/movie-list-service";
import { getShowWatchlistForUser } from "../services/appwrite/show-list-service";
import { fetchMovieDetails } from "../services/tmdb/movie-service";
import { fetchShowDetails } from "../services/tmdb/show-service";

export function useMediaWatchlist(userId) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(async () => {
    if (!userId) {
      console.log("No userId found, skipping watchlist fetch.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching watchlist for userId:", userId);

      const [movieDocs, showDocs] = await Promise.all([
        getMovieWatchlistForUser(userId),
        getShowWatchlistForUser(userId),
      ]);

      const combined = [...movieDocs, ...showDocs].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );

      const enrichedDocs = await Promise.all(
        combined.map(async (item) => {
          try {
            if (item.type === "movie") {
              const data = await fetchMovieDetails(item.movieId);
              return {
                ...item,

                id: item.movieId,
                posterUrl: data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : null,
                title: data.title ?? "Untitled",
              };
            } else if (item.type === "show") {
              const data = await fetchShowDetails(item.showId);
              return {
                ...item,
                id: item.showId,
                posterUrl: data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                  : null,
                title: data.name ?? "Untitled",
              };
            }
            return item;
          } catch (fetchError) {
            console.warn("Error fetching details for item:", item, fetchError);
            return item;
          }
        })
      );

      setWatchlist(enrichedDocs);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return {
    watchlist,
    loading,
    error,
    refetch: fetchWatchlist,
  };
}
