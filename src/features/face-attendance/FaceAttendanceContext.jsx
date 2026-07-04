import React, { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'orga.employee.faceProfile';
const FaceAttendanceContext = createContext(null);

const readProfile = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved || { faceImage: null, faceRegistered: false, faceUpdatedAt: null };
  } catch {
    return { faceImage: null, faceRegistered: false, faceUpdatedAt: null };
  }
};

export function FaceAttendanceProvider({ children }) {
  const [faceProfile, setFaceProfile] = useState(readProfile);

  const saveFaceProfile = (profile) => {
    const next = { ...faceProfile, ...profile };
    setFaceProfile(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return <FaceAttendanceContext.Provider value={{ faceProfile, saveFaceProfile }}>{children}</FaceAttendanceContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFaceAttendance = () => {
  const context = useContext(FaceAttendanceContext);
  if (!context) throw new Error('useFaceAttendance must be used inside FaceAttendanceProvider');
  return context;
};
