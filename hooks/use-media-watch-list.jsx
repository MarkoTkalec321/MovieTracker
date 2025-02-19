import { useEffect, useState, useCallback } from "react";

// Existing watchlist services that return documents with `movieId` / `showId`
import { getMovieWatchlistForUser } from "../services/appwrite/movie-list-service";
import { getShowWatchlistForUser } from "../services/appwrite/show-list-service";

// Existing detail fetchers for movies and shows
import { fetchMovieDetails } from "../services/tmdb/movie-service";
import { fetchShowDetails } from "../services/tmdb/show-service";

export function useMediaWatchlist(userId) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches the user's watchlist docs, then enriches them with full
   * metadata (posterUrl, title, etc.) from TMDB services.
   */
  const fetchWatchlist = useCallback(async () => {
    if (!userId) {
      console.log("No userId found, skipping watchlist fetch.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching watchlist for userId:", userId);

      // 1) Get raw movie & show documents from Appwrite
      const [movieDocs, showDocs] = await Promise.all([
        getMovieWatchlistForUser(userId),
        getShowWatchlistForUser(userId),
      ]);

      // 2) Sort by savedAt descending
      const combined = [...movieDocs, ...showDocs].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );

      // 3) Enrich each watchlist doc with full metadata (posterUrl, title, etc.)
      // useMediaWatchlist.js
      const enrichedDocs = await Promise.all(
        combined.map(async (item) => {
          try {
            if (item.type === "movie") {
              const data = await fetchMovieDetails(item.movieId); // item.movieId is the TMDB ID
              return {
                ...item,
                // unify the ID so your UI can use `item.id`
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
                id: item.showId,  // unify the ID for shows
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

  // Automatically fetch watchlist on mount (and whenever userId changes)
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Return refetch so we can manually reload data (e.g. on tab focus, pull-to-refresh)
  return {
    watchlist,
    loading,
    error,
    refetch: fetchWatchlist,
  };
}
