import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          innerRadius={80}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        {showTextAnchor && (
          <g>
            <text
              x="50%"
              y="50%"
              dy={-10}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={16}
              textAnchor="middle"
              fill="#333"
              fontSize="20px"
              fontWeight="600"
            >
              {totalAmount}
            </text>
          </g>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
