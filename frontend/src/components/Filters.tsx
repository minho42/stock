import { FilterBySymbols } from "./FilterBySymbols";
import { FilterByActions } from "./FilterByActions";

export const Filters = ({
  uniqueSymbols,
  uniqueActions,
  selectedSymbol,
  setSelectedSymbol,
  selectedAction,
  setSelectedAction,
}) => {
  if (uniqueSymbols?.length === 0 && uniqueActions?.length === 0) {
    return null;
  }

  return (
    // sticky top-0 z-40
    <section className="bg-white py-2 border-y border-gray-200">
      <div className="text-sm uppercase">Filters</div>
      <div className="flex flex-wrap items-start justify-between">
        {uniqueSymbols?.length > 0 && (
          <div className="flex flex-wrap sm:w-3/4 items-center justify-center space-x-2">
            <FilterBySymbols
              symbols={uniqueSymbols}
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </div>
        )}
        {uniqueActions?.length > 0 && (
          <div className="flex flex-wrap sm:w-1/4 items-center justify-center space-x-1">
            <FilterByActions
              actions={uniqueActions}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
          </div>
        )}
      </div>
    </section>
  );
};
