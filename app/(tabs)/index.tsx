import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Add a small delay to ensure root layout is mounted
    const timer = setTimeout(() => {
      router.replace('/(tabs)/popular');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}