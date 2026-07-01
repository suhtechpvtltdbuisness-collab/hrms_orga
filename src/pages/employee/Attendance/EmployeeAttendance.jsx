import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService, authService, shiftAssignmentService, shiftService } from '../../../service';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_META = {
  no_shift: { label: 'No Shift', tone: 'bg-slate-100 text-slate-700 border-slate-200' },
  pending: { label: 'Pending', tone: 'bg-slate-100 text-slate-600 border-slate-200' },
  present: { label: 'Present', tone: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  late: { label: 'Late', tone: 'bg-amber-100 text-amber-700 border-amber-200' },
  absent: { label: 'Absent', tone: 'bg-rose-100 text-rose-700 border-rose-200' },
  checked_in: { label: 'Checked In', tone: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  checked_out: { label: 'Checked Out', tone: 'bg-sky-100 text-sky-700 border-sky-200' },
  on_leave: { label: 'On Leave', tone: 'bg-blue-100 text-blue-700 border-blue-200' },
  weekend: { label: 'Weekend', tone: 'bg-slate-100 text-slate-500 border-slate-200' },
  holiday: { label: 'Holiday', tone: 'bg-violet-100 text-violet-700 border-violet-200' },
};

const pad2 = (value) => String(value).padStart(2, '0');

const toDateKey = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const formatDateLabel = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatShortDate = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  const raw = String(value).trim();
  if (!raw) return null;
  const clean = raw.replace(/\s+/g, ' ');
  if (/\b(AM|PM)\b/i.test(clean)) return clean.toUpperCase();

  const parts = clean.split(':').map((part) => Number(part));
  if (parts.length >= 2 && parts.every((n) => !Number.isNaN(n))) {
    const [hours, minutes] = parts;
    const period = hours >= 12 ? 'PM' : 'AM';
    const normalizedHours = ((hours + 11) % 12) + 1;
    return `${pad2(normalizedHours)}:${pad2(minutes)} ${period}`;
  }

  return clean;
};

const parseClockTime = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const meridianMatch = raw.match(/\b(AM|PM)\b/i);
  const timePart = raw.replace(/\b(AM|PM)\b/i, '').trim();
  const [hoursRaw = '0', minutesRaw = '0', secondsRaw = '0'] = timePart.split(':');

  let hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const seconds = Number(secondsRaw);
  if ([hours, minutes, seconds].some((n) => Number.isNaN(n))) return null;

  if (meridianMatch) {
    const meridian = meridianMatch[1].toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  }

  return { hours, minutes, seconds };
};

const buildDateTime = (baseDate, timeValue) => {
  const parsed = parseClockTime(timeValue);
  if (!parsed) return null;
  const d = new Date(baseDate);
  d.setHours(parsed.hours, parsed.minutes, parsed.seconds, 0);
  return d;
};

