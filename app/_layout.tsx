import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Image as ExpoImage } from 'expo-image';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from './authContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);
  const opacity = new Animated.Value(0);

  // Play startup sound + animation
  useEffect(() => {
    const playStartup = async () => {
      // Load and play the YTS sound (add your own mp3!)
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/toudoum.wav')
      );
      await sound.playAsync();

      // Fade in effect for splash screen
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Keep splash 2 sec
      await new Promise((res) => setTimeout(res, 2000));

      setShowSplash(false);
      SplashScreen.hideAsync();
    };

    playStartup();
  }, []);

  // Handle font errors
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // When fonts are loaded, we keep splash for animation
  useEffect(() => {
    if (loaded) {
      // nothing, splash hides itself later
    }
  }, [loaded]);



  // Display the splash screen
  if (!loaded || showSplash) {
  return (
    <View style={styles.splashContainer}>
      <Animated.View>
        <ExpoImage
          source={require('../assets/load-loading.gif')}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
}


  return (
    <AuthProvider>
  <RootLayoutNav />
  </AuthProvider>
);
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal2" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modalAccount" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
splashContainer: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},
logo: {
  width: 220,
  height: 220,
},
});
