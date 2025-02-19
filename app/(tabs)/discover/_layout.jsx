import React from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Movies from "./movies";
import ShowsTab from "./shows";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialTopTabNavigator();

export default function DiscoverLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#222" },
        tabBarIndicatorStyle: { backgroundColor: "red" },
        // We'll use a custom label that shows both text and icon
        tabBarShowIcon: false,
        tabBarLabel: () => {
          let iconName;
          if (route.name === "Movies") {
            iconName = "film-outline"; // Ionicons icon for movies
          } else if (route.name === "Shows") {
            iconName = "tv-outline"; // Ionicons icon for TV shows
          }
          return (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 14 }}>
                {route.name}
              </Text>
              <Ionicons name={iconName} size={20} color="yellow" />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Movies" component={Movies} />
      <Tab.Screen name="Shows" component={ShowsTab} />
    </Tab.Navigator>
  );
}
