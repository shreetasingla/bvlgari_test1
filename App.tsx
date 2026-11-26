import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Cinzel_600SemiBold,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold,
} from '@expo-google-fonts/playfair-display';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { LauncherScreen } from './src/screens/LauncherScreen';
import { PassportNavigator } from './src/navigation/PassportNavigator';
import { AuthenticationSeal } from './src/components/AuthenticationSeal';
import { VerificationResult } from './src/services/hardwareScanner';
import {
  BookedAppointment,
  PassportSessionProvider,
} from './src/state/passportSession';
import { COLORS } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_500Medium_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [verification, setVerification] = useState<VerificationResult | null>(
    null
  );
  const [sealDismissed, setSealDismissed] = useState(false);
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const transitionOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    transitionOpacity.setValue(0);
    Animated.timing(transitionOpacity, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [verification, sealDismissed, transitionOpacity]);

  const session = useMemo(
    () => ({
      verification,
      appointments,
      bookAppointment: (appointment: BookedAppointment) => {
        setAppointments([appointment]);
      },
    }),
    [verification, appointments]
  );

  const showPassport = Boolean(verification && sealDismissed);

  if (!fontsLoaded) {
    return <View style={styles.splashFallback} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={showPassport ? 'dark' : 'light'} />
      <PassportSessionProvider value={session}>
        <Animated.View
          style={[styles.appRoot, { opacity: transitionOpacity }]}
        >
          {showPassport && verification ? (
            <NavigationContainer>
              <PassportNavigator
                verification={verification}
                onRescan={() => {
                  setVerification(null);
                  setSealDismissed(false);
                  setAppointments([]);
                }}
              />
            </NavigationContainer>
          ) : verification ? (
            <AuthenticationSeal
              verification={verification}
              onContinue={() => setSealDismissed(true)}
            />
          ) : (
            <LauncherScreen
              onAuthenticated={(result) => {
                setAppointments([]);
                setSealDismissed(false);
                setVerification(result);
              }}
            />
          )}
        </Animated.View>
      </PassportSessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashFallback: {
    flex: 1,
    backgroundColor: COLORS.emeraldDeep,
  },
  appRoot: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
});
