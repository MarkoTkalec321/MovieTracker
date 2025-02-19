import React from 'react';
import { Redirect, Tabs } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ name, color }) => {
  return <Icon name={name} size={24} color={color} />;
};

const TabsLayout = () => {
  const { loading, isLogged } = useGlobalContext();
  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#F5C518",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabIcon name="bookmark-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
