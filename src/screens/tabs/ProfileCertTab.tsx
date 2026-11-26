import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PASSPORT_DATA } from '../../data/passportData';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../../theme/tokens';

interface ProfileCertTabProps {
  onOpenWallet: () => void;
  onOpenTransfer: () => void;
}

export const ProfileCertTab: React.FC<ProfileCertTabProps> = ({
  onOpenWallet,
  onOpenTransfer,
}) => {
  const { horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();
  const [hashCopied, setHashCopied] = useState(false);

  const handleCopyHash = async () => {
    await Clipboard.setStringAsync(PASSPORT_DATA.certificate.auraHashFull).catch(
      () => {}
    );
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync().catch(() => {});
    }
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2200);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingHorizontal: horizontalPadding },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.column, { maxWidth: maxContentWidth }]}>
        {/* Owner Profile Card */}
        <View style={styles.ivoryCard}>
          <View style={styles.cardHeaderRow}>
            <LinearGradient
              colors={[COLORS.emerald, COLORS.emeraldDeep]}
              style={styles.iconCircleEmerald}
            >
              <Ionicons name="person-outline" size={16} color={COLORS.goldBright} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>REGISTERED OWNER PROFILE</Text>
              <Text style={[styles.cardTitle, { fontSize: scaleFont(17) }]}>
                {PASSPORT_DATA.owner.displayName}
              </Text>
            </View>
            <View style={styles.gdprPill}>
              <Ionicons name="lock-closed" size={10} color={COLORS.emerald} />
              <Text style={styles.gdprPillText}>GDPR</Text>
            </View>
          </View>

          <View style={styles.tokenBanner}>
            <View style={styles.tokenBannerIcon}>
              <Ionicons name="key-outline" size={13} color={COLORS.emerald} />
            </View>
            <Text style={styles.tokenBannerText}>
              Encrypted Token {PASSPORT_DATA.owner.encryptedToken} • GDPR Protected
            </Text>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Boutique of Origin</Text>
              <Text style={styles.infoValue}>
                {PASSPORT_DATA.owner.boutiqueOfOrigin}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Purchase Date & Bag Age</Text>
              <Text style={styles.infoValue}>
                {PASSPORT_DATA.owner.purchaseDateLabel} (
                {PASSPORT_DATA.owner.ageSummary})
              </Text>
            </View>
          </View>
        </View>

        {/* Digital Ownership Certificate Card */}
        <LinearGradient
          colors={[COLORS.emerald, '#0C2E1E', COLORS.obsidian]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.certificateCard}
        >
          <View style={styles.certInnerBorder}>
            {/* Decorative corner accents */}
            <View style={[styles.cornerAccent, styles.cornerTL]} />
            <View style={[styles.cornerAccent, styles.cornerTR]} />
            <View style={[styles.cornerAccent, styles.cornerBL]} />
            <View style={[styles.cornerAccent, styles.cornerBR]} />

            <View style={styles.certHeader}>
              <View>
                <Text style={styles.certKicker}>
                  AURA BLOCKCHAIN CONSORTIUM
                </Text>
                <Text style={[styles.certHeading, { fontSize: scaleFont(15) }]}>
                  DIGITAL OWNERSHIP CERTIFICATE
                </Text>
              </View>
              <View style={styles.sealGlow}>
                <MaterialCommunityIcons
                  name="seal-variant"
                  size={30}
                  color={COLORS.goldBright}
                />
              </View>
            </View>

            <View style={styles.certRule} />

            <View style={styles.certField}>
              <Text style={styles.certFieldLabel}>UNIQUE CERTIFICATE ID</Text>
              <Text style={styles.certFieldValueMono}>
                {PASSPORT_DATA.certificate.certificateId}
              </Text>
            </View>

            <View style={styles.certField}>
              <View style={styles.hashHeaderRow}>
                <Text style={styles.certFieldLabel}>AURA BLOCKCHAIN HASH</Text>
                <Pressable onPress={handleCopyHash} style={({ pressed }) => [styles.copyHashBtn, pressed && styles.copyPressed]}>
                  <Ionicons
                    name={hashCopied ? 'checkmark' : 'copy-outline'}
                    size={12}
                    color={COLORS.goldBright}
                  />
                  <Text style={styles.copyHashText}>
                    {hashCopied ? 'Copied' : 'Copy Full'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.certFieldValueMono}>
                {PASSPORT_DATA.certificate.auraHashShort}
              </Text>
            </View>

            <View style={styles.hardwareBox}>
              <View style={styles.hardwareHeader}>
                <MaterialCommunityIcons
                  name="chip"
                  size={15}
                  color={COLORS.goldBright}
                />
                <Text style={styles.hardwareTitle}>
                  DUAL HARDWARE VERIFICATION
                </Text>
              </View>
              <Text style={styles.hardwareBody}>
                {PASSPORT_DATA.certificate.dualHardwareVerification}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Care & Repair Snapshot */}
        <View style={styles.snapshotCard}>
          <View style={styles.snapshotHeader}>
            <View style={styles.snapshotIconWrap}>
              <Ionicons
                name="sparkles"
                size={14}
                color={COLORS.goldBright}
              />
            </View>
            <Text style={styles.snapshotTitle}>CARE & REPAIR SNAPSHOT</Text>
          </View>
          <Text style={styles.snapshotSummary}>
            {PASSPORT_DATA.careSnapshot}
          </Text>
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiNum}>
                {PASSPORT_DATA.metrics.structuralRepairs}
              </Text>
              <Text style={styles.kpiLabel}>Structural{'\n'}Repairs</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiNum}>
                {PASSPORT_DATA.metrics.complimentaryConditionings}
              </Text>
              <Text style={styles.kpiLabel}>Complimentary{'\n'}Conditionings</Text>
            </View>
            <LinearGradient
              colors={[COLORS.emerald, COLORS.emeraldDeep]}
              style={[styles.kpiBox, styles.kpiBoxHighlight]}
            >
              <Text style={[styles.kpiNum, { color: COLORS.goldBright }]}>
                {PASSPORT_DATA.metrics.resaleConditionScore}
              </Text>
              <Text style={[styles.kpiLabel, { color: 'rgba(250,248,245,0.85)' }]}>
                Resale{'\n'}Score
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Native Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={onOpenWallet}
            style={({ pressed }) => [
              styles.primaryActionBtn,
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={['#E8D4A2', '#C5A059', '#A8823D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryActionGradient}
            >
              <Ionicons name="wallet-outline" size={18} color={COLORS.obsidian} />
              <Text style={styles.primaryActionText}>
                Add Certificate to Apple / Google Wallet
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onOpenTransfer}
            style={({ pressed }) => [
              styles.secondaryActionBtn,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={18}
              color={COLORS.emerald}
            />
            <Text style={styles.secondaryActionText}>
              Transfer Ownership (Resale / Gift)
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    gap: 16,
  },
  ivoryCard: {
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircleEmerald: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.3,
    color: COLORS.textMuted,
  },
  cardTitle: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.obsidian,
    marginTop: 2,
  },
  gdprPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(14, 92, 56, 0.12)',
  },
  gdprPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    color: COLORS.emerald,
    letterSpacing: 0.5,
  },
  tokenBanner: {
    marginTop: 14,
    backgroundColor: COLORS.ivoryWarm,
    borderRadius: RADII.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenBannerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenBannerText: {
    flex: 1,
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11.5,
    color: COLORS.emerald,
    lineHeight: 16,
  },
  infoList: {
    marginTop: 14,
    gap: 12,
  },
  infoRow: {
    gap: 3,
  },
  infoLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.7,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORS.obsidian,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  certificateCard: {
    borderRadius: RADII.xl,
    padding: 4,
    ...SHADOWS.luxuryDark,
  },
  certInnerBorder: {
    borderRadius: RADII.xl - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(197, 160, 89, 0.4)',
    padding: 18,
    overflow: 'hidden',
  },
  cornerAccent: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },
  certHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certKicker: {
    fontFamily: FONTS.sansBold,
    fontSize: 8.5,
    letterSpacing: 1.6,
    color: COLORS.goldBright,
  },
  certHeading: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    marginTop: 4,
    letterSpacing: 0.8,
  },
  sealGlow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certRule: {
    height: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
    marginVertical: 14,
  },
  certField: {
    marginBottom: 12,
  },
  certFieldLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: COLORS.textOnDarkMuted,
  },
  certFieldValueMono: {
    fontFamily: FONTS.mono,
    fontSize: 13.5,
    color: COLORS.goldBright,
    marginTop: 4,
  },
  hashHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyHashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
  },
  copyPressed: {
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
  },
  copyHashText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: COLORS.goldBright,
  },
  hardwareBox: {
    marginTop: 4,
    backgroundColor: 'rgba(10, 10, 10, 0.5)',
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
    padding: 13,
  },
  hardwareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  hardwareTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.goldBright,
  },
  hardwareBody: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.ivory,
  },
  snapshotCard: {
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  snapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  snapshotIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: COLORS.emerald,
  },
  snapshotSummary: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: COLORS.ivoryWarm,
    borderRadius: RADII.md,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  kpiBoxHighlight: {
    borderColor: COLORS.goldBorder,
    borderWidth: 1,
  },
  kpiNum: {
    fontFamily: FONTS.serifBold,
    fontSize: 20,
    color: COLORS.obsidian,
  },
  kpiLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 14,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryActionBtn: {
    borderRadius: RADII.md,
    overflow: 'hidden',
    ...SHADOWS.goldGlow,
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: RADII.md,
  },
  primaryActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: COLORS.obsidian,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: COLORS.ivoryCard,
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
    borderRadius: RADII.md,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  secondaryActionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: COLORS.emerald,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
