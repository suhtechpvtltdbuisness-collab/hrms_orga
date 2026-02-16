// src/components/common/Button.jsx
import React from "react";

export const Button = ({
  text,
  onClick,
  disabled,
  loading,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full
        h-11
        rounded-full
        flex items-center justify-center gap-2
        text-sm font-medium
        transition
        ${
          loading
            ? "bg-white border border-purple-500 text-purple-600 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }
      `}
    >
      {loading && (
        <img
          src="/loader.svg"
          alt="loading"
          className="w-6 h-6"
        />
      )}

      <span>
        {loading ? "Signing you in..." : text}
      </span>
    </button>
  );
};
