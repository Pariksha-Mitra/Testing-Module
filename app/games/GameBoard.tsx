'use client';
import * as React from 'react';
import { GameCard } from '@/components/games/GameCard';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Dropdown from '@/components/Dropdown/Dropdown';
import Image from 'next/image';

const gameCards = [
    { gradient: "bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx8G_GuZDTq1he8GB6jB6HW25HG45iGRfan9I6BPVE3cqRx7XlXuXzQnotGh1Ly5x1YCg&usqp=CAU')] bg-cover bg-center" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#FCE459_0%,#DCA12B_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#FCE459_0%,#DCA12B_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]" }
];
export const GameBoard: React.FC = () => {
    const [selection, setSelection] = React.useState({
        class: '',
        subject: '',
        lesson: '',
        homework: ''
    });
    const handleSelect = (value: string | number, dropdownId: keyof typeof selection) => {
        const stringValue = typeof value === "number" ? value.toString() : value;
        setSelection(prev => ({
            ...prev,
            [dropdownId]: stringValue
        }));
    };
    const classOptions = ["५", "६", "७", "८", "९", "१०"];
    const subjectOptions = ["विषय १", "विषय २", "विषय ३"];
    const lessonOptions = ["धडा १", "धडा २", "धडा ३"];
    const homeworkOptions = ["स्वाध्याय १", "स्वाध्याय २"];
    return (
        <div className="flex min-h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-x-hidden bg-[linear-gradient(180deg,#FBFFB7_0%,#FFF_55.5%,#65D4FF_100%)] pl-28 pr-4 pb-4 max-md:pr-2 max-md:pl-4">
                <div className="bg-[#6378fd] text-white flex flex-col items-center p-3 rounded-lg shadow mt-4">
                    <div className="flex items-center justify-center w-full text-center gap-6">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e73b6312f9bb41febee608f513bb69e2f2e6c45a4e99d2fe4ca95f7b860880a?placeholderIfAbsent=true&apiKey=2e5ff378be9f41bb95630ceb5432e4b0"
                            alt=""
                            className="object-contain shrink-0 aspect-square w-[50px]"
                        />
                        <p className="text-7xl font-rozhaOne">खेळ खेळून शिका</p>
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e73b6312f9bb41febee608f513bb69e2f2e6c45a4e99d2fe4ca95f7b860880a?placeholderIfAbsent=true&apiKey=2e5ff378be9f41bb95630ceb5432e4b0"
                            alt=""
                            className="object-contain shrink-0 aspect-square w-[50px]"
                        />
                    </div>
                    <div className="flex justify-between w-full mt-3 gap-2 laila-regular">
                        <Dropdown
                            id="class-dropdown"
                            items={classOptions}
                            label="इयत्ता:"
                            defaultValue={selection.class}
                            buttonBgColor="bg-[#fc708a]"
                            buttonBorderColor="border-white"
                            buttonBorderWidth="border-[2px]"
                            onSelect={(value) => handleSelect(value, "class")}
                            className="w-[18%]"
                        />
                        <Dropdown
                            id="subject-dropdown"
                            label="विषय:"
                            items={subjectOptions}
                            defaultValue={selection.subject}
                            buttonBgColor="bg-[#fc708a]"
                            buttonBorderColor="border-white"
                            buttonBorderWidth="border-[2px]"
                            onSelect={(value) => handleSelect(value, "subject")}
                            className="w-[18%]"
                        />
                        <Dropdown
                            id="lesson-dropdown"
                            label="धडा:"
                            items={lessonOptions}
                            defaultValue={selection.lesson}
                            buttonBgColor="bg-[#fc708a]"
                            buttonBorderColor="border-white"
                            buttonBorderWidth="border-[2px]"
                            onSelect={(value) => handleSelect(value, "lesson")}
                            className="w-[18%]"
                        />
                        <Dropdown
                            id="homework-dropdown"
                            label="स्वाध्याय:"
                            items={homeworkOptions}
                            defaultValue={selection.homework}
                            buttonBgColor="bg-[#fc708a]"
                            buttonBorderColor="border-white"
                            buttonBorderWidth="border-[2px]"
                            onSelect={(value) => handleSelect(value, "homework")}
                            className="w-[18%]"
                        />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center mt-6">
                    <div className="grid grid-cols-4 gap-6 w-full px-4">
                        {gameCards.map((card, index) => (
                            <button key={index} className="relative aspect-[5/2.5]">
                                <GameCard {...card} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
