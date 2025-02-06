"use client"
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import { QuestionsProvider } from "@/context/QuestionsContext";
import React from "react";

const TestPageLayout: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    if (!children) {
        throw new Error("TestPageLayout requires children");
    }

    return (
        <QuestionsProvider>
            <div className="relative flex bg-gradient-to-b from-yellow-200 to-blue-300 min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6 ml-24">
                    {children}
                </main>
            </div>
        </QuestionsProvider>
    );
};

export default TestPageLayout;
