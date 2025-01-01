"use client";
import React, { useState } from "react";
import AuthHeader from "@/components/ui/AuthHeader";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const NewPassword = () => {
  const { data: session } = useSession();
  const query = useSearchParams()
  const token = query.get("token");
  const user = session?.user;
  console.log(user);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { showToast } = useToast();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    try {
      const res = await fetch("/api/forgot/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword: password })
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.message)

      showToast("Password reset successful!", "success");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
    }

  };

  return (
    <>
      <AuthHeader />
      <div className="w-full min-h-screen py-10 bg-gradient-to-b from-yellow-50 via-white to-blue-300">
        <div className="w-full h-full flex justify-center items-center flex-col">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-60 border border-black shadow-lg rounded-2xl p-8 w-11/12 max-w-4xl"
          >
            <h2 className="text-4xl font-bold text-center mb-8">
              Reset Password
            </h2>
            <div className="grid grid-cols-1 gap-8">
              <div className="flex flex-col">
                <label className="text-xl font-light mb-2">New Password</label>
                <input
                  className="p-3 border border-black shadow-md rounded-2xl"
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xl font-light mb-2">
                  Confirm Password
                </label>
                <input
                  className="p-3 border border-black shadow-md rounded-2xl"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button className="py-2 px-12 bg-pink-400 text-white text-2xl font-medium rounded-2xl shadow-md">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
