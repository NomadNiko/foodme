import { View, Text } from 'react-native';

export default function PurchaseScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>Purchase (Disabled in Development)</Text>
    </View>
  );
}
