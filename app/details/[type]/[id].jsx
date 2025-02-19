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

  const { data, cast, loading, error } = useMediaDetail(type, id);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#999" />
        <Text>Loading detail...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No data found.</Text>
      </View>
    );
  }

  const {
    poster_path,
    title,
    name,        
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    vote_average,
    vote_count,
    overview,
    production_countries,
    production_companies,
    revenue,
  } = data;

  const finalRuntime = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : episode_run_time?.length
    ? `${episode_run_time[0]}m`
    : "N/A";

  const finalDate = release_date || first_air_date || "N/A";

  const countryStr = production_countries
    ?.map((c) => c.name)
    .join(", ");

  const finalTitle = title || name || "Untitled";

  const renderCastItem = ({ item }) => {
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
          <View className="w-20 h-20 items-center justify-center">
            <Ionicons name="person-circle-outline" size={75} color="white" />
          </View>
        )}

        <Text className="text-sm mt-1 w-20 text-center text-white">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <View className="h-14 flex-row items-center px-4 bg-[#121212] shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>
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
            height: 300,
            resizeMode: "cover",
          }}
        />

        </View>

        {/* Title + Basic Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-1 text-white">{finalTitle}</Text>
          <Text className="text-sm text-gray-400">
            {finalDate} • {finalRuntime}
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            Rating: {vote_average?.toFixed(1)}/10 ({vote_count} votes)
          </Text>
        </View>

        <View className="border-b border-[#f5c518] my-3 mx-4" />

        {/* Overview */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2 text-white">Overview</Text>
          <Text className="text-sm text-gray-400 leading-5">{overview}</Text>
        </View>

        <View className="border-b border-[#f5c518] my-3 mx-4" />

        {/* Production Country */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2 text-white">
            {type === "movie" ? "Made In" : "Origin Country"}
          </Text>
          <Text className="text-sm text-gray-400">{countryStr || "Unknown"}</Text>
        </View>

        <View className="border-b border-[#f5c518] my-3 mx-4" />

        {/* Production Companies */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-2 text-white">Production</Text>
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
              <Text className="text-sm text-gray-400">{company.name}</Text>
            </View>
          ))}
        </View>

        {/* If there's a revenue field (movies), show it */}
        {type === "movie" && (
          <>
            <View className="border-b border-[#f5c518] my-3 mx-4" />

            <View className="px-4 mb-2">
              <Text className="text-lg font-semibold mb-2 text-white">Revenue</Text>
              <Text className="text-sm text-gray-400">
                ${revenue?.toLocaleString() || "0"}
              </Text>
            </View>
          </>
        )}

        {/* Horizontal line */}
        <View className="border-b border-[#f5c518] my-3 mx-4" />

        {/* Cast */}
        <View className="px-4">
        <Text className="text-lg font-semibold mb-2 text-white">Cast</Text>
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
