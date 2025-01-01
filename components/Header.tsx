"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="bg-blue-500 text-white flex items-center justify-between p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-white rounded-full"></div>
        <div>
          <h1 className="text-3xl font-bold rozha-one-bold">स्वागत आहे!</h1>
          <p className="text-sm">{session?.user.username}, DETAILS</p>
        </div>
      </div>
      <Image src="/logout.png" alt="Logout" width={64} height={64} onClick={() => signOut()}/>
    </div>
  );
} 
