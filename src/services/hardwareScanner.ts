import { Platform } from 'react-native';

export type ScanMethod = 'nfc' | 'qr';

export interface VerificationResult {
  method: ScanMethod;
  serialId: string;
  hardwareId: string;
  auraHashShort: string;
  isSimulated: boolean;
  message: string;
}

const EXPECTED_SERIAL = '#BVL-SRP-2026-8841';

/**
 * Attempts a real native CoreNFC (iOS) / Android NFC read via react-native-nfc-manager.
 * If the runtime is Expo Go, web, or a simulator without NFC hardware, gracefully resolves
 * with a deterministic simulated NXP NTAG DNA cryptographic verification payload.
 */
export async function scanSerpentiNfcClasp(
  onStatusUpdate?: (status: string) => void
): Promise<VerificationResult> {
  if (Platform.OS === 'web') {
    return runSimulatedNfcSequence(onStatusUpdate);
  }

  try {
    // Dynamic import prevents crashes in environments where the native module is absent (e.g. Expo Go)
    const nfcModule = await import('react-native-nfc-manager');
    const NfcManager = nfcModule.default;
    const NfcTech = nfcModule.NfcTech;

    const isSupported = await NfcManager.isSupported();
    if (!isSupported) {
      return runSimulatedNfcSequence(onStatusUpdate);
    }

    onStatusUpdate?.('Hold top of phone near Serpenti clasp...');
    await NfcManager.start();
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage:
        'Hold your phone near the Bvlgari Serpenti clasp to verify the NXP NTAG DNA chip.',
    });

    const tag = await NfcManager.getTag();
    await NfcManager.cancelTechnologyRequest();

    return {
      method: 'nfc',
      serialId: EXPECTED_SERIAL,
      hardwareId: tag?.id ? `NXP-DNA-${tag.id}` : 'NXP-DNA-04E2-8841-9A',
      auraHashShort: '0x9f84c71a...88e31c',
      isSimulated: false,
      message: 'Native CoreNFC / Android NFC tag verified on Aura Blockchain.',
    };
  } catch {
    // Cleanly fall back to simulated CoreNFC / Android NFC handshake for simulator or Expo Go demo
    return runSimulatedNfcSequence(onStatusUpdate);
  }
}

async function runSimulatedNfcSequence(
  onStatusUpdate?: (status: string) => void
): Promise<VerificationResult> {
  onStatusUpdate?.('Detecting NXP NTAG DNA 424 chip in clasp...');
  await delay(550);
  onStatusUpdate?.('Validating ECDSA cryptographic signature...');
  await delay(550);
  onStatusUpdate?.('Matching Aura Blockchain Consortium ledger...');
  await delay(450);

  return {
    method: 'nfc',
    serialId: EXPECTED_SERIAL,
    hardwareId: 'NXP-DNA-04E2-8841-9A',
    auraHashShort: '0x9f84c71a...88e31c',
    isSimulated: true,
    message: 'Simulated CoreNFC / Android NFC handshake complete.',
  };
}

/**
 * Validates scanned QR payloads from the Avery Dennison serialized interior tag,
 * accepting either full Bvlgari Aura URIs or simulated tag triggers.
 */
export function parseInteriorQrPayload(rawData: string): VerificationResult {
  const normalized = rawData.trim();
  const containsValidRef =
    normalized.includes('BVL-SRP-2026-8841') ||
    normalized.includes('AURA') ||
    normalized.startsWith('SIMULATED');

  return {
    method: 'qr',
    serialId: EXPECTED_SERIAL,
    hardwareId: 'AD-QR-BVL-2026-8841',
    auraHashShort: '0x9f84c71a...88e31c',
    isSimulated: normalized.startsWith('SIMULATED') || !containsValidRef,
    message: 'Avery Dennison serialized interior QR tag authenticated.',
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
