import React, { useState, useRef } from "react";
import { CandleData, TimeFrame } from "../types";
import {
  calculateChartPoints,
  generateGridLines,
  formatPrice,
  formatDate,
} from "../utils/chartUtils";

interface LineChartProps {
  data: CandleData[];
  timeFrame: TimeFrame;
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  timeFrame,
  width = 800,
  height = 400,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    price: number;
    timestamp: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 80 };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  console.log("LineChart received data:", data.length, "points for", timeFrame);

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const chartPoints = calculateChartPoints(data, width, height, padding);
  const gridLines = generateGridLines(
    minPrice,
    maxPrice,
    width,
    height,
    padding
  );

  const pathData = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`)
    .join(" ");

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find the closest point
    const closestPoint = chartPoints.reduce((closest, point) => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      const closestDistance = Math.sqrt(
        Math.pow(closest.x - x, 2) + Math.pow(closest.y - y, 2)
      );
      return distance < closestDistance ? point : closest;
    });

    if (
      Math.sqrt(
        Math.pow(closestPoint.x - x, 2) + Math.pow(closestPoint.y - y, 2)
      ) < 20
    ) {
      setHoveredPoint(closestPoint);
    } else {
      setHoveredPoint(null);
    }
  };

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <div className="">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Stock Chart</h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </div>
            <div
              className={`text-sm ${
                priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}>
              {priceChange >= 0 ? "+" : ""}
              {formatPrice(priceChange)} ({priceChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}>
          {/* Grid lines */}
          {gridLines.map((line, index) => (
            <g key={index}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={width - padding.right}
                y2={line.y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={line.y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500">
                {formatPrice(line.price)}
              </text>
            </g>
          ))}

          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            className="drop-shadow-sm"
          />

          {/* Chart area fill */}
          <path
            d={`${pathData} L ${chartPoints[chartPoints.length - 1]?.x},${
              height - padding.bottom
            } L ${padding.left},${height - padding.bottom} Z`}
            fill="url(#gradient)"
            opacity="0.1"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {chartPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3B82F6"
              className="opacity-0 hover:opacity-100 transition-opacity duration-200"
            />
          ))}

          {/* Hovered point highlight */}
          {hoveredPoint && (
            <>
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={height - padding.bottom}
                stroke="#3B82F6"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            </>
          )}

          {/* X-axis labels */}
          {chartPoints
            .filter((_, index) => {
              // For weekly and monthly, show more labels since there are fewer data points
              const step =
                timeFrame === "weekly" || timeFrame === "monthly"
                  ? Math.max(1, Math.floor(chartPoints.length / 4))
                  : Math.max(1, Math.floor(chartPoints.length / 6));
              return index % step === 0;
            })
            .map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500">
                {formatDate(point.timestamp, timeFrame)}
              </text>
            ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-gray-800 text-white p-2 rounded-lg text-sm pointer-events-none z-10"
            style={{
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 40,
              transform:
                hoveredPoint.x > width - 120 ? "translateX(-100%)" : "none",
            }}>
            <div className="font-semibold">
              {formatPrice(hoveredPoint.price)}
            </div>
            <div className="text-xs text-gray-300">
              {formatDate(hoveredPoint.timestamp, timeFrame)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
