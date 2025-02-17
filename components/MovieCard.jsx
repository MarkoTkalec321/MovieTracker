import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { getMovieDetails } from "../lib/api-tmdb/movie";

const MovieCard = ({ item }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  // Fetch movie details when the component mounts
  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getMovieDetails(item.id);
      setMovieDetails(details);
    };
    fetchDetails();
  }, [item.id]);

  // Format runtime (e.g., 120 -> "2h 0m")
  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  // Format release date (e.g., "1968-09-07" -> "1968")
  const formatReleaseDate = (date) => {
    return date ? new Date(date).getFullYear() : "N/A";
  };

  // Render genre FABs for the movie
  const renderMovieGenreFAB = (genre) => (
    <TouchableOpacity
      key={genre.id}
      className="p-2 m-1 bg-gray-200 rounded-full"
    >
      <Text className="text-sm text-black">{genre.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-row mb-4 bg-gray-100 rounded-2xl overflow-hidden h-48">
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        className="w-24 h-full rounded-[8px]"
        resizeMode="cover"
      />
      <View className="flex-1 pl-3 pr-3 pt-2 pb-2">
        <Text className="text-lg font-bold">{item.title}</Text>
        {movieDetails && (
          <>
            <Text className="text-sm text-gray-600">
              {formatReleaseDate(movieDetails.release_date)} •{" "}
              {formatRuntime(movieDetails.runtime)}
            </Text>
            {/* Render genres as small FABs in a separate View */}
            <View className="flex-row flex-wrap mt-1 items-center justify-center">
              {movieDetails.genres.map((genre) => (
                <View
                  key={genre.id}
                  className="bg-gray-200 rounded-full px-2 py-1 mx-1 mb-1"
                >
                  <Text className="text-[10px]">{genre.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <Text 
            className="text-sm text-gray-600 mt-2"
            numberOfLines={movieDetails?.genres?.length > 4 ? 2 : 3}
        >
          {item.overview}
        </Text>
      </View>
    </View>
  );
};

export default MovieCard;