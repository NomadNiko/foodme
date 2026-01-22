import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Skip all authentication and go straight to the main app
    router.replace('/(tabs)/popular');
  }, []);

  return null;
}