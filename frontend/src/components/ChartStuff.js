import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ChartCardList } from "./ChartCardList";
import { ChartTimeFrameList } from "./ChartTimeFrameList";

const timeFrames = [
  {
    name: "1m",
    inDays: 21,
    inRealDays: 30,
  },
  {
    name: "3m",
    inDays: 21 * 3,
    inRealDays: 91,
  },
  {
    name: "6m",
    inDays: 21 * 6,
    inRealDays: 182,
  },
  {
    name: "1y",
    inDays: 5 * 52 * 1,
    inRealDays: 365,
  },
  {
    name: "2y",
    inDays: 5 * 52 * 2,
    inRealDays: 730,
  },
  {
    name: "5y",
    inDays: 5 * 52 * 5,
    inRealDays: 1825,
  },
  {
    name: "10y",
    inDays: 5 * 52 * 10,
    inRealDays: 3650,
  },
  // {
  //   name: "all",
  //   inDays: 0,
  // },
];

export const ChartStuff = ({ uniqueSymbols, selectedSymbol, setSelectedSymbol, journals }) => {
  const [isChartHidden, setIsChartHidden] = useLocalStorage(`isChartHidden`, false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
  const [selectedTimeFrameName, setSelectedTimeFrameName] = useLocalStorage(
    `chartSelectedTimeFrameName`,
    "1y"
  );

  const handleTimeFrameChange = (e) => {
    setSelectedTimeFrameName(e.target.innerHTML);
  };

  useEffect(() => {
    const selected = timeFrames.find((tf) => tf.name === selectedTimeFrameName);
    setSelectedTimeFrame(selected);
  }, [selectedTimeFrameName]);

  if (!uniqueSymbols || uniqueSymbols?.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col w-full">
      <div className="">
        {/* <button onClick={() => setIsChartHidden(!isChartHidden)} className="uppercase text-xs">
          {isChartHidden ? "Show charts" : "Hide charts"}
        </button> */}
      </div>

      <div className={`${isChartHidden ? "hidden" : "block"}`}>
        <div className="py-1">
          <ChartTimeFrameList
            timeFrames={timeFrames}
            selectedTimeFrameName={selectedTimeFrameName}
            handleTimeFrameChange={handleTimeFrameChange}
          />
        </div>

        <ChartCardList
          uniqueSymbols={uniqueSymbols}
          selectedSymbol={selectedSymbol}
          selectedTimeFrame={selectedTimeFrame}
          setSelectedSymbol={setSelectedSymbol}
          journals={journals}
        />
      </div>
    </div>
  );
};
