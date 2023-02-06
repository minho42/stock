import { useState, useEffect, useContext, useCallback } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { showValueWithComma, truncateStr } from "../utils";
import { SiteContext } from "../SiteContext";
import { BACKEND_BASE_URL } from "../globalVariables";

const requestJournalDelete = async (id) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/journals/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("requestJournalDelete failed");
    }
    const journal = await res.json();
    return journal;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchQuote = async (symbol) => {
  if (!symbol) return;
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/data/quote/${symbol}`);
    if (!res.ok) {
      throw new Error("fetchQuote failed, frontend");
    }
    const { quote } = await res.json();
    if (!quote) {
      throw new Error("no quote");
    }
    return quote;
  } catch (error) {
    console.log(error);
  }
};

export const JournalItem = ({ journal, selectedSymbol, setSelectedSymbol, onDelete }) => {
  // console.log(journal);
  const [quote, setQuote] = useState(null);
  const [isPriceUp, setIsPriceUp] = useState(null);
  const [priceDiffPercentage, setPriceDiffPercentage] = useState(null);
  const [prevDotID, setPrevDotID] = useState(null);
  const [prevDotRadius, setPrevDotRadius] = useState(null);
  const { actionStyles, toast, toastOptions } = useContext(SiteContext);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const fetchAndSetQuote = useCallback(async () => {
    const quote = await fetchQuote(journal.symbol);
    setQuote(quote);
  }, []);

  useEffect(() => {
    if (!journal?.symbol) return;

    fetchAndSetQuote();
  }, [journal]);

  useEffect(() => {
    if (!journal.price || !quote) return;
    if (quote.regularMarketPrice >= journal.price) {
      setIsPriceUp(true);
    } else {
      setIsPriceUp(false);
    }

    // TODO: if journal.price doesn't exist, get quote of the day from the chartData
    setPriceDiffPercentage((((quote.regularMarketPrice - journal.price) / journal.price) * 100).toFixed(2));
  }, [quote]);

  const removePrevDotHighlight = () => {
    if (prevDotID) {
      const prevDot = document.getElementById(prevDotID);
      if (prevDot && prevDotRadius) {
        prevDot.setAttribute("r", prevDotRadius);
      }
    }
  };

  const handleClick = () => {
    setSelectedSymbol(journal.symbol);
    removePrevDotHighlight();
  };

  const handleHover = (journal) => {
    setIsMouseOver(true);
    const id = journal._id;
    removePrevDotHighlight();
    const dot = document.getElementById(id);
    setPrevDotID(id);
    if (dot) {
      setPrevDotRadius(dot.getAttribute("r"));
      dot.setAttribute("r", "16");
    }
  };

  const handleLeave = () => {
    setIsMouseOver(false);
    removePrevDotHighlight();
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    onDelete(journal._id);

    const deletedJournal = await requestJournalDelete(journal._id);
    // console.log(deletedJournal);
    if (!deletedJournal) {
      toast.Error("Uh-oh Something went wrong", toastOptions);
    }
  };

  return (
    <article
      onClick={handleClick}
      onMouseOver={() => handleHover(journal)}
      onMouseLeave={handleLeave}
      className={`flex flex-col w-full bg-white 
      hover:bg-gray-100
     sm:px-2 py-3 space-x-2 space-y-1
     ${selectedSymbol ? "cursor-auto" : "cursor-pointer"}
     `}
    >
      <div className="flex items-center space-x-1">
        <div className="text-sm text-gray-500 tracking-tight">
          {new Date(journal.date).toLocaleDateString()}
        </div>

        <div>·</div>

        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full capitalize ${
            actionStyles[journal?.action]
          }`}
        >
          {journal?.action[0]}
        </div>

        <div>·</div>

        <div className="font-semibold">{journal.symbol}</div>

        <div className="flex space-x-1 flex-wrap">
          {journal?.amount || journal?.price ? <div>·</div> : ""}

          <div
            className={`
                font-semibold
                ${journal?.action === "sell" ? "text-pink-600" : "text-green-600"}
                 `}
          >
            {journal?.amount && showValueWithComma(journal?.amount)}
          </div>
          {journal?.price ? <div className="text-gray-500 ml-1">at {journal?.price}</div> : ""}
        </div>

        {selectedSymbol && journal?.price && isPriceUp !== null && <div>·</div>}

        {selectedSymbol && journal?.price && isPriceUp !== null && (
          <div>
            <div className="flex flex-wrap ">
              <div className={`${isPriceUp ? "text-green-600" : "text-pink-600"} text-sm`}>
                ({priceDiffPercentage && <span>{priceDiffPercentage}%</span>} since)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full items-center relative pr-1">
        {journal?.content && (
          <h1
            className={`text-lg 
            ${selectedSymbol ? "whitespace-pre-line" : "line-clamp-3 sm:line-clamp-4"}
            `}
          >
            {selectedSymbol ? journal?.content : truncateStr(journal?.content)}
          </h1>
        )}

        <div className="">
          <div className="flex absolute right-1.5 top-1/2 transform -translate-y-full text-gray-700 hover:text-black rounded-full bg-gray-100/80 pl-1">
            {isMouseOver && (
              <Tippy content="Delete">
                <span>
                  <TrashIcon
                    onClick={handleDelete}
                    className="w-9 h-9 rounded-full p-2 hover:bg-gray-200 cursor-pointer"
                  />
                </span>
              </Tippy>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
