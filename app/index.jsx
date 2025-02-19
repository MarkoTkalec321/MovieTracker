import React from 'react';
import { Redirect } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function Index() {

  const { loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/(tabs)/discover" />;
}
