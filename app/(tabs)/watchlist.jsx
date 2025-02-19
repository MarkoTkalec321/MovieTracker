import React, { useEffect } from "react";
import { View, FlatList, Image, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native"; // or expo-router
import { useGlobalContext } from "../../context/GlobalProvider";
import { useMediaWatchlist } from "../../hooks/use-media-watch-list";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme";

export default function Watchlist() {
  const { user, loading: globalLoading } = useGlobalContext();
  const { theme } = useTheme();
  const userId = user?.$id;
  const router = useRouter();

  const { watchlist, loading, error, refetch } = useMediaWatchlist(userId);

  // Watch for focus to refetch
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (globalLoading || loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text className="text-white">Please log in to see your watchlist.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  // Navigate to the details screen on item press
  const handlePress = (type, id) => {
    router.push(`/details/${type}/${id}`);
  };

  const renderItem = ({ item }) => {
    const iconName = item.type === "movie" ? "film-outline" : "tv-outline";
    return (
      <TouchableOpacity
        onPress={() => handlePress(item.type, item.id)}
        activeOpacity={0.8}
        className="mx-1 my-1 w-[130px] relative"
      >
        <Image
          source={{ uri: item.posterUrl }}
          className="w-full aspect-[2/3] rounded-md"
          resizeMode="cover"
        />
        <Ionicons
          name={iconName}
          size={25}
          color="yellow"
          className="absolute top-1 left-1"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <FlatList
        data={watchlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        onRefresh={refetch}
        refreshing={loading}
      />
    </View>
  );
}
