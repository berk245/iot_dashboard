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
      data: [...props.data],
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: "",
      refAreaRight: "",
      top: "dataMax+1",
      bottom: "dataMin-1",
      animation: true,
    };
  }
  // addTimestamps(arr){
  //   let result = []

  //   arr.map(item => {
  //     let timestamp = new Date(item.measurement_interval).getTime()
  //     if(1634610000 < timestamp < 1634750000) console.log(timestamp,item.measurement_interval)
  //     let newItem = {...item, timestamp: timestamp}
  //     result.push(newItem)
  //   })
  //   return(result)
  // }

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

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom } =
      this.state;

    return (
      <>
        {data && (
          <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
            <h3>{this.props.title.toUpperCase()}</h3>
            <div style={{ width:'90%', textAlign:'right' }}>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    borderColor: "#8884d8",
                    color: "#8884d8",
                    fontWeight: 600,
                    borderWidth: '2px'
                  }}
                  onClick={() => {
                    DownloadChartData(data);
                  }}
                >
                  Download Chart Data
                </Button>
              </div>
            <ResponsiveContainer width="90%" height={450}>
              
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
                  dataKey="measurement_interval"
                />
                <YAxis
                  allowDataOverflow
                  domain={[bottom, top]}
                  type="number"
                  yAxisId="1"
                />
                <Tooltip />
                <Line
                  yAxisId="1"
                  type="natural"
                  dataKey="avg_measurement_value"
                  stroke="#8884d8"
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
