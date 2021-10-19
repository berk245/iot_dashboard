import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function MultipleLineChart({data, title }) {
  return (
    <div>
      <h3>{title}</h3>
      <LineChart width={900} height={200}>
        <XAxis dataKey="date" tick={false} />
        <YAxis/>
          <Line
            type="monotone"
            data={data.data1}
            dataKey="measurement_value"
            stroke="#8884d8"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            data={data.data2}
            dataKey="measurement_value"
            stroke="#2584b8"
            dot={false}
            strokeWidth={2}
          />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default MultipleLineChart;
