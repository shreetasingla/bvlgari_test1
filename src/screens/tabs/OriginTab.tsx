import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { OriginTier, PASSPORT_DATA } from '../../data/passportData';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../../theme/tokens';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const OriginTab: React.FC = () => {
  const { horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'tier-3': true,
  });

  const toggleTier = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
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
        {/* Header Card */}
        <LinearGradient
          colors={[COLORS.obsidian, '#161816', COLORS.emeraldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.introBanner}
        >
          <View style={styles.fairlyMadeRow}>
            <View style={styles.fairlyBadge}>
              <Ionicons name="leaf-outline" size={12} color={COLORS.goldBright} />
              <Text style={styles.fairlyBadgeText}>
                POWERED BY FAIRLY MADE®
              </Text>
            </View>
            <Text style={styles.tapHint}>Tap any tier to inspect</Text>
          </View>
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(18) }]}>
            Italian Supply Chain Traceability
          </Text>
          <Text style={styles.sectionSubtitle}>
            End-to-end provenance across Tuscany, Valenza, and Florence recorded
            on the Aura Blockchain Consortium ledger.
          </Text>
        </LinearGradient>

        {/* Interactive Vertical Timeline */}
        <View style={styles.timelineList}>
          {PASSPORT_DATA.originTiers.map((tier: OriginTier, idx: number) => {
            const isExpanded = !!expandedIds[tier.id];
            const isLast = idx === PASSPORT_DATA.originTiers.length - 1;

            return (
              <View key={tier.id} style={styles.timelineItemRow}>
                {/* Left Vertical Rail */}
                <View style={styles.railColumn}>
                  <View
                    style={[
                      styles.railNode,
                      isExpanded && styles.railNodeActive,
                    ]}
                  >
                    <Text style={[styles.railNodeNumber, isExpanded && { color: COLORS.goldBright }]}>{3 - idx}</Text>
                  </View>
                  {!isLast && <View style={styles.railLine} />}
                </View>

                {/* Tier Card */}
                <Pressable
                  onPress={() => toggleTier(tier.id)}
                  style={({ pressed }) => [
                    styles.tierCard,
                    isExpanded && styles.tierCardExpanded,
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isExpanded }}
                >
                  <View style={styles.tierTopBar}>
                    <Text style={styles.tierLabel}>{tier.tierLabel}</Text>
                    <View style={[styles.chevronCircle, isExpanded && styles.chevronCircleActive]}>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={isExpanded ? COLORS.goldBright : COLORS.emerald}
                      />
                    </View>
                  </View>

                  <Text style={[styles.tierTitle, { fontSize: scaleFont(15.5) }]}>
                    {tier.title}
                  </Text>

                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={COLORS.gold}
                    />
                    <Text style={styles.locationText}>
                      {tier.facility} • {tier.location}
                    </Text>
                  </View>

                  <View style={styles.badgePill}>
                    <Ionicons name="checkmark-circle" size={12} color={COLORS.emerald} />
                    <Text style={styles.badgePillText}>{tier.badgeText}</Text>
                  </View>

                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <View style={styles.expandedRule} />
                      <Text style={styles.summaryText}>{tier.summary}</Text>

                      <View style={styles.auditGrid}>
                        <View style={styles.auditRow}>
                          <Text style={styles.auditKey}>
                            BATCH VERIFICATION TIMESTAMP
                          </Text>
                          <Text style={styles.auditValMono}>
                            {tier.verifiedTimestamp}
                          </Text>
                        </View>
                        <View style={styles.auditDivider} />
                        <View style={styles.auditRow}>
                          <Text style={styles.auditKey}>BATCH REFERENCE</Text>
                          <Text style={styles.auditValMono}>
                            {tier.batchCode}
                          </Text>
                        </View>
                        <View style={styles.auditDivider} />
                        <View style={styles.auditRow}>
                          <Text style={styles.auditKey}>CERTIFICATION</Text>
                          <Text style={styles.auditVal}>
                            {tier.certification}
                          </Text>
                        </View>
                        <View style={styles.auditDivider} />
                        <View style={styles.auditRow}>
                          <Text style={styles.auditKey}>
                            FAIRLY MADE AUDIT / AURA ANCHOR
                          </Text>
                          <Text style={styles.auditValMono}>
                            {tier.fairlyMadeAuditId} • {tier.auraAnchorHash}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.artisanNoteBox}>
                        <Ionicons
                          name="checkmark-done-circle"
                          size={16}
                          color={COLORS.emerald}
                        />
                        <Text style={styles.artisanNoteText}>
                          {tier.artisanNote}
                        </Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>
            );
          })}
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
  introBanner: {
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.luxuryDark,
  },
  fairlyMadeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  fairlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.emerald,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  fairlyBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.goldBright,
  },
  tapHint: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.textOnDarkMuted,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textOnDarkMuted,
    marginTop: 5,
  },
  timelineList: {
    gap: 2,
  },
  timelineItemRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  railColumn: {
    width: 32,
    alignItems: 'center',
  },
  railNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ivoryCard,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    ...SHADOWS.subtle,
  },
  railNodeActive: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.goldBright,
  },
  railNodeNumber: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.gold,
  },
  railLine: {
    width: 2.5,
    flex: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
    marginVertical: 4,
    borderRadius: 1,
  },
  tierCard: {
    flex: 1,
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  tierCardExpanded: {
    borderColor: COLORS.gold,
    borderWidth: 1.5,
    ...SHADOWS.cardElevated,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  tierTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: COLORS.emerald,
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.ivoryWarm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  chevronCircleActive: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.goldBorder,
  },
  tierTitle: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.obsidian,
    marginTop: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  locationText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  badgePill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.successSoft,
    borderWidth: 1,
    borderColor: 'rgba(14, 92, 56, 0.15)',
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgePillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.emerald,
  },
  expandedSection: {
    marginTop: 12,
  },
  expandedRule: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  auditGrid: {
    backgroundColor: COLORS.ivoryWarm,
    borderRadius: RADII.md,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  auditRow: {
    gap: 3,
  },
  auditDivider: {
    height: 1,
    backgroundColor: 'rgba(230, 223, 211, 0.6)',
  },
  auditKey: {
    fontFamily: FONTS.sansBold,
    fontSize: 8.5,
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  auditVal: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12.5,
    color: COLORS.obsidian,
  },
  auditValMono: {
    fontFamily: FONTS.mono,
    fontSize: 11.5,
    color: COLORS.emerald,
  },
  artisanNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: COLORS.successSoft,
    borderRadius: RADII.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(14, 92, 56, 0.12)',
  },
  artisanNoteText: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.emerald,
    lineHeight: 17,
  },
});
