import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SerpentiClaspGraphic } from '../components/SerpentiClaspGraphic';
import {
  parseInteriorQrPayload,
  scanSerpentiNfcClasp,
  VerificationResult,
} from '../services/hardwareScanner';
import { COLORS, FONTS, SHADOWS, useResponsiveLayout } from '../theme/tokens';

interface LauncherScreenProps {
  onAuthenticated: (result: VerificationResult) => void;
}

export const LauncherScreen: React.FC<LauncherScreenProps> = ({
  onAuthenticated,
}) => {
  const { isCompact, horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();

  const [isScanningNfc, setIsScanningNfc] = useState(false);
  const [nfcStatusText, setNfcStatusText] = useState(
    'Ready for CoreNFC & Android NFC tap'
  );
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<
    'unknown' | 'granted' | 'denied' | 'unavailable'
  >('unknown');
  const [CameraViewComponent, setCameraViewComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [qrDetected, setQrDetected] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulseOuterAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopInner = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const loopOuter = Animated.loop(
      Animated.sequence([
        Animated.delay(650),
        Animated.timing(pulseOuterAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOuterAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loopInner.start();
    loopOuter.start();

    return () => {
      loopInner.stop();
      loopOuter.stop();
    };
  }, [pulseAnim, pulseOuterAnim]);

  useEffect(() => {
    if (!qrModalVisible) return;
    const lineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    lineLoop.start();
    return () => lineLoop.stop();
  }, [qrModalVisible, scanLineAnim]);

  const triggerHaptic = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }
  };

  const handleTapNfc = async () => {
    if (isScanningNfc) return;
    setIsScanningNfc(true);
    setNfcStatusText('Initializing NFC session...');
    try {
      const result = await scanSerpentiNfcClasp((msg) => setNfcStatusText(msg));
      await triggerHaptic();
      setNfcStatusText('Aura Blockchain Signature Verified');
      setTimeout(() => {
        setIsScanningNfc(false);
        onAuthenticated(result);
      }, 380);
    } catch {
      setIsScanningNfc(false);
      setNfcStatusText('Unable to read NFC tag. Try interior QR backup.');
    }
  };

  const handleOpenQrScanner = async () => {
    setQrDetected(false);
    setQrModalVisible(true);

    if (Platform.OS === 'web') {
      setCameraPermissionStatus('unavailable');
      return;
    }

    try {
      const camModule = await import('expo-camera');
      const { Camera, CameraView } = camModule;
      const perm = await Camera.requestCameraPermissionsAsync();
      if (perm.status === 'granted') {
        setCameraViewComponent(() => CameraView);
        setCameraPermissionStatus('granted');
      } else {
        setCameraPermissionStatus('denied');
      }
    } catch {
      setCameraPermissionStatus('unavailable');
    }
  };

  const completeQrScan = async (payload: string) => {
    if (qrDetected) return;
    setQrDetected(true);
    const result = parseInteriorQrPayload(payload);
    await triggerHaptic();
    setTimeout(() => {
      setQrModalVisible(false);
      setQrDetected(false);
      onAuthenticated(result);
    }, 520);
  };

  const claspSize = isCompact ? 132 : 158;

  const innerRingStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1.48],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 0.25, 1],
      outputRange: [0.7, 0.45, 0],
    }),
  };

  const outerRingStyle = {
    transform: [
      {
        scale: pulseOuterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1.68],
        }),
      },
    ],
    opacity: pulseOuterAnim.interpolate({
      inputRange: [0, 0.25, 1],
      outputRange: [0.55, 0.3, 0],
    }),
  };

  return (
    <LinearGradient
      colors={[COLORS.emeraldDeep, COLORS.emerald, COLORS.obsidian]}
      locations={[0, 0.55, 1]}
      style={styles.gradientRoot}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingVertical: isCompact ? 14 : 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.container, { maxWidth: maxContentWidth }]}>
            {/* Roman Maison Wordmark */}
            <View style={styles.brandBlock}>
              <Text
                style={[styles.brandWordmark, { fontSize: scaleFont(30) }]}
                accessibilityRole="header"
              >
                BVLGARI
              </Text>
              <Text style={styles.brandSubline}>
                ROMA • ETERNAL DIGITAL PRODUCT PASSPORT
              </Text>
            </View>

            {/* Cross-platform compatibility pill */}
            <View style={styles.compatPill}>
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={COLORS.goldBright}
              />
              <Text style={styles.compatPillText}>
                Compatible with All iOS & Android Phones
              </Text>
            </View>

            {/* Serpenti Clasp + Pulsing Gold NFC Beacon */}
            <View style={[styles.beaconStage, { marginVertical: isCompact ? 14 : 24 }]}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    width: claspSize + 24,
                    height: claspSize + 24,
                    borderRadius: (claspSize + 24) / 2,
                  },
                  outerRingStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    width: claspSize + 14,
                    height: claspSize + 14,
                    borderRadius: (claspSize + 14) / 2,
                  },
                  innerRingStyle,
                ]}
              />

              <View style={styles.claspFrame}>
                <SerpentiClaspGraphic size={claspSize} />
                <View style={styles.nfcFloatingBadge}>
                  <MaterialCommunityIcons
                    name="nfc"
                    size={22}
                    color={COLORS.obsidian}
                  />
                </View>
              </View>
            </View>

            {/* Editorial Subtitle */}
            <View style={styles.copyBlock}>
              <Text style={[styles.heroHeadline, { fontSize: scaleFont(19) }]}>
                Authenticate Your Creation
              </Text>
              <Text style={styles.heroDescription}>
                Hold your smartphone over the Serpenti snakehead clasp to verify
                the embedded NXP NTAG DNA cryptographic chip, or scan the
                serialized Avery Dennison interior QR tag.
              </Text>
            </View>

            {/* Live NFC Status Readout */}
            <View style={styles.statusBox}>
              {isScanningNfc ? (
                <ActivityIndicator size="small" color={COLORS.goldBright} />
              ) : (
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={COLORS.goldBright}
                />
              )}
              <Text style={styles.statusBoxText}>{nfcStatusText}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsStack}>
              <Pressable
                onPress={handleTapNfc}
                disabled={isScanningNfc}
                style={({ pressed }) => [
                  styles.primaryNfcButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Tap NFC on Serpenti Clasp"
              >
                <LinearGradient
                  colors={['#DFBE78', '#C5A059', '#A8823D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryNfcGradient}
                >
                  <MaterialCommunityIcons
                    name="nfc-tap"
                    size={22}
                    color={COLORS.obsidian}
                  />
                  <Text style={styles.primaryNfcText}>
                    {isScanningNfc
                      ? 'Reading Serpenti NFC Chip...'
                      : 'Tap NFC on Serpenti Clasp'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={handleOpenQrScanner}
                disabled={isScanningNfc}
                style={({ pressed }) => [
                  styles.secondaryQrButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Scan Interior Backup QR Tag"
              >
                <Ionicons
                  name="qr-code-outline"
                  size={20}
                  color={COLORS.goldBright}
                />
                <Text style={styles.secondaryQrText}>
                  Scan Interior Backup QR Tag
                </Text>
              </Pressable>
            </View>

            {/* Consortium Footer */}
            <Text style={styles.footerCaption}>
              SECURED BY AURA BLOCKCHAIN CONSORTIUM • LVMH PROVENANCE STANDARD
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Native Camera / Simulated QR Scanner Modal */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalSafeWrap} edges={['top', 'bottom']}>
            <View style={styles.qrModalCard}>
              <View style={styles.qrModalHeader}>
                <View>
                  <Text style={styles.qrModalTitle}>
                    Interior Backup QR Tag
                  </Text>
                  <Text style={styles.qrModalSubtitle}>
                    Avery Dennison Serialized Label • #BVL-SRP-2026-8841
                  </Text>
                </View>
                <Pressable
                  onPress={() => setQrModalVisible(false)}
                  style={styles.closeIconButton}
                  accessibilityLabel="Close QR Scanner"
                >
                  <Ionicons name="close" size={22} color={COLORS.ivory} />
                </Pressable>
              </View>

              <View style={styles.viewfinderBox}>
                {cameraPermissionStatus === 'granted' && CameraViewComponent ? (
                  <CameraViewComponent
                    style={StyleSheet.absoluteFillObject}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={({ data }: { data: string }) =>
                      completeQrScan(data)
                    }
                  />
                ) : (
                  <LinearGradient
                    colors={['#10261B', '#0A1912', '#141414']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}

                {/* Reticle Frame */}
                <View style={styles.reticleFrame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />

                  <Animated.View
                    style={[
                      styles.laserLine,
                      {
                        transform: [
                          {
                            translateY: scanLineAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [12, 168],
                            }),
                          },
                        ],
                      },
                    ]}
                  />

                  <View style={styles.qrCenterPreview}>
                    <Ionicons
                      name={qrDetected ? 'checkmark-circle' : 'qr-code'}
                      size={56}
                      color={qrDetected ? '#5EE29B' : COLORS.goldBright}
                    />
                    <Text style={styles.viewfinderHint}>
                      {qrDetected
                        ? 'Tag Verified • Opening Passport...'
                        : cameraPermissionStatus === 'granted'
                          ? 'Align interior stitched QR tag within frame'
                          : 'Camera simulator ready for older phones & preview'}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  completeQrScan('SIMULATED:AURA:BVL-SRP-2026-8841')
                }
                style={({ pressed }) => [
                  styles.simulateQrBtn,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="scan-outline"
                  size={18}
                  color={COLORS.obsidian}
                />
                <Text style={styles.simulateQrBtnText}>
                  {qrDetected
                    ? 'Verified — Launching Passport...'
                    : 'Capture Serialized QR Tag (#BVL-SRP-2026-8841)'}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  brandWordmark: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.goldBright,
    letterSpacing: 8,
    textAlign: 'center',
  },
  brandSubline: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: COLORS.textOnDarkMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  compatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  compatPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.ivory,
    letterSpacing: 0.3,
  },
  beaconStage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 220,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.goldBright,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
  },
  claspFrame: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcFloatingBadge: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.goldBright,
    borderWidth: 2,
    borderColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.goldGlow,
  },
  copyBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  heroHeadline: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.ivory,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDescription: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.textOnDarkMuted,
    textAlign: 'center',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10, 54, 34, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    width: '100%',
    justifyContent: 'center',
  },
  statusBoxText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12.5,
    color: COLORS.ivory,
  },
  actionsStack: {
    width: '100%',
    gap: 12,
  },
  primaryNfcButton: {
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.goldGlow,
  },
  primaryNfcGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  primaryNfcText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14.5,
    color: COLORS.obsidian,
    letterSpacing: 0.4,
  },
  secondaryQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  secondaryQrText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.goldBright,
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  footerCaption: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: 'rgba(250, 248, 245, 0.55)',
    marginTop: 22,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 18, 12, 0.88)',
    justifyContent: 'center',
    padding: 16,
  },
  modalSafeWrap: {
    width: '100%',
    alignItems: 'center',
  },
  qrModalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: COLORS.obsidian,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 18,
    ...SHADOWS.luxuryDark,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  qrModalTitle: {
    fontFamily: FONTS.serifDisplay,
    fontSize: 17,
    color: COLORS.goldBright,
    letterSpacing: 0.8,
  },
  qrModalSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11.5,
    color: COLORS.textOnDarkMuted,
    marginTop: 3,
  },
  closeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBox: {
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reticleFrame: {
    width: 196,
    height: 196,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.goldBright,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  laserLine: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: COLORS.goldBright,
    opacity: 0.85,
  },
  qrCenterPreview: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  viewfinderHint: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: COLORS.ivory,
    textAlign: 'center',
    marginTop: 10,
  },
  simulateQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  simulateQrBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: COLORS.obsidian,
  },
});
