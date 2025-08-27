import React, { useState, useEffect } from "react";
import CustomPieChart from "../charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    if (Array.isArray(data)) {
      const dataArr = data.map((item) => ({
        name: item?.source,
        amount: item?.amount,
      }));
      setChartData(dataArr);
    } else {
      console.error('Data is not an array:', data);
      setChartData([]); // Fallback to an empty array if data is not an array
    }
  };

  useEffect(() => {
    prepareChartData();
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`${totalIncome}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default RecentIncomeWithChart;
