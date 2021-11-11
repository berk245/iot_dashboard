import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend
} from "recharts";
import { ResponsiveContainer } from "recharts/lib/component/ResponsiveContainer";
import DownloadChartData from "./helpers/DownloadChartData";
import { Button } from "@material-ui/core";
import { timeConverter } from "./helpers/TimeConverter";




class CustomizedAxisTick extends React.Component{

  render () {
    const {x, y, stroke, payload} = this.props;
		let converted = timeConverter(payload.value)
   	return (
    	<g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fill="#666">
          <tspan textAnchor="middle" x="0">{converted.date}</tspan>
          <tspan textAnchor="middle" x="0" dy="20">{converted.time}</tspan>
        </text>
      </g>
    );
  }
};



export default class SingleZoomChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [...props.data.values],
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: "",
      refAreaRight: "",
      animation: true,
      labels: props.data.labels,
    };
      
  }

  zoom() {
    let { refAreaLeft, refAreaRight, data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState({
        refAreaLeft: "",
        refAreaRight: "",
      });
      return;
    }


    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    this.setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin-1"
    }));
  }

  handleMouseDown(e) {
    try {
      this.setState({ refAreaLeft: e.activeLabel });
    } catch {
      console.log("Click out of bounds");
    }
  }

  handleMouseMove(e) {
    try {
      this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel });
    } catch {
      console.log("Click out of bounds");
    }
  }

  formatXAxis(tickItem) {
    // let label = new Date(tickItem).toLocaleDateString('de-DE') + ' ' + new Date(tickItem).toLocaleTimeString('de-DE')
    // return label
    let label = "";
    let splited = tickItem.split(" ");
    if (splited[1] == "01:00:00") {
      label = splited[0];
    }
    return label;
  }

  legendFormatter = (value, entry, index) => {
    let splitted = this.state.labels[value].split('_')
    return splitted[splitted.length -1]
  }

  renderTooltip = (e) =>{
    if(!e.payload) return <div></div>
    try{
      let color1 = e.payload[0].color
      let {data1, timestamp_unix} = e.payload[0].payload 
      let formatted = timeConverter(timestamp_unix)
    return (
   
    <div style={{border: '1px solid  silver', borderRadius:'5px', background:'white', padding:'0.5rem 1rem'}}>
        <p>{formatted.date} {formatted.time}</p>
        <p style={{color: color1}}>{this.props.data.labels.data1} : {data1.toFixed(2)}</p>
    </div>
    )
    }catch(err){
      return <div></div>
    }
    
    
  }

  render() {
    const { data, left, right, refAreaLeft, refAreaRight } =
      this.state;


    return (
      <>
        {data && (
          <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
            <div style={{marginBottom: '1rem'}}>
            <p style={{fontSize: '1.1rem', fontWeight: 600, marginLeft: '2rem'}}>{this.props.data.kpi.toUpperCase()}</p>
            <div style={{ display:'inline-block', width:'70%', marginLeft:'2rem', marginBottom:'1rem' }}>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    borderColor: "#002884",
                    fontSize:'0.75rem',
                    padding:'0.1rem 0.5rem',
                    color: "#002884",
                    fontWeight: 600,
                    borderWidth: '2px',
                    textTransform: 'none'
                  }}
                  onClick={() => {
                    DownloadChartData(data);
                  }}
                >
                  Download as CSV
                </Button>
              </div>
              </div>
              {left !== "dataMin" && (
              <div style={{width: '10%', margin:'auto'}}>
              <Button
                onClick={this.zoomOut.bind(this)}
                variant="outlined"
                size="small"
                style={{
                  borderColor: "rgb(171, 0, 60)",
                  fontSize: "0.75rem",
                  padding: "0.1rem 0.5rem",
                  color: "rgb(171, 0, 60)",
                  fontWeight: 600,
                  borderWidth: "2px",
                  textTransform: "none",
                }}
              >
                Zoom Out
              </Button>
              </div>
            )}
            <ResponsiveContainer width="90%" height={400}>
              <LineChart
                data={data}
                onMouseDown={(e) => this.handleMouseDown(e)}
                onMouseMove={(e) => this.handleMouseMove(e)}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseUp={this.zoom.bind(this)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  height={100}
                  tickMargin={20}
                  padding={{ left: 50, right: 50 }}
                  allowDataOverflow
                  domain={[left, right]}
                  dataKey="timestamp_unix"
                  type='number'
                  tick={<CustomizedAxisTick/>}         

                />
                <YAxis
                  allowDataOverflow
                  tickCount={5}
                  domain={[dataMin => (Math.floor(dataMin/10) *10), dataMax => (Math.ceil(dataMax/10) *10)]}
                  padding={{top: 10, bottom: 5}}
                  type="number"
                  yAxisId="1"
                  width={120}
                />
                <Tooltip content={this.renderTooltip}/>
                <Line
                  dot={false}
                  strokeWidth={2}
                  yAxisId="1"
                  type="natural"
                  dataKey="data1"
                  stroke="#002884"
                  animationDuration={300}
                />
                <Legend formatter={this.legendFormatter}/>
                {refAreaLeft && refAreaRight ? (
                  <ReferenceArea
                    yAxisId="1"
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </>
    );
  }
}
