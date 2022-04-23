import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export const SearchSuggestionList = ({ query, quotes, onSelect, onSymbolChange }) => {
  const [filteredQuotes, setFilteredQuotes] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const keyboardShortcuts = (e) => {
    if (query?.length === 0 || !quotes) return;

    // console.log(focusedIndex);

    if (e.keyCode === 40) {
      // move down
      let newIndex = focusedIndex + 1;
      if (newIndex > filteredQuotes.length - 1) {
        newIndex = 0;
      }
      setFocusedIndex(newIndex);
      onSymbolChange(filteredQuotes[newIndex].symbol);
    } else if (e.keyCode === 38) {
      // move up
      let newIndex = focusedIndex - 1;
      if (newIndex < 0) {
        newIndex = filteredQuotes.length - 1;
      }
      setFocusedIndex(newIndex);
      onSymbolChange(filteredQuotes[newIndex].symbol);
    } else if (e.keyCode === 13) {
      // Enter
      e.preventDefault();
      onSelect(filteredQuotes[focusedIndex].symbol);
    } else if (e.keyCode === 9) {
      // Tab
      onSelect(filteredQuotes[focusedIndex].symbol);
    } else if (e.keyCode === 27) {
      // esc
      onSelect("");
    }
  };

  const handleClick = (quote) => {
    console.log("click");
    onSelect(quote?.symbol);
  };

  useEffect(() => {
    if (!quotes) return;

    const tempQuotes = quotes.filter((quote) => quote.isYahooFinance);
    setFilteredQuotes(tempQuotes);
  }, [quotes]);

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndex, query, filteredQuotes]);

  // console.log(query);
  return (
    <div className="w-full absolute top-16 left-0 bg-white shadow-lg pb-2 space-y-1 rounded-b-md">
      {query && quotes?.length === 0 && (
        <div className="flex flex-col items-center justify-center px-2 py-3 gap-1">
          <ExclamationCircleIcon className="w-6 h-6" />
          No results for '{query}'
        </div>
      )}

      {filteredQuotes &&
        filteredQuotes.map((quote, index) => {
          return (
            <div
              onClick={() => handleClick(quote)}
              key={index}
              className={`flex items-center hover:bg-blue-100 px-2 py-2 text-sm cursor-pointer
            ${index === focusedIndex ? "bg-blue-100" : "bg-white"}
            `}
            >
              <div className="flex flex-shrink-0 w-2/6 font-semibold">{quote?.symbol}</div>
              <div className="flex flex-wrap">{quote?.shortname || quote?.longname}</div>
              {/* <div className="flex text-gray-500 text-right">
              <span className="capitalize">{quote?.quoteType?.toLowerCase()}</span> - {quote?.exchange}
            </div> */}
            </div>
          );
        })}
    </div>
  );
};
