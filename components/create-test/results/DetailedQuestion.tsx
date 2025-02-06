"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";

const DetailedQuestion = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-white font-laila">
            <div className="relative w-full bg-[#9747FF] text-white text-4xl font-semibold p-6 rounded-t-lg text-center">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-3 rounded-full shadow-md"
                >
                    <IoArrowBack size={24} />
                </button>
                DETAILED TEST RESULT
            </div>
            <div className="bg-white w-11/12 mt-4 p-6 rounded-lg shadow-lg">
                <div className="text-xl mb-6">
                    <span className="font-semibold text-red-500">प्रश्न: ९/१५</span>
                </div>
                <div className="text-2xl font-medium mb-6">
                    खालीलपैकी कोणते पिकांसाठी हानिकारक आहे?
                </div>
                <div className="grid grid-cols-2 gap-4 min-w-full">
                    <button className="border border-gray-300 p-4 rounded-lg">१. पाऊस</button>
                    <button className="border border-gray-300 p-4 rounded-lg">२. सकाळची हवा</button>
                    <button className="border border-green-500 p-4 rounded-lg bg-green-100">
                        ३. गारपीट <span className="ml-2 text-green-500">●</span>
                    </button>
                    <button className="border border-gray-300 p-4 rounded-lg">४. सूर्यप्रकाश</button>
                </div>
                <div className="mt-8 border-t pt-4 text-gray-600 text-lg">
                    Answer explanation here
                </div>
            </div>
        </div>
    );
};

export default DetailedQuestion;
