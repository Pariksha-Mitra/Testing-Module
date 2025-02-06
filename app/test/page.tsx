"use client";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function TestInterface() {
  return (
    <div className="h-full">
      {/* Back Button */}
      <button className="flex items-center gap-1 text-gray-700 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          color="white"
          className="size-10 bg-[#FC708A] rounded-full p-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>

        <span className="text-xl font-semibold">मागे</span>
      </button>

      {/* Main Card */}
      <Card className="max-w-md mx-auto rounded-xl">
        <div className="bg-purple-600 p-4 text-white text-center">
          <Typography variant="h5">TEST TITLE HERE</Typography>
        </div>

        <CardContent className="space-y-4 w-full ">
          {/* Info Boxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-orange-200 rounded-3xl p-3 border border-black">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="absolute">❓</span>
              </div>
              <Typography>१५ बहुपर्यायी प्रश्न</Typography>
            </div>

            <div className="flex items-center gap-3 bg-blue-300 rounded-3xl p-3 border border-black">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span>⏱️</span>
              </div>
              <Typography>चाचणी सोडवण्यासाठी 20 मिनिटे</Typography>
            </div>

            <div className="flex items-center gap-3 bg-green-300 rounded-3xl p-3 border border-black">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span>🎯</span>
              </div>
              <Typography>चाचणी पूर्ण केल्यावर तास मिळेल</Typography>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="mt-6 px-12">
            <Typography variant="h6" className="text-center text-red-500 mb-4">
              महत्वाच्या सूचना
            </Typography>
            <ul className="list-disc pl-6 space-y-2">
              <li>प्रत्येक प्रश्नास उत्तरासाठी एक गुण दिला जाईल.</li>
              <li>प्रत्येक प्रश्नाला योग्य वेळ द्या, पुढे करू शका.</li>
            </ul>
          </div>

          {/* Best Wishes */}
          <div className="text-center mt-6">
            <span className="inline-block px-8 py-4 rounded-[50%] bg-pink-50 text-pink-500">
              शुभेच्छा!
            </span>
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="contained"
              className="bg-green-500 hover:bg-green-600 normal-case text-lg py-2 px-6 font-semibold"
            >
              सोडवा
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
