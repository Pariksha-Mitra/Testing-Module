'use client';
import * as React from 'react';
import { GameCard } from '@/components/games';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Dropdown from '@/components/Dropdown/Dropdown';

const GAME_CARDS = [
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

const OPTIONS = {
    class: ["५", "६", "७", "८", "९", "१०"],
    subject: ["विषय १", "विषय २", "विषय ३"],
    lesson: ["धडा १", "धडा २", "धडा ३"],
    homework: ["स्वाध्याय १", "स्वाध्याय २"]
} as const;

interface Selection {
    class: string;
    subject: string;
    lesson: string;
    homework: string;
}

export const GameBoard: React.FC = () => {
    const [selection, setSelection] = React.useState<Selection>({
        class: '',
        subject: '',
        lesson: '',
        homework: ''
    });

    const handleSelect = (value: string | number, dropdownId: keyof Selection) => {
        const stringValue = value.toString();
        setSelection(prev => ({
            ...prev,
            [dropdownId]: stringValue
        }));
    };

    return (
        <div className="flex min-h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-x-hidden bg-[linear-gradient(180deg,#FBFFB7_0%,#FFF_55.5%,#65D4FF_100%)] pl-28 pr-4 pb-4 max-md:pr-2 max-md:pl-4">
                <div className="bg-[#6378fd] text-white flex flex-col items-center p-3 rounded-lg shadow mt-4">
                    <div className="flex items-center justify-center w-full text-center gap-6">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e73b6312f9bb41febee608f513bb69e2f2e6c45a4e99d2fe4ca95f7b860880a?placeholderIfAbsent=true&apiKey=2e5ff378be9f41bb95630ceb5432e4b0"
                            alt="Game icon"
                            className="object-contain shrink-0 aspect-square w-[50px]"
                        />
                        <p className="text-7xl font-rozhaOne">खेळ खेळून शिका</p>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e73b6312f9bb41febee608f513bb69e2f2e6c45a4e99d2fe4ca95f7b860880a?placeholderIfAbsent=true&apiKey=2e5ff378be9f41bb95630ceb5432e4b0"
                            alt="Game icon"
                            className="object-contain shrink-0 aspect-square w-[50px]"
                        />
                    </div>
                    <div className="flex justify-between w-full mt-3 gap-2 laila-regular">
                        {Object.entries(OPTIONS).map(([key, items]) => (
                            <Dropdown
                                key={key}
                                id={`${key}-dropdown`}
                                items={Array.from(items)}
                                label={`${key === 'class' ? 'इयत्ता' : key === 'subject' ? 'विषय' : key === 'lesson' ? 'धडा' : 'स्वाध्याय'}:`}
                                defaultValue={selection[key as keyof Selection]}
                                buttonBgColor="bg-[#fc708a]"
                                buttonBorderColor="border-white"
                                buttonBorderWidth="border-[2px]"
                                onSelect={(value) => handleSelect(value, key as keyof Selection)}
                                className="w-[18%]"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center mt-6">
                    <div className="grid grid-cols-4 gap-6 w-full px-4">
                        {GAME_CARDS.map((card, index) => (
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
