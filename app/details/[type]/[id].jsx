import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMediaDetail } from "../../../hooks/use-media-detail";

export default function DetailScreen() {
  const { type, id } = useLocalSearchParams();
  const router = useRouter();

  // Use the custom hook
  const { data, cast, loading, error } = useMediaDetail(type, id);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#999" />
        <Text>Loading detail...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  // If still no data (unexpected)
  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No data found.</Text>
      </View>
    );
  }

  // De-structure fields from the fetched data
  const {
    poster_path,
    title,
    name,            // TV shows often use 'name' field instead of 'title'
    release_date,
    first_air_date,  // TV shows use first_air_date
    runtime,
    episode_run_time, // TV shows might have an array for episode_run_time
    vote_average,
    vote_count,
    overview,
    production_countries,
    production_companies,
    revenue,
    // ... any other fields you need
  } = data;

  // Convert runtime: for TV, it's usually in "episode_run_time" array
  const finalRuntime = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : episode_run_time?.length
    ? `${episode_run_time[0]}m` // Just pick first episode runtime for demonstration
    : "N/A";

  // Convert date: for movies, it's release_date; for shows, it's first_air_date
  const finalDate = release_date || first_air_date || "N/A";

  // Countries
  const countryStr = production_countries
    ?.map((c) => c.name)
    .join(", ");

  // Title-like field (movie vs show)
  const finalTitle = title || name || "Untitled";

  const renderCastItem = ({ item }) => {
    // People in TMDB typically have an `id` (person ID).
    return (
      <TouchableOpacity
        onPress={() => router.push(`/person/${item.id}`)}
        activeOpacity={0.7}
        className="items-center mr-4"
      >
        {item.profile_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
            }}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color="gray" />
        )}
        <Text className="text-sm mt-1 w-20 text-center text-gray-700">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Poster with arrow in top-left */}
        <View className="relative">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster",
          }}
          style={{
            width: "100%",
            height: 300, // Ensure it has a fixed height
            resizeMode: "cover", // Ensures the image covers the space while maintaining aspect ratio
          }}
        />
          {/* Back arrow */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title + Basic Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-1">{finalTitle}</Text>
          <Text className="text-sm text-gray-600">
            {finalDate} • {finalRuntime}
          </Text>
          <Text className="text-sm text-gray-600 mt-2">
            Rating: {vote_average?.toFixed(1)}/10 ({vote_count} votes)
          </Text>
        </View>

        <View className="border-b border-gray-300 my-3 mx-4" />

        {/* Overview */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2">Overview</Text>
          <Text className="text-sm text-gray-700 leading-5">{overview}</Text>
        </View>

        <View className="border-b border-gray-300 my-3 mx-4" />

        {/* Production Country */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2">
            {type === "movie" ? "Made In" : "Origin Country"}
          </Text>
          <Text className="text-sm text-gray-700">{countryStr || "Unknown"}</Text>
        </View>

        <View className="border-b border-gray-300 my-3 mx-4" />

        {/* Production Companies */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2">Production</Text>
          {production_companies?.map((company) => (
            <View key={company.id} className="flex-row items-center mb-2">
              {company.logo_path && (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${company.logo_path}`,
                  }}
                  className="w-12 h-12 mr-2"
                  resizeMode="contain"
                />
              )}
              <Text className="text-sm text-gray-700">{company.name}</Text>
            </View>
          ))}
        </View>

        {/* If there's a revenue field (movies), show it */}
        {type === "movie" && (
          <>
            <View className="border-b border-gray-300 my-3 mx-4" />
            <View className="px-4 mb-2">
              <Text className="text-lg font-semibold mb-2">Revenue</Text>
              <Text className="text-sm text-gray-700">
                ${revenue?.toLocaleString() || "0"}
              </Text>
            </View>
          </>
        )}

        {/* Horizontal line */}
        <View className="border-b border-gray-300 my-3 mx-4" />

        {/* Cast */}
        <View className="px-4">
        <Text className="text-lg font-semibold mb-2">Cast</Text>
        <FlatList
            horizontal
            data={cast}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCastItem}
            showsHorizontalScrollIndicator={false}
        />
        </View>
      </ScrollView>
    </View>
  );
}
