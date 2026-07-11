const API_BASE_PATH = "/api";
const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}${API_BASE_PATH}`
    : API_BASE_PATH;

const request = async (path, options = {}) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || 'Request failed. Please try again.');
    error.code = payload.code;
    error.status = response.status;
    throw error;
  }
  return payload;
};

export const faceAttendanceService = {
  getFaceStatus: () => request('/employee/face/status'),
  getTodayAttendance: () => request('/attendance/today-status'),
  registerFace: (image) => request('/employee/face/register', {
    method: 'POST', body: JSON.stringify({ image }),
  }),
  verifyFace: (image) => request('/employee/face/verify', {
    method: 'POST', body: JSON.stringify({ image }),
  }),
  markFaceAttendance: (type, image) => request('/employee/face/attendance', {
    method: 'POST', body: JSON.stringify({ type, image }),
  }),
  markPasswordAttendance: (type, password) => request('/employee/face/password-attendance', {
    method: 'POST', body: JSON.stringify({ type, password }),
  }),
};
