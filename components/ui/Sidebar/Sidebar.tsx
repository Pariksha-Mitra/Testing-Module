"use client";

import React from "react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-24 backdrop-blur-md bg-gradient-to-b from-yellow-50 to-blue-200 border-r border-black flex flex-col">
      {/* Top Section */}
      <div className="flex flex-col items-center p-4">
        <div className="w-16 h-16 bg-red-500 rounded-full mb-4"></div>
      </div>

      {/* Middle Section (Scrollable) */}
      <div className="flex flex-col items-center flex-grow overflow-y-auto px-2">
        {/* Add your middle section items here */}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center p-4">
        <SidebarItem
          href="/dashboard"
          ariaLabel="Home"
          icon={
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              {/* Replace with your Home SVG path */}
              <path d="M12 3l-12 9h4v9h6v-7h4v7h6v-9h4l-12-9z" />
            </svg>
          }
        />

        <SidebarItem
          href="/question-bank"
          ariaLabel="Question Bank"
          icon={
            <svg
              fill="currentColor"
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="30.000000pt"
              height="30.000000pt"
              viewBox="0 0 106.000000 106.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,106.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path
                  d="M144 901 c-41 -10 -54 -19 -54 -36 0 -9 -14 -15 -42 -17 l-43 -3 0
  -345 c0 -395 -11 -360 99 -320 94 34 210 45 318 30 113 -15 103 -15 216 0 108
  15 224 4 318 -30 110 -40 99 -75 99 320 l0 345 -42 3 c-29 2 -43 8 -43 17 0
  29 -43 40 -160 40 -105 0 -120 -2 -175 -28 -33 -16 -70 -37 -82 -49 l-22 -20
  -33 26 c-66 50 -126 69 -228 72 -52 2 -109 0 -126 -5z m247 -56 c25 -9 62 -29
  82 -46 l37 -30 0 -256 c0 -239 -1 -255 -17 -248 -115 48 -117 49 -240 49
  l-123 1 0 272 0 272 38 4 c61 8 174 -1 223 -18z m487 19 l52 -7 0 -267 0 -268
  -122 -4 c-119 -5 -134 -8 -240 -53 -17 -7 -18 9 -18 248 l0 255 33 28 c70 59
  172 82 295 68z m-786 -321 l3 -268 100 3 c55 2 120 -1 145 -6 42 -8 40 -8 -50
  -15 -52 -3 -128 -16 -167 -27 -40 -11 -75 -20 -78 -20 -8 0 -6 586 2 593 3 4
  15 7 25 7 17 0 18 -17 20 -267z m928 -33 c0 -165 -2 -300 -5 -300 -3 0 -38 9
  -78 20 -39 11 -115 24 -167 27 -84 6 -90 8 -55 15 22 4 87 7 145 5 l105 -2 3
  268 2 267 25 0 25 0 0 -300z"
                />
              </g>
            </svg>
          }
        />

        <SidebarItem
          href="/create-test"
          ariaLabel="Create Test"
          icon={
            <svg
              width="30"
              height="30"
              viewBox="0 0 44 44"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
            </svg>
          }
        />

        <SidebarItem
          href="/profile"
          ariaLabel="Profile"
          icon={
            <svg
              fill="currentColor"
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="30.000000pt"
              height="30.000000pt"
              viewBox="0 0 182.000000 182.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,182.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path
                  d="M829 1486 c-86 -31 -144 -88 -175 -173 -47 -132 39 -296 177 -337 66
-20 92 -20 160 0 116 34 200 164 186 287 -20 163 -198 277 -348 223z m146 -57
c23 -7 57 -28 81 -53 85 -84 84 -206 -2 -292 -81 -82 -207 -82 -288 0 -84 83
-87 198 -8 285 56 63 131 84 217 60z"
                />
                <path
                  d="M731 884 c-139 -50 -236 -165 -263 -312 -18 -99 -52 -92 442 -92 494
0 460 -7 442 92 -25 132 -104 236 -222 292 -62 30 -71 31 -210 33 -112 2 -155
-1 -189 -13z m356 -66 c88 -32 165 -114 192 -202 12 -38 21 -70 21 -72 0 -2
-175 -4 -390 -4 -214 0 -390 2 -390 4 0 2 9 33 20 68 30 98 108 178 209 214
22 8 85 13 158 14 102 0 132 -4 180 -22z"
                />
              </g>
            </svg>
          }
        />
      </div>
    </div>
  );
}
