import { CandleData, ChartPoint } from "../types";

export const formatPrice = (price: number): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "$0.00";
  }
  return `$${price.toFixed(2)}`;
};

export const formatDate = (timestamp: number, timeFrame: string): string => {
  const date = new Date(timestamp);

  switch (timeFrame) {
    case "hourly":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "daily":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "weekly":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "monthly":
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    default:
      return date.toLocaleDateString();
  }
};

export const calculateChartPoints = (
  data: CandleData[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): ChartPoint[] => {
  if (data.length === 0) return [];

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  return data.map((item, index) => ({
    x: padding.left + (index / (data.length - 1)) * chartWidth,
    y: padding.top + ((maxPrice - item.close) / priceRange) * chartHeight,
    timestamp: item.timestamp,
    price: item.close,
  }));
};

export const generateGridLines = (
  minPrice: number,
  maxPrice: number,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): { y: number; price: number }[] => {
  const gridLines = [];
  const priceRange = maxPrice - minPrice;
  const chartHeight = height - padding.top - padding.bottom;

  for (let i = 0; i <= 5; i++) {
    const price = minPrice + (priceRange * i) / 5;
    const y = padding.top + ((maxPrice - price) / priceRange) * chartHeight;
    gridLines.push({ y, price });
  }

  return gridLines;
};
