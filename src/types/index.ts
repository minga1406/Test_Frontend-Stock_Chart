export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  timestamp: number;
  price: number;
}

export type TimeFrame = 'hourly' | 'daily' | 'weekly' | 'monthly';

export const TIME_FRAME_MAP: Record<TimeFrame, string> = {
  hourly: '1h',
  daily: '1d', 
  weekly: '1w',
  monthly: '1M'
};