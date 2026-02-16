import { useEffect } from "react";

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "38%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: "toastSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Card */}
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: "22px 24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          position: "relative",
        }}
      >
        {/* Icon — exact SVG files, square box with rounded corners */}
        {isSuccess ? (
          /* error.svg — green checkmark with #EEFFE8 background box */
          <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ flexShrink: 0 }}>
            <rect width="60" height="60" rx="8" fill="#EEFFE8"/>
            <mask id="m_success" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="10" y="10" width="40" height="40">
              <rect x="10" y="10" width="40" height="40" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#m_success)">
              <path d="M27.1 39.1335L41.2335 25L38.7665 22.5665L27.1 34.2335L21.2 28.3335L18.7665 30.7665L27.1 39.1335ZM30 50C27.2557 50 24.6668 49.475 22.2335 48.425C19.8002 47.375 17.6778 45.9445 15.8665 44.1335C14.0555 42.3222 12.625 40.1998 11.575 37.7665C10.525 35.3332 10 32.7443 10 30C10 27.2333 10.525 24.6333 11.575 22.2C12.625 19.7667 14.0555 17.65 15.8665 15.85C17.6778 14.05 19.8002 12.625 22.2335 11.575C24.6668 10.525 27.2557 10 30 10C32.7667 10 35.3667 10.525 37.8 11.575C40.2333 12.625 42.35 14.05 44.15 15.85C45.95 17.65 47.375 19.7667 48.425 22.2C49.475 24.6333 50 27.2333 50 30C50 32.7443 49.475 35.3332 48.425 37.7665C47.375 40.1998 45.95 42.3222 44.15 44.1335C42.35 45.9445 40.2333 47.375 37.8 48.425C35.3667 49.475 32.7667 50 30 50ZM30 46.6665C34.6443 46.6665 38.5832 45.0443 41.8165 41.8C45.0498 38.5557 46.6665 34.6223 46.6665 30C46.6665 25.3557 45.0498 21.4168 41.8165 18.1835C38.5832 14.9502 34.6443 13.3335 30 13.3335C25.3777 13.3335 21.4443 14.9502 18.2 18.1835C14.9557 21.4168 13.3335 25.3557 13.3335 30C13.3335 34.6223 14.9557 38.5557 18.2 41.8C21.4443 45.0443 25.3777 46.6665 30 46.6665Z" fill="#00B600"/>
            </g>
          </svg>
        ) : (
          /* cancel.svg — red X circle, no background box */
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "8px",
              background: "#FFE9E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <mask id="m_cancel" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#m_cancel)">
                <path d="M12.6 29.7335L20 22.3335L27.4 29.7335L29.7335 27.4L22.3335 20L29.7335 12.6L27.4 10.2665L20 17.6665L12.6 10.2665L10.2665 12.6L17.6665 20L10.2665 27.4L12.6 29.7335ZM20 40C17.2557 40 14.6668 39.475 12.2335 38.425C9.80017 37.375 7.67783 35.9445 5.8665 34.1335C4.0555 32.3222 2.625 30.1998 1.575 27.7665C0.525 25.3332 0 22.7443 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.0555 7.65 5.8665 5.85C7.67783 4.05 9.80017 2.625 12.2335 1.575C14.6668 0.525 17.2557 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7443 39.475 25.3332 38.425 27.7665C37.375 30.1998 35.95 32.3222 34.15 34.1335C32.35 35.9445 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40ZM20 36.6665C24.6443 36.6665 28.5832 35.0443 31.8165 31.8C35.0498 28.5557 36.6665 24.6223 36.6665 20C36.6665 15.3557 35.0498 11.4168 31.8165 8.1835C28.5832 4.95017 24.6443 3.3335 20 3.3335C15.3777 3.3335 11.4443 4.95017 8.2 8.1835C4.95567 11.4168 3.3335 15.3557 3.3335 20C3.3335 24.6223 4.95567 28.5557 8.2 31.8C11.4443 35.0443 15.3777 36.6665 20 36.6665Z" fill="#EB0000"/>
              </g>
            </svg>
          </div>
        )}

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#111827", letterSpacing: "-0.01em" }}>
            {toast.title}
          </p>
          <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: "#9CA3AF", lineHeight: 1.4 }}>
            {toast.message}
          </p>
        </div>

        {/* X close button — gray box, top right */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            background: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2L8 8M8 2L2 8" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};