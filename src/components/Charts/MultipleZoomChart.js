import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceDot,
} from "recharts";

const initialData = [
  { name: 2, cost: 12.39, impression: 14 },
  { name: 3, cost: 12.37, impression: 13 },
  { name: 4, cost: 13.16, impression: 13.1 },
  { name: 5, cost: 12.29, impression: 12.7 },
  { name: 6, cost: 13, impression: 13.9 },
  { name: 7, cost: 12.53, impression: 14 },
  { name: 8, cost: 12.52, impression: 13.5 },
  { name: 9, cost: 12.79, impression: 13.7 },
  { name: 10, cost: 12.94, impression: 12.9 },
  { name: 11, cost: 12.94, impression: 12.9 },
  { name: 12, cost: 14.11, impression: 15 },
  { name: 13, cost: 12.39, impression: 14 },
  { name: 14, cost: 12.37, impression: 13 },
  { name: 15, cost: 12.79, impression: 13.7 },
  { name: 16, cost: 12.94, impression: 12.9 },
  { name: 17, cost: 14.11, impression: 15 },
  { name: 18, cost: 12.39, impression: 14 },
  { name: 19, cost: 12.37, impression: 13 },
  { name: 20, cost: 13.16, impression: 13.1 },
  { name: 21, cost: 12.29, impression: 12.7 },
  { name: 22, cost: 13, impression: 13.9 },
  { name: 23, cost: 12.53, impression: 14 },
  { name: 24, cost: 12.52, impression: 13.5 },
  { name: 25, cost: 13.16, impression: 13.1 },
  { name: 26, cost: 12.29, impression: 12.7 },
  { name: 27, cost: 13, impression: 13.9 },
  { name: 28, cost: 12.53, impression: 14 },
  { name: 29, cost: 12.52, impression: 13.5 },
  { name: 30, cost: 12.79, impression: 13.7 },
  { name: 31, cost: 12.94, impression: 12.9 },
];

const initialState = {
  data: initialData,
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
  animation: true,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      this.setState(() => ({
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    this.setState(() => ({
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      top: "dataMax + 1",
      bottom: "dataMin - 1",
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
    }));
  }

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom } =
      this.state;

    console.log(this.state);

    return (
      <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
        <LineChart
          width={800}
          height={400}
          data={data}
          onMouseDown={(e) =>
            this.setState({
              refAreaLeft: e.activeLabel,
              refAreaRight: e.activeLabel,
            })
          }
          onMouseMove={(e) =>
            this.state.refAreaLeft &&
            this.setState({ refAreaRight: e.activeLabel })
          }
          onMouseUp={this.zoom.bind(this)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow
            dataKey="name"
            domain={[left, right]}
            type="number"
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
            dataKey="cost"
            stroke="#8884d8"
            animationDuration={300}
          />
          <Line
            yAxisId="1"
            type="natural"
            dataKey="impression"
            stroke="#82ca9d"
            animationDuration={300}
          />
          <ReferenceDot></ReferenceDot>
          {refAreaLeft ? (
            <ReferenceArea
              yAxisId="1"
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.2}
            />
          ) : null}
        </LineChart>
        {left !== "dataMin" && (
          <button
            type="button"
            className="btn update"
            onClick={this.zoomOut.bind(this)}
          >
            Zoom Out
          </button>
        )}
      </div>
    );
  }
}
