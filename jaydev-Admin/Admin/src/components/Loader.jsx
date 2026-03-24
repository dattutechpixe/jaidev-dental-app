import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative w-[130px] h-[4px] rounded-full bg-black/20 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-[#0071e2]"
          style={{
              animation: "moving 1s ease-in-out infinite",
            }}
        >
        </div>

        {/* Inline keyframes using style tag (no Tailwind config) */}
        <style>{`
          @keyframes moving {
            0% {
              width: 0%;
              left: 0;
              right: unset;
            }
            50% {
              width: 100%;
              left: 0;
              right: unset;
            }
            100% {
              width: 0%;
              left: unset;
              right: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
