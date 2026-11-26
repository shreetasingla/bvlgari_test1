import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PASSPORT_DATA } from '../data/passportData';
import { VerificationResult } from '../services/hardwareScanner';
import { usePassportSession } from '../state/passportSession';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../theme/tokens';
import { SerpentiClaspGraphic } from './SerpentiClaspGraphic';

interface PersistentHeaderProps {
  verification: VerificationResult | null;
  onOpenWallet: () => void;
  onRescan: () => void;
}

/**
 * Persistent top navigation bar & compact hero product summary card
 * visible across all 5 authenticated Digital Product Passport tabs.
 */
export const PersistentHeader: React.FC<PersistentHeaderProps> = ({
  verification,
  onOpenWallet,
  onRescan,
}) => {
  const { isCompact, horizontalPadding, scaleFont } = useResponsiveLayout();
  const { verification: sessionVerification } = usePassportSession();
  const activeVerification = verification ?? sessionVerification;
  const methodLabel =
    activeVerification?.method === 'qr'
      ? 'Interior QR tag'
      : 'Serpenti NFC clasp';

  return (
    <View style={[styles.wrapper, { paddingHorizontal: horizontalPadding }]}>
      {/* Top Navigation Header */}
      <View style={styles.navBar}>
        <Pressable
          onPress={onRescan}
          style={({ pressed }) => [
            styles.navIconBtn,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Return to NFC and QR Scanner"
        >
          <MaterialCommunityIcons
            name={verification?.method === 'qr' ? 'qrcode-scan' : 'nfc'}
            size={17}
            color={COLORS.emerald}
          />
        </Pressable>

        <View style={styles.titleCenter}>
          <Text style={[styles.brandLogo, { fontSize: scaleFont(20) }]}>
            {PASSPORT_DATA.brand}
          </Text>
          <View style={styles.subtitleRow}>
            <View style={styles.subtitleDot} />
            <Text style={styles.consortiumSubtitle} numberOfLines={1}>
              {PASSPORT_DATA.consortiumSubtitle}
            </Text>
            <View style={styles.subtitleDot} />
          </View>
        </View>

        <Pressable
          onPress={onOpenWallet}
          style={({ pressed }) => [
            styles.walletBtn,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Export to Apple Wallet or Google Wallet"
        >
          <Ionicons name="wallet-outline" size={15} color={COLORS.goldBright} />
          <Text style={styles.walletBtnText}>Wallet</Text>
        </Pressable>
      </View>

      {/* Compact Hero Card */}
      <LinearGradient
        colors={['#181A18', COLORS.obsidian, COLORS.emeraldDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, isCompact && styles.heroCardCompact]}
      >
        {/* Inner gold border accent */}
        <View style={styles.heroInnerBorder}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTextCol}>
              {/* Status Badge */}
              <View style={styles.authBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={11}
                  color={COLORS.goldBright}
                />
                <Text style={styles.authBadgeText}>
                  {PASSPORT_DATA.statusBadge}
                </Text>
              </View>

              <Text
                style={[styles.bagName, { fontSize: scaleFont(15.5) }]}
                numberOfLines={2}
              >
                {PASSPORT_DATA.bagName}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.retailPrice}>{PASSPORT_DATA.retailPrice}</Text>
                <View style={styles.metaDivider} />
                <Text style={styles.serialId}>{PASSPORT_DATA.serialId}</Text>
              </View>
            </View>

            <View style={styles.emblemMiniWrap}>
              <View style={styles.emblemGlow} />
              <SerpentiClaspGraphic size={isCompact ? 54 : 62} />
            </View>
          </View>

          {/* Live Bag Age Pill */}
          <View style={styles.agePill}>
            <Ionicons name="time-outline" size={12} color={COLORS.goldBright} />
            <Text style={styles.agePillText} numberOfLines={1}>
              {PASSPORT_DATA.liveBagAgePill}
            </Text>
          </View>
          <View style={styles.verifyPill}>
            <MaterialCommunityIcons
              name={activeVerification?.method === 'qr' ? 'qrcode-scan' : 'nfc'}
              size={12}
              color={COLORS.goldBright}
            />
            <Text style={styles.verifyPillText} numberOfLines={1}>
              This session verified via {methodLabel}
              {activeVerification?.hardwareId
                ? ` • ${activeVerification.hardwareId}`
                : ''}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.ivory,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  navIconBtn: {
    width: 38,
    height: 38,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.ivoryWarm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.gold,
    letterSpacing: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  subtitleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
  },
  consortiumSubtitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 8,
    letterSpacing: 1.6,
    color: COLORS.emerald,
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: RADII.sm,
  },
  walletBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: COLORS.goldBright,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  heroCard: {
    borderRadius: RADII.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.luxuryDark,
  },
  heroCardCompact: {
    padding: 2,
  },
  heroInnerBorder: {
    borderRadius: RADII.lg - 3,
    borderWidth: 0.8,
    borderColor: 'rgba(197, 160, 89, 0.2)',
    padding: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroTextCol: {
    flex: 1,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: 'rgba(10, 54, 34, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.5)',
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  authBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 8.5,
    letterSpacing: 0.9,
    color: COLORS.goldBright,
  },
  bagName: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.ivory,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  retailPrice: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: COLORS.goldBright,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(197, 160, 89, 0.4)',
  },
  serialId: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textOnDarkMuted,
  },
  emblemMiniWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emblemGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
  },
  agePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
    backgroundColor: 'rgba(250, 248, 245, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
    borderRadius: RADII.sm,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  agePillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.ivory,
    flexShrink: 1,
  },
  verifyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  verifyPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.goldLight,
    flexShrink: 1,
  },
});
