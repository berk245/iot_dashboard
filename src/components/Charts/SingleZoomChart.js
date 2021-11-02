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

export default class SingleZoomChart extends React.Component {
  
  constructor(props){
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
    }
  }
  

  zoom (){
    let { refAreaLeft, refAreaRight, data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState({
        refAreaLeft: "",
        refAreaRight: "",
      });

      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight){
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



  render(){
    const {data,left,right,refAreaLeft, refAreaRight,top,bottom} = this.state
  
    return (
      <>
          {data&&
          <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
            <h3>{this.props.title.toUpperCase() }</h3>
            <ResponsiveContainer width="90%" height={400}>
              <LineChart
                data={data}
                onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
                onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseUp={this.zoom.bind(this)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis allowDataOverflow domain={[left, right]} dataKey='measurement_interval' />
                <YAxis allowDataOverflow domain={[bottom, top]}  type="number" yAxisId="1" />
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
            <button
              onClick={() => {
                DownloadChartData(data);
              }}
            >
              Download
            </button>
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
        }
        </>
      
    );

  }
  
}
