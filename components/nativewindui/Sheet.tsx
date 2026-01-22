import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';

// Stub implementation for development mode
export function Sheet({ children, isOpen, onClose }: { 
  children: React.ReactNode; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={{ backgroundColor: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