const formatDuration = (ms) => {
  if (!Number.isFinite(ms) || ms < 0) return '--';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const formatCountdown = (target, now) => {
  if (!target) return '';
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return '00h 00m';
  const totalMinutes = Math.ceil(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${pad2(hours)}h ${pad2(minutes)}m`;
};

const firstDefined = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
};

const normalizeAttendanceRecord = (item) => {
  const source = item?.attendance || item?.record || item?.data || item || {};
  return {
    id: source.id || item?.id || source._id || `${source.attendanceDate || source.date || Date.now()}`,
    date: source.attendanceDate || source.date || source.createdAt || '',
    checkIn: source.checkIn || source.checkInTime || source.checkInAt || '',
    checkOut: source.checkOut || source.checkOutTime || source.checkOutAt || '',
    status: String(source.status || source.attendanceStatus || 'pending').toLowerCase(),
    period: String(source.period || source.session || '').toLowerCase(),
    lateEntry: Boolean(source.lateEntry || source.isLate || source.late || false),
    earlyExit: Boolean(source.earlyExit || source.earlyCheckout || false),
    shiftName: source.shift?.name || source.shiftName || source.shift || '',
    nextActionAt: source.nextActionAt || source.checkOutAllowedAt || source.checkInAllowedAt || '',
    permissions: source.permissions || source.access || {},
    blockReason: source.blockReason || source.message || '',
    raw: source,
  };
};

const normalizeAttendanceList = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data.map(normalizeAttendanceRecord);
  if (data && Array.isArray(data.records)) return data.records.map(normalizeAttendanceRecord);
  if (data && Array.isArray(data.attendances)) return data.attendances.map(normalizeAttendanceRecord);
  if (data && typeof data === 'object') {
    const arr = Object.values(data).find(Array.isArray);
    if (arr) return arr.map(normalizeAttendanceRecord);
  }
  return [];
};

const normalizeShiftType = (shift) => {
  if (!shift) return null;
  const source = shift.shiftType || shift.shift || shift;
  const name = firstDefined(source.name, source.shiftName, source.title, source.label, '');
  const startTime = firstDefined(source.startTime, source.shiftStartTime, source.beginTime, source.fromTime, '');
  const endTime = firstDefined(source.endTime, source.shiftEndTime, source.toTime, '');
  const graceMinutes = Number(firstDefined(
    source.lateEntryGracePeriod,
    source.gracePeriod,
    source.graceMinutes,
    source.enableEntryGracePeriod ? source.lateEntryGracePeriod : undefined,
    0,
  )) || 0;
  const checkInEarlyMinutes = Number(firstDefined(
    source.beginCheckinBefore,
    source.checkInEarlyMinutes,
    source.checkInBeforeMinutes,
    0,
  )) || 0;
  const checkOutAfterMinutes = Number(firstDefined(
    source.allowCheckoutAfter,
    source.checkOutAfterMinutes,
    0,
  )) || 0;

  return {
    id: source.id || source._id || '',
    name,
    startTime,
    endTime,
    status: String(source.status || (source.active === false ? 'inactive' : 'active')).toLowerCase(),
    beginCheckinBefore: checkInEarlyMinutes,
    allowCheckoutAfter: checkOutAfterMinutes,
    lateEntryGracePeriod: graceMinutes,
    enableEntryGracePeriod: Boolean(source.enableEntryGracePeriod ?? graceMinutes > 0),
    enableExitGracePeriod: Boolean(source.enableExitGracePeriod ?? checkOutAfterMinutes > 0),
    workingHoursCalculation: source.workingHoursCalculation || '',
    raw: source,
  };
};

const matchAssignedShift = (assignedValue, shiftTypes) => {
  if (!assignedValue) return null;
  const assignedObject = typeof assignedValue === 'object' ? assignedValue : null;
  const assignedId = assignedObject?.id || assignedObject?._id || null;
  const assignedName = String(
    assignedObject?.name ||
      assignedObject?.title ||
      assignedObject?.shiftName ||
      assignedValue ||
      '',
  ).trim().toLowerCase();

  const matched = shiftTypes.find((shift) => {
    const normalizedName = String(shift.name || '').trim().toLowerCase();
    return (
      (assignedId && String(shift.id || shift._id) === String(assignedId)) ||
      (assignedName && normalizedName === assignedName)
    );
  });

  return matched ? normalizeShiftType(matched) : null;
};

const resolveShiftFromContext = (attendanceInfo, profileUser, shiftTypes) => {
  const assignedShiftCandidate = firstDefined(
    attendanceInfo?.shift,
    attendanceInfo?.shiftName,
    attendanceInfo?.shiftId,
    attendanceInfo?.assignedShift,
    attendanceInfo?.employmentAssignedShift,
    attendanceInfo?.employmentCurrentShift,
    profileUser?.employmentAssignedShift,
    profileUser?.employmentCurrentShift,
    profileUser?.employmentShift,
    profileUser?.shift,
  );

  const matchedShift = matchAssignedShift(assignedShiftCandidate, shiftTypes);
  if (matchedShift) return matchedShift;

  const fallbackShift = normalizeShiftType({
    id: assignedShiftCandidate?.id || assignedShiftCandidate?._id || '',
    name:
      typeof assignedShiftCandidate === 'object'
        ? assignedShiftCandidate?.name || assignedShiftCandidate?.title || ''
        : String(assignedShiftCandidate || ''),
    startTime: firstDefined(
      attendanceInfo?.shiftStartTime,
      attendanceInfo?.employmentShiftStartTime,
      profileUser?.employmentShiftStartTime,
      profileUser?.employmentShift?.startTime,
    ),
    endTime: firstDefined(
      attendanceInfo?.shiftEndTime,
      attendanceInfo?.employmentShiftEndTime,
      profileUser?.employmentShiftEndTime,
      profileUser?.employmentShift?.endTime,
    ),
    beginCheckinBefore: firstDefined(
      attendanceInfo?.beginCheckinBefore,
      attendanceInfo?.employmentBeginCheckinBefore,
      profileUser?.employmentBeginCheckinBefore,
      profileUser?.employmentShift?.beginCheckinBefore,
    ),
    allowCheckoutAfter: firstDefined(
      attendanceInfo?.allowCheckoutAfter,
      attendanceInfo?.employmentAllowCheckoutAfter,
      profileUser?.employmentAllowCheckoutAfter,
      profileUser?.employmentShift?.allowCheckoutAfter,
    ),
    lateEntryGracePeriod: firstDefined(
      attendanceInfo?.lateEntryGracePeriod,
      attendanceInfo?.employmentLateEntryGracePeriod,
      profileUser?.employmentLateEntryGracePeriod,
      profileUser?.employmentShift?.lateEntryGracePeriod,
    ),
    enableEntryGracePeriod: firstDefined(
      attendanceInfo?.enableEntryGracePeriod,
      attendanceInfo?.employmentEnableEntryGracePeriod,
      profileUser?.employmentEnableEntryGracePeriod,
      profileUser?.employmentShift?.enableEntryGracePeriod,
    ),
    enableExitGracePeriod: firstDefined(
      attendanceInfo?.enableExitGracePeriod,
      attendanceInfo?.employmentEnableExitGracePeriod,
      profileUser?.employmentEnableExitGracePeriod,
      profileUser?.employmentShift?.enableExitGracePeriod,
    ),
    status: firstDefined(
      attendanceInfo?.shiftStatus,
      attendanceInfo?.employmentShiftStatus,
      profileUser?.employmentShiftStatus,
      profileUser?.employmentShift?.status,
      'active',
    ),
    workingHoursCalculation: firstDefined(
      attendanceInfo?.workingHoursCalculation,
      profileUser?.workingHoursCalculation,
      profileUser?.employmentShift?.workingHoursCalculation,
    ),
  });

  return fallbackShift?.name || fallbackShift?.startTime || fallbackShift?.endTime ? fallbackShift : null;
};

const normalizeShiftAssignment = (item) => {
  const source = item?.shiftAssignment || item?.assignment || item?.record || item?.data || item || {};
  const employee = source.employee || item?.employee || item?.user || {};
  const shiftType = source.shiftType || item?.shiftType || source.shift || item?.shift || null;
  const shiftTypeId = firstDefined(source.shiftTypeId, item?.shiftTypeId, shiftType?.id, shiftType?._id, '');

  return {
    id: source.id || item?.id || source._id || '',
    employeeId: firstDefined(source.employeeId, item?.employeeId, employee.id, employee.userId, ''),
    employeeName: firstDefined(
      employee.name,
      employee.fullName,
      source.employeeName,
      item?.employeeName,
      '',
    ),
    departmentName: firstDefined(
      employee.departmentName,
      employee.department,
      source.departmentName,
      source.department,
      item?.departmentName,
      item?.department,
      '',
    ),
    shiftTypeId: shiftTypeId ? String(shiftTypeId) : '',
    shiftType: shiftType ? normalizeShiftType(shiftType) : null,
    date: source.date || source.shiftDate || source.assignmentDate || item?.date || '',
    status: String(source.status || item?.status || '').toLowerCase(),
    raw: source,
  };
};

const AttendanceStatusPill = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.tone}`}>
      {meta.label}
    </span>
  );
};

