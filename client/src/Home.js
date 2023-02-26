import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

const FRAME_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const RANGE_OPTIONS = [
  { value: 1, label: "1     " },
  { value: 2, label: "2      " },
  { value: 3, label: "3      " },
  { value: 4, label: "4      " },
  { value: 5, label: "5      " },
  { value: 6, label: "6      " },
];

function Home() {
  const [spendings, setSpendings] = useState([]);
  const [frame, setFrame] = useState("daily");
  const [range, setRange] = useState(1);

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(
        `/api/spendings?frame=${frame}&range=${range}`
      );
      const { spendings } = data;

      setSpendings(spendings);
    } catch (error) {
      console.error(error);
    }
  };

  const formattedTransactions = useMemo(
    () =>
      spendings &&
      spendings.map((t) => ({
        totalAmount: t.totalAmount,
        date: new Date(t.startDate).toDateString(),
      })),
    [spendings]
  );

  useEffect(() => {
    fetchChartData();
  }, [frame, range]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome to My Spending App</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedTransactions}
          margin={{
            top: 30,
            right: 50,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="totalAmount" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <label htmlFor="frame" style={{ marginRight: 10 }}>
        Frame:
      </label>
      <select
        id="frame"
        value={frame}
        onChange={(e) => setFrame(e.target.value)}
        style={{ marginRight: 10 }}
      >
        {FRAME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="range" style={{ marginRight: 10 }}>
        Range:
      </label>
      <select
        id="range"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        style={{ marginRight: 10 }}
      >
        {RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Home;
