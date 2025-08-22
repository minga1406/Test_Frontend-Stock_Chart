import { useState, useEffect } from "react";
import { CandleData, TimeFrame } from "../types";

interface ApiCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ApiResponse {
  candles: ApiCandle[];
}

export const useStockData = (timeFrame: TimeFrame) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://chart.stockscan.io/candle/v3/TSLA/${timeFrame}/NASDAQ`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }

        const result = (await response.json()) as ApiResponse;

        // Transform the data based on API response structure
        let stockData: CandleData[] = [];

        if (result.candles && Array.isArray(result.candles)) {
          stockData = result.candles.map((item: ApiCandle) => ({
            timestamp: new Date(item.date).getTime(),
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume) || 0,
          }));
        } else {
          console.warn("No candles data found for", timeFrame, ":", result);
        }

        // Sort by timestamp
        stockData.sort((a, b) => a.timestamp - b.timestamp);

        setData(stockData);
      } catch (err) {
        console.error("Error fetching stock data:", err);

        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  return { data, loading, error };
};
