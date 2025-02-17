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
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabIcon name="home-outline" color={color} />
          ),
        }}
      />
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
