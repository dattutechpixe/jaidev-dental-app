import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

export default function SidebarItem({
  active = false,
  icon: Icon,
  title,
  path,
  options,
  collapsed = false,
  open = false,        // received from parent
  setOpenItem,         // function to set open item in parent
  id,                  // unique id of this item
}) {
  const toggleOpen = () => {
    setOpenItem(open ? null : id); // close if already open, else open this one
  };

  const [collapsedMenuOpen, setCollapsedMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const popoverRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const openCollapsedMenu = (toggle = false) => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    setPopoverPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 8 });
    if (toggle) setCollapsedMenuOpen((s) => !s);
    else setCollapsedMenuOpen(true);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setCollapsedMenuOpen(false), 150);
  };

  const cancelClose = () => {
    clearTimeout(closeTimeoutRef.current);
  };

  return (
    <div
      ref={rootRef}
      className="w-full relative"
      onMouseEnter={() => collapsed && options && openCollapsedMenu(false)}
      onMouseLeave={() => collapsed && options && scheduleClose()}
    >
      {/* Main link or accordion header */}
      <div
        className={`flex items-center justify-between px-4 py-4 text-lg font-medium rounded cursor-pointer ${
          active ? "bg-[#FFD54F] text-[#121212]" : "text-white hover:bg-[#FFD54F]/20 hover:text-[#FFD54F]"
        }`}
        onClick={options ? toggleOpen : undefined}
      >
        <Link
          to={path || "#"}
          className="flex items-center gap-2 flex-1"
          onClick={(e) => {
            if (collapsed && options) {
              e.preventDefault();
              openCollapsedMenu(true);
            }
          }}
        >
          {Icon && <Icon size={20} />}
          {!collapsed && <span>{title}</span>}
        </Link>
        {!collapsed &&
          options &&
          (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </div>

      {/* Dropdown options */}
      {!collapsed && options && open && (
        <div className="ml-6 mt-1 flex flex-col gap-1">
          {options.map((opt, idx) => (
            <Link
              key={idx}
              to={opt.path}
              className={`px-3 py-1 rounded-md text-sm md:text-md md:font-medium ${
                opt.active
                  ? "text-[#FFD54F] text-[20px] font-bold"
                  : "text-white/80 hover:text-[#FFD54F]"
              }`}
            >
              {opt.title}
            </Link>
          ))}
        </div>
      )}

      {/* Collapsed popover: show on hover/click when sidebar is minimized */}
      {collapsed && options && collapsedMenuOpen &&
        createPortal(
          <div
            ref={popoverRef}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{ position: 'absolute', top: `${popoverPos.top}px`, left: `${popoverPos.left}px`, width: 220 }}
            className="bg-white border rounded-md shadow-lg z-50 py-2"
          >
            {options.map((opt, idx) => (
              <Link
                key={idx}
                to={opt.path}
                onClick={() => setCollapsedMenuOpen(false)}
                className={`block px-3 py-2 text-md font-medium ${opt.active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {opt.title}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
