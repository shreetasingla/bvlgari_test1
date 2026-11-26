import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PASSPORT_DATA } from '../data/passportData';
import { COLORS, FONTS, SHADOWS } from '../theme/tokens';

interface WalletExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WalletExportModal: React.FC<WalletExportModalProps> = ({
  visible,
  onClose,
}) => {
  const [savedPlatform, setSavedPlatform] = useState<'apple' | 'google' | null>(
    null
  );

  const handleSaveWallet = async (target: 'apple' | 'google') => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }
    setSavedPlatform(target);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeWrap} edges={['top', 'bottom']}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Digital Wallet Pass</Text>
                <Text style={styles.modalSubtitle}>
                  Apple Wallet (.pkpass) & Google Wallet Ready
                </Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={COLORS.ivory} />
              </Pressable>
            </View>

            {/* Wallet Pass Preview */}
            <LinearGradient
              colors={[COLORS.emerald, COLORS.emeraldDeep, COLORS.obsidian]}
              style={styles.walletPassPreview}
            >
              <View style={styles.passHeaderRow}>
                <Text style={styles.passBrand}>BVLGARI ETERNAL</Text>
                <MaterialCommunityIcons
                  name="contactless-payment"
                  size={22}
                  color={COLORS.goldBright}
                />
              </View>

              <Text style={styles.passBagTitle}>{PASSPORT_DATA.bagName}</Text>

              <View style={styles.passGrid}>
                <View style={styles.passCell}>
                  <Text style={styles.passCellLabel}>CERTIFICATE</Text>
                  <Text style={styles.passCellValue}>
                    {PASSPORT_DATA.certificate.certificateId}
                  </Text>
                </View>
                <View style={styles.passCell}>
                  <Text style={styles.passCellLabel}>SERIAL ID</Text>
                  <Text style={styles.passCellValue}>
                    {PASSPORT_DATA.serialId}
                  </Text>
                </View>
              </View>

              <View style={styles.passGrid}>
                <View style={styles.passCell}>
                  <Text style={styles.passCellLabel}>OWNER TOKEN</Text>
                  <Text style={styles.passCellValue}>
                    {PASSPORT_DATA.owner.encryptedToken}
                  </Text>
                </View>
                <View style={styles.passCell}>
                  <Text style={styles.passCellLabel}>CONDITION</Text>
                  <Text style={styles.passCellValue}>100% Mint (Grade A+)</Text>
                </View>
              </View>

              <View style={styles.passBarcodeBox}>
                <Ionicons name="qr-code" size={44} color={COLORS.obsidian} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.barcodeTitle}>
                    Aura Blockchain Verified Pass
                  </Text>
                  <Text style={styles.barcodeHash}>
                    {PASSPORT_DATA.certificate.auraHashShort}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {savedPlatform && (
              <View style={styles.feedbackBanner}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#5EE29B"
                />
                <Text style={styles.feedbackText}>
                  {savedPlatform === 'apple'
                    ? 'Certificate pass packaged for Apple Wallet.'
                    : 'Certificate pass saved to Google Wallet.'}
                </Text>
              </View>
            )}

            <View style={styles.walletBtnRow}>
              <Pressable
                onPress={() => handleSaveWallet('apple')}
                style={({ pressed }) => [
                  styles.walletActionBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="logo-apple" size={18} color={COLORS.obsidian} />
                <Text style={styles.walletActionText}>Apple Wallet</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSaveWallet('google')}
                style={({ pressed }) => [
                  styles.walletActionBtnOutline,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="logo-google"
                  size={16}
                  color={COLORS.goldBright}
                />
                <Text style={styles.walletActionOutlineText}>
                  Google Wallet
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

interface TransferOwnershipModalProps {
  visible: boolean;
  onClose: () => void;
}

const TRANSFER_WINDOW_SECONDS = 15 * 60;

function createTransferCode(): string {
  const segment = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BVL-XFER-${segment}-8841`;
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({
  visible,
  onClose,
}) => {
  const [transferCode, setTransferCode] = useState<string>(() =>
    createTransferCode()
  );
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TRANSFER_WINDOW_SECONDS);
  const [windowId, setWindowId] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const startedAt = Date.now();
    setSecondsLeft(TRANSFER_WINDOW_SECONDS);
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, TRANSFER_WINDOW_SECONDS - elapsed);
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        setCopied(false);
        setTransferCode(createTransferCode());
        setWindowId((current) => current + 1);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [visible, windowId]);

  const handleRegenerate = () => {
    setCopied(false);
    setTransferCode(createTransferCode());
    setWindowId((current) => current + 1);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(transferCode).catch(() => {});
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync().catch(() => {});
    }
    setCopied(true);
  };

  const handleShare = async () => {
    await Share.share({
      title: 'BVLGARI ETERNAL — Encrypted Ownership Transfer',
      message: `BVLGARI ETERNAL One-Time Ownership Transfer Code\nAsset: ${PASSPORT_DATA.bagName} (${PASSPORT_DATA.serialId})\nCertificate: ${PASSPORT_DATA.certificate.certificateId}\nTransfer Token: ${transferCode}\n\nPrivacy Notice: GDPR zero-knowledge token — no personal seller details are shared.`,
    }).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeWrap} edges={['top', 'bottom']}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Transfer Ownership</Text>
                <Text style={styles.modalSubtitle}>
                  Anonymous Resale / Gift Handover • Aura Escrow
                </Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={COLORS.ivory} />
              </Pressable>
            </View>

            <View style={styles.privacyNoticeBox}>
              <Ionicons
                name="lock-closed"
                size={16}
                color={COLORS.goldBright}
              />
              <Text style={styles.privacyNoticeText}>
                Zero-Knowledge GDPR Protection: Your name (Shreeta S.), boutique
                receipt PII, and contact info remain encrypted and are NEVER
                revealed to the buyer or recipient.
              </Text>
            </View>

            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>
                ONE-TIME ENCRYPTED TRANSFER CODE • EXPIRES {formatCountdown(secondsLeft)}
              </Text>
              <Text style={styles.codeValue}>{transferCode}</Text>
              <Text style={styles.codeMeta}>
                Linked to {PASSPORT_DATA.certificate.certificateId} •{' '}
                {PASSPORT_DATA.certificate.auraHashShort}
              </Text>
            </View>

            <View style={styles.transferActionsRow}>
              <Pressable
                onPress={handleCopy}
                style={({ pressed }) => [
                  styles.walletActionBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={17}
                  color={COLORS.obsidian}
                />
                <Text style={styles.walletActionText}>
                  {copied ? 'Code Copied' : 'Copy Code'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.walletActionBtnOutline,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="share-outline"
                  size={17}
                  color={COLORS.goldBright}
                />
                <Text style={styles.walletActionOutlineText}>Share Token</Text>
              </Pressable>
            </View>

            <Pressable onPress={handleRegenerate} style={styles.regenLink}>
              <Ionicons
                name="refresh-outline"
                size={14}
                color={COLORS.textOnDarkMuted}
              />
              <Text style={styles.regenText}>
                Generate New One-Time Code
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 18, 12, 0.82)',
    justifyContent: 'center',
    padding: 16,
  },
  safeWrap: {
    width: '100%',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: COLORS.obsidian,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 18,
    ...SHADOWS.luxuryDark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: FONTS.serifDisplay,
    fontSize: 17,
    color: COLORS.goldBright,
    letterSpacing: 0.7,
  },
  modalSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11.5,
    color: COLORS.textOnDarkMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletPassPreview: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    marginBottom: 14,
  },
  passHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  passBrand: {
    fontFamily: FONTS.serifDisplay,
    fontSize: 13,
    letterSpacing: 2.2,
    color: COLORS.goldBright,
  },
  passBagTitle: {
    fontFamily: FONTS.serifEditorial,
    fontSize: 15.5,
    color: COLORS.ivory,
    marginBottom: 12,
  },
  passGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  passCell: {
    flex: 1,
  },
  passCellLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.textOnDarkMuted,
  },
  passCellValue: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: COLORS.ivory,
    marginTop: 2,
  },
  passBarcodeBox: {
    marginTop: 6,
    backgroundColor: COLORS.ivory,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barcodeTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: COLORS.obsidian,
  },
  barcodeHash: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.emerald,
    marginTop: 2,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(14, 92, 56, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(94, 226, 155, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  feedbackText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.ivory,
  },
  walletBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  walletActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 13,
  },
  walletActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.obsidian,
  },
  walletActionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 12,
    paddingVertical: 13,
  },
  walletActionOutlineText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.goldBright,
  },
  pressed: {
    opacity: 0.85,
  },
  privacyNoticeBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(10, 54, 34, 0.6)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  privacyNoticeText: {
    flex: 1,
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.ivory,
  },
  codeBox: {
    backgroundColor: '#0E0E0E',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  codeLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: COLORS.textOnDarkMuted,
    marginBottom: 8,
  },
  codeValue: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.goldBright,
  },
  codeMeta: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.textOnDarkMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  transferActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  regenLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
  },
  regenText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.textOnDarkMuted,
  },
});
