import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function UserScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
        </View>
        
        <View style={{ backgroundColor: '#1a1a1a', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Account</Text>
          <Text style={{ color: '#888', fontSize: 16 }}>Pro User (Development Mode)</Text>
        </View>

        <TouchableOpacity 
          style={{ 
            backgroundColor: '#1a1a1a', 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onPress={() => Alert.alert('Settings', 'Settings functionality coming soon')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 15 }}>App Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ 
            backgroundColor: '#1a1a1a', 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onPress={() => Alert.alert('About', 'Food Me v1.1.0\nDevelopment Version')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 15 }}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
