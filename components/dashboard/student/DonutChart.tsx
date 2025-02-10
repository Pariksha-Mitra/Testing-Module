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
    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6 overflow-auto">
      {/* Legend Section */}
      <div className="w-full md:w-3/2">
        <div className="flex flex-col justify-center ">
          {segments.map((segment) => (
            <div key={segment.label} className="flex justify-center items-center mb-2 md:mr-20">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: segment.color }}
              />
              <span
                className="ml-2 text-base md:text-lg arya-regular"
                style={{ color: segment.color }}
              >
                {`${segment.label}: ${segment.value}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-44 md:h-44 lg:w-52 lg:h-52">
          <svg
            viewBox="0 0 42 42"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {segments.map((segment, index) => (
              <g
                key={segment.label}
                onMouseEnter={() => handleMouseEnter(segment)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx="21"
                  cy="21"
                  r="15.9155"
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="8"
                  pointerEvents="stroke"
                  strokeDasharray={`${(segment.value / total) * 100} ${100 - (segment.value / total) * 100
                    }`}
                  strokeDashoffset={-calculateOffset(index)}
                />
              </g>
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 arya-bold">
              {hoveredSegment
                ? `${hoveredSegment.label}: ${hoveredSegment.value}`
                : centerValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
