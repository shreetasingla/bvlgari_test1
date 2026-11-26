import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LogbookEntry, PASSPORT_DATA } from '../../data/passportData';
import { usePassportSession } from '../../state/passportSession';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../../theme/tokens';

export const LogbookTab: React.FC = () => {
  const { horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();
  const [sharedFeedback, setSharedFeedback] = useState(false);
  const { appointments } = usePassportSession();

  const entries: LogbookEntry[] = [
    ...appointments.map((appointment) => ({
      id: appointment.id,
      date: `${appointment.date} • ${appointment.time}`,
      title: `VIP Appointment Reserved — ${appointment.serviceTitle}`,
      location: PASSPORT_DATA.vipBoutique.name,
      category: 'appointment' as const,
      conditionGrade: 'Scheduled',
      artisanOrAdvisor: `Concierge hold • ${appointment.refCode}`,
      notes:
        'Private suite reserved from your Digital Product Passport. The visit is sealed to the Aura care ledger when the appointment is completed.',
      blockNumber: 'Pending seal',
      txHash: appointment.refCode,
    })),
    ...PASSPORT_DATA.logbookEntries,
  ];

  const handleShareServiceHistory = async () => {
    const ledgerSummary = [
      `BVLGARI ETERNAL — Verified Service & Care Ledger`,
      `Creation: ${PASSPORT_DATA.bagName} (${PASSPORT_DATA.serialId})`,
      `Certificate: ${PASSPORT_DATA.certificate.certificateId}`,
      `Aura Hash: ${PASSPORT_DATA.certificate.auraHashShort}`,
      '',
      ...entries.map(
        (entry) =>
          `• ${entry.date}: ${entry.title} — ${entry.location} (${entry.conditionGrade}) [Tx: ${entry.txHash}]`
      ),
      '',
      'Personal owner identity masked under GDPR Zero-Knowledge Protection.',
    ].join('\n');

    await Clipboard.setStringAsync(ledgerSummary).catch(() => {});
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }

    try {
      await Share.share({
        title: 'BVLGARI Verified Service History',
        message: ledgerSummary,
      });
    } catch {
      // Clipboard already holds the verified proof for web/simulator
    }

    setSharedFeedback(true);
    setTimeout(() => setSharedFeedback(false), 3000);
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
        {/* Logbook Overview Header */}
        <LinearGradient
          colors={[COLORS.obsidian, '#161816', COLORS.emeraldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerBadge}>
            <MaterialCommunityIcons
              name="book-lock-outline"
              size={13}
              color={COLORS.goldBright}
            />
            <Text style={styles.headerBadgeText}>
              IMMUTABLE AURA CARE TIMELINE
            </Text>
          </View>
          <Text style={[styles.headerTitle, { fontSize: scaleFont(18) }]}>
            Full Repair & Service History
          </Text>
          <Text style={styles.headerSubtitle}>
            Every boutique authentication, conditioning, and atelier repair is
            cryptographically signed and append-only.
          </Text>
        </LinearGradient>

        {/* Chronological Timeline */}
        <View style={styles.timelineWrap}>
          {entries.map(
            (entry: LogbookEntry, index: number) => {
              const isLast = index === entries.length - 1;
              const isFirst = index === 0;
              return (
                <View key={entry.id} style={styles.timelineRow}>
                  <View style={styles.railCol}>
                    <View style={[styles.dotOuter, isFirst && styles.dotOuterFirst]}>
                      <View style={[styles.dotInner, isFirst && styles.dotInnerFirst]} />
                    </View>
                    {!isLast && <View style={styles.railLine} />}
                  </View>

                  <View style={[styles.entryCard, isFirst && styles.entryCardFirst]}>
                    <View style={styles.dateRow}>
                      <Text style={styles.entryDate}>{entry.date}</Text>
                      <View style={styles.gradePill}>
                        <Text style={styles.gradePillText}>
                          {entry.conditionGrade}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[styles.entryTitle, { fontSize: scaleFont(15.5) }]}
                    >
                      {entry.title}
                    </Text>

                    <View style={styles.locationRow}>
                      <Ionicons
                        name="business-outline"
                        size={13}
                        color={COLORS.gold}
                      />
                      <Text style={styles.locationText}>{entry.location}</Text>
                    </View>

                    <Text style={styles.notesText}>{entry.notes}</Text>

                    <View style={styles.ledgerMetaBox}>
                      <View style={styles.ledgerMetaTop}>
                        <Ionicons name="person-outline" size={12} color={COLORS.emerald} />
                        <Text style={styles.advisorText}>
                          {entry.artisanOrAdvisor}
                        </Text>
                      </View>
                      <Text style={styles.txText}>
                        Block {entry.blockNumber} • Tx {entry.txHash}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
          )}
        </View>

        {sharedFeedback && (
          <View style={styles.feedbackBanner}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.emerald} />
            <Text style={styles.feedbackText}>
              Verified resale service proof copied & ready to share.
            </Text>
          </View>
        )}

        {/* Share Resale Proof Button */}
        <Pressable
          onPress={handleShareServiceHistory}
          style={({ pressed }) => [
            styles.shareBtn,
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={['#E8D4A2', '#C5A059', '#A8823D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareBtnGradient}
          >
            <Ionicons name="share-social-outline" size={18} color={COLORS.obsidian} />
            <Text style={styles.shareBtnText}>
              Share Verified Service History
            </Text>
          </LinearGradient>
        </Pressable>
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
  headerCard: {
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.luxuryDark,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: COLORS.emerald,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  headerBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.goldBright,
  },
  headerTitle: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textOnDarkMuted,
    marginTop: 5,
  },
  timelineWrap: {
    gap: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  railCol: {
    width: 24,
    alignItems: 'center',
  },
  dotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.ivoryCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    ...SHADOWS.subtle,
  },
  dotOuterFirst: {
    borderColor: COLORS.goldBright,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
  dotInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.emerald,
  },
  dotInnerFirst: {
    backgroundColor: COLORS.goldBright,
  },
  railLine: {
    width: 2.5,
    flex: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
    marginVertical: 4,
    borderRadius: 1,
  },
  entryCard: {
    flex: 1,
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  entryCardFirst: {
    borderColor: COLORS.goldBorder,
    borderWidth: 1.5,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  entryDate: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: COLORS.emerald,
    letterSpacing: 0.5,
  },
  gradePill: {
    backgroundColor: COLORS.successSoft,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(14, 92, 56, 0.12)',
  },
  gradePillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: COLORS.emerald,
  },
  entryTitle: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.obsidian,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    marginBottom: 8,
  },
  locationText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  notesText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  ledgerMetaBox: {
    backgroundColor: COLORS.ivoryWarm,
    borderRadius: RADII.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 4,
  },
  ledgerMetaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  advisorText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.obsidian,
  },
  txText: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: COLORS.emerald,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successSoft,
    borderWidth: 1,
    borderColor: COLORS.borderEmerald,
    borderRadius: RADII.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  feedbackText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12.5,
    color: COLORS.emerald,
  },
  shareBtn: {
    borderRadius: RADII.md,
    overflow: 'hidden',
    ...SHADOWS.goldGlow,
  },
  shareBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: RADII.md,
  },
  shareBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.obsidian,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
