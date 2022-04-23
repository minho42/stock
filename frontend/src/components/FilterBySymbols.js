import { useContext } from "react";
import { SiteContext } from "../SiteContext";
import { XIcon } from "@heroicons/react/outline";

export const FilterBySymbols = ({ symbols, selectedSymbol, setSelectedSymbol }) => {
  const { ownedSymbols } = useContext(SiteContext);

  const toggleSelectedSymbol = (symbol) => {
    if (symbol === selectedSymbol) {
      return setSelectedSymbol(null);
    }
    return setSelectedSymbol(symbol);
  };
  return (
    <>
      <div
        onClick={() => setSelectedSymbol(null)}
        className={`flex items-center text-sm rounded-full px-2 py-2 m-1 leading-none cursor-pointer font-semibold
      ${selectedSymbol ? "bg-gray-100 text-black" : "bg-black text-white"}
      `}
      >
        All {symbols?.length}
      </div>
      {symbols.map((symbol, index) => {
        return (
          <div
            key={index}
            onClick={() => toggleSelectedSymbol(symbol)}
            className={`flex items-center text-sm rounded-full px-2 py-1.5 m-1 leading-none cursor-pointer uppercase font-semibold relative 
              ${symbol === selectedSymbol ? " bg-black text-white " : " bg-gray-100 text-black "}
              
              ${ownedSymbols.includes(symbol) ? "border border-gray-400" : ""}
              `}
          >
            {symbol}
          </div>
        );
      })}

      <div>
        {selectedSymbol && (
          <XIcon onClick={() => setSelectedSymbol(null)} className="w-6 h-6 cursor-pointer" />
        )}
      </div>
    </>
  );
};
