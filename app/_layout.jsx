import { Stack } from "expo-router";
import "../global.css";
import GlobalProvider from '../context/GlobalProvider'


export default function RootLayout() {
  return (
    <GlobalProvider>
     
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="details" options={{ headerShown: false }} />
          <Stack.Screen name="person" options={{ headerShown: false }} />
        </Stack>
    
    </GlobalProvider>
  );
}
