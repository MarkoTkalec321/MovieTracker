// app/person/[id].jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePersonDetail } from "../../hooks/use-person-detail";
import { fetchPersonCredits } from "../../lib/tmdb/person"; // adjust the path as needed

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams(); // person id from the route
  const router = useRouter();
  const { person, loading, error } = usePersonDetail(id);
  
  // State for filmography (movies the person acted in)
  const [filmography, setFilmography] = useState([]);
  const [filmographyLoading, setFilmographyLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadCredits = async () => {
      try {
        setFilmographyLoading(true);
        const creditsData = await fetchPersonCredits(id);
        // Filter for movies only. Ensure that your TMDB response contains a 'media_type' property.
        const movies = creditsData.cast.filter(
          (item) => item.media_type === "movie"
        );
        setFilmography(movies);
      } catch (err) {
        console.error("Error fetching person credits:", err);
      } finally {
        setFilmographyLoading(false);
      }
    };

    loadCredits();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#999" />
        <Text className="mt-2 text-base text-gray-500">Loading person details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  if (!person) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">No data found.</Text>
      </View>
    );
  }

  const {
    name,
    profile_path,
    biography,
    birthday,
    place_of_birth,
    also_known_as,
    known_for_department,
  } = person;

  return (
    <View className="flex-1 bg-white">
      {/* Custom Top Bar with Back Arrow */}
      <View className="h-14 flex-row items-center px-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {/* Profile Picture & Basic Info */}
        <View className="items-center my-4">
          {profile_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w300${profile_path}` }}
              className="w-36 h-36 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={140} color="gray" />
          )}
          <Text className="text-2xl font-bold mt-4 text-gray-800">{name}</Text>
          {known_for_department && (
            <Text className="text-sm text-gray-500">{known_for_department}</Text>
          )}
        </View>

        {/* Divider */}
        <View className="border-b border-gray-300 my-4" />

        {/* Also Known As */}
        {also_known_as && also_known_as.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Also Known As</Text>
            {also_known_as.map((aka, index) => (
              <Text key={index} className="text-sm text-gray-700">
                {aka}
              </Text>
            ))}
          </View>
        )}

        {/* Divider */}
        <View className="border-b border-gray-300 my-4" />

        {/* Birthday & Place of Birth */}
        <View className="mb-4">
          {birthday && (
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-800 mb-1">Birthday</Text>
              <Text className="text-sm text-gray-700">{birthday}</Text>
            </View>
          )}
          {place_of_birth && (
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-1">Place of Birth</Text>
              <Text className="text-sm text-gray-700">{place_of_birth}</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View className="border-b border-gray-300 my-4" />

        {/* Filmography Section */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Filmography</Text>
          {filmographyLoading ? (
            <ActivityIndicator size="small" color="#999" />
          ) : (
            <FlatList
            horizontal
            data={filmography}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => router.push(`/details/movie/${item.id}`)}
                activeOpacity={0.8}
                className="items-center mr-4"
                >
                <Image
                    source={{
                    uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image",
                    }}
                    className="w-20 h-[120px] rounded-md"
                    resizeMode="cover"
                />
                <Text
                    className="text-sm mt-1 w-20 text-center text-gray-700"
                    numberOfLines={1}
                >
                    {item.title || item.name}
                </Text>
                </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            />
          )}
        </View>


        {/* Divider */}
        <View className="border-b border-gray-300 my-4" />

        
        {/* Biography */}
        {biography && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Biography</Text>
            <Text className="text-sm text-gray-700 leading-5">{biography}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
