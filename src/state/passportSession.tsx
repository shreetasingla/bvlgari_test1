import React, { createContext, useContext } from 'react';
import { VerificationResult } from '../services/hardwareScanner';

export interface BookedAppointment {
  id: string;
  refCode: string;
  serviceTitle: string;
  date: string;
  time: string;
}

interface PassportSessionValue {
  verification: VerificationResult | null;
  appointments: BookedAppointment[];
  bookAppointment: (appointment: BookedAppointment) => void;
}

const PassportSessionContext = createContext<PassportSessionValue | null>(null);

export const PassportSessionProvider = PassportSessionContext.Provider;

export function usePassportSession(): PassportSessionValue {
  const value = useContext(PassportSessionContext);
  if (!value) {
    throw new Error('usePassportSession must be used inside PassportSessionProvider');
  }
  return value;
}