const EmployeeAttendance = () => {
  const [view, setView] = useState('calendar');
  const [time, setTime] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(
    month === new Date().getMonth() && year === new Date().getFullYear() ? new Date().getDate() : 1,
  );

  const [loadingShift, setLoadingShift] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [employeeName, setEmployeeName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [shiftInfo, setShiftInfo] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [records, setRecords] = useState([]);

  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const shiftLoadLock = useRef(false);
  const attendanceLoadLock = useRef(false);

  const isCurrentMonth = month === time.getMonth() && year === time.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthKey = useMemo(() => `${year}-${pad2(month + 1)}`, [month, year]);
  const todayKey = toDateKey(time);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [todayKey]);

  useEffect(() => {
    if (isCurrentMonth) {
      setSelectedDay(time.getDate());
    } else if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [isCurrentMonth, time, selectedDay, daysInMonth]);

  const loadShiftContext = useCallback(async ({ quiet = false } = {}) => {
    if (shiftLoadLock.current) return;
    shiftLoadLock.current = true;
    if (!quiet) setLoadingShift(true);
    setErrorMsg('');

    try {
      const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const profileRes = await authService.getProfile();
      const profileUser = profileRes.success ? (profileRes.data?.user || storedUser) : storedUser;
      const userId = profileUser?.id || profileUser?._id;

      const [attendanceInfoRes, shiftTypesRes, shiftAssignmentsRes] = await Promise.all([
        userId ? attendanceService.getEmployeeInfo(Number(userId)) : Promise.resolve({ success: false, data: null }),
        shiftService.getShiftTypes(),
        userId
          ? shiftAssignmentService.getEmployeeAssignments(Number(userId), todayKey, todayKey)
          : Promise.resolve({ success: false, data: [] }),
      ]);

      const attendanceInfo = attendanceInfoRes.success ? (attendanceInfoRes.data || {}) : {};
      const shiftTypes = shiftTypesRes.success && Array.isArray(shiftTypesRes.data) ? shiftTypesRes.data : [];
      const assignmentList = shiftAssignmentsRes.success && Array.isArray(shiftAssignmentsRes.data)
        ? shiftAssignmentsRes.data.map(normalizeShiftAssignment)
        : [];
      const todayAssignment = assignmentList.find((assignment) => toDateKey(assignment.date) === todayKey) || assignmentList[0] || null;

      const resolvedShift = todayAssignment
        ? (
            todayAssignment.shiftType
            || (todayAssignment.shiftTypeId ? matchAssignedShift({ id: todayAssignment.shiftTypeId }, shiftTypes) : null)
            || null
          )
        : resolveShiftFromContext(attendanceInfo, profileUser, shiftTypes);

      const resolvedEmployeeName =
        todayAssignment?.employeeName ||
        attendanceInfo.empName ||
        attendanceInfo.employeeName ||
        profileUser.name ||
        profileUser.firstName ||
        'Employee';

      const resolvedDepartment =
        todayAssignment?.departmentName ||
        attendanceInfo.departmentName ||
        attendanceInfo.department ||
        profileUser.departmentName ||
        profileUser.department ||
        '—';

      setEmployeeName(resolvedEmployeeName);
      setDepartmentName(resolvedDepartment);
      setShiftInfo(resolvedShift);
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load shift details. Please refresh and try again.');
    } finally {
      shiftLoadLock.current = false;
      if (!quiet) setLoadingShift(false);
    }
  }, [todayKey]);

  const loadAttendanceState = useCallback(async ({ quiet = false } = {}) => {
    if (attendanceLoadLock.current) return;
    attendanceLoadLock.current = true;
    if (!quiet) setLoadingAttendance(true);
    setErrorMsg('');

    try {
      const [todayRes, monthRes] = await Promise.all([
        attendanceService.getTodayStatus(),
        attendanceService.getMyAttendance(monthKey),
      ]);

      if (todayRes.success) {
        const todayPayload = todayRes.data?.record || todayRes.data?.attendance || todayRes.data?.data || todayRes.data;
        setTodayAttendance(todayPayload ? normalizeAttendanceRecord(todayPayload) : null);
      }

      if (monthRes.success) {
        setRecords(normalizeAttendanceList(monthRes.data));
      } else {
        setErrorMsg(monthRes.message || 'Failed to load attendance history');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load attendance data. Please try again.');
    } finally {
      attendanceLoadLock.current = false;
      if (!quiet) setLoadingAttendance(false);
    }
  }, [monthKey]);

  useEffect(() => {
    loadShiftContext();
  }, [loadShiftContext]);

  useEffect(() => {
    loadAttendanceState({ quiet: false });
  }, [loadAttendanceState]);

  useEffect(() => {
    const handleFocus = () => {
      loadShiftContext({ quiet: true });
      loadAttendanceState({ quiet: true });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    const refreshTimer = setInterval(() => {
      loadAttendanceState({ quiet: true });
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(refreshTimer);
    };
  }, [loadAttendanceState, loadShiftContext]);

  const selectedDate = new Date(year, month, selectedDay);
  const selectedDateKey = toDateKey(selectedDate);
  const todayRecord = todayAttendance && toDateKey(todayAttendance.date) === todayKey ? todayAttendance : null;

  const selectedRecord = useMemo(
    () => records.find((record) => toDateKey(record.date) === selectedDateKey) || null,
    [records, selectedDateKey],
  );

  const currentAttendance = todayRecord;
  const hasShift = Boolean(shiftInfo?.name || shiftInfo?.startTime || shiftInfo?.endTime);
  const currentShiftStatus = shiftInfo?.status || 'active';

  const shiftStart = hasShift ? buildDateTime(time, shiftInfo.startTime) : null;
  const shiftEnd = hasShift ? buildDateTime(time, shiftInfo.endTime) : null;
  if (shiftStart && shiftEnd && shiftEnd <= shiftStart) {
    shiftEnd.setDate(shiftEnd.getDate() + 1);
  }

  const checkInOpenAt = useMemo(() => {
    if (currentAttendance?.permissions?.checkInAllowedAt) {
      return new Date(currentAttendance.permissions.checkInAllowedAt);
    }
    if (currentAttendance?.checkInAllowedAt) {
      return new Date(currentAttendance.checkInAllowedAt);
    }
    if (!shiftStart) return null;
    return new Date(shiftStart.getTime() - (Number(shiftInfo?.beginCheckinBefore) || 0) * 60000);
  }, [
    currentAttendance?.checkInAllowedAt,
    currentAttendance?.permissions?.checkInAllowedAt,
    shiftInfo?.beginCheckinBefore,
    shiftStart,
  ]);

  const checkOutOpenAt = useMemo(() => {
    if (currentAttendance?.permissions?.checkOutAllowedAt) {
      return new Date(currentAttendance.permissions.checkOutAllowedAt);
    }
    if (currentAttendance?.checkOutAllowedAt) {
      return new Date(currentAttendance.checkOutAllowedAt);
    }
    if (!shiftEnd) return null;
    return new Date(shiftEnd.getTime() + (shiftInfo?.enableExitGracePeriod ? Number(shiftInfo?.allowCheckoutAfter) || 0 : 0) * 60000);
  }, [
    currentAttendance?.checkOutAllowedAt,
    currentAttendance?.permissions?.checkOutAllowedAt,
    shiftEnd,
    shiftInfo?.allowCheckoutAfter,
    shiftInfo?.enableExitGracePeriod,
  ]);

  const hasCheckIn = Boolean(currentAttendance?.checkIn);
  const hasCheckOut = Boolean(currentAttendance?.checkOut);
  const isShiftOver = shiftEnd ? time.getTime() > shiftEnd.getTime() : false;
  const isBeforeCheckInWindow = checkInOpenAt ? time.getTime() < checkInOpenAt.getTime() : false;

  const backendCheckInPermission = currentAttendance?.permissions?.canCheckIn ?? currentAttendance?.canCheckIn;
  const backendCheckOutPermission = currentAttendance?.permissions?.canCheckOut ?? currentAttendance?.canCheckOut;

  const canCheckInNow =
    typeof backendCheckInPermission === 'boolean'
      ? backendCheckInPermission
      : Boolean(
          hasShift &&
            !hasCheckIn &&
            !hasCheckOut &&
            checkInOpenAt &&
            shiftEnd &&
            time.getTime() >= checkInOpenAt.getTime() &&
            time.getTime() <= shiftEnd.getTime(),
        );

  const canCheckOutNow =
    typeof backendCheckOutPermission === 'boolean'
      ? backendCheckOutPermission
      : Boolean(
          hasShift &&
            hasCheckIn &&
            !hasCheckOut &&
            checkOutOpenAt &&
            time.getTime() >= checkOutOpenAt.getTime(),
        );

  const computedStatus = !hasShift
    ? 'no_shift'
    : hasCheckOut
      ? 'checked_out'
      : hasCheckIn
        ? currentAttendance?.lateEntry
          ? 'late'
          : 'checked_in'
        : isShiftOver
          ? 'absent'
          : 'pending';

  const todayMessage = useMemo(() => {
    if (!hasShift) {
      return 'No shift has been assigned to you. Please contact your administrator.';
    }

    if (hasCheckOut) {
      return 'Your attendance for today has been completed.';
    }

    if (hasCheckIn && !hasCheckOut && checkOutOpenAt) {
      if (canCheckOutNow) {
        return 'You are now eligible to check out.';
      }
      return `Check-out becomes available in ${formatCountdown(checkOutOpenAt, time)}.`;
    }

    if (isBeforeCheckInWindow && checkInOpenAt) {
      return `Your shift starts at ${formatTime(shiftInfo?.startTime)}. Check-in opens in ${formatCountdown(checkInOpenAt, time)}.`;
    }

    if (canCheckInNow) {
      return 'Check-in is now available for your assigned shift.';
    }

    if (isShiftOver && !hasCheckIn) {
      return 'Attendance window has closed for today.';
    }

    return `Your shift starts at ${formatTime(shiftInfo?.startTime) || '—'}.`;
  }, [
    canCheckInNow,
    canCheckOutNow,
    checkInOpenAt,
    checkOutOpenAt,
    hasCheckIn,
    hasCheckOut,
    hasShift,
    isBeforeCheckInWindow,
    isShiftOver,
    shiftInfo?.startTime,
    time,
  ]);

  const selectedRecordStatus = useMemo(() => {
    if (!selectedRecord) {
      if (!selectedDateKey) return 'pending';
      if (selectedDateKey < todayKey) return 'absent';
      if (selectedDateKey === todayKey) return computedStatus;
      return 'pending';
    }

    if (selectedRecord.status === 'present' && selectedRecord.lateEntry) return 'late';
    if (selectedRecord.status === 'completed' || selectedRecord.checkOut) return 'checked_out';
    if (selectedRecord.status === 'present' || selectedRecord.status === 'checked_in') return 'present';
    return selectedRecord.status || 'pending';
  }, [computedStatus, selectedDateKey, selectedRecord, todayKey]);

  const attendanceStats = useMemo(() => {
    const present = records.filter((record) => ['present', 'checked_in'].includes(record.status) || record.checkIn).length;
    const late = records.filter((record) => record.lateEntry || record.status === 'late').length;
    const absent = records.filter((record) => record.status === 'absent').length;
    const checkedOut = records.filter((record) => record.checkOut || record.status === 'checked_out' || record.status === 'completed').length;

    return { present, late, absent, checkedOut };
  }, [records]);

  const attendanceMap = useMemo(() => {
    const map = {};
    records.forEach((record) => {
      const key = toDateKey(record.date);
      if (!key) return;
      if (record.status === 'present' && record.period === 'half_day') {
        map[key] = 'half_day';
        return;
      }
      if (record.status === 'present' && record.lateEntry) {
        map[key] = 'late';
        return;
      }
      if (record.status === 'completed' || record.checkOut) {
        map[key] = 'checked_out';
        return;
      }
      map[key] = record.status || 'pending';
    });
    return map;
  }, [records]);

  const handleCheckIn = async () => {
    setErrorMsg('');
    setCheckInLoading(true);
    try {
      const res = await attendanceService.checkInSelf();
      if (res.success) {
        toast.success('Check-in successful.');
        await loadAttendanceState({ quiet: false });
      } else {
        toast.error(res.message || 'Failed to check in');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to check in');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setErrorMsg('');
    setCheckOutLoading(true);
    try {
      const res = await attendanceService.checkOutSelf();
      if (res.success) {
        toast.success('Check-out successful.');
        await loadAttendanceState({ quiet: false });
      } else {
        toast.error(res.message || 'Failed to check out');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to check out');
    } finally {
      setCheckOutLoading(false);
    }
  };

  const selectedRecordCheckIn = selectedRecord?.checkIn ? formatTime(selectedRecord.checkIn) : '--';
  const selectedRecordCheckOut = selectedRecord?.checkOut ? formatTime(selectedRecord.checkOut) : '--';
  const selectedRecordHours =
    selectedRecord?.checkIn && selectedRecord?.checkOut
      ? formatDuration(new Date(selectedRecord.checkOut).getTime() - new Date(selectedRecord.checkIn).getTime())
      : selectedRecord?.checkIn
        ? 'In progress'
        : '--';

  const renderSelectedDayDetails = () => {
    const label = formatDateLabel(selectedDate);

    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-violet-50/30 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-600">Selected Day</p>
            <h3 className="mt-1 text-base font-bold text-slate-900">{label}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AttendanceStatusPill status={selectedRecordStatus} />
              {selectedRecord?.lateEntry && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Late Check-in
                </span>
              )}
              {selectedRecord?.earlyExit && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Early Checkout
                </span>
              )}
            </div>
          </div>

          <div className="grid min-w-[280px] grid-cols-3 gap-3 md:min-w-[420px]">
            <div className="rounded-xl border border-slate-100 bg-white/80 p-3 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Check In</p>
              <p className={`text-sm font-bold ${selectedRecord?.lateEntry ? 'text-amber-600' : 'text-slate-700'}`}>{selectedRecordCheckIn}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/80 p-3 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Check Out</p>
              <p className="text-sm font-bold text-slate-700">{selectedRecordCheckOut}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/80 p-3 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Hours</p>
              <p className="text-sm font-bold text-slate-700">{selectedRecordHours}</p>
            </div>
          </div>
        </div>

        {!selectedRecord && selectedDateKey !== todayKey && (
          <p className="mt-4 text-sm text-slate-500">
            {selectedDateKey < todayKey ? 'No record found. This day is marked as absent.' : 'No attendance record yet for this date.'}
          </p>
        )}
      </div>
    );
  };

  const renderCalendarCell = (day) => {
    const date = new Date(year, month, day);
    const key = toDateKey(date);
    const isToday = key === todayKey;
    const isSelected = day === selectedDay;
    const status = attendanceMap[key] || (isToday ? 'pending' : '');
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const finalStatus = status || (isWeekend ? 'weekend' : '');

    const cellClass = finalStatus === 'pending'
      ? 'bg-white border-slate-200 text-slate-700'
      : finalStatus === 'weekend'
        ? 'bg-slate-50 border-slate-100 text-slate-400'
        : finalStatus === 'absent'
          ? 'bg-rose-50 border-rose-100 text-rose-700'
          : finalStatus === 'late'
            ? 'bg-amber-50 border-amber-100 text-amber-700'
            : finalStatus === 'checked_out'
              ? 'bg-sky-50 border-sky-100 text-sky-700'
              : finalStatus === 'present' || finalStatus === 'checked_in'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700';

    return (
      <div
        key={day}
        onClick={() => setSelectedDay(day)}
        className={`aspect-square cursor-pointer rounded-xl border p-2 transition-all hover:scale-[1.02] ${cellClass} ${isSelected ? 'ring-2 ring-violet-500 shadow-sm' : ''}`}
        style={isToday ? { boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.15)' } : undefined}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className={`text-xs font-semibold ${isToday ? 'text-violet-700' : ''}`}>{day}</span>
            {isToday && <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Today</span>}
          </div>
          <div>
            {finalStatus && finalStatus !== 'pending' && finalStatus !== 'weekend' && (
              <p className="text-[9px] font-bold uppercase tracking-wide">{STATUS_META[finalStatus]?.label || finalStatus}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const loadingState = loadingShift || loadingAttendance;
  const showCheckInButton = hasShift && !hasCheckIn && !hasCheckOut && canCheckInNow && !checkInLoading;
  const showCheckOutButton = hasShift && hasCheckIn && !hasCheckOut && canCheckOutNow && !checkOutLoading;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance</h1>
          <p className="mt-0.5 text-sm text-slate-500">Shift-based check-in and check-out with live status tracking</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-violet-600" />
            <span>{formatDateLabel(time)}</span>
            <span className="text-slate-300">•</span>
            <span className="tabular-nums text-violet-700">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#756FCC] via-[#8B6FD9] to-[#B58CEC] p-5 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
          <div className="flex-1 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-100">Assigned shift</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{shiftInfo?.name || 'No shift assigned'}</h2>
              {currentShiftStatus && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize text-violet-50">
                  {currentShiftStatus}
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] uppercase tracking-wide text-violet-100">Employee</p>
                <p className="mt-1 text-sm font-semibold">{employeeName}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] uppercase tracking-wide text-violet-100">Department</p>
                <p className="mt-1 text-sm font-semibold">{departmentName}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] uppercase tracking-wide text-violet-100">Shift timing</p>
                <p className="mt-1 text-sm font-semibold">
                  {shiftInfo?.startTime ? formatTime(shiftInfo.startTime) : '—'}{' '}
                  <span className="text-violet-100">→</span>{' '}
                  {shiftInfo?.endTime ? formatTime(shiftInfo.endTime) : '—'}
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] uppercase tracking-wide text-violet-100">Grace period</p>
                <p className="mt-1 text-sm font-semibold">
                  {shiftInfo?.enableEntryGracePeriod ? `${shiftInfo.lateEntryGracePeriod || 0} min late` : '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-xs text-violet-100">Today’s status</p>
              <div className="mt-2">
                <AttendanceStatusPill status={computedStatus} />
              </div>
              <p className="mt-3 text-sm text-violet-50">{todayMessage}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="text-xs text-violet-100">Check-in / Check-out</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/15 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-violet-100">Check In</p>
                  <p className="mt-1 text-base font-bold">{currentAttendance?.checkIn ? formatTime(currentAttendance.checkIn) : '--:--'}</p>
                </div>
                <div className="rounded-xl bg-white/15 p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-violet-100">Check Out</p>
                  <p className="mt-1 text-base font-bold">{currentAttendance?.checkOut ? formatTime(currentAttendance.checkOut) : '--:--'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {showCheckInButton && (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkInLoading || loadingState}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#756FCC] transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkInLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Check In
                  </button>
                )}

                {showCheckOutButton && (
                  <button
                    onClick={handleCheckOut}
                    disabled={checkOutLoading || loadingState}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkOutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Check Out
                  </button>
                )}

                {!hasShift && (
                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-violet-50">
                    No shift has been assigned to you. Please contact your administrator.
                  </div>
                )}

                {hasShift && !hasCheckIn && !hasCheckOut && isBeforeCheckInWindow && checkInOpenAt && (
                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-violet-50">
                    Check-in opens in {formatCountdown(checkInOpenAt, time)}.
                  </div>
                )}

                {hasShift && hasCheckIn && !hasCheckOut && !canCheckOutNow && checkOutOpenAt && (
                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-violet-50">
                    Check-out opens in {formatCountdown(checkOutOpenAt, time)}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Present', value: attendanceStats.present, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Late', value: attendanceStats.late, icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
          { label: 'Absent', value: attendanceStats.absent, icon: XCircle, color: 'bg-rose-100 text-rose-500' },
          { label: 'Checked Out', value: attendanceStats.checkedOut, icon: Clock, color: 'bg-sky-100 text-sky-600' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setView('calendar')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                view === 'calendar' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('history')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                view === 'history' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              History
            </button>
          </div>

          {view === 'calendar' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (month === 0) {
                    setMonth(11);
                    setYear((prev) => prev - 1);
                  } else {
                    setMonth((prev) => prev - 1);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-36 text-center text-sm font-semibold text-slate-700">
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={() => {
                  if (month === 11) {
                    setMonth(0);
                    setYear((prev) => prev + 1);
                  } else {
                    setMonth((prev) => prev + 1);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {loadingState ? (
          <div className="p-10 text-center text-sm text-slate-500">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-violet-600" />
            Loading attendance data...
          </div>
        ) : view === 'calendar' ? (
          <div className="p-5">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <div key={day} className="px-1 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, idx) => renderCalendarCell(idx + 1))}
            </div>

            {renderSelectedDayDetails()}

            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
              {[
                ['Present', 'bg-emerald-400'],
                ['Late', 'bg-amber-400'],
                ['Absent', 'bg-rose-400'],
                ['Checked Out', 'bg-sky-400'],
                ['Weekend', 'bg-slate-300'],
                ['Holiday', 'bg-violet-400'],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-[11px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {records.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">No attendance records found for this month.</div>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    {['Date', 'Day', 'Check In', 'Check Out', 'Hours', 'Status', 'Period'].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-[12px] font-bold uppercase tracking-wide whitespace-nowrap">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map((record) => {
                    const key = toDateKey(record.date);
                    const status = record.status === 'present' && record.lateEntry ? 'late' : record.status;
                    const hours =
                      record.checkIn && record.checkOut
                        ? formatDuration(new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime())
                        : record.checkIn
                          ? 'In progress'
                          : '-';
                    const dateObj = key ? new Date(key) : new Date(record.date);
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-700">{formatShortDate(record.date)}</td>
                        <td className="px-5 py-3 text-xs text-slate-500">{DAYS[dateObj.getDay()] || '-'}</td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-600">{record.checkIn ? formatTime(record.checkIn) : '-'}</td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-600">{record.checkOut ? formatTime(record.checkOut) : '-'}</td>
                        <td className="px-5 py-3 text-xs text-slate-600">{hours}</td>
                        <td className="px-5 py-3">
                          <AttendanceStatusPill status={status} />
                        </td>
                        <td className="px-5 py-3">
                          {record.period ? (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                              {record.period.replace(/_/g, ' ')}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
