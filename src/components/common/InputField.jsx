// src/components/common/InputField.jsx
import React from "react";

export const InputField = ({
  label,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-4 text-left">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        )}

        <input
          {...props}
          className={`
            w-full
            ${Icon ? "pl-10" : "pl-4"}
            pr-4
            py-2.5
            border
            border-gray-300
            rounded-xl
            text-sm
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-purple-400
            disabled:bg-gray-100
            disabled:text-gray-500
            ${className}
          `}
        />
      </div>
    </div>
  );
};
