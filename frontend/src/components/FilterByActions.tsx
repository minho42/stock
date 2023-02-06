import { useContext } from "react";
import { SiteContext } from "../SiteContext";
import { XIcon } from "@heroicons/react/outline";

export const FilterByActions = ({ actions, selectedAction, setSelectedAction }) => {
  const { actionStyles } = useContext(SiteContext);

  const toggleSelectedAction = (action) => {
    if (action === selectedAction) {
      return setSelectedAction(null);
    }
    return setSelectedAction(action);
  };

  return (
    <>
      <div
        onClick={() => setSelectedAction(null)}
        className={`flex items-center text-sm rounded-full px-3 py-2 m-1 leading-none cursor-pointer font-semibold capitalize
      ${selectedAction ? "bg-gray-100 hover:bg-gray-200 text-black" : "bg-black text-white"}
      `}
      >
        All
      </div>

      {actions.map((action, index) => {
        return (
          <div
            key={index}
            onClick={() => toggleSelectedAction(action)}
            className={`flex items-center text-sm rounded-full px-3 py-2 m-1 leading-none cursor-pointer font-semibold capitalize
            ${
              // action === selectedAction ? "bg-black text-white" : ""
              action === selectedAction ? "border-2 border-black" : ""
              // : "bg-white hover:bg-gray-200 text-black border border-gray-400 hover:border-gray-500"
            }
            ${actionStyles[action.toLowerCase()]}
            `}
          >
            {action}
          </div>
        );
      })}

      <div>
        {selectedAction && (
          <XIcon onClick={() => setSelectedAction(null)} className="w-6 h-6 cursor-pointer" />
        )}
      </div>
    </>
  );
};
