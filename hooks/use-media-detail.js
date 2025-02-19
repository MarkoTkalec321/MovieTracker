// hooks/useMediaDetail.js
import { useEffect, useState } from "react";

// Existing services to fetch details
import { fetchMovieDetails } from "../services/tmdb/movie-service";
import { fetchShowDetails } from "../services/tmdb/show-service";
// Existing service to fetch cast/credits
import { fetchCredits } from "../lib/tmdb/credits";

/**
 * Fetches details (movie or show) + cast from TMDB by 'type' and 'id'
 * Returns { data, cast, loading, error }
 */
export function useMediaDetail(type, id) {
  const [data, setData] = useState(null);    // holds movie or show detail
  const [cast, setCast] = useState([]);      // holds cast array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type || !id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch movie or show details
        let detailData;
        if (type === "movie") {
          detailData = await fetchMovieDetails(id);
        } else {
          detailData = await fetchShowDetails(id);
        }
        setData(detailData);

        // 2) Fetch cast/credits
        const fetchedCast = await fetchCredits(type, id);
        setCast(fetchedCast);

      } catch (err) {
        console.error("Error fetching media detail:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  return { data, cast, loading, error };
}
