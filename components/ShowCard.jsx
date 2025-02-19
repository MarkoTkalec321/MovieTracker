import React, { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { getShowDetails } from "../lib/tmdb/show";
import { addShowToWatchlist, removeShowFromWatchlist, getWatchlistEntryForShow } from "../services/appwrite/show-list-service";
import { useGlobalContext } from "../context/GlobalProvider";
import MediaCard from "./MediaCard";

const ShowCard = ({ item }) => {
  const { user } = useGlobalContext();
  const [showDetails, setShowDetails] = useState(null);
  const [savedDocId, setSavedDocId] = useState(null);

  // Fetch TV show details on mount
  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getShowDetails(item.id);
      setShowDetails(details);
    };
    fetchDetails();
  }, [item.id]);

  // Check if show is already saved
  useEffect(() => {
    const checkSaved = async () => {
      if (user) {
        const docId = await getWatchlistEntryForShow(user.$id, item.id);
        setSavedDocId(docId);
      }
    };
    checkSaved();
  }, [user, item.id]);

  // Handle save / remove action
  const handleSaveOrRemoveShow = useCallback(async () => {
    if (!user) return;
    if (savedDocId) {
      try {
        await removeShowFromWatchlist(savedDocId);
        setSavedDocId(null);
        console.log("Show removed from watchlist");
      } catch (error) {
        console.error("Error removing show:", error);
      }
    } else {
      try {
        const response = await addShowToWatchlist(user.$id, item.id);
        setSavedDocId(response.$id);
        console.log("Show saved:", response);
      } catch (error) {
        console.error("Error saving show:", error);
      }
    }
  }, [user, savedDocId, item.id]);

  // Format primary info for TV shows: "Year • X Seasons"
  const formatShowPrimaryInfo = useCallback((details) => {
    const year = details.first_air_date ? new Date(details.first_air_date).getFullYear() : "N/A";
    const seasons = details.number_of_seasons ? `${details.number_of_seasons} Seasons` : "";
    return `${year} • ${seasons}`;
  }, []);

  return (
    <MediaCard
      type={"show"}      // "movie" or "show"
      id={item.id} 
      posterPath={item.poster_path}
      title={item.name}
      overview={item.overview}
      details={showDetails}
      saved={!!savedDocId}
      onSave={handleSaveOrRemoveShow}
      formatPrimaryInfo={formatShowPrimaryInfo}
    >
      {showDetails && (
        <View className="flex-row flex-wrap mt-1 items-center justify-center">
          {showDetails.genres.map((genre) => (
            <View key={genre.id} className="bg-gray-200 rounded-full px-2 py-1 mx-1 mb-1">
              <Text className="text-[10px]">{genre.name}</Text>
            </View>
          ))}
        </View>
      )}
    </MediaCard>
  );
};

export default ShowCard;
