import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle, Camera, Check, CheckCircle2, ChevronLeft, Eye, EyeOff,
  Fingerprint, KeyRound, Loader2, RefreshCw, ScanFace, ShieldCheck, Sparkles,
  UserRoundCheck, X,
} from 'lucide-react';
import { useFaceAttendance } from './FaceAttendanceContext';
import { faceAttendanceService } from './faceAttendanceService';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function ModalShell({ children, onClose, wide = false }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', close);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div role="dialog" aria-modal="true" className={cx('relative max-h-[94vh] w-full overflow-y-auto rounded-3xl border border-white/60 bg-white shadow-2xl', wide ? 'max-w-3xl' : 'max-w-xl')}>
        {onClose && <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"><X size={18} /></button>}
        {children}
      </div>
    </div>
  );
}

export function FaceStatusBadge({ registered }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', registered ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
    {registered ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}{registered ? 'Registered' : 'Not registered'}
  </span>;
}

export function FaceAttendanceCard({ onRegister }) {
  const { faceProfile, faceProfileLoading } = useFaceAttendance();
  const updated = faceProfile.faceUpdatedAt ? new Date(faceProfile.faceUpdatedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not registered yet';
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-100/60 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-violet-100 to-indigo-100 shadow-md">
            {faceProfile.faceImage ? <img src={faceProfile.faceImage} alt="Registered face" className="h-full w-full object-cover" /> : <ScanFace className="absolute inset-0 m-auto h-10 w-10 text-violet-500" />}
            <span className={cx('absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-white', faceProfile.faceRegistered ? 'bg-emerald-500' : 'bg-rose-400')} />
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-slate-900">Face Attendance</h2><FaceStatusBadge registered={faceProfile.faceRegistered} /></div>
            <p className="text-sm text-slate-500">Secure, touch-free attendance verification.</p>
            <p className="mt-2 text-xs font-medium text-slate-400">Last updated · {updated}</p>
          </div>
        </div>
        <button disabled={faceProfileLoading} onClick={onRegister} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:cursor-wait disabled:opacity-60">
          {faceProfileLoading ? <Loader2 className="animate-spin" size={16} /> : faceProfile.faceRegistered ? <RefreshCw size={16} /> : <ScanFace size={17} />}{faceProfileLoading ? 'Checking...' : faceProfile.faceRegistered ? 'Update Face' : 'Register Face'}
        </button>
      </div>
    </section>
  );
}

