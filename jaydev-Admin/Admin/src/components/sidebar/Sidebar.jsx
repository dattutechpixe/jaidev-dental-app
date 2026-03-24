import React, { useState, useContext } from "react";
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";
import { SidebarLinks } from "../../utils/SidebarLinks";
import { ThemeContext } from "../../context/ThemeContext";

export default function Sidebar({ sidebar }) {
  const { pathname } = useLocation();
  const [openItem, setOpenItem] = useState(null);
  const { sideBar } = useContext(ThemeContext);

  return (
    <aside
      style={{ backgroundColor: sideBar }}
      className={`h-dvh md:h-screen fixed top-0 left-0 z-30 border-r border-[#333333] 
        transition-transform duration-500 ease-in-out transform 
        ${sidebar ? "w-[70vw] md:w-[18vw]" : "w-[70vw] md:w-[80px]"}
        ${sidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Fixed Logo Section */}
      <div className="h-[80px] text-2xl flex items-center justify-center mb-2 transition-all duration-300">
        {/* {sidebar ? "LOGO" : "L"} */}
        {/* {sidebar ? (
          <img
            src="/assets/Logo.png" 
            alt="Logo"
            className="h-[40px] w-auto"
          />
        ) : (
          <img
            src="/assets/Logo.png" 
            alt="Logo"
            className="h-[30px] w-auto"
          />
        )} */}
      </div>

      {/* Scrollable Menu Section */}
      <div className="h-[calc(100%-80px)] overflow-y-auto px-2 space-y-1">
        {SidebarLinks.map((item, index) => {
          // Check if any of the submenu items match the current path
          const hasActiveChild = item.options?.some(
            (option) => pathname === option.path
          );
          // Check if the main item's path matches the current path
          const isActive = pathname === item.path || hasActiveChild;

          // Add active state to submenu items
          const optionsWithActive = item.options?.map((option) => ({
            ...option,
            active: pathname === option.path,
          }));

          return (
            <SidebarItem
              key={index}
              id={index}
              icon={item.icon}
              title={item.title}
              active={isActive}
              path={item.path}
              options={optionsWithActive}
              collapsed={!sidebar}
              open={openItem === index}
              setOpenItem={setOpenItem}
            />
          );
        })}
      </div>
    </aside>
  );
}
