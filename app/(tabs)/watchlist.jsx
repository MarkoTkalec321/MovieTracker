import React, { useEffect, useState } from "react";
import { View, FlatList, Image, ActivityIndicator, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useMediaWatchlist } from "../../hooks/use-media-watch-list";
import { useRouter } from "expo-router";
import { removeMovieFromWatchlist } from "../../services/appwrite/movie-list-service";
import { removeShowFromWatchlist } from "../../services/appwrite/show-list-service";

export default function Watchlist() {
  const { user, loading: globalLoading } = useGlobalContext();
  const userId = user?.$id;
  const router = useRouter();
  const { watchlist, loading, error, refetch } = useMediaWatchlist(userId);
  const isFocused = useIsFocused();


  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (globalLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">Please log in to see your watchlist.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  const handleLongPress = (id) => {
    setIsSelectionMode(true);
    setSelectedItems(new Set([id]));
  };

  const handleSelectItem = (id) => {
    if (!isSelectionMode) {
      router.push(`/details/${id}`);
      return;
    }

    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  };
  
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
  
    const itemText = selectedItems.size === 1 ? "item" : "items";
  
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${selectedItems.size} ${itemText}?`,
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                [...selectedItems].map(async (id) => {
                  const itemToDelete = watchlist.find((item) => item.id === id || item.$id === id);
                  if (!itemToDelete) {
                    console.error(`❌ Item with id ${id} not found in watchlist`);
                    return;
                  }
  
                  console.log(`Deleting: ${itemToDelete.$id} - Type: ${itemToDelete.type}`);
  
                  const documentId = itemToDelete.$id;
  
                  if (itemToDelete.type === "movie") {
                    await removeMovieFromWatchlist(documentId);
                  } else if (itemToDelete.type === "show") {
                    await removeShowFromWatchlist(documentId);
                  }
                })
              );
  
              setIsSelectionMode(false);
              setSelectedItems(new Set());
              console.log("Refreshing watchlist...");
              refetch();
            } catch (error) {
              console.error("❌ Error deleting items:", error);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };  

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.has(item.id);
    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => handleSelectItem(item.id)}
        activeOpacity={0.8}
        className={`mx-1 my-1 w-[130px] relative ${isSelected ? "opacity-50" : ""}`}
      >
        {/* Poster */}
        <Image
          source={{ uri: item.posterUrl }}
          className="w-full aspect-[2/3] rounded-md"
          resizeMode="cover"
        />

        {/* Movie/Show Icon */}
        <Ionicons
          name={item.type === "movie" ? "film-outline" : "tv-outline"}
          size={25}
          color="yellow"
          className="absolute top-1 left-1"
        />

        {/* Selection Indicator (Only Visible in Selection Mode) */}
        {isSelectionMode && (
          <View className="absolute top-1 right-1 bg-red-500 p-1 rounded-full">
            <Ionicons name={isSelected ? "checkmark-circle" : "ellipse-outline"} size={20} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#121212]">

      {isSelectionMode && (
        <View className="flex-row justify-between items-center p-4">
          {/* Cancel Selection Button */}
          <TouchableOpacity onPress={handleCancelSelection}>
            <Ionicons name="close-circle-outline" size={30} color="gray" />
          </TouchableOpacity>

          {/* Delete Selected Items Button */}
          <TouchableOpacity onPress={handleDeleteSelected}>
            <Ionicons name="trash-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {/* Watchlist Grid */}
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
