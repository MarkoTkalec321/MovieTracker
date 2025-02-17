import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { fetchShowGenres, fetchShows, handleShowSearch, fetchShowDetails } from "../../../services/show-service";

const Shows = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [shows, setShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  // Fetch genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      const genres = await fetchShowGenres();
      setGenres(genres);
    };
    loadGenres();
  }, []);

  // Fetch shows when selected genres change
  useEffect(() => {
    if (!searchQuery) {
      const loadShows = async () => {
        const shows = await fetchShows(selectedGenres);
        setShows(shows);
      };
      loadShows();
    }
  }, [selectedGenres]);

  // Handle search
  const onSearch = async () => {
    const { results, message } = await handleShowSearch(searchQuery);
    setShows(results);
    setNoResultsMessage(message);
  };

  return (
    <View>
      {/* Render TV shows */}
      <FlatList
        data={shows}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Shows;