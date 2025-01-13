"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  
  console.log(session?.user);
  return (
    <div className="bg-[#6378FD] text-white flex items-center justify-between px-5 py-3 rounded-[20px] shadow">
      <div className="flex items-center space-x-4">
        <div className=" w-32 h-32 bg-white rounded-full"></div>
        <div className="pl-10">
          <h1 className="text-6xl font-bold rozha-one-regular">स्वागत आहे !</h1>
          <p className="text-3xl laila-light">{session?.user.username}, DETAILS</p>
          
        </div>
      </div>
      <button onClick={() => signOut()} >
        <Image src="/logout.png" alt="Logout" width={100} height={100} />
        <div className="arya-bold mt-[-15px]">लॉगआउट</div>
        
      </button>
    </div>
  );
}
