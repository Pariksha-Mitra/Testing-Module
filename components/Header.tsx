"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="bg-[#6378FD] text-white flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 rounded-[20px] shadow">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex-shrink-0"></div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-6xl font-bold rozha-one-regular">
            स्वागत आहे !
          </h1>
          <p className="text-xl md:text-3xl laila-light mt-2">
            {session?.user.username}, DETAILS
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="flex flex-col items-center mt-4 md:mt-0"
      >
        <Image
          src="/logout.png"
          alt="Logout"
          width={50}
          height={50}
          className="md:w-24 md:h-24"
        />
        <div className="arya-bold mt-2 md:mt-[-10px] text-sm md:text-base">
          लॉगआउट
        </div>
      </button>
    </div>
  );
}
