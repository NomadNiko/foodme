import { Tabs, useRouter } from 'expo-router';
import { Platform, View, AppState } from 'react-native';
import { useEffect, useRef } from 'react';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  // Simplified for development mode
  return (
    <>
    <Tabs
      initialRouteName="popular"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: Platform.OS === 'android' ? 5 : 10,
          paddingBottom: Platform.OS === 'android' ? 15 : 20,
          backgroundColor: '#000000',
          borderTopWidth: 0,
          elevation: Platform.OS === 'android' ? 10 : 0,
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 15 : 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'android' ? 70 : 80,
          zIndex: Platform.OS === 'android' ? 20 : 1,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'android' ? -9 : 0,
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
        tabBarButton: Platform.OS === 'android' 
          ? (props) => {
              const TouchableComponent = require('react-native').TouchableWithoutFeedback;
              const View = require('react-native').View;
              return (
                <TouchableComponent {...props}>
                  <View style={props.style}>
                    {props.children}
                  </View>
                </TouchableComponent>
              );
            }
          : undefined,
      }}>
      <Tabs.Screen
        name="popular"
        options={{
          title: 'Popular',
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="random"
        options={{
          title: 'Random',
          tabBarIcon: ({ color }) => <TabBarIcon name="random" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cocktails"
        options={{
          title: 'Cocktails',
          tabBarIcon: ({ color }) => <TabBarIcon name="glass" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="speakeasy"
        options={{
          title: 'Speakeasy',
          tabBarIcon: ({ color }) => <TabBarIcon name="building" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
    {Platform.OS === 'android' && (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: '#000000',
        zIndex: 10,
      }} />
    )}
    </>
  );
}
