export default function Sidebar() {
  return (
    <div className="backdrop-blur-md bg-gradient-to-b from-yellow-50  to-blue-200 border-r border-black w-24 h-screen flex flex-col items-center justify-between py-4 pb-12">
      <div className="w-16 h-16 bg-red-500 rounded-full mb-4"></div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-white rounded-xl border border-black shadow mb-4"></div>
        <div className="w-14 h-14 bg-[#6378fd] rounded-xl border border-black shadow mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <div className="w-14 h-14 bg-white rounded-xl border border-black shadow mb-4"></div>
        <div className="w-14 h-14 bg-white rounded-xl border border-black flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
