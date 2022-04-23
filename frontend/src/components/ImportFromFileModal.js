import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { XIcon } from "@heroicons/react/outline";
import { parse } from "papaparse";

export const ImportFromFileModal = ({ handleAdd, onClose }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const setCsvFromSelectedFiles = async (files) => {
    // brokers = [{
    // 'stake': {
    //   filename: 'Stake_transaction_summary_report'
    //   columnNames: [
    //     'date': 'DATE (US)'
    //     'action': 'SIDE',
    //   ]
    // }
    // }]
    // findBroker(filename)
    // if not supported -> show msg
    // if supported -> broker.import()

    if (!files) return;

    try {
      const csvFiles = Array.from(files).filter((file) => file.type === "text/csv");
      if (!csvFiles || csvFiles?.length === 0) {
        setErrorMessage("Please select a csv file");
        throw new Error("!csvFiles");
      }
      setSelectedFile(csvFiles[0]);
      setErrorMessage("");
    } catch (error) {
      setSelectedFile(null);
      // console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setCsvFromSelectedFiles(e.target.files);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsHighlighted(false);

    setCsvFromSelectedFiles(e.dataTransfer.files);
  };

  const importStake = async (data) => {
    const dateColumnName = "DATE (US)";
    const valueColumnName = "VALUE (USD)";
    const priceColumnName = "EFFECTIVE PRICE (USD)";
    const referenceColumnName = "REFERENCE";
    const buyName = "B";
    const sellName = "S";

    try {
      data.forEach((d) => {
        if (!d[dateColumnName]) return;

        const action = d.SIDE === buyName ? "buy" : d.SIDE === sellName ? "sell" : "note";
        handleAdd({
          action,
          symbol: d.SYMBOL,
          amount: Math.abs(d[valueColumnName]),
          price: d[priceColumnName],
          date: new Date(d[dateColumnName]),
          content: "",
          // reference: d[referenceColumnName],
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setErrorMessage("File not found");
      return;
    }

    try {
      const text = await selectedFile.text();
      // console.log(text);
      if (!text) {
        throw new Error("!text");
      }
      const { data } = parse(text, { header: true });
      if (!data) {
        throw new Error("!data");
      }
      console.log(data);

      if (selectedFile.name.toLowerCase().includes("stake")) {
        importStake(data);
      }
    } catch (error) {
      setErrorMessage("Something went wrong");
      console.log(error);
    } finally {
      setSelectedFile(null);
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-40">
      <div
        id="overlay"
        className="min-h-full min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>
      <div className="fixed max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-2 bg-white rounded-lg shadow-2xl p-4">
        <div className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="font-semibold text-2xl">Import from a csv</h1>
          <span onClick={() => onClose()} className="cursor-pointer">
            <XIcon className="h-6 w-6 m-2" />
          </span>
        </div>

        <input onChange={handleInputChange} type="file" className="input" />

        <div
          onDragEnter={() => setIsHighlighted(true)}
          onDragLeave={() => setIsHighlighted(false)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-28 text-center border-4 
          ${isHighlighted ? "border-green-500 bg-green-100" : "border-gray-400 bg-gray-100"}
          `}
        >
          {selectedFile ? <div className="font-semibold p-1">{selectedFile?.name}</div> : "Drop file here"}
        </div>

        {errorMessage && <div className="bg-red-100 p-1">{errorMessage}</div>}

        <button
          onClick={handleImport}
          className={`${selectedFile ? "btn-blue" : "btn-disabled"}`}
          disabled={!selectedFile}
        >
          Import
        </button>
        <button onClick={() => onClose()} className="btn-gray">
          Cancel
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
