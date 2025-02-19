import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getMovieWatchlistForUser } from "../../services/appwrite/movie-list-service";
import { getShowWatchlistForUser } from "../../services/appwrite/show-list-service";
import { logOut } from "../../lib/appwrite/auth";
import { useTheme } from "../../theme"; // our theme context hook

export default function Profile() {
  const { user, isLogged, loading: globalLoading, setIsLogged } = useGlobalContext();
  const { theme, toggleTheme } = useTheme();
  const userId = user?.$id;

  const [loading, setLoading] = useState(true);
  const [movieCount, setMovieCount] = useState(0);
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
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
  }, [userId]);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logOut();
      setIsLogged(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (globalLoading || loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  const createdAt = user.$createdAt
    ? new Date(user.$createdAt).toLocaleDateString()
    : "N/A";

  return (
    <View className="flex-1 p-4" style={{ backgroundColor: theme.colors.background }}>
      {/* Header Section */}
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity onPress={handleLogout} className="p-2">
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View className="items-center mb-6">
        <Ionicons
          name="person-circle-outline"
          size={96}
          color={theme.colors.textPrimary}
        />
        <Text
          className="mt-4 text-2xl font-bold"
          style={{ color: theme.colors.textPrimary }}
        >
          Hello, {user.username}
        </Text>
      </View>

      <View
        className="border-b mb-6"
        style={{ borderBottomColor: theme.colors.border, borderBottomWidth: 1 }}
      />

      {/* Account Details Section */}
      <View className="mb-6">
        <Text
          className="text-lg font-semibold"
          style={{ color: theme.colors.textPrimary }}
        >
          Account Details
        </Text>
        <View className="mt-2">
          <Text style={{ fontSize: 16, color: theme.colors.textPrimary }}>
            Email: {user.email}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.textPrimary }}>
            Account ID: {user.accountId}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.textPrimary }}>
            Created: {createdAt}
          </Text>
        </View>
      </View>

      <View
        className="border-b mb-6"
        style={{ borderBottomColor: theme.colors.border, borderBottomWidth: 1 }}
      />

      {/* Watchlist Statistics Section */}
      <View
        className="mb-6 p-4 rounded-lg shadow-md"
        style={{
          backgroundColor:
            theme.colors.background === "#121212"
              ? "rgba(0,0,0,0.3)"
              : "rgba(255,255,255,0.8)",
        }}
      >
        <Text
          className="text-xl font-semibold mb-4"
          style={{ color: theme.colors.textPrimary }}
        >
          Ready To Watch:
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Ionicons name="film-outline" size={28} color="orange" />
            <Text
              className="mt-1 text-base"
              style={{ color: theme.colors.textPrimary }}
            >
              {movieCount} Movie{movieCount === 1 ? "" : "s"}
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="tv-outline" size={28} color="lightblue" />
            <Text
              className="mt-1 text-base"
              style={{ color: theme.colors.textPrimary }}
            >
              {showCount} Show{showCount === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </View>

      <View
        className="border-b mb-6"
        style={{ borderBottomColor: theme.colors.border, borderBottomWidth: 1 }}
      />

      {/* Theme Toggle Section */}
      <View className="flex-row items-center justify-center">
        <Text
          className="text-base mr-2"
          style={{ color: theme.colors.textPrimary }}
        >
          {theme.name === "light" ? "Light Mode" : "Dark Mode"}
        </Text>
        <Switch
          value={theme.name === "light"}
          onValueChange={toggleTheme}
          thumbColor={theme.colors.textPrimary}
          trackColor={{ false: "#767577", true: "#ccc" }}
        />
      </View>
    </View>
  );
}
