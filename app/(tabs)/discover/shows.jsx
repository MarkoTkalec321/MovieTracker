import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from "react-native";
import { useShows } from "../../../hooks/use-shows";
import ShowCard from "../../../components/ShowCard";
import GenreFAB from "../../../components/GenreFAB";
import Icon from "react-native-vector-icons/Ionicons";
import { Animated } from "react-native";

const Shows = () => {
  const {
    genres,
    selectedGenres,
    shows,
    searchQuery,
    refreshing,
    loading,
    setSearchQuery,
    onSearch,
    clearSearch,
    loadMoreShows,
    onRefresh,
    handleGenrePress,
  } = useShows();

  const scrollY = new Animated.Value(0);

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Search Bar */}
      <View className="flex-row items-center h-13 border border-gray-300 rounded-lg px-3 mb-4">
        <TextInput
          className="flex-1"
          placeholder="Search TV shows..."
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

      {/* Animated Genre FABs */}
      <Animated.View
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
          overflow: "hidden",
        }}
      >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8, paddingHorizontal: 4 }}>
        {genres.map((item) => (
          <GenreFAB
            key={`genre-${item.id}`}
            item={item}
            selected={selectedGenres.includes(item.id) || (item.id === -1 && selectedGenres.length === 0)}
            onPress={handleGenrePress}
          />
        ))}
      </ScrollView>
      </Animated.View>

      {/* Show List with Scroll Event */}
      <FlatList
        data={shows}
        renderItem={({ item, index }) => <ShowCard item={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={{ paddingBottom: 16 }}
        onEndReached={loadMoreShows}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

export default Shows;
