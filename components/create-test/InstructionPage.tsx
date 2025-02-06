import InfoTab from '@/components/create-test/InfoTab';

const InstructionPage = () => {

    return (
        <div className='flex flex-col justify-center items-center h-screen '>
            <div className='flex flex-col items-center justify-center bg-[#9747FF] p-6 min-w-[40%] font-laila rounded-md text-white text-4xl font-semibold'>
                Test Title Here
            </div>

            <div className='flex flex-col justify-center items-center p-8 bg-white/50 min-w-[40%] rounded-md shadow-md'>
                <InfoTab image='question-mark-1' title='१५ बहुपर्यायी प्रश्न' color='FFC756' />
                <InfoTab image='clock-1' title='चाचणी सोडवण्यासाठी 20 मिनिटे ' color='98D8EF' />
                <InfoTab image='reward-1' title='चाचणी पूर्ण केल्यानंतर तारा मिळेल' color='6AD9A1' />

                <span className='font-laila font-bold text-red-700 text-2xl mt-6'>महत्त्वाच्या सूचना</span>
                <ul className='text-lg text-gray-800 list-disc list-inside mt-4'>
                    <li>प्रत्येक बरोबर उत्तरासाठी एक गुण दिला जाईल.</li>
                    <li>प्रत्येक प्रश्नाला योग्य वेळ घ्या, घाई करू नका.</li>
                </ul>

                <div className='flex flex-col items-center mt-8'>
                    <span className='font-laila text-3xl text-pink-600'>शुभेच्छा!</span>
                    <button className='bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-2 px-6 rounded-full mt-4'>
                        सोडवा
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionPage;
