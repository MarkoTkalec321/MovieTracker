import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import { useMovies } from "../../../hooks/use-movies";
import MovieCard from "../../../components/MovieCard";
import Icon from "react-native-vector-icons/Ionicons";

const Movies = () => {
  const {
    genres,
    selectedGenres,
    movies,
    searchQuery,
    noResultsMessage,
    setGenres,
    setMovies,
    setSearchQuery,
    setSelectedGenres,
    onSearch,
    clearSearch,
    fetchMovies,
    fetchGenres
  } = useMovies();

  const [refreshing, setRefreshing] = useState(false);

  // Handle genre selection
  const handleGenrePress = (genreId) => {
    if (genreId === -1) {
      setSelectedGenres([]);
    } else {
      const updatedGenres = selectedGenres.includes(-1)
        ? [genreId]
        : selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];
      setSelectedGenres(updatedGenres);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedGenres([]);
    const genres = await fetchGenres();
    const movies = await fetchMovies([]);
    setGenres(genres);
    setMovies(movies);
    setRefreshing(false);
  };

  // Render genre FABs
  const renderGenreFAB = ({ item }) => (
    <TouchableOpacity
      className={`h-9 px-3 mx-1 mb-2 bg-gray-200 rounded-full flex items-center justify-center ${
        selectedGenres.includes(item.id) || (item.id === -1 && selectedGenres.length === 0)
          ? "bg-red-500"
          : ""
      }`}
      onPress={() => handleGenrePress(item.id)}
    >
      <Text className="text-sm text-black">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Search Bar */}
      <View className="flex-row items-center h-13 border border-gray-300 rounded-lg px-3 mb-4">
        <TextInput
          className="flex-1"
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Genre FABs */}
      <FlatList
        data={genres}
        renderItem={renderGenreFAB}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-6"
      />

      {/* No Results Message */}
      {noResultsMessage && (
        <Text className="text-sm text-gray-600 text-center mb-4">
          {noResultsMessage}
        </Text>
      )}

      {/* Movie List with Pull-to-Refresh */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Movie List */}
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </ScrollView>
    </View>
  );
};

export default Movies;