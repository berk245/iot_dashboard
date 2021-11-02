import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import { ResponsiveContainer } from "recharts/lib/component/ResponsiveContainer";
import DownloadChartData from "./helpers/DownloadChartData";
import { Button } from "@material-ui/core";

export default class SingleZoomChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [...props.data.values],
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: "",
      refAreaRight: "",
      top: "dataMax+1",
      bottom: "dataMin-1",
      animation: true,
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
      bottom: "dataMin - 1",
      top: "dataMax + 1",
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
  
  customYAxisTick(tick){
    return(tick.toFixed(2))
  }
  customXAxisTick(tick){
    console.log(tick.split(' ').join('\n'))
    return tick.split(' ').join('\n')
  }

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom } =
      this.state;

    console.log(this.props)
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
                    borderColor: "#8884d8",
                    fontSize:'0.75rem',
                    padding:'0.1rem 0.5rem',
                    color: "#8884d8",
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
                  angle={-10}
                  padding={{ left: 50, right: 50 }}
                  interval={100}
                  allowDataOverflow
                  domain={[left, right]}
                  dataKey="timestamp"
                  tickFormatter={this.customXAxisTick}
                />
                <YAxis
                  allowDataOverflow
                  domain={[bottom, top]}
                  tickFormatter={this.customYAxisTick}
                  tickCount={20}
                  
                  padding={{top: 10, bottom: 20}}
                  type="number"
                  yAxisId="1"
                  width={120}
                />
                <Tooltip />
                <Line
                  dot={false}
                  strokeWidth={2}
                  yAxisId="1"
                  type="natural"
                  dataKey="data1"
                  stroke="#8884d8"
                  animationDuration={300}
                />
                <Line
                  yAxisId="1"
                  dot={false}
                  strokeWidth={2}
                  type="natural"
                  dataKey="data2"
                  stroke="#AB003C"
                  animationDuration={300}
                />
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

            {/* {left !== "dataMin" && (
              <button
                type="button"
                className="btn update"
                onClick={this.zoomOut.bind(this)}
              >
                Zoom Out
              </button>
            )} */}
          </div>
        )}
      </>
    );
  }
}
