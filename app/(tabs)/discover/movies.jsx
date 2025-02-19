import React, { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
  ScrollView,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMovies } from "../../../hooks/use-movies";
import MovieCard from "../../../components/MovieCard";
import GenreFAB from "../../../components/GenreFAB";
import Icon from "react-native-vector-icons/Ionicons";

const Movies = () => {
  const {
    genres,
    selectedGenres,
    movies,
    searchQuery,
    setSearchQuery,
    onSearch,
    clearSearch,
    loadMoreMovies,
    onRefresh,
    handleGenrePress,
    loading,
    refreshing,
  } = useMovies();

  const scrollY = new Animated.Value(0);

  const renderMovieItem = useCallback(
    ({ item }) => <MovieCard item={item} />,
    []
  );

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 192,
      offset: 192 * index,
      index,
    }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  return (
    <View className="flex-1 p-4 bg-[#1f1d1d]">
      {/* Search Bar */}
      <View className="flex-row items-center h-13 border border-[#f5c518] rounded-lg px-3 mb-4">
        <TextInput
          className="flex-1 text-white"
          placeholder="Search movies..."
          placeholderTextColor="#b3b3b3"
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

      {/* Animated Genre FABs (Horizontal Scroll) */}
      <Animated.View
        className="overflow-hidden"
        style={{
          height: scrollY.interpolate({
            inputRange: [0, 150],
            outputRange: [50, 0],
            extrapolate: "clamp",
          }),
          opacity: scrollY.interpolate({
            inputRange: [0, 150],
            outputRange: [1, 0],
            extrapolate: "clamp",
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 150],
                outputRange: [0, -30],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8, paddingHorizontal: 4 }}
        >
          {genres.map((item) => {
            const isSelected =
              selectedGenres.includes(item.id) ||
              (item.id === -1 && selectedGenres.length === 0);
            return (
              <GenreFAB
                key={`genre-${item.id}`}
                item={item}
                selected={isSelected}
                onPress={handleGenrePress}
              />
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Horizontal line below FABs */}
      <View
        className="my-2 border-b"
        style={{ borderBottomColor: "#777777", borderBottomWidth: 1 }}
      />

      {/* Movie List */}
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={{ paddingBottom: 16 }}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default Movies;
