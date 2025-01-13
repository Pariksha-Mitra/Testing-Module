import React, { useState } from "react";

interface DonutChartProps {
  segments: { color: string; value: number; label: string }[];
  total: number;
  centerValue: number | string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  total,
  centerValue,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const calculateOffset = (index: number) => {
    const previousValues = segments
      .slice(0, index)
      .reduce((sum, seg) => sum + seg.value, 0);
    return (previousValues / total) * 100;
  };

  const handleMouseEnter = (segment: { label: string; value: number }) => {
    setHoveredSegment(segment);
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <div className="grid grid-cols-2 gap-32 items-center mt-3">
      {/* Left column: legend */}
      <div>
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center mb-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: segment.color }}
            />
            <span
              className="ml-2 text-lg arya-regular"
              style={{ color: segment.color }}
            >
              {`${segment.label}: ${segment.value}`}
            </span>
          </div>
        ))}
      </div>

      {/* Right column: donut chart */}
      <div className="relative w-52 h-52">
        <svg
          viewBox="0 0 42 42"
          className="w-full h-full "
          preserveAspectRatio="xMidYMid meet"
        >
          {segments.map((segment, index) => (
           <g
           key={index}
           onMouseOver={() => handleMouseEnter(segment)}
           onMouseOut={handleMouseLeave}
           style={{ cursor: "pointer" }}
         >
           <circle
             cx="21"
             cy="21"
             r="15.9155"
             fill="transparent"
             stroke={segment.color}
             strokeWidth={8}
             pointerEvents="stroke"
             strokeDasharray={`${(segment.value / total) * 100} ${
               100 - (segment.value / total) * 100
             }`}
             strokeDashoffset={-calculateOffset(index)}
           />
         </g>
         
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-green-600 arya-bold">
            {hoveredSegment
              ? `${hoveredSegment.label}: ${hoveredSegment.value}`
              : centerValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
