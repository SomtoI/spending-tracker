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

function Home() {
  const [spendings, setSpendings] = useState([]);

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(`/api/spendings`);
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
  }, []);

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
    </>
  );
}

export default Home;