export function PermissionScreen({ onGranted, error, setError }) {
  const [loading, setLoading] = useState(false);
  const request = async () => {
    setLoading(true); setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('No compatible camera was found on this device.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      onGranted(stream);
    } catch (err) {
      setError(err?.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser settings, then retry.' : err.message || 'Unable to open the camera.');
    } finally { setLoading(false); }
  };
  return <div className="px-6 py-10 text-center sm:px-10">
    <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-violet-100 text-violet-600"><Camera size={38} /></div>
    <h3 className="text-xl font-bold text-slate-900">Camera access needed</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Your camera is used only to capture the verification image. Nothing is recorded in the background.</p>
    {error && <div className="mx-auto mt-5 flex max-w-md gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-left text-sm text-rose-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}
    <button disabled={loading} onClick={request} className="mt-6 inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}{loading ? 'Requesting access...' : error ? 'Retry Camera' : 'Allow Camera'}</button>
  </div>;
}

export function ImagePreview({ image, onRetake, onConfirm, confirmLabel = 'Confirm Face', loading = false }) {
  return <div className="p-6 sm:p-8">
    <div className="overflow-hidden rounded-2xl bg-slate-950"><img src={image} alt="Captured face preview" className="aspect-video w-full object-cover -scale-x-100" /></div>
    <p className="mt-4 text-center text-sm text-slate-500">Make sure your face is clear, centered, and well lit.</p>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <button disabled={loading} onClick={onRetake} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><RefreshCw size={17} />Retake</button>
      <button disabled={loading} onClick={onConfirm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={17} /> : <Check size={17} />}{loading ? 'Processing...' : confirmLabel}</button>
    </div>
  </div>;
}

export function CameraCapture({ initialStream, onCapture, onCancel }) {
  const videoRef = useRef(null); const stopTimerRef = useRef(null); const [ready, setReady] = useState(false); const [error, setError] = useState('');
  useEffect(() => {
    const video = videoRef.current;
    // React StrictMode replays effects in development. Delaying cleanup prevents
    // that replay from permanently stopping the newly granted camera stream.
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    if (video && initialStream) {
      video.srcObject = initialStream;
    }
    return () => {
      stopTimerRef.current = setTimeout(() => {
        initialStream?.getTracks().forEach((track) => track.stop());
      }, 0);
    };
  }, [initialStream]);
  const startPreview = async () => {
    try {
      await videoRef.current?.play();
      setReady(true);
      setError('');
    } catch {
      setReady(false);
      setError('Camera preview could not be started. Please retry camera access.');
    }
  };
  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return setError('Camera is still loading. Please wait a moment.');
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0); onCapture(canvas.toDataURL('image/jpeg', .88));
  };
  return <div className="p-4 sm:p-6">
    <div className="mb-4 text-center"><p className="font-semibold text-slate-900">Align your face inside the frame</p><p className="mt-1 text-xs text-slate-500">Keep still and look directly into the camera</p></div>
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950">
      {!ready && <div className="absolute inset-0 z-10 grid place-items-center text-white"><div className="text-center"><Loader2 className="mx-auto animate-spin" /><p className="mt-2 text-xs">Starting camera...</p></div></div>}
      <video ref={videoRef} muted autoPlay playsInline onLoadedMetadata={startPreview} onPlaying={() => setReady(true)} onError={() => setError('The camera stream was interrupted. Please retry.')} className="h-full w-full object-cover -scale-x-100" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_30%_43%_at_50%_48%,transparent_98%,rgba(2,6,23,.58)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-white/90 shadow-[0_0_0_1px_rgba(124,58,237,.8)]" />
    </div>
    {error && <p className="mt-3 text-center text-sm text-rose-600">{error}</p>}
    <div className="mt-5 flex items-center justify-center gap-4">
      <button onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
      <button disabled={!ready} onClick={capture} aria-label="Capture face" className="group grid h-16 w-16 place-items-center rounded-full border-4 border-violet-100 bg-violet-600 text-white shadow-lg shadow-violet-200 transition hover:scale-105 disabled:opacity-50"><Camera size={25} className="group-active:scale-75" /></button>
    </div>
  </div>;
}

const instructions = ['Sit in good, even lighting', 'Remove sunglasses and face coverings', 'Keep your face centered in the frame', 'Make sure only one person appears', 'Look directly into the camera'];

