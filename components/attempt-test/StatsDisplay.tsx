import React from "react";

const StatsDisplay: React.FC = React.memo(() => (
  <div className="flex items-center space-x-4 laila-semibold">
    <div className="flex items-center space-x-2">
      <span>सोडवलेले:</span>
      <button className="bg-[#11CE6E] rounded-full w-5 h-5" />
    </div>
    <div className="flex items-center space-x-2">
      <span>न सोडवलेले:</span>
      <button className="bg-[#F3AA01] rounded-full w-5 h-5" />
    </div>
    <div className="flex items-center space-x-2">
      <span>न पाहिलेले:</span>
      <button className="bg-[#959595] rounded-full w-5 h-5" />
    </div>
  </div>
));
StatsDisplay.displayName = "StatsDisplay";

export default StatsDisplay;