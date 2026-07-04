import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { faceAttendanceService } from './faceAttendanceService';

const FaceAttendanceContext = createContext(null);
const EMPTY_PROFILE = { faceImage: null, faceRegistered: false, faceUpdatedAt: null };

export function FaceAttendanceProvider({ children }) {
  const [faceProfile, setFaceProfile] = useState(EMPTY_PROFILE);
  const [faceProfileLoading, setFaceProfileLoading] = useState(true);

  const saveFaceProfile = useCallback((profile) => {
    setFaceProfile((current) => ({ ...current, ...profile }));
  }, []);

  const refreshFaceProfile = useCallback(async () => {
    setFaceProfileLoading(true);
    try {
      const result = await faceAttendanceService.getFaceStatus();
      saveFaceProfile(result.data);
      return result.data;
    } finally {
      setFaceProfileLoading(false);
    }
  }, [saveFaceProfile]);

  useEffect(() => {
    refreshFaceProfile().catch(() => setFaceProfile(EMPTY_PROFILE));
  }, [refreshFaceProfile]);

  return <FaceAttendanceContext.Provider value={{ faceProfile, faceProfileLoading, saveFaceProfile, refreshFaceProfile }}>{children}</FaceAttendanceContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFaceAttendance = () => {
  const context = useContext(FaceAttendanceContext);
  if (!context) throw new Error('useFaceAttendance must be used inside FaceAttendanceProvider');
  return context;
};
