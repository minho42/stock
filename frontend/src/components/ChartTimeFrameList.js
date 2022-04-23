import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const ChartTimeFrameList = ({ timeFrames, selectedTimeFrameName, handleTimeFrameChange }) => {
  return (
    <div className="flex justify-center space-x-1">
      {timeFrames.map((tf, index) => {
        return (
          <button
            onClick={handleTimeFrameChange}
            key={index}
            className={`${
              selectedTimeFrameName === tf.name ? "bg-gray-200 font-semibold" : ""
            } rounded px-2 py-1 uppercase text-sm hover:bg-gray-100`}
          >
            {tf.name}
          </button>
        );
      })}
    </div>
  );
};
