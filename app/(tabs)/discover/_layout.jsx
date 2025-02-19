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
        tabBarIndicatorStyle: { backgroundColor: "#F5C518" },
        tabBarShowIcon: false, // Icons handled inside custom label
        tabBarLabel: () => {
          let iconName;
          if (route.name === "Movies") {
            iconName = "film-outline";
          } else if (route.name === "Shows") {
            iconName = "tv-outline";
          }
          return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 14, marginRight: 15 }}>
                {route.name}
              </Text>
              <Ionicons name={iconName} size={18} color="yellow" />
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
