import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Movies from "./movies";
import ShowsTab from "./shows";

const Tab = createMaterialTopTabNavigator();

export default function DiscoverLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#222" },
        tabBarIndicatorStyle: { backgroundColor: "red" },
        tabBarLabelStyle: { color: "white" },
      }}
    >
      <Tab.Screen name="movies" component={Movies} />
      <Tab.Screen name="shows" component={ShowsTab} />
    </Tab.Navigator>
  );
}