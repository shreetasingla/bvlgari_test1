import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PersistentHeader } from '../components/PersistentHeader';
import {
  TransferOwnershipModal,
  WalletExportModal,
} from '../components/PassportModals';
import { VerificationResult } from '../services/hardwareScanner';
import { ProfileCertTab } from '../screens/tabs/ProfileCertTab';
import { OriginTab } from '../screens/tabs/OriginTab';
import { ImpactTab } from '../screens/tabs/ImpactTab';
import { LogbookTab } from '../screens/tabs/LogbookTab';
import { VipSpaTab } from '../screens/tabs/VipSpaTab';
import { COLORS, FONTS, RADII, useResponsiveLayout } from '../theme/tokens';

export type PassportTabParamList = {
  ProfileCert: undefined;
  Origin: undefined;
  Impact: undefined;
  Logbook: undefined;
  VipSpa: undefined;
};

const Tab = createBottomTabNavigator<PassportTabParamList>();

interface PassportNavigatorProps {
  verification: VerificationResult | null;
  onRescan: () => void;
}

export const PassportNavigator: React.FC<PassportNavigatorProps> = ({
  verification,
  onRescan,
}) => {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsiveLayout();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <PersistentHeader
        verification={verification}
        onOpenWallet={() => setWalletModalVisible(true)}
        onRescan={onRescan}
      />

      <View style={styles.navigatorWrap}>
        <Tab.Navigator
          initialRouteName="ProfileCert"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.goldBright,
            tabBarInactiveTintColor: 'rgba(250, 248, 245, 0.45)',
            tabBarStyle: {
              backgroundColor: COLORS.obsidian,
              borderTopWidth: 1,
              borderTopColor: 'rgba(197, 160, 89, 0.3)',
              height: (isCompact ? 60 : 66) + bottomPadding,
              paddingTop: 8,
              paddingBottom: bottomPadding,
              paddingHorizontal: 4,
            },
            tabBarLabelStyle: {
              fontFamily: FONTS.sansSemiBold,
              fontSize: isCompact ? 9.5 : 10,
              letterSpacing: 0.4,
              marginTop: 3,
            },
            tabBarIconStyle: {
              marginBottom: -2,
            },
          }}
        >
          <Tab.Screen
            name="ProfileCert"
            options={{
              tabBarLabel: 'Profile & Cert',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
                  size={size - 2}
                  color={color}
                />
              ),
            }}
          >
            {() => (
              <ProfileCertTab
                onOpenWallet={() => setWalletModalVisible(true)}
                onOpenTransfer={() => setTransferModalVisible(true)}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Origin"
            component={OriginTab}
            options={{
              tabBarLabel: 'Origin',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'git-branch' : 'git-branch-outline'}
                  size={size - 2}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Impact"
            component={ImpactTab}
            options={{
              tabBarLabel: 'Impact',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'leaf' : 'leaf-outline'}
                  size={size - 2}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Logbook"
            component={LogbookTab}
            options={{
              tabBarLabel: 'Logbook',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons
                  name={focused ? 'book-check' : 'book-check-outline'}
                  size={size - 1}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="VipSpa"
            component={VipSpaTab}
            options={{
              tabBarLabel: 'VIP Spa',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons
                  name={focused ? 'spa' : 'spa-outline'}
                  size={size - 1}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>

      <WalletExportModal
        visible={walletModalVisible}
        onClose={() => setWalletModalVisible(false)}
      />

      <TransferOwnershipModal
        visible={transferModalVisible}
        onClose={() => setTransferModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
  navigatorWrap: {
    flex: 1,
  },
});
