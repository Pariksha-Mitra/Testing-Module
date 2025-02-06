"use client";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { Rating } from "@mui/material";
import Image from "next/image";

export default function TestFeedback() {
  const [value, setValue] = useState<number | null>(3);

  return (
    <div className="h-full flex items-center justify-center w-full">
      {/* Main Card */}
      <Card className="w-[420px] mx-auto rounded-xl">
        <div className="bg-purple-600 p-4 text-white text-center">
          <Typography variant="h5">TEST FEEDBACK</Typography>
        </div>

        <CardContent className="space-y-6 w-full flex flex-col items-center">
          {/* Feedback Question */}
          <Typography variant="h6" className="text-center font-semibold">
            तुम्ही या सराव चाचणीला किती तारे द्याल?
          </Typography>

          <Image src={"/stars.png"} alt="Stars" height={200} width={200} />
          {/* Rating Component */}

          <div className="w-full h-0.5 bg-slate-300" />
          <div className="flex flex-col items-center">
            <Rating
              name="feedback-rating"
              value={value}
              onChange={(e, val) => {
                setValue(val);
              }}
              size="large"
            />

            {/* Refresh Button */}
            <button onClick={() => setValue(3)} className="mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-6"
                color="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          {/* Submit Button */}
          <Button
            variant="contained"
            className="bg-green-500 hover:bg-green-600 normal-case text-lg py-2 px-6 font-semibold"
          >
            समाप्त करा
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
