import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import { cocktailDB } from '~/lib/database/cocktailDB';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const initializationStarted = useRef(false);

  useEffect(() => {
    if (initializationStarted.current) {
      return;
    }
    initializationStarted.current = true;

    const initializeDatabase = async () => {
      try {
        await cocktailDB.initialize();
        const cocktailCount = cocktailDB.getAllCocktails().length;

        if (cocktailCount === 0) {
          await cocktailDB.forceRefreshFromJSON();
        }

        await cocktailDB.forceRefreshFromJSON();
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error instanceof Error ? error.message : 'Failed to initialize database');
      }
    };

    initializeDatabase();
  }, []);

  // Don't render ANYTHING until database is loaded
  if (!isDbInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}>
        {dbError ? (
          <>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Database Error</Text>
            <Text style={{ color: '#ff4444', fontSize: 14 }}>{dbError}</Text>
          </>
        ) : (
          <>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>
              Loading Cocktails...
            </Text>
            <Text style={{ color: '#888', fontSize: 14 }}>Initializing database...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <>
      <StatusBar key="root-status-bar-light" style="light" />
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
        <ActionSheetProvider>
          <NavThemeProvider value={NAV_THEME['dark']}>
            <Stack screenOptions={SCREEN_OPTIONS}>
              <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
              <Stack.Screen name="modal" options={MODAL_OPTIONS} />
              <Stack.Screen
                name="cocktail/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="venue/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="venue-cocktails/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />
            </Stack>
          </NavThemeProvider>
        </ActionSheetProvider>
      </GestureHandlerRootView>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const TABS_OPTIONS = {
  headerShown: false,
} as const;

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerShown: false,
} as const;
