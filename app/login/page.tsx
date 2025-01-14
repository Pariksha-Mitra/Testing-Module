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
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    sessionStatus !== "authenticated" && (
      <>
        <AuthHeader />
        <div className="w-full min-h-screen py-10 bg-gradient-to-b from-yellow-50 via-white to-blue-300">
          <div className="w-full h-full flex justify-center items-center flex-col">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="bg-white bg-opacity-60 border border-black shadow-lg rounded-2xl p-8 w-11/12 max-w-4xl"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setRole(ROLE.Student)}
                      className={`linear duration-300 py-2 border border-black shadow-md rounded-3xl px-6 ${
                        role === ROLE.Student ? "bg-red-400 text-white" : ""
                      }`}
                    >
                      विद्यार्थी
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole(ROLE.Teacher)}
                      className={`linear duration-300 py-2 border border-black shadow-md rounded-3xl px-6 ${
                        role === ROLE.Teacher ? "bg-red-400 text-white" : ""
                      } `}
                    >
                      शिक्षक
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 mt-4">
                    <div className="flex flex-col">
                      <label className="text-xl font-light mb-2">
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
                      <label className="text-xl font-light mb-2">पासवर्ड</label>
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
      </>
    )
  );
};

export default Login;
