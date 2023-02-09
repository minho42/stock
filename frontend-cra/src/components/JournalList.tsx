import { useContext, useEffect, useState } from "react";
import { XIcon } from "@heroicons/react/outline";
import { JournalItem } from "./JournalItem";
import { SiteContext } from "../SiteContext";

export const JournalList = ({
  journals,
  setJournals,
  selectedSymbol,
  selectedAction,
  setSelectedSymbol,
  setSelectedAction,
}) => {
  const { actionStyles } = useContext(SiteContext);
  const [filteredJournals, setFilteredJournals] = useState([]);

  useEffect(() => {
    const filtered = journals
      .filter((journal) => {
        if (selectedSymbol) {
          return journal.symbol === selectedSymbol;
        }
        return journal;
      })
      .filter((journal) => {
        if (selectedAction) {
          return journal.action === selectedAction;
        }
        return journal;
      });
    setFilteredJournals(filtered);
  }, [journals, selectedSymbol, selectedAction]);

  if (!journals || journals.length === 0) return null;
  // if (!selectedSymbol && !selectedAction) return null;

  const handleDelete = (id) => {
    const newJournals = journals.filter((journal) => journal._id !== id);
    setJournals(newJournals);
  };

  return (
    <div className="flex flex-col w-full items-start justify-start mt-2">
      <div className="flex flex-row items-center text-sm uppercase pb-2 sm:pt-0 gap-2">
        Journals ({filteredJournals?.length})
        {selectedSymbol && (
          <div className="flex items-center space-x-1">
            <div className="bg-black text-white font-semibold px-2 py-0.5 rounded-full ml-1">
              {selectedSymbol}
            </div>
            <div>
              {selectedSymbol && (
                <XIcon onClick={() => setSelectedSymbol(null)} className="w-5 h-5 cursor-pointer" />
              )}
            </div>
          </div>
        )}
        {selectedAction && (
          <div className="flex items-center space-x-1">
            <div
              className={`font-semibold capitalize px-2 py-0.5 rounded-full ml-1
              ${actionStyles[selectedAction.toLowerCase()]}
            `}
            >
              {selectedAction}
            </div>
            <div>
              {selectedAction && (
                <XIcon onClick={() => setSelectedAction(null)} className="w-5 h-5 cursor-pointer" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full border-y border-gray-200 divide-y pb-3 overflow-hidden">
        {filteredJournals.map((journal, index) => {
          return (
            <JournalItem
              key={index}
              journal={journal}
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
              onDelete={handleDelete}
            />
          );
        })}
      </div>
    </div>
  );
};
