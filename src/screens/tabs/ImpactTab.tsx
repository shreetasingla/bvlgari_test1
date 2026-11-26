import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ImpactMetric, PASSPORT_DATA } from '../../data/passportData';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../../theme/tokens';

const AnimatedProgressBar: React.FC<{
  percent: number;
  variant: 'emerald' | 'gold';
}> = ({ percent, variant }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percent, widthAnim]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const barColors: [string, string] =
    variant === 'emerald'
      ? [COLORS.emeraldLight, COLORS.emerald]
      : ['#DFBE78', '#A8823D'];

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFillWrap, { width: barWidth }]}>
        <LinearGradient
          colors={barColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progressFill}
        />
      </Animated.View>
    </View>
  );
};

export const ImpactTab: React.FC = () => {
  const { horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();

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
        {/* ESG Policy Banner */}
        <LinearGradient
          colors={[COLORS.emerald, '#0C2E1E', COLORS.emeraldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.policyHeaderCard}
        >
          <View style={styles.policyBadge}>
            <Ionicons name="earth-outline" size={13} color={COLORS.goldBright} />
            <Text style={styles.policyBadgeText}>
              BVLGARI 2023 ENVIRONMENTAL POLICY
            </Text>
          </View>
          <Text style={[styles.policyTitle, { fontSize: scaleFont(18) }]}>
            Sustainability & Circularity Scorecard
          </Text>
          <Text style={styles.policySubtitle}>
            Verified environmental footprint for your Serpenti Forever Mini Top
            Handle Bag (#BVL-SRP-2026-8841).
          </Text>
        </LinearGradient>

        {/* Impact Metric Cards */}
        {PASSPORT_DATA.impactMetrics.map((metric: ImpactMetric) => (
          <View key={metric.id} style={styles.metricCard}>
            <View style={styles.metricTopRow}>
              <View style={styles.metricLabelRow}>
                <View style={[styles.metricDot, { backgroundColor: metric.barColor === 'emerald' ? COLORS.emerald : COLORS.gold }]} />
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <View style={[styles.percentBox, { backgroundColor: metric.barColor === 'emerald' ? COLORS.successSoft : '#FFF8EB' }]}>
                <Text
                  style={[
                    styles.percentTag,
                    {
                      color:
                        metric.barColor === 'emerald'
                          ? COLORS.emerald
                          : COLORS.warning,
                    },
                  ]}
                >
                  {metric.progressPercent}%
                </Text>
              </View>
            </View>

            <Text style={[styles.metricHeadline, { fontSize: scaleFont(16.5) }]}>
              {metric.headlineValue}
            </Text>

            <AnimatedProgressBar
              percent={metric.progressPercent}
              variant={metric.barColor}
            />

            <Text style={styles.metricSublabel}>{metric.sublabel}</Text>

            <View style={styles.policyRefRow}>
              <Ionicons
                name="document-text-outline"
                size={13}
                color={COLORS.textMuted}
              />
              <Text style={styles.policyRefText}>{metric.policyReference}</Text>
            </View>
          </View>
        ))}

        {/* Audit Footer Card */}
        <View style={styles.footerCard}>
          <View style={styles.footerIconWrap}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={COLORS.emerald}
            />
          </View>
          <Text style={styles.footerText}>
            {PASSPORT_DATA.impactPolicyFooter}
          </Text>
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
  policyHeaderCard: {
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.luxuryDark,
  },
  policyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  policyBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.goldBright,
  },
  policyTitle: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    letterSpacing: 0.5,
  },
  policySubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textOnDarkMuted,
    marginTop: 5,
  },
  metricCard: {
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  percentBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  percentTag: {
    fontFamily: FONTS.serifBold,
    fontSize: 15,
  },
  metricHeadline: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.obsidian,
    marginTop: 6,
    marginBottom: 12,
  },
  progressTrack: {
    height: 12,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.ivoryWarm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 12,
  },
  progressFillWrap: {
    height: '100%',
    borderRadius: RADII.pill,
    overflow: 'hidden',
  },
  progressFill: {
    flex: 1,
    borderRadius: RADII.pill,
  },
  metricSublabel: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  policyRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  policyRefText: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.ivoryWarm,
    borderRadius: RADII.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderEmerald,
  },
  footerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  footerText: {
    flex: 1,
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
});
