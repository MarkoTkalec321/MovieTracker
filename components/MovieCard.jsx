import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import { getMovieDetails } from "../lib/tmdb/movie";
import { addMovieToWatchlist, removeMovieFromWatchlist, getWatchlistEntryForMovie } from "../services/appwrite/movie-list-service";
import { useGlobalContext } from "../context/GlobalProvider";
import MediaCard from "./MediaCard";

const MovieCard = ({ item }) => {
  const { user } = useGlobalContext();
  const [movieDetails, setMovieDetails] = useState(null);
  const [savedDocId, setSavedDocId] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getMovieDetails(item.id);
      setMovieDetails(details);
    };
    fetchDetails();
  }, [item.id]);

  useEffect(() => {
    const checkSaved = async () => {
      if (user) {
        const docId = await getWatchlistEntryForMovie(user.$id, item.id);
        setSavedDocId(docId);
      }
    };
    checkSaved();
  }, [user, item.id]);

  const handleSaveOrRemoveMovie = useCallback(async () => {
    if (!user) return;
    if (savedDocId) {
      try {
        await removeMovieFromWatchlist(savedDocId);
        setSavedDocId(null);
      } catch (error) {
        console.error("Error removing movie:", error);
      }
    } else {
      try {
        const response = await addMovieToWatchlist(user.$id, item.id);
        setSavedDocId(response.$id);
      } catch (error) {
        console.error("Error saving movie:", error);
      }
    }
  }, [user, savedDocId, item.id]);

  const formatPrimaryInfo = useCallback((details) => {
    const releaseYear = details.release_date ? new Date(details.release_date).getFullYear() : "N/A";
    const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : "";
    return `${releaseYear} • ${runtime}`;
  }, []);

  const renderedGenres = useMemo(() => {
    if (!movieDetails) return null;
    return (
      <View className="flex-row flex-wrap mt-1 items-center justify-center">
        {movieDetails.genres.map((genre) => (
          <View
            key={genre.id}
            className="bg-white rounded-full px-2 py-1 mx-1 mb-1"
          >
            <Text className="text-[11px] text-gray-800 font-semibold">{genre.name}</Text>
          </View>
        ))}
      </View>
    );
  }, [movieDetails]);

  return (
    <MediaCard
      type={"movie"}
      id={item.id} 
      posterPath={item.poster_path}
      title={item.title}
      overview={item.overview}
      details={movieDetails}
      saved={!!savedDocId}
      onSave={handleSaveOrRemoveMovie}
      formatPrimaryInfo={formatPrimaryInfo}
    >
      {renderedGenres}
    </MediaCard>
  );
};

export default React.memo(MovieCard);