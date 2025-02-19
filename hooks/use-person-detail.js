import { useEffect, useState } from "react";
import { fetchPersonDetails } from "../lib/tmdb/person";

export function usePersonDetail(personId) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personId) {
      setLoading(false);
      return;
    }

    const loadPerson = async () => {
      try {
        setLoading(true);
        const data = await fetchPersonDetails(personId);
        setPerson(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPerson();
  }, [personId]);

  return { person, loading, error };
}
