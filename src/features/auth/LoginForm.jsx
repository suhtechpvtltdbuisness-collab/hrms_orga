import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserRound,
  ScanFace,
  Building2,
  Camera,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../service";

const MAX_CAPTURE_WIDTH = 960;

function captureFrame(video) {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, MAX_CAPTURE_WIDTH / (video.videoWidth || MAX_CAPTURE_WIDTH));
  canvas.width = Math.max(1, Math.round((video.videoWidth || MAX_CAPTURE_WIDTH) * scale));
  canvas.height = Math.max(1, Math.round((video.videoHeight || 540) * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to capture image from camera.");
  }
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function FaceLoginModal({ open, image, loading, error, onClose, onCapture, onRetake, onConfirm }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [startingCamera, setStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    if (!open || image) return undefined;

    let mounted = true;
    const startCamera = async () => {
      try {
        setStartingCamera(true);
        setCameraError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch (err) {
        setCameraError(
          err?.name === "NotAllowedError"
            ? "Camera access was denied. Please allow camera permission and try again."
            : err?.message || "Unable to access your camera.",
        );
      } finally {
        if (mounted) setStartingCamera(false);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [open, image]);

  if (!open) return null;

  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const dataUrl = captureFrame(videoRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      onCapture(dataUrl);
    } catch (err) {
      setCameraError(err?.message || "Unable to capture your face.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600">Face Login</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {image ? "Review your capture" : "Verify with your face"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!image ? (
            <>
              <div className="mb-4 rounded-2xl bg-slate-950">
                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  {(startingCamera || cameraError) && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950/70 px-6 text-center text-white">
                      {startingCamera ? (
                        <div>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                          <p className="mt-3 text-sm">Starting camera...</p>
                        </div>
                      ) : (
                        <div>
                          <AlertCircle className="mx-auto h-6 w-6 text-rose-300" />
                          <p className="mt-3 text-sm">{cameraError}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <video ref={videoRef} muted autoPlay playsInline className="h-full w-full object-cover -scale-x-100" />
                </div>
              </div>
              <p className="mb-5 text-sm text-slate-500">
                Center your face, remove obstructions, and look directly into the camera before capturing.
              </p>
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <p className="text-sm text-rose-600">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={startingCamera || Boolean(cameraError)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                  Capture Face
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl bg-slate-950">
                <img src={image} alt="Captured face" className="aspect-video w-full object-cover" />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                If the image is clear and centered, continue to sign in with facial verification.
              </p>
              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <p className="text-sm text-rose-600">{error}</p>
                </div>
              )}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onRetake}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  Retake
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
                  {loading ? "Verifying Face..." : "Login with Face"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("password");
  const [error, setError] = useState("");
  const [faceError, setFaceError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceImage, setFaceImage] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", organizationEmail: "" });

  const navigateByRole = (result) => {
    const userData = result.data?.user || result.data || {};
    const role = (userData?.role || "").toLowerCase();
    const type = (userData?.type || "").toLowerCase();
    const roleId = userData?.roleId;
    const isSuperAdmin = roleId == 0 || role === "superadmin" || type === "superadmin";
    const isAdmin =
      roleId == 1 ||
      role === "admin" ||
      type === "admin" ||
      userData?.isAdmin === true;

    if (isSuperAdmin) {
      navigate("/super-admin", { replace: true });
    } else if (isAdmin) {
      navigate("/hrms/dashboard", { replace: true });
    } else {
      navigate("/employee", { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
    if (faceError) setFaceError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await authService.login({ email: form.email, password: form.password });

    if (result.success) {
      navigateByRole(result);
    } else {
      setError(result.message || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && form.email && form.password) {
      handleSubmit();
    }
  };

  const openFaceModal = () => {
    if (!form.organizationEmail) {
      setFaceError("Enter your organization email first so we can match your face within the correct organization.");
      return;
    }
    setFaceImage(null);
    setFaceError("");
    setShowFaceModal(true);
  };

  const closeFaceModal = () => {
    if (faceLoading) return;
    setShowFaceModal(false);
    setFaceImage(null);
  };

  const handleFaceLogin = async () => {
    if (!form.organizationEmail) {
      setFaceError("Please enter your organization email before using face login.");
      return;
    }
    if (!faceImage) {
      setFaceError("Please capture your face to continue.");
      return;
    }

    setFaceLoading(true);
    setFaceError("");
    const result = await authService.faceLogin({
      organizationEmail: form.organizationEmail,
      image: faceImage,
    });

    if (result.success) {
      navigateByRole(result);
      return;
    }

    setFaceError(result.message || "Face login failed. Please try again.");
    setFaceLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <FaceLoginModal
        open={showFaceModal}
        image={faceImage}
        loading={faceLoading}
        error={faceError}
        onClose={closeFaceModal}
        onCapture={setFaceImage}
        onRetake={() => {
          setFaceImage(null);
          setFaceError("");
        }}
        onConfirm={handleFaceLogin}
      />

      <div className="flex items-center justify-center gap-3 mb-8">
        <img src="/images/Orga Logo.svg" alt="ORGA HRMS" className="h-9" />
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Welcome Back</p>
            <p className="text-white/75 text-xs">Sign in to continue to ORGA HRMS</p>
          </div>
        </div>

        <div className="px-8 py-7">
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5 mb-6">
            <UserRound className="w-4 h-4 text-violet-500 shrink-0" />
            <p className="text-xs text-violet-700 font-medium">
              Access is granted automatically based on your account role (Admin or Employee).
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveMode("password")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeMode === "password"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("face")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeMode === "face"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Face Login
              </button>
            </div>
          </div>

          {activeMode === "password" ? (
            <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Password Login</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Use your account email and password to sign in.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 h-11 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your email"
                      className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-3 h-11 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                    <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                      className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right -mt-2">
                  <button type="button" className="text-xs text-violet-600 font-medium hover:underline">
                    Forgot Password? Contact HR
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.email || !form.password}
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-sm"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-violet-600 shadow-sm">
                  <ScanFace className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">Face Login</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Enter your organization email, then verify with your face.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Organization Email
                </label>
                <div className="flex items-center gap-3 border border-violet-200 rounded-xl px-3 h-11 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all bg-white">
                  <Building2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <input
                    type="email"
                    name="organizationEmail"
                    value={form.organizationEmail}
                    onChange={handleChange}
                    placeholder="Enter your company email"
                    className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                    autoComplete="organization"
                  />
                </div>
              </div>

              {faceError && !showFaceModal && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{faceError}</p>
                </div>
              )}

              <div className="mt-5 rounded-xl border border-dashed border-violet-200 bg-white/80 p-4">
                <p className="text-xs leading-5 text-slate-600">
                  This uses the face already registered for employee attendance. Matching happens only inside the organization you enter above.
                </p>
              </div>

              <button
                type="button"
                onClick={openFaceModal}
                className="w-full h-11 mt-4 border border-violet-200 text-violet-700 font-semibold rounded-xl hover:bg-violet-100 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ScanFace className="w-4 h-4" />
                Sign In With Face
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        © 2025 ORGA HRMS. All rights reserved.
      </p>
    </div>
  );
};
