import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { JournalList } from "./JournalList";

import { Filters } from "./Filters";
import { AddJournalModal } from "./AddJournalModal";
import { ChartStuff } from "./ChartStuff";

import { ImportFromFileModal } from "./ImportFromFileModal";
import { BACKEND_BASE_URL } from "../globalVariables";

import { demoUserData } from "./demoUserData";
import { Link } from "react-router-dom";

export const Journals = () => {
  const { user } = useContext(UserContext);
  const { journals, setJournals, isJournalChanged, setIsJournalChanged, uniqueSymbols, setUniqueSymbols } =
    useContext(SiteContext);
  // const [journals, setJournals] = useState([]);
  // const [isJournalChanged, setIsJournalChanged] = useState(false);
  // const [uniqueSymbols, setUniqueSymbols] = useState([]);

  const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState<boolean>(false);
  const [isImportFromFileModalOpen, setIsImportFromFileModalOpen] = useState<boolean>(false);
  const [uniqueSymbolsSortedByDate, setUniqueSymbolsSortedByDate] = useState([]);
  const [uniqueActions, setUniqueActions] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestCreateJournal = async (payload) => {
    // console.log(payload);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("requestCreateJournal failed");
      }
      const { journal } = await res.json();
      setIsJournalChanged(!isJournalChanged);
      return journal;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const fetchJournals = async () => {
    setIsLoading(true);

    if (!user) {
      // Fetch demoUser journals (isPublic=true) and show them
      try {
        return setJournals(
          demoUserData.sort((a, b) => {
            return new Date(b.date).valueOf() - new Date(a.date).valueOf();
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/journals`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("fetchJournals failed");
      }
      const data = await res.json();
      setJournals(
        data.sort((a, b) => {
          return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        })
      );
    } catch (error) {
      // TODO: handle "SyntaxError: Unexpected token < in JSON at position 0"
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeUniqueSymbols = () => {
    const filteredJournals = journals
      .filter((journal) => journal.symbol)
      .filter((journal) => {
        if (selectedAction) {
          return journal.action === selectedAction;
        }
        return journal;
      })
      .map((journal) => {
        return { symbol: journal.symbol, date: journal.date };
      });
    const journalsWithUniqueSymbols = [...new Set(filteredJournals.map((journal) => journal.symbol))];
    setUniqueSymbols(journalsWithUniqueSymbols.sort());

    if (selectedSymbol && !journalsWithUniqueSymbols.includes(selectedSymbol)) {
      setSelectedSymbol(null);
    }

    const journalsWithUniqueSymbolsSortedByDate = [
      ...new Set(
        filteredJournals
          .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
          .map((journal) => journal.symbol)
      ),
    ];
    setUniqueSymbolsSortedByDate(journalsWithUniqueSymbolsSortedByDate);
  };

  const makeUniqueActions = () => {
    const totalActions = journals
      .filter((journal) => journal.action)
      .filter((journal) => {
        if (selectedSymbol) {
          return journal.symbol === selectedSymbol;
        }
        return journal;
      })
      .map((journal) => journal.action);
    const uniqueTotalActions = [...new Set(totalActions)];
    setUniqueActions(uniqueTotalActions.sort());

    if (selectedAction && !uniqueTotalActions.includes(selectedAction)) {
      setSelectedAction(null);
    }
  };

  useEffect(() => {
    setJournals([]);
    fetchJournals();
  }, [user]);

  useEffect(() => {
    fetchJournals();
  }, [isJournalChanged]);

  useEffect(() => {
    makeUniqueSymbols();
  }, [journals, selectedAction]);

  useEffect(() => {
    makeUniqueActions();
  }, [journals, selectedSymbol]);

  return (
    <main className="flex flex-col space-y-3 px-2 w-full pb-12">
      <section className="flex items-center justify-center space-x-3">
        {user ? (
          <button onClick={() => setIsAddJournalModalOpen(true)} className="btn-blue rounded-full px-4 py-3">
            Add a journal
          </button>
        ) : (
          <div className="flex flex-col  w-full items-center justify-center space-y-4">
            <h1 className="text-3xl font-semibold text-center">Investing Journals</h1>

            <ul className="list-disc list-inside text-xl px-2">
              <li>Learn by keeping a journal on your investing journey</li>
              <li>Identify what does and doesn't work for you</li>
            </ul>

            <div className="flex flex-col w-full h-full items-center justify-center text-lg bg-purple-100 px-4 py-3">
              <p>This is a demo.</p>
              <p>
                <Link to="/signup" className="font-semibold border-b-2 border-black">
                  Signup
                </Link>{" "}
                to add your journals
              </p>
            </div>
          </div>
        )}

        {/* <button onClick={() => setIsImportFromFileModalOpen(true)} className="btn-white">
          Import from a csv
        </button> */}
      </section>

      {isLoading ? (
        <div className="text-center animate-bounce">Loading...</div>
      ) : !journals || journals.length === 0 ? (
        <div className="text-center">No journals</div>
      ) : (
        ""
      )}

      <Filters
        uniqueSymbols={uniqueSymbols}
        uniqueActions={uniqueActions}
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />

      <article className="flex flex-col sm:flex-row justify-center sm:space-x-2">
        {selectedSymbol && (
          <section id="journals-left" className={`${selectedSymbol ? "sm:w-1/2" : "w-full"} h-full`}>
            <ChartStuff
              uniqueSymbols={uniqueSymbolsSortedByDate}
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
              journals={journals}
            />
          </section>
        )}
        <section
          id="journals-right"
          className={`${selectedSymbol ? "sm:w-1/2" : "w-full max-w-3xl"} space-y-6 h-full`}
        >
          <JournalList
            journals={journals}
            setJournals={setJournals}
            selectedSymbol={selectedSymbol}
            selectedAction={selectedAction}
            setSelectedSymbol={setSelectedSymbol}
            setSelectedAction={setSelectedAction}
          />
        </section>
      </article>

      {isAddJournalModalOpen && (
        <AddJournalModal
          handleAdd={(payload) => requestCreateJournal(payload)}
          onClose={() => setIsAddJournalModalOpen(false)}
          selectedSymbol={selectedSymbol}
          selectedAction={selectedAction}
        />
      )}

      {isImportFromFileModalOpen && (
        <ImportFromFileModal
          handleAdd={(payload) => requestCreateJournal(payload)}
          onClose={() => setIsImportFromFileModalOpen(false)}
        />
      )}
    </main>
  );
};
