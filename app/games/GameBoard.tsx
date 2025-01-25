'use client';
import * as React from 'react';
import { GameCard } from '@/components/games';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Dropdown from '@/components/Dropdown/Dropdown';

const GAME_CARDS = [
    { gradient: "bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx8G_GuZDTq1he8GB6jB6HW25HG45iGRfan9I6BPVE3cqRx7XlXuXzQnotGh1Ly5x1YCg&usqp=CAU')] bg-cover bg-center", class: "५", subject: "विषय १", lesson: "धडा १", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]", class: "६", subject: "विषय २", lesson: "धडा २", homework: "स्वाध्याय २" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]", class: "७", subject: "विषय १", lesson: "धडा १", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]", class: "८", subject: "विषय ३", lesson: "धडा ३", homework: "स्वाध्याय २" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]", class: "९", subject: "विषय २", lesson: "धडा २", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]", class: "१०", subject: "विषय १", lesson: "धडा ३", homework: "स्वाध्याय २" },
    { gradient: "bg-[linear-gradient(180deg,#FCE459_0%,#DCA12B_100%)]", class: "५", subject: "विषय २", lesson: "धडा १", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]", class: "६", subject: "विषय ३", lesson: "धडा २", homework: "स्वाध्याय २" },
    { gradient: "bg-[linear-gradient(180deg,#FC708A_0%,#DD3151_100%)]", class: "७", subject: "विषय १", lesson: "धडा ३", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#FCE459_0%,#DCA12B_100%)]", class: "८", subject: "विषय २", lesson: "धडा १", homework: "स्वाध्याय २" },
    { gradient: "bg-[linear-gradient(180deg,#7E7CFE_0%,#2F4DC4_100%)]", class: "९", subject: "विषय ३", lesson: "धडा २", homework: "स्वाध्याय १" },
    { gradient: "bg-[linear-gradient(180deg,#6AD9A1_0%,#329965_100%)]", class: "१०", subject: "विषय १", lesson: "धडा ३", homework: "स्वाध्याय २" }
];

const OPTIONS = {
    class: ["सर्व", "५", "६", "७", "८", "९", "१०"],
    subject: ["सर्व", "विषय १", "विषय २", "विषय ३"],
    lesson: ["सर्व", "धडा १", "धडा २", "धडा ३"],
    homework: ["सर्व", "स्वाध्याय १", "स्वाध्याय २"]
} as const;

interface Selection {
    class: string;
    subject: string;
    lesson: string;
    homework: string;
}

export const GameBoard: React.FC = () => {
    const [selection, setSelection] = React.useState<Selection>({
        class: 'सर्व',
        subject: 'सर्व',
        lesson: 'सर्व',
        homework: 'सर्व'
    });

    const handleSelect = (value: string | number, dropdownId: keyof Selection) => {
        const stringValue = value.toString();
        setSelection(prev => ({
            ...prev,
            [dropdownId]: stringValue
        }));
    };

    const filteredGames = React.useMemo(() => {
        return GAME_CARDS.filter(game => {
            return Object.entries(selection).every(([key, value]) => {
                if (value === 'सर्व') return true;
                return game[key as keyof typeof game] === value;
            });
        });
    }, [selection]);

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

                <div className="w-full px-4 mt-6">
                    {filteredGames.length > 0 ? (
                        <div className="grid grid-cols-4 gap-6">
                            {filteredGames.map((card, index) => (
                                <button key={index} className="relative aspect-[5/2.5]">
                                    <GameCard gradient={card.gradient} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white/50 rounded-lg shadow">
                            <p className="text-xl text-gray-600 font-laila">
                                कोणतेही खेळ सापडले नाहीत. कृपया ड्रॉपडाउन मधून निवड कमी करा.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
