import { ChartCard } from "./ChartCard";

export const ChartCardList = ({
  uniqueSymbols,
  selectedSymbol,
  selectedTimeFrame,
  setSelectedSymbol,
  journals,
}) => {
  return (
    //   <div
    //     className={`grid grid-flow-row gap-2 bg-gray-100 p-3
    // ${selectedSymbol ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 "}`}
    //   >
    <div className="flex flex-wrap bg-gray-100 p-2 gap-2">
      {uniqueSymbols
        .filter((symbol) => {
          if (selectedSymbol) {
            return symbol === selectedSymbol;
          }
          return symbol;
        })
        .map((symbol) => {
          return (
            <ChartCard
              // key is necessary here to make child component rerender when props change in parent
              key={symbol}
              symbol={symbol}
              selectedTimeFrame={selectedTimeFrame}
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
              journals={journals.filter((journal) => journal.symbol === symbol)}
            />
          );
        })}
    </div>
  );
};
