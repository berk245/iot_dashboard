import { makeStyles } from '@material-ui/core';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const useStyles = makeStyles(()=>({
    chartTitle:{
        margin: '2rem 0rem 0rem 2.5rem'
    }
}))

const data = [
    {
      timestamp: "2021-08-30",
      likelihood: 10,
    },
    {
        timestamp: "2021-09-01",
        likelihood: 12,
      },{
        timestamp: "2021-09-02",
        likelihood: 14,
      },{
        timestamp: "2021-09-03",
        likelihood: 26,
      },{
        timestamp: "2021-09-04",
        likelihood: 57,
      },{
        timestamp: "2021-09-05",
        likelihood: 50,
      },{
        timestamp: "2021-09-06",
        likelihood: 40,
      },{
        timestamp: "2021-09-07",
        likelihood: 30,
      },{
        timestamp: "2021-09-08",
        likelihood: 20,
      },
    
  ];

function PredictionChart() {
    const classes = useStyles()
    return (
        <>
        <h4 className={classes.chartTitle}>Possibility of Completion (%) [Hardcoded Dummy Data]</h4>
        <ResponsiveContainer width='90%' height={200} margin='auto'>
        <BarChart
          data={data}
          barCategoryGap={5}
          margin={{
            top: 50,
            right: 50,
            left: 20,
            bottom: 5,
          }}
          top={100}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="timestamp" tick={{fontSize:14}}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="likelihood" fill="#AB003C" />
        </BarChart>
        </ResponsiveContainer>
      </>
    )
}

export default PredictionChart
