export default function TestHeader() {
  return (
    <div className="bg-[#6378fd] text-white flex flex-col items-center p-4 rounded-lg shadow">
      <div className="flex items-center w-full">
        <img src="test-paper.png" alt="test-paper" className="w-14 h-14" />
        <h1 className="text-3xl rozha-one-bold flex-1 text-center">
          चाचणी तयार करा
        </h1>
      </div>

      <div className="flex items-center justify-around flex-wrap w-full mt-4 gap-2">
        <div className="flex bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white">
          <label className="text-xl font-light">इयत्ता:</label>
          <select
            title="School"
            className="px-4 py-1 shadow-md rounded-xl text-black appearance-none"
          >
            <option value="१">१</option>
            <option value="२">२</option>
          </select>
        </div>
        <div className="flex bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white">
          <label className="text-xl font-light">विषय:</label>
          <select
            title="School"
            className="px-4 py-1 shadow-md rounded-xl text-black appearance-none"
          >
            <option value="१">१</option>
            <option value="२">२</option>
          </select>
        </div>
        <div className="flex bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white">
          <label className="text-xl font-light">इयत्ता:</label>
          <select
            title="School"
            className="px-4 py-1 shadow-md rounded-xl text-black appearance-none"
          >
            <option value="१">१</option>
            <option value="२">२</option>
          </select>
        </div>
        <div className="flex bg-[#fc708a] rounded-2xl py-1 px-4 items-center gap-2 border-2 border-white">
          <label className="text-xl font-light">विषय:</label>
          <select
            title="School"
            className="px-4 py-1 shadow-md rounded-xl text-black appearance-none"
          >
            <option value="१">१</option>
            <option value="२">२</option>
          </select>
        </div>
      </div>
    </div>
  );
}
