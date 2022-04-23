import { useState, useEffect, useReducer, useCallback } from "react";
import { BACKEND_BASE_URL } from "../globalVariables";

import {
  Line,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { timestampToDate, dateStrToTimestamp } from "../utils";
import { useLocalStorage } from "./useLocalStorage";
import { xAxisFormatter, yAxisFormatter, CustomLineDot, CustomTooltip } from "./ChartCustoms";

// TODO: refactor to smaller pieces?

export const Chart = ({ symbol, selectedTimeFrame, journals }) => {
  const [chartData, setChartData] = useLocalStorage(`chartData-${symbol}`, []);
  const [chartDataTimeFramed, setChartDataTimeFramed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const fetchChartData = useCallback(async (symbol) => {
    // setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/data/chart/${symbol}`);
      if (!res.ok) {
        throw new Error("fetchChartData error");
      }
      let {
        data: { timestamp, quote },
      } = await res.json();

      let tempChartData = [];
      if (timestamp && quote) {
        timestamp.forEach((item, i) => {
          tempChartData.push({ timestamp: item, quote: quote[i] });
        });
      }

      // const lastData = tempChartData.at(-1);
      // tempChartData.push({ teimstamp: 24 * 60 * 60 * 1000 + lastData.timestmap, quote: null });

      if (journals) {
        journals.forEach((j) => {
          const transactionDateFromChartData = tempChartData.find((item) => {
            return Math.abs(item.timestamp - dateStrToTimestamp(j.date)) / 60 / 60 < 24;
          });
          // remove same date first before pushing transaction data to prevent duplicate dates
          const removeIndex = tempChartData.findIndex((d) => {
            const a = new Date(d.timestamp * 1000);
            const b = new Date(dateStrToTimestamp(j.date) * 1000);
            return (
              a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
            );
          });

          // TODO: how to handle actions from same day:
          // console.log(`removeIndex: ${removeIndex}`);
          if (removeIndex >= 0) {
            tempChartData.splice(removeIndex, 1);
          }

          if (transactionDateFromChartData?.quote) {
            tempChartData.push({
              id: j._id,
              timestamp: dateStrToTimestamp(j.date),
              quote: transactionDateFromChartData.quote,
              transaction: transactionDateFromChartData.quote,
              action: j.action,
            });
          }
        });
      }

      tempChartData.sort((a, b) => {
        if (a.timestamp > b.timestamp) return 1;
        else return -1;
      });

      tempChartData = tempChartData.map(({ id, timestamp, quote, transaction, action }) => {
        return {
          id: id,
          timestamp: timestampToDate(timestamp),
          quote,
          transaction,
          action,
        };
      });

      setChartData(tempChartData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setChartData([]);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetchChartData(symbol);
  }, []);

  useEffect(() => {
    forceUpdate();
  }, [journals]);

  useEffect(() => {
    if (!chartData || !selectedTimeFrame) return;

    const days = selectedTimeFrame.inDays;
    setChartDataTimeFramed(chartData.slice(-days));
  }, [selectedTimeFrame, chartData]);

  if (isLoading) {
    return <div className="w-full text-center">Loading</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        // width={280}
        // height={180}
        data={chartDataTimeFramed}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="1"
          stroke="#abafb1"
          xAxis={false}
          yAxis={false}
          vertical={false}
          color="#dbdbdb"
        />
        <XAxis
          dataKey="timestamp"
          fontSize="0.7rem"
          color="#666666"
          tickSize="0"
          tickMargin="10"
          tickFormatter={xAxisFormatter}
        />
        <YAxis
          fontSize="0.7rem"
          color="#666666"
          tickSize="0"
          // tickCount="7"
          tickCount="5"
          tickMargin="10"
          tickFormatter={yAxisFormatter}
          domain={[
            (dataMin) => {
              if (isFinite(dataMin)) {
                return dataMin - Math.round(dataMin * 0.01);
              }
              return dataMin;
            },
            (dataMax) => dataMax + Math.round(dataMax * 0.01),
          ]}
          allowDataOverflow={true}
        />
        <Tooltip
          // active={false}
          isAnimationActive={false}
          // position={{ x: 45, y: 10 }}
          content={CustomTooltip}
        />
        <defs>
          <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cccccc" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          type="basis"
          dataKey="quote"
          fill="url(#gradientArea)"
          stroke="#000000"
          strokeWidth="1.2"
          isAnimationActive={false}
          // animationDuration="200"
        />
        <Line type="linear" dataKey="transaction" dot={<CustomLineDot />} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
