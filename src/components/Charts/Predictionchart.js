import { makeStyles } from '@material-ui/core';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const useStyles = makeStyles(()=>({
    chartTitle:{
        margin: '2rem 0rem 0rem 5%'
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


class CustomizedXAxisTick extends React.Component {
    render() {
      const { x, y, stroke, payload } = this.props;

      const date = payload.value.split('-').reverse().join('-')

      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} fill="#666">
            <tspan textAnchor="middle" x="0">
              {date}
            </tspan>
          </text>
        </g>
      );
    }
  } 



function PredictionChart({predictionData}) {
    const classes = useStyles()

    const YAxisFormatter = (e) =>{
      console.log(e)
      return e * 100
    }
    const  renderTooltip = (e) => {
      if (!e.payload) return <div></div>;
      try {
        let color1 = e.payload[0].color;
        let { likelihood, timestamp_dry } = e.payload[0].payload;
        return (
          <div
            style={{
              border: "1px solid  silver",
              borderRadius: "5px",
              background: "white",
              padding: "0.25rem",
            }}
          >
            <p>
              Date: {timestamp_dry.split('-').reverse().join('-')}
            </p>
            <p style={{ color: color1 }}>
              Likelihood: {(likelihood*100).toFixed(2)}%
            </p>
          </div>
        );
      } catch (err) {
        return <div></div>;
      }
    };
  
    return (

        <>
        {predictionData.length&&
        <>
         <h4 className={classes.chartTitle}>Possibility of Completion (%)</h4>
        <ResponsiveContainer width='100%' height={250}>
        <BarChart
          data={predictionData}
          barCategoryGap={25}
          margin={{
            top: 50,
            right: 0,
            left: 0,
            bottom: 20,
          }}
          top={100}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="timestamp_dry" tickMargin={10} tick={{fontSize:14}} tick={<CustomizedXAxisTick/>}/>
          <YAxis tickFormatter={YAxisFormatter} domain={[0,1]} tickCount={3}/>
          <Tooltip content={renderTooltip}/>
          <Bar dataKey="likelihood" fill="#002884"  />
        </BarChart>
        </ResponsiveContainer>
        </>
        }
       
      </>
    )
}

export default PredictionChart
