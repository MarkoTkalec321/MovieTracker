import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/tmdb/movie-service";
import { fetchShowDetails } from "../services/tmdb/show-service";
import { fetchCredits } from "../lib/tmdb/credits";

export function useMediaDetail(type, id) {
  const [data, setData] = useState(null);
  const [cast, setCast] = useState([]);
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

        let detailData;
        if (type === "movie") {
          detailData = await fetchMovieDetails(id);
        } else {
          detailData = await fetchShowDetails(id);
        }
        setData(detailData);

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
