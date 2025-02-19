import React from 'react';
import { Text, View } from 'react-native';
import { Redirect, Link, Router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function Index() {

  const { loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/(tabs)/discover" />;
}
