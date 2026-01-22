import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Index() {
  // This component should never actually render in production
  // The root layout handles all routing logic
  
  useEffect(() => {
    console.log('Index component mounted - this should not happen in production');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff' }}>Redirecting...</Text>
    </View>
  );
}