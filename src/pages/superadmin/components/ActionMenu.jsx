import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const ActionMenu = ({ label = 'Open actions', items = [] }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 text-left shadow-xl">
          {items.map(({ label: itemLabel, icon: Icon, onClick, danger, disabled }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onClick?.();
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {Icon && <Icon size={16} />}
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
