import React, { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PASSPORT_DATA, SpaServiceOption } from '../../data/passportData';
import { usePassportSession } from '../../state/passportSession';
import { COLORS, FONTS, RADII, SHADOWS, useResponsiveLayout } from '../../theme/tokens';

export const VipSpaTab: React.FC = () => {
  const { horizontalPadding, maxContentWidth, scaleFont } =
    useResponsiveLayout();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    PASSPORT_DATA.vipBoutique.services[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    PASSPORT_DATA.vipBoutique.availableDates[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    PASSPORT_DATA.vipBoutique.availableTimeSlots[1]
  );
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const { bookAppointment } = usePassportSession();

  const selectedService =
    PASSPORT_DATA.vipBoutique.services.find(
      (s) => s.id === selectedServiceId
    ) ?? PASSPORT_DATA.vipBoutique.services[0];

  const handleConfirmAppointment = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});
    }

    const refCode = `BVL-MCR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedRef(refCode);
    bookAppointment({
      id: `apt-${refCode}`,
      refCode,
      serviceTitle: selectedService.title,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const openConciergeCall = () => {
    const dial = PASSPORT_DATA.vipBoutique.conciergePhone.replace(/\s/g, '');
    Linking.openURL(`tel:${dial}`).catch(() => {});
  };

  const openDirections = () => {
    const query = encodeURIComponent(
      `${PASSPORT_DATA.vipBoutique.name}, ${PASSPORT_DATA.vipBoutique.address}`
    );
    Linking.openURL(`https://maps.google.com/?q=${query}`).catch(() => {});
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
        {/* Boutique Location Banner */}
        <LinearGradient
          colors={[COLORS.emerald, '#0C2E1E', COLORS.emeraldDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.boutiqueCard}
        >
          <View style={styles.boutiqueBadge}>
            <MaterialCommunityIcons
              name="diamond-stone"
              size={13}
              color={COLORS.goldBright}
            />
            <Text style={styles.boutiqueBadgeText}>
              VIP CLIENT RETENTION CONCIERGE
            </Text>
          </View>
          <Text style={[styles.boutiqueName, { fontSize: scaleFont(17) }]}>
            {PASSPORT_DATA.vipBoutique.name}
          </Text>
          <Text style={styles.boutiqueAddress}>
            {PASSPORT_DATA.vipBoutique.address}
          </Text>
          <View style={styles.boutiqueHoursRow}>
            <Ionicons name="time-outline" size={12} color={COLORS.goldBright} />
            <Text style={styles.boutiqueHours}>
              {PASSPORT_DATA.vipBoutique.hours}
            </Text>
          </View>
          <View style={styles.conciergeRow}>
            <Pressable
              onPress={openConciergeCall}
              style={({ pressed }) => [
                styles.conciergeBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Call the boutique concierge"
            >
              <Ionicons name="call-outline" size={14} color={COLORS.obsidian} />
              <Text style={styles.conciergeBtnText}>Call concierge</Text>
            </Pressable>
            <Pressable
              onPress={openDirections}
              style={({ pressed }) => [
                styles.conciergeBtnGhost,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open directions to the boutique"
            >
              <Ionicons name="navigate-outline" size={14} color={COLORS.goldBright} />
              <Text style={styles.conciergeGhostText}>Directions</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Selectable Service Cards */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLabelNumber}>
            <Text style={styles.sectionLabelNumberText}>1</Text>
          </View>
          <Text style={styles.sectionLabel}>SELECT PRIVATE SERVICE</Text>
        </View>
        <View style={styles.servicesList}>
          {PASSPORT_DATA.vipBoutique.services.map(
            (service: SpaServiceOption) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <Pressable
                  key={service.id}
                  onPress={() => {
                    setSelectedServiceId(service.id);
                    setConfirmedRef(null);
                  }}
                  style={({ pressed }) => [
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View style={styles.serviceTopRow}>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.serviceTitle,
                          { fontSize: scaleFont(14.5) },
                        ]}
                      >
                        {service.title}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceMetaRow}>
                    <LinearGradient
                      colors={[COLORS.emerald, COLORS.emeraldDeep]}
                      style={styles.pricePill}
                    >
                      <Text style={styles.pricePillText}>
                        {service.priceLabel}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.durationText}>{service.duration}</Text>
                    {service.highlightBadge && (
                      <View style={styles.highlightBadge}>
                        <Ionicons name="star" size={10} color={COLORS.gold} />
                        <Text style={styles.highlightBadgeText}>
                          {service.highlightBadge}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.serviceDesc}>{service.description}</Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* Date Selector */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLabelNumber}>
            <Text style={styles.sectionLabelNumberText}>2</Text>
          </View>
          <Text style={styles.sectionLabel}>CHOOSE DATE</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {PASSPORT_DATA.vipBoutique.availableDates.map((dateStr) => {
            const active = dateStr === selectedDate;
            return (
              <Pressable
                key={dateStr}
                onPress={() => {
                  setSelectedDate(dateStr);
                  setConfirmedRef(null);
                }}
                style={({ pressed }) => [styles.slotChip, active && styles.slotChipActive, pressed && { opacity: 0.85 }]}
              >
                <Text
                  style={[
                    styles.slotChipText,
                    active && styles.slotChipTextActive,
                  ]}
                >
                  {dateStr}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Time Slot Selector */}
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLabelNumber}>
            <Text style={styles.sectionLabelNumberText}>3</Text>
          </View>
          <Text style={styles.sectionLabel}>CHOOSE APPOINTMENT TIME</Text>
        </View>
        <View style={styles.timeGrid}>
          {PASSPORT_DATA.vipBoutique.availableTimeSlots.map((slot) => {
            const active = slot === selectedTime;
            return (
              <Pressable
                key={slot}
                onPress={() => {
                  setSelectedTime(slot);
                  setConfirmedRef(null);
                }}
                style={({ pressed }) => [styles.timeChip, active && styles.slotChipActive, pressed && { opacity: 0.85 }]}
              >
                <Text
                  style={[
                    styles.slotChipText,
                    active && styles.slotChipTextActive,
                  ]}
                >
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Confirmation Banner if booked */}
        {confirmedRef && (
          <LinearGradient
            colors={[COLORS.obsidian, '#181A18']}
            style={styles.confirmationCard}
          >
            <View style={styles.confirmIconCircle}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={COLORS.goldBright}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.confirmationTitle}>
                Confirmed • Ref {confirmedRef}
              </Text>
              <Text style={styles.confirmationBody}>
                {selectedService.title} on {selectedDate} at {selectedTime} —
                Bvlgari Selfridges Exchange Square, Manchester. The hold is now
                on your Aura care logbook.
              </Text>
            </View>
          </LinearGradient>
        )}

        {/* Gold Confirm Button */}
        <Pressable
          onPress={handleConfirmAppointment}
          style={({ pressed }) => [
            styles.confirmBtn,
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={['#E8D4A2', '#C5A059', '#A8823D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmBtnGradient}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.obsidian}
            />
            <Text style={styles.confirmBtnText}>
              Confirm Selfridges Appointment
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
    gap: 14,
  },
  boutiqueCard: {
    borderRadius: RADII.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.luxuryDark,
  },
  boutiqueBadge: {
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
  boutiqueBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 1.1,
    color: COLORS.goldBright,
  },
  boutiqueName: {
    fontFamily: FONTS.serifDisplay,
    color: COLORS.ivory,
    letterSpacing: 0.4,
  },
  boutiqueAddress: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    color: COLORS.textOnDarkMuted,
    marginTop: 5,
  },
  boutiqueHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  boutiqueHours: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: COLORS.goldBright,
  },
  conciergeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  conciergeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.goldBright,
    borderRadius: 10,
    paddingVertical: 10,
  },
  conciergeBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: COLORS.obsidian,
  },
  conciergeBtnGhost: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingVertical: 10,
  },
  conciergeGhostText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12.5,
    color: COLORS.goldBright,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sectionLabelNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabelNumberText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.goldBright,
  },
  sectionLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: COLORS.emerald,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: COLORS.ivoryCard,
    borderRadius: RADII.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  serviceCardSelected: {
    borderColor: COLORS.gold,
    borderWidth: 1.8,
    backgroundColor: '#FFFDF9',
    ...SHADOWS.cardElevated,
  },
  serviceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: COLORS.gold,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.emerald,
  },
  serviceTitle: {
    fontFamily: FONTS.serifEditorial,
    color: COLORS.obsidian,
    lineHeight: 20,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginLeft: 32,
  },
  pricePill: {
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pricePillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10.5,
    color: COLORS.goldBright,
  },
  durationText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: COLORS.textMuted,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.ivoryWarm,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADII.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  highlightBadgeText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: COLORS.emerald,
  },
  serviceDesc: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginLeft: 32,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  slotChip: {
    backgroundColor: COLORS.ivoryCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADII.md,
    paddingHorizontal: 16,
    paddingVertical: 11,
    ...SHADOWS.subtle,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: COLORS.ivoryCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADII.md,
    paddingHorizontal: 16,
    paddingVertical: 11,
    ...SHADOWS.subtle,
  },
  slotChipActive: {
    backgroundColor: COLORS.emerald,
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },
  slotChipText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12.5,
    color: COLORS.obsidian,
  },
  slotChipTextActive: {
    color: COLORS.goldBright,
  },
  confirmationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 16,
    ...SHADOWS.luxuryDark,
  },
  confirmIconCircle: {
    marginTop: 1,
  },
  confirmationTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: COLORS.goldBright,
  },
  confirmationBody: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.ivory,
    marginTop: 3,
  },
  confirmBtn: {
    borderRadius: RADII.md,
    overflow: 'hidden',
    marginTop: 4,
    ...SHADOWS.goldGlow,
  },
  confirmBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: RADII.md,
  },
  confirmBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.obsidian,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
