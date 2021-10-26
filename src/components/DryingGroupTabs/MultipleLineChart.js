import React from "react";
import {
    ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

function MultipleLineChart({data1, data2, title, unit }) {


    return (
    <div style={{padding: '1rem'}}>
      <h3 style={{margin: '0rem 0rem 3rem 3rem'}}>{title} ({unit})</h3>
      <ResponsiveContainer>
      <LineChart   >
        <XAxis dataKey='date' label="Date-Time" tick={false} padding={{ left: 20 }}  />
        <YAxis />
          <Line
            type="monotone"
            data={data1}
            label={'Some Name'}
            dataKey="measurement_value"
            name='External'
            stroke="#e91e63"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            data={data2}
            dataKey="measurement_value"
            name='Internal'
            stroke="#002884c7"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Legend style={{margin:'1rem 0 0 -20rem'}} verticalAlign="top" align='center' height={36}/>
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MultipleLineChart;
