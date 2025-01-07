"use client";
import { signOut, useSession } from "next-auth/react";

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
      <button onClick={() => signOut()}>
        <img src="/logout.png" alt="Logout" className="w-16 h-16" />
      </button>
    </div>
  );
}
