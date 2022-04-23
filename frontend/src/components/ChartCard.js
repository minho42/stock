import { Chart } from "./Chart";

export const ChartCard = ({ symbol, selectedTimeFrame, journals, selectedSymbol, setSelectedSymbol }) => {
  return (
    <div
      onClick={() => setSelectedSymbol(symbol)}
      className={`flex w-full bg-white 
      border-2 border-transparent h-40 sm:h-56
      ${selectedSymbol ? "" : " hover:border-gray-500 "}
    rounded-xl overflow-hidden relative`}
    >
      <div className="absolute left-10 top-2.5 text-sm text-white rounded-sm bg-black px-1 font-semibold z-30">
        {symbol}
      </div>

      <Chart
        // key is necessary here to make child component rerender when props change in parent
        key={journals}
        symbol={symbol}
        selectedTimeFrame={selectedTimeFrame}
        journals={journals}
      />
    </div>
  );
};
