import { useState, useEffect, useContext } from "react";
import { SiteContext } from "../SiteContext";
import ReactDOM from "react-dom";
import { XIcon } from "@heroicons/react/outline";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormError } from "./FormError";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BACKEND_BASE_URL } from "../globalVariables";
import { SearchSuggestionList } from "./SearchSuggestionList";

const validationSchema = Yup.object().shape({
  action: Yup.string().min(1, "must have a character").max(10, "too long").required("required field"),
  symbol: Yup.string(),
  amount: Yup.number().min(0),
  price: Yup.number().min(0),
  date: Yup.date(),
  content: Yup.string(),
});

export const AddJournalModal = ({ handleAdd, onClose, selectedSymbol, selectedAction }) => {
  const { actionStyles, actionOptions } = useContext(SiteContext);
  const [searchSuggestionQuotes, setSearchSuggestionQuotes] = useState(null);
  const [isSearchSuggestionsOpen, setIsSearchSuggestionsOpen] = useState(false);

  const initialValues = {
    action: selectedAction ? selectedAction : actionOptions[0],
    symbol: selectedSymbol ? selectedSymbol : "",
    amount: "",
    price: "",
    date: new Date(),
    content: "",
  };

  const requestFetchQuotesFromSearch = async (query) => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/data/search/${query}`);
      if (!res.ok) {
        throw new Error("requestFetchQuotesFromSearch failed");
      }
      const quotes = await res.json();
      if (!quotes) {
        throw new Error("no quotes");
      }
      return quotes;
    } catch (error) {
      console.log(error);
    }
  };

  const debounce = (callback, delay = 400) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const fetchSuggestion = debounce(async (query) => {
    if (query?.trim()?.length === 0) {
      setSearchSuggestionQuotes(null);
      setIsSearchSuggestionsOpen(false);
      return;
    }

    try {
      const res = await requestFetchQuotesFromSearch(query);
      if (!res) {
        throw new Error("fetchSuggestion failed");
      }
      // console.log(res.quotes);
      setSearchSuggestionQuotes(res.quotes);
      setIsSearchSuggestionsOpen(true);
    } catch (error) {
      console.log(error);
      setSearchSuggestionQuotes(null);
      setIsSearchSuggestionsOpen(false);
    }
  });

  return ReactDOM.createPortal(
    <div className="relative inset-0 z-40">
      <div
        id="overlay"
        className="min-h-full min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>
      <div className="fixed max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-2 bg-white rounded-lg shadow-2xl px-4 py-10">
        <div className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="font-semibold text-2xl">Add a journal</h1>
          <span onClick={() => onClose()} className="cursor-pointer">
            <XIcon className="h-6 w-6 m-2" />
          </span>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            await handleAdd(values);
            onClose();

            setSubmitting(false);
            // resetForm();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => {
            return (
              <form onSubmit={handleSubmit} className="flex flex-col items-end space-y-1">
                {/* <pre className="text-sm">{JSON.stringify(values, null, 2)}</pre> */}
                <div className="mb-3">
                  <div className="flex w-full space-x-1">
                    <div className="flex w-full items-center justify-evenly space-x-1">
                      {actionOptions.map((actionOption, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex flex-col items-center justify-center p-1 w-1/4 focus-outline
                            ${actionOption === values.action ? actionStyles[actionOption] : ""} 
                            `}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.action}
                            id="action"
                          >
                            <label htmlFor={actionOption} className="font-semibold uppercase px-2 py-1">
                              {actionOption}
                            </label>
                            <input
                              key={index}
                              type="radio"
                              id={actionOption}
                              name="action"
                              value={actionOption}
                              defaultChecked={actionOption === values.action}
                              autoFocus={actionOption === values.action}
                              className="w-4 h-4 outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <FormError touched={touched} message={errors.action} />
                  </div>

                  <div className="w-full relative">
                    <label htmlFor="symbol" className="block font-semibold capitalize">
                      symbol
                    </label>
                    <input
                      onChange={async (e) => {
                        handleChange(e);
                        fetchSuggestion(e.target.value);
                      }}
                      onBlur={(e) => {
                        if (!isSearchSuggestionsOpen) {
                          console.log(`onBlur from input: ${isSearchSuggestionsOpen}`);
                          handleBlur(e);
                          setIsSearchSuggestionsOpen(false);
                        }
                      }}
                      value={values.symbol}
                      type="text"
                      id="symbol"
                      className="w-full input"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      placeholder="Search for symbols"
                    />

                    {isSearchSuggestionsOpen && searchSuggestionQuotes && (
                      <SearchSuggestionList
                        query={values.symbol}
                        quotes={searchSuggestionQuotes}
                        onSelect={(symbol) => {
                          setFieldValue("symbol", symbol);
                          setIsSearchSuggestionsOpen(false);
                        }}
                        onSymbolChange={(symbol) => setFieldValue("symbol", symbol)}
                      />
                    )}
                    <FormError touched={touched} message={errors.symbol} />
                  </div>

                  <div className="w-full">
                    <label htmlFor="amount" className="block font-semibold capitalize">
                      amount
                    </label>
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      type="number"
                      step="0.01"
                      id="amount"
                      className="w-full input"
                    />
                    <FormError touched={touched} message={errors.amount} />
                  </div>

                  <div className="w-full">
                    <label htmlFor="price" className="block font-semibold capitalize">
                      price
                    </label>
                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      type="number"
                      step="0.01"
                      id="price"
                      className="w-full input"
                    />
                    <FormError touched={touched} message={errors.price} />
                  </div>

                  <div className="w-full">
                    <label htmlFor="content" className="block font-semibold capitalize">
                      content
                    </label>
                    <textarea
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.content}
                      type="text"
                      id="content"
                      rows="2"
                      className="w-full input"
                    />
                    <FormError touched={touched} message={errors.content} />
                  </div>

                  <div className="w-full">
                    <label htmlFor="date" className="block font-semibold capitalize">
                      date
                    </label>
                    <DatePicker
                      // selected={new Date()}
                      selected={values.date}
                      maxDate={new Date()}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(date) => {
                        setFieldValue("date", date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      formatWeekDay={(name) => name.slice(0, 1)}
                      calendarStartDay="1"
                      fixedHeight={true}
                      className="w-full input"
                    />
                    <FormError touched={touched} message={errors.date} />
                  </div>
                </div>

                <button type="submit" className="w-full btn-blue" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
