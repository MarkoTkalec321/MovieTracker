import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from "../../context/GlobalProvider";
import { useTheme } from "../../theme";

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/watchlist" />;
  
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="sign-in"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="sign-up"
          options={{
            headerShown: false
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#161622'
      style="light" />
    </>
  )
}

export default AuthLayout