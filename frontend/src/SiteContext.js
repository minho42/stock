import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";
import { BACKEND_BASE_URL } from "./globalVariables";

export const SiteContext = createContext(null);

const requestGetOwnedStocks = async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ownedStocks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("requestGetOwnedStocks fetch failed");
    }
    const ownedStocks = await res.json();
    return ownedStocks[0].symbols;
  } catch (error) {
    throw new Error("requestGetOwnedStocks failed");
  }
};

export const SiteProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [journals, setJournals] = useState([]);
  const [isJournalChanged, setIsJournalChanged] = useState(false);
  const [uniqueSymbols, setUniqueSymbols] = useState([]);
  const [ownedSymbols, setOwnedSymbols] = useState([]);

  const actionOptions = ["buy", "sell", "watch", "note"];
  const actionStyles = {
    buy: "bg-green-200",
    sell: "bg-pink-200",
    watch: "bg-amber-200",
    note: "bg-blue-200",
  };
  const actionStylesHex = {
    buy: "#bbf7d0",
    sell: "#fbcfe8",
    watch: "#fde68a",
    note: "#bfdbfe",
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    theme: "dark",
  };

  useEffect(() => {}, [user]);

  const getOwnedSymbols = async () => {
    try {
      const ownedStocks = await requestGetOwnedStocks();
      if (!ownedStocks) {
        throw new Error("getOwnedSymbols: !ownedStocks");
      }
      setOwnedSymbols([...ownedStocks]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getOwnedSymbols();
  }, [uniqueSymbols]);

  return (
    <SiteContext.Provider
      value={{
        actionOptions,
        actionStyles,
        actionStylesHex,
        toast,
        toastOptions,
        journals,
        setJournals,
        isJournalChanged,
        setIsJournalChanged,
        uniqueSymbols,
        setUniqueSymbols,
        ownedSymbols,
        setOwnedSymbols,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
