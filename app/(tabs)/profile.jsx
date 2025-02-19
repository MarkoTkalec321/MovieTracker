import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { getMovieWatchlistForUser } from "../../services/appwrite/movie-list-service";
import { getShowWatchlistForUser } from "../../services/appwrite/show-list-service";
import { logOut } from "../../lib/appwrite/auth";

export default function Profile() {
  const { user, loading: globalLoading, setIsLogged } = useGlobalContext();
  const userId = user?.$id;
  const [loading, setLoading] = useState(true);
  const [movieCount, setMovieCount] = useState(0);
  const [showCount, setShowCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const fetchStats = async () => {
        try {
          setLoading(true);
          const [movies, shows] = await Promise.all([
            getMovieWatchlistForUser(userId),
            getShowWatchlistForUser(userId),
          ]);
          setMovieCount(movies.length);
          setShowCount(shows.length);
        } catch (error) {
          console.error("Error fetching watchlist stats:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, [userId])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logOut();
              setIsLogged(false);
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  if (globalLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <Text className="text-base text-[#b3b3b3]">Loading profile...</Text>
      </View>
    );
  }

  const createdAt = user.$createdAt
    ? new Date(user.$createdAt).toLocaleDateString()
    : "N/A";

  return (
    <View className="flex-1 p-4 bg-[#121212]">
      {/* Header Section */}
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity onPress={handleLogout} className="p-2">
          <Ionicons name="log-out-outline" size={35} color="red" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View className="items-center mb-6">
        <Ionicons
          name="person-circle-outline"
          size={96}
          color="#ffffff"
        />
        <Text className="mt-4 text-2xl font-bold text-white">
          Hello, {user.username}
        </Text>
      </View>

      {/* Divider */}
      <View className="border-b border-[#f5c518] my-4" />

      {/* Account Details Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-white">
          Account Details
        </Text>
        <View className="mt-2">
          <Text className="text-base">
            <Text className="text-white">Email: </Text>
            <Text className="text-gray-400">{user.email}</Text>
          </Text>
          <Text className="text-base">
            <Text className="text-white">Account ID: </Text>
            <Text className="text-gray-400">{user.accountId}</Text>
          </Text>
          <Text className="text-base">
            <Text className="text-white">Created: </Text>
            <Text className="text-gray-400">{createdAt}</Text>
          </Text>
        </View>
      </View>


      {/* Divider */}
      <View className="border-b border-[#f5c518] my-4" />

      {/* Watchlist Statistics Section */}
      <View className="mb-4 rounded-lg shadow-md bg-opacity-80 bg-[#121212]">
        <Text className="text-xl font-semibold mb-4 text-white">
          Ready To Watch:
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Ionicons name="film-outline" size={28} color="orange" />
            <Text className="mt-1 text-base text-white">
              {movieCount} Movie{movieCount === 1 ? "" : "s"}
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="tv-outline" size={28} color="lightblue" />
            <Text className="mt-1 text-base text-white">
              {showCount} Show{showCount === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="border-b border-[#f5c518] my-4" />
    </View>
  );
}
