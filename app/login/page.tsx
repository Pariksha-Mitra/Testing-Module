"use client"
import AuthHeader from '@/components/ui/AuthHeader';
import Link from 'next/link';
import { ROLE } from '@/utils/types';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

const Login: React.FC = () => {
  const [role, setRole] = useState<ROLE>(ROLE.Student);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { showToast } = useToast();
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated") router.push("/dashboard");
  }, [sessionStatus, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        showToast("अवैध वापरकर्तानाव किंवा पासवर्ड", "error");
      } else {
        router.push("/dashboard");
        showToast("लॉगिन यशस्वी झाले", "success");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="text-center h-screen w-screen flex justify-center items-center">
        <output aria-live="polite" className="sr-only">Loading...</output>
        <svg aria-hidden="true" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.59c0 27.615-22.386 50.001-50 50.001s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50m-90.919 0c0 22.6 18.32 40.92 40.919 40.92s40.919-18.32 40.919-40.92c0-22.598-18.32-40.918-40.919-40.918S9.081 27.992 9.081 50.591" fill="currentColor" />
          <path d="M93.968 39.04c2.425-.636 3.894-3.128 3.04-5.486A50 50 0 0 0 41.735 1.279c-2.474.414-3.922 2.919-3.285 5.344s3.12 3.849 5.6 3.484a40.916 40.916 0 0 1 44.131 25.769c.902 2.34 3.361 3.802 5.787 3.165" fill="currentFill" />
        </svg>
      </div>

    );
  }
  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-col w-full h-screen  bg-gradient-to-b from-yellow-50 via-white to-blue-300">
        <div className='relative h-[25%]'>
          <AuthHeader />
        </div>

        <div className="mt-10 w-full flex justify-center items-center flex-col">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-60 border border-black shadow-lg rounded-2xl p-8 w-11/12 max-w-4xl laila-bold"
              >
                <div className="flex items-center gap-7 justify-center">
                  <button
                    type="button"
                    onClick={() => setRole(ROLE.Student)}
                    className={`linear duration-300 py-3 border border-black shadow-md rounded-3xl px-6 ${role === ROLE.Student ? "bg-red-400 text-white" : ""
                      }`}
                  >
                    विद्यार्थी
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(ROLE.Teacher)}
                    className={`linear duration-300 py-3 border border-black shadow-md rounded-3xl px-6 ${role === ROLE.Teacher ? "bg-red-400 text-white" : ""
                      } `}
                  >
                    शिक्षक
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-4">
                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-xl font-light mb-2">
                      वापरकर्तानाव
                    </label>
                    <div className="flex items-center gap-6 justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="black"
                        className="size-11"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <input
                        id="username"
                        className="py-2 px-4 flex-1 border border-black shadow-md rounded-3xl"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="password" className="text-xl font-light mb-2">
                      पासवर्ड
                    </label>
                    <div className="flex items-center gap-6 justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="size-11"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                      <input
                        id="password"
                        className="py-2 px-4 flex-1 border border-black shadow-md rounded-3xl"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <button className="py-2 px-12 bg-red-400 text-white text-2xl font-medium rounded-2xl shadow-md">
                    लॉगिन करा
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-between w-11/12 max-w-4xl px-8 py-4">
                <Link href={"/register"} className="text-blue-600">
                  तुम्ही नवीन आहात का?
                </Link>
                {role === "teacher" && (
                  <Link href={"/forgot-password"} className="text-blue-600">
                    पासवर्ड विसरलात?
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

    )
  );
};

export default Login;
