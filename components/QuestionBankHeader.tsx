import Image from 'next/image';

export default function QuestionBankHeader() {
  return (
    <div className="bg-[#6378fd] text-white flex flex-col items-center p-4 rounded-lg shadow">
      <div className="flex items-center justify-center w-full text-center gap-8" >
        <Image src="/question.svg" alt="test-paper" width={100} height={100} />
        <h1 className="text-3xl rozha-one-bold">प्रश्न संच</h1>
        <Image src="/paper.svg" alt="test-paper" width={80} height={80} />
      </div>

      <div className="flex items-center justify-between flex-wrap w-full mt-4 gap-2 no-wrap laila-regular">
        {["इयत्ता", "विषय", "धडा", "स्वाध्याय"].map((label, index) => (
          <div
            key={index}
            className="bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white flex flex-col md:flex-row md:w-[20%] w-full "
          >
            <label className="text-xl font-light">{label}:</label>
            <select
              title={label}
              className="px-4 py-1 shadow-md rounded-xl text-black appearance-none mt-2 md:mt-0 w-[80%] text-center"
            >
              <option value="१">१</option>
              <option value="२">२</option>
            </select>
          </div>
        ))}
      </div>
    
    </div>
  );
}
