import { useState, useEffect, useContext } from "react";
import { SiteContext } from "../SiteContext";
import { BACKEND_BASE_URL } from "../globalVariables";

const requestUpdateOwnedStocks = async (stocks) => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ownedStocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ symbols: stocks }),
    });
    if (!res.ok) {
      throw new Error("requestUpdateOwnedStocks failed");
    }
    const updated = await res.json();
    console.log(updated);
    return updated;
  } catch (error) {
    console.log(error);
  }
};

export const OwnedStocks = () => {
  const { uniqueSymbols, toast, toastOptions, ownedSymbols, setOwnedSymbols } = useContext(SiteContext);
  const [newOwnedSymbols, setNewOwnedSymbols] = useState([]);

  useEffect(() => {
    setNewOwnedSymbols(ownedSymbols);
  }, [ownedSymbols]);

  if (!uniqueSymbols || uniqueSymbols?.length === 0) return "";

  const handleToggle = (symbol) => {
    if (newOwnedSymbols.includes(symbol)) {
      const deleted = newOwnedSymbols.filter((s) => s !== symbol);
      setNewOwnedSymbols(deleted);
    } else {
      const added = [...newOwnedSymbols, symbol];
      setNewOwnedSymbols(added);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await requestUpdateOwnedStocks(newOwnedSymbols);
      if (!updated) {
        throw new Error("!updated");
      }
      toast.success("Owned stocks updated", toastOptions);
    } catch (error) {
      console.log(error);
      toast.error("Owned stocks update failed", toastOptions);
      setNewOwnedSymbols(ownedSymbols);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 space-y-3 rounded-md border border-gray-300">
      <div className="text-lg">Which stocks do you currently own?</div>
      {newOwnedSymbols.length} / {uniqueSymbols.length}
      <div className="space-x-6">
        <button className="link-blue" onClick={() => setNewOwnedSymbols(uniqueSymbols)}>
          Select all
        </button>
        <button className="link-blue" onClick={() => setNewOwnedSymbols([])}>
          Unselect all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueSymbols.map((symbol, index) => {
          return (
            <div
              onClick={() => handleToggle(symbol)}
              key={index}
              className={`px-2 py-0.5 rounded-full border-2 border-transparent cursor-pointer text-sm font-semibold
              ${newOwnedSymbols.includes(symbol) ? "bg-blue-600 text-white" : "bg-gray-100"}
              `}
            >
              {symbol}
            </div>
          );
        })}
      </div>
      <div>
        <button onClick={handleSave} className="block btn-blue">
          Save owned stocks
        </button>
      </div>
    </div>
  );
};
