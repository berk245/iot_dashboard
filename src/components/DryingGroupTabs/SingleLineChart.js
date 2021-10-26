import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

function SingleLineChart({data,  title, unit}) {
    return (
        <div style={{padding:'1rem'}}>
            <h3 style={{margin:'3rem 2rem'}}>{title} ({unit})</h3>
            <LineChart width={900} height={200} data={data}>
            <Line type="monotone" dataKey="measurement_value" stroke="#8884d8" dot={false} strokeWidth={2}/>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" tick={false} interval='preserveEnd' />
            <YAxis />
            <Tooltip/>
        </LineChart>

        </div>
    )
}

export default SingleLineChart
