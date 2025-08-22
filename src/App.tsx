import { useState } from "react";
import { TimeFrameButtons } from "./components/TimeFrameButtons";
import { LineChart } from "./components/LineChart";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useStockData } from "./hooks/useStockData";
import { TimeFrame } from "./types";

function App() {
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>("daily");
  const { data, loading, error } = useStockData(selectedTimeFrame);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-5xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-lg">
                <LoadingSpinner size="large" />
                <p className="text-gray-500 mt-4">Loading stock data...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-lg">
                <div className="text-red-500 text-center">
                  <p className="text-xl font-semibold mb-2">
                    Error loading data
                  </p>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <LineChart
                data={data}
                timeFrame={selectedTimeFrame}
                width={900}
                height={400}
              />
            )}
          </div>
          <div className="flex items-center justify-start">
            <TimeFrameButtons
              selectedTimeFrame={selectedTimeFrame}
              onTimeFrameChange={setSelectedTimeFrame}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
