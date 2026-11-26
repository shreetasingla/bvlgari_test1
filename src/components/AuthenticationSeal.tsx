import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PASSPORT_DATA } from '../data/passportData';
import { VerificationResult } from '../services/hardwareScanner';
import { COLORS, FONTS, SHADOWS, useResponsiveLayout } from '../theme/tokens';

interface AuthenticationSealProps {
  verification: VerificationResult;
  onContinue: () => void;
}

const CHECKS = [
  'Cryptographic signature accepted',
  'Aura Consortium ledger matched',
  'Ownership certificate unsealed',
];

export const AuthenticationSeal: React.FC<AuthenticationSealProps> = ({
  verification,
  onContinue,
}) => {
  const { scaleFont, horizontalPadding } = useResponsiveLayout();
  const sealScale = useRef(new Animated.Value(0.72)).current;
  const sealOpacity = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const [visibleChecks, setVisibleChecks] = useState(0);
  const [ready, setReady] = useState(false);
  const continued = useRef(false);

  const methodLabel =
    verification.method === 'nfc'
      ? 'Serpenti NFC clasp'
      : 'Interior QR tag';

  const enter = () => {
    if (continued.current) return;
    continued.current = true;
    onContinue();
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );
    }

    Animated.parallel([
      Animated.spring(sealScale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(sealOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring, {
            toValue: 1,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ring, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timers = CHECKS.map((_, index) =>
      setTimeout(() => setVisibleChecks(index + 1), 420 + index * 380)
    );
    const readyTimer = setTimeout(() => setReady(true), 420 + CHECKS.length * 380);
    const autoTimer = setTimeout(enter, 4600);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(readyTimer);
      clearTimeout(autoTimer);
    };
    // enter is stable for this mount; ceremony runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.emeraldDeep, COLORS.emerald, COLORS.obsidian]}
      locations={[0, 0.45, 1]}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.column, { paddingHorizontal: horizontalPadding }]}>
          <Text style={styles.kicker}>AURA BLOCKCHAIN CONSORTIUM</Text>
          <Text style={[styles.title, { fontSize: scaleFont(26) }]}>
            Creation Authenticated
          </Text>
          <Text style={styles.subtitle}>
            {PASSPORT_DATA.bagName}
          </Text>

          <View style={styles.sealStage}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: ring.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0.55, 0.35, 0],
                  }),
                  transform: [
                    {
                      scale: ring.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1.45],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={{
                opacity: sealOpacity,
                transform: [{ scale: sealScale }],
              }}
            >
              <LinearGradient
                colors={['#E8D4A2', '#C5A059', '#8C6A32']}
                style={styles.seal}
              >
                <MaterialCommunityIcons
                  name="shield-check"
                  size={54}
                  color={COLORS.emeraldDeep}
                />
              </LinearGradient>
            </Animated.View>
          </View>

          <View style={styles.methodPill}>
            <MaterialCommunityIcons
              name={verification.method === 'nfc' ? 'nfc' : 'qrcode-scan'}
              size={16}
              color={COLORS.goldBright}
            />
            <Text style={styles.methodText}>
              Verified via {methodLabel}
              {verification.isSimulated ? ' • Preview handshake' : ''}
            </Text>
          </View>

          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>SERIAL</Text>
              <Text style={styles.metaValue}>{verification.serialId}</Text>
            </View>
            <View style={styles.metaRule} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>HARDWARE</Text>
              <Text style={styles.metaValue}>{verification.hardwareId}</Text>
            </View>
            <View style={styles.metaRule} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>AURA HASH</Text>
              <Text style={styles.metaValue}>{verification.auraHashShort}</Text>
            </View>
          </View>

          <View style={styles.checks}>
            {CHECKS.map((label, index) => {
              const shown = index < visibleChecks;
              return (
                <View key={label} style={styles.checkRow}>
                  <Ionicons
                    name={shown ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={shown ? COLORS.goldBright : 'rgba(250,248,245,0.28)'}
                  />
                  <Text
                    style={[styles.checkText, !shown && styles.checkTextPending]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={enter}
            disabled={!ready}
            style={({ pressed }) => [
              styles.enterBtn,
              !ready && styles.enterBtnWaiting,
              pressed && ready && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open digital product passport"
          >
            <LinearGradient
              colors={ready ? ['#E8D4A2', '#C5A059', '#A8823D'] : ['#3A3328', '#2A261F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.enterGradient}
            >
              <Text
                style={[
                  styles.enterText,
                  !ready && { color: 'rgba(250,248,245,0.45)' },
                ]}
              >
                {ready ? 'Open Digital Passport' : 'Sealing certificate…'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  kicker: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: COLORS.goldBright,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.serifEditorialItalic,
    fontSize: 15,
    color: COLORS.textOnDarkMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  sealStage: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1.5,
    borderColor: COLORS.goldBright,
  },
  seal: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(10, 54, 34, 0.35)',
    ...SHADOWS.goldGlow,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    backgroundColor: 'rgba(20,20,20,0.55)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  methodText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12.5,
    color: COLORS.ivory,
  },
  metaCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.28)',
    backgroundColor: 'rgba(10, 18, 14, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  metaLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: COLORS.textOnDarkMuted,
  },
  metaValue: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.goldBright,
    flexShrink: 1,
    textAlign: 'right',
  },
  metaRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(197, 160, 89, 0.25)',
  },
  checks: {
    width: '100%',
    gap: 8,
    marginBottom: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: COLORS.ivory,
  },
  checkTextPending: {
    color: 'rgba(250,248,245,0.35)',
  },
  enterBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  enterBtnWaiting: {
    opacity: 0.9,
  },
  enterGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  enterText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14.5,
    color: COLORS.obsidian,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.88,
  },
});