export function FaceRegistrationWizard({ onClose, onRegistered }) {
  const { saveFaceProfile } = useFaceAttendance(); const [step, setStep] = useState('instructions'); const [understood, setUnderstood] = useState(false); const [stream, setStream] = useState(null); const [image, setImage] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const confirm = async () => { setLoading(true); setError(''); try { const result = await faceAttendanceService.registerFace(image); saveFaceProfile(result.data); setStep('success'); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return <ModalShell onClose={onClose} wide>
    {step !== 'success' && <div className="border-b border-slate-100 px-6 py-5"><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Face registration</p><h2 className="mt-1 text-xl font-bold text-slate-900">{step === 'instructions' ? 'Before you begin' : step === 'permission' ? 'Enable your camera' : image ? 'Review your photo' : 'Capture your face'}</h2></div>}
    {step === 'instructions' && <div className="p-6 sm:p-8"><div className="grid gap-3 sm:grid-cols-2">{instructions.map((item, i) => <div key={item} className={cx('flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3', i === 4 && 'sm:col-span-2')}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">{i + 1}</span><span className="text-sm font-medium text-slate-700">{item}</span></div>)}</div><label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4"><input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="h-4 w-4 accent-violet-600" /><span className="text-sm font-semibold text-slate-700">I understand and I’m ready to continue</span></label><button disabled={!understood} onClick={() => setStep('permission')} className="mt-5 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Continue</button></div>}
    {step === 'permission' && <PermissionScreen error={error} setError={setError} onGranted={(value) => { setStream(value); setStep('camera'); }} />}
    {step === 'camera' && !image && <CameraCapture initialStream={stream} onCancel={onClose} onCapture={(value) => { setImage(value); stream?.getTracks().forEach(t => t.stop()); }} />}
    {step === 'camera' && image && <><ImagePreview image={image} loading={loading} onRetake={() => { setImage(null); setStep('permission'); }} onConfirm={confirm} />{error && <p className="px-6 pb-5 text-center text-sm text-rose-600">{error}</p>}</>}
    {step === 'success' && <div className="px-6 py-12 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-[pulse_1.5s_ease-in-out_infinite]"><UserRoundCheck size={48} /></div><h2 className="mt-6 text-2xl font-bold text-slate-900">Face Registered Successfully</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Your face profile is ready. You can now use secure face verification for attendance.</p><button onClick={() => { onRegistered?.(); onClose(); }} className="mt-7 rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white hover:bg-violet-700">Done</button></div>}
  </ModalShell>;
}

export function VerificationOptionCard({ icon, title, description, onClick, disabled, children }) {
  const OptionIcon = icon;
  return <div className={cx('rounded-2xl border p-5 transition-all', disabled ? 'border-slate-100 bg-slate-50' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50')}><div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600"><OptionIcon size={23} /></div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{description}</p>{children || <button disabled={disabled} onClick={onClick} className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">Continue</button>}</div>;
}

export function AttendanceSuccessModal({ result, onClose }) {
  const checkout = result.type === 'check-out';
  return <ModalShell onClose={onClose}><div className="p-7 text-center sm:p-10"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={42} /></div><h2 className="mt-5 text-2xl font-bold text-slate-900">{checkout ? 'Check Out Successful' : 'Attendance marked successfully'}</h2><p className="mt-2 text-sm text-slate-500">Your attendance record has been securely updated.</p><div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-left"><div><p className="text-xs text-slate-400">{checkout ? 'Check Out Time' : 'Check In Time'}</p><p className="mt-1 font-bold text-slate-800">{new Date(result.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p></div><div><p className="text-xs text-slate-400">Verification Method</p><p className="mt-1 font-bold text-slate-800">{result.method === 'face' ? 'Face Recognition' : 'Password'}</p></div>{checkout && <><div><p className="text-xs text-slate-400">Working Hours</p><p className="mt-1 font-bold text-slate-800">8h 12m</p></div><div><p className="text-xs text-slate-400">Break Time</p><p className="mt-1 font-bold text-slate-800">42m</p></div><div className="col-span-2"><p className="text-xs text-slate-400">Total Duration</p><p className="mt-1 font-bold text-slate-800">8h 54m</p></div></>}</div><button onClick={onClose} className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Done</button></div></ModalShell>;
}

export function AttendanceFailureModal({ message, onRetry, onClose }) {
  return <ModalShell onClose={onClose}><div className="p-8 text-center"><div className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-rose-100 text-rose-600"><AlertCircle size={36} /></div><h2 className="mt-5 text-xl font-bold text-slate-900">Verification failed</h2><p className="mt-2 text-sm text-slate-500">{message}</p><div className="mt-6 flex gap-3"><button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600">Cancel</button><button onClick={onRetry} className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white">Try Again</button></div></div></ModalShell>;
}

export function AttendanceVerificationModal({ type, onClose, onRegister, onSuccess }) {
  const { faceProfile } = useFaceAttendance(); const [mode, setMode] = useState('choose'); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [stream, setStream] = useState(null); const [image, setImage] = useState(null);
  const finish = async (method, capture) => { setLoading(true); setError(''); try { const result = method === 'password' ? await faceAttendanceService.markPasswordAttendance(type, password) : await faceAttendanceService.markFaceAttendance(type, capture); onSuccess(result.data); } catch (err) { setError(err.message || 'Verification failed. Please try again.'); setMode('failure'); } finally { setLoading(false); } };
  if (mode === 'failure') return <AttendanceFailureModal message={error} onClose={onClose} onRetry={() => { setError(''); setImage(null); setMode('choose'); }} />;
  return <ModalShell onClose={loading ? undefined : onClose} wide>
    {mode === 'choose' && <><div className="border-b border-slate-100 px-6 py-6 sm:px-8"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600"><ShieldCheck size={23} /></div><div><h2 className="text-xl font-bold text-slate-900">Choose Attendance Verification</h2><p className="text-sm text-slate-500">Securely {type === 'check-out' ? 'check out' : 'check in'} using your preferred method.</p></div></div></div><div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8"><VerificationOptionCard icon={KeyRound} title="Mark Attendance with Password" description="Use your employee account password." onClick={() => setMode('password')} /><VerificationOptionCard icon={ScanFace} title="Mark Attendance with Face" description={faceProfile.faceRegistered ? 'Fast, secure facial verification using your camera.' : 'Face not registered. Please register your face before marking attendance.'} disabled={!faceProfile.faceRegistered}>{faceProfile.faceRegistered ? <button onClick={() => setMode('permission')} className="mt-5 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Verify Face</button> : <button onClick={() => { onClose(); onRegister(); }} className="mt-5 w-full rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100">Register Face</button>}</VerificationOptionCard></div></>}
    {mode === 'password' && <div className="p-7 sm:p-9"><button onClick={() => setMode('choose')} className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-violet-600"><ChevronLeft size={17} />Back</button><div className="mx-auto max-w-md"><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-600"><Fingerprint size={28} /></div><h2 className="text-xl font-bold text-slate-900">Confirm with password</h2><p className="mt-1 text-sm text-slate-500">Enter your account password to continue.</p><label className="mt-6 block text-sm font-semibold text-slate-700">Password</label><div className="relative mt-2"><input autoFocus type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && password.trim() && finish('password')} placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <p className="mt-2 text-xs text-rose-600">{error}</p>}<button disabled={!password.trim() || loading} onClick={() => finish('password')} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-45">{loading && <Loader2 className="animate-spin" size={17} />}{loading ? 'Verifying...' : 'Continue'}</button></div></div>}
    {mode === 'permission' && <PermissionScreen error={error} setError={setError} onGranted={(value) => { setStream(value); setMode('camera'); }} />}
    {mode === 'camera' && !image && <CameraCapture initialStream={stream} onCancel={onClose} onCapture={(value) => { setImage(value); stream?.getTracks().forEach(t => t.stop()); }} />}
    {mode === 'camera' && image && <ImagePreview image={image} loading={loading} confirmLabel="Verify Face" onRetake={() => { setImage(null); setMode('permission'); }} onConfirm={() => finish('face', image)} />}
    {loading && mode === 'camera' && <div className="absolute inset-0 z-30 grid place-items-center rounded-3xl bg-white/90 backdrop-blur-sm"><div className="text-center"><div className="relative mx-auto h-20 w-20"><div className="absolute inset-0 rounded-full border-4 border-violet-100" /><div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-violet-600" /><Sparkles className="absolute inset-0 m-auto text-violet-600" /></div><p className="mt-4 font-bold text-slate-900">Verifying...</p><p className="mt-1 text-sm text-slate-500">Matching your secure face profile</p></div></div>}
  </ModalShell>;
}
