const wait = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

// API-ready boundary. Replace these mock bodies with the documented endpoints
// without changing any consuming component.
export const faceAttendanceService = {
  getEmployeeProfile: async () => { await wait(250); return { success: true }; }, // GET /employee/profile
  getTodayAttendance: async () => { await wait(250); return { success: true }; }, // GET /attendance/today
  registerFace: async (image) => {
    await wait();
    if (!image) throw new Error('A captured face image is required.');
    return { success: true, data: { faceImage: image, faceRegistered: true, faceUpdatedAt: new Date().toISOString() } }; // POST /employee/face/register
  },
  verifyFace: async (image) => {
    await wait(1400);
    if (!image) throw new Error('Face capture failed. Please try again.');
    return { success: true, confidence: 0.96 }; // POST /employee/face/verify
  },
  verifyPassword: async (password) => {
    await wait(900);
    if (!password?.trim()) throw new Error('Password is required.');
    return { success: true }; // Password verification payload for attendance endpoint
  },
  markAttendance: async (type, method) => {
    await wait(700);
    return { success: true, data: { type, method, timestamp: new Date().toISOString() } }; // POST /attendance/check-in or /attendance/check-out
  },
};
