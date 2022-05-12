const axios = require("axios");
const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const ChartData = require("../models/chartDataModel");

const cache = apicache.middleware;

const fetchQuotesFromSearch = async (query) => {
  const quotesCount = 5;
  try {
    const { data } = await axios(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${query}&lang=en-US&region=US&quotesCount=${quotesCount}&newsCount=0&listsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=true&enableEnhancedTrivialQuery=true&researchReportsCount=0`
    );
    return data.quotes;
  } catch (error) {
    console.log(error);
  }
};

const fetchCurrency = async (fromTo) => {
  try {
    const { data } = await axios(
      `https://query1.finance.yahoo.com/v8/finance/chart/${fromTo}=X?&includePrePost=false&interval=3mo&useYfid=false&range=1mo&.tsrc=finance`
    );
    return data.chart.result[0].meta.regularMarketPrice;
  } catch (error) {
    console.log(error);
  }
};

const fetchQuote = async (symbol) => {
  try {
    const { data } = await axios(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
    return data.quoteResponse.result[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchChartData = async (symbol) => {
  // TODO: timezone for asx: doesn't show up to the current date but like 2 days back...
  const period2 = Math.round(new Date().getTime() / 1000);
  try {
    const { data } = await axios(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?symbol=${symbol}&period1=1238504400&period2=${period2}&useYfid=true&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-AU&region=AU&crumb=IhoCryrfgf0&corsDomain=au.finance.yahoo.com`
    );
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

router.get("/data/search/:text", cache("7 days"), async (req, res) => {
  const text = req.params.text;
  try {
    const quotes = await fetchQuotesFromSearch(text);
    if (!quotes) {
      return res.status(404).send();
    }
    const filteredQuotes = quotes.filter((quote) => quote.isYahooFinance && quote.typeDisp !== "Option");
    res.send({ quotes: filteredQuotes });
  } catch (error) {
    console.log(error);
    res.status(400).send(e);
  }
});

router.get("/currency/USDAUD", cache("5 minutes"), async (req, res) => {
  const rate = await fetchCurrency("USDAUD");
  res.send({ rate });
});

router.get("/currency/AUDUSD", cache("5 minutes"), async (req, res) => {
  const rate = await fetchCurrency("AUDUSD");
  res.send({ rate });
});

router.get("/data/quote/:symbol", cache("5 minutes"), async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const quote = await fetchQuote(symbol);
    if (!quote) {
      return res.status(404).send();
    }
    res.send({ quote });
  } catch (error) {
    console.log(error);
    res.status(400).send(e);
  }
});

//
router.get("/data/chart/:symbol", cache("5 minutes"), async (req, res) => {
  // TODO: refactor, double try/catch block and logic

  const symbol = req.params.symbol.toUpperCase();
  if (!symbol || symbol.length < 1) {
    console.error("!symbol");
    return res.status(400).send();
  }

  // Return from DB if the data is available and recent
  try {
    const RECENT_TIME = 1000 * 60 * 10;
    const chartData = await ChartData.findOne({
      name: symbol,
      createdAt: { $gte: new Date(new Date().getTime() - RECENT_TIME).toISOString() },
    });
    if (chartData && chartData.timestamp?.length > 0) {
      console.log(`Data from db for [${symbol}]`);

      return res.send({
        data: {
          timestamp: chartData.timestamp,
          quote: chartData.quote,
        },
      });
    }
  } catch (error) {
    console.log("ChartData.findOne error for: " + symbol);
  }

  // If DB data not available or old, fetch and save
  try {
    console.log(`fetchChartData(${symbol})`);
    const data = await fetchChartData(symbol);
    if (!data || data.chart.error) {
      throw new Error("fetchChartData failed");
    }

    const returnData = {
      timestamp: data.chart.result[0].timestamp,
      quote: data.chart.result[0].indicators.quote[0].close,
    };

    console.log(`Saving [${symbol}] to db`);
    await ChartData.deleteMany({ name: symbol });
    const chartDataToSave = new ChartData({
      name: symbol,
      timestamp: returnData.timestamp,
      quote: returnData.quote,
    });
    await chartDataToSave.save();

    res.send({
      data: returnData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
