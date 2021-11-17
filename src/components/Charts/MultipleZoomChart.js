import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  Legend,
} from "recharts";
import { ResponsiveContainer } from "recharts/lib/component/ResponsiveContainer";
import DownloadChartData from "./helpers/DownloadChartData";
import { Button } from "@material-ui/core";
import { timeConverter } from "./helpers/TimeConverter";
import { TextField } from "@material-ui/core";
import ChartStyles from "./ChartStyles.css";

class CustomizedAxisTick extends React.Component {
  render() {
    const { x, y, stroke, payload } = this.props;
    let converted = timeConverter(payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fill="#666">
          <tspan textAnchor="middle" x="0">
            {converted.date}
          </tspan>
          <tspan textAnchor="middle" x="0" dy="20">
            {converted.time}
          </tspan>
        </text>
      </g>
    );
  }
}

class CustomEventLabel extends React.Component {
  render() {
    const { viewBox, event, eventTypes } = this.props;
    console.log(event, eventTypes)
    const x = viewBox.width + viewBox.x + 20;
    const y = viewBox.y + 2;
    return (
      <text
        x={x}
        y={y}
        dy={10}
        dx={-10}
        fill='#666'
        style={{fontSize: '0.85rem'}}
      >
        {eventTypes[event.event_type_id -1].description}
      </text>
    );
  }
}

export default class MultipleZoomChart extends React.Component {
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
      addEventForm: false,
      events: props.chartEvents,
      eventTypes: props.eventTypes,
      newEventTimeStamp: false,
      newEventType: "",
    };
  }

  makePostRequest = async (date, time, type) => {
    let formattedDate = date.split("/").reverse().join("-") + " " + time;

    let { project_id, id, location_id } = this.props.dryingGroup;

    let data = {
      project_id: project_id,
      drying_group_id: id,
      location_id: location_id,
      event_type_id: type,
      timestamp: formattedDate,
    };
    console.log(data);

    let response = await fetch("https://api.smartdrying.io/event/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      this.props.getChartEvents(id);
    } else {
      response = await response.json();
      let error = JSON.parse(response.body);
      console.log(error.partialFailureErrors.reason);
      alert(error.partialFailureErrors.trigger);
      return;
    }
  };

  AddEventForm = (types, timestamp) => {
    console.log(timestamp);
    let date = "";
    let time = "";
    let eventType = "";
    let timestampDisplay = "Click on the chart to select a date";
    if (timestamp) {
      date = timeConverter(timestamp).date;
      time = timeConverter(timestamp).time;
      timestampDisplay = date + " " + time;
    }

    const setEventType = (e) => {
      this.setState({ newEventType: e.target.value });
    };

    return (
      <div className="addEventContainer" style={{}}>
        <div className="timestamp-section">
          <label htmlFor="#event-timestamp">Timestamp:</label>
          <input
            id="event-timestamp"
            value={timestampDisplay}
            placeholder="Click on a point in chart to "
            className="timestamp-input"
          />
        </div>
        <div className="event-type-selector">
          <span>Event Type</span>
          <select
            id="event-type-selector"
            onChange={setEventType}
            className="select-dropdown"
          >
            <option disabled selected>
              Choose an event type
            </option>
            {types.map((type, idx) => {
              return (
                <option value={type.id} key={idx}>
                  {type.description}
                </option>
              );
            })}
          </select>
        </div>
        <div className="add-event-buttons">
          <Button
            variant="outlined"
            onClick={() => {
              this.makePostRequest(date, time, this.state.newEventType);
            }}
            className="add-event-button"
            style={{ marginRight: "1rem" }}
          >
            Add Event
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              this.setState({ addEventForm: false });
            }}
            className="add-event-button"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

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
      bottom: "dataMin-1",
    }));
  }

  handleMouseDown(e) {
    let { addEventForm } = this.state;
    if (addEventForm) return;

    try {
      this.setState({ refAreaLeft: e.activeLabel });
    } catch {
      console.log("Click out of bounds");
    }
  }

  handleMouseMove(e) {
    let { addEventForm } = this.state;
    if (addEventForm) return;
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
    let splitted = this.state.labels[value].split("_");
    return splitted[splitted.length - 1];
  };

  renderTooltip = (e) => {
    if (!e.payload) return <div></div>;
    try {
      let color1 = e.payload[0].color;
      let color2 = e.payload[1].color;
      let { data1, data2, timestamp_unix } = e.payload[0].payload;
      let formatted = timeConverter(timestamp_unix);
      return (
        <div
          style={{
            border: "1px solid  silver",
            borderRadius: "5px",
            background: "white",
            padding: "0.5rem 1rem",
          }}
        >
          <p>
            {formatted.date} {formatted.time}
          </p>
          <p style={{ color: color1 }}>
            {this.props.data.labels.data1} : {data1.toFixed(2)}
          </p>
          <p style={{ color: color2 }}>
            {this.props.data.labels.data2} : {data2.toFixed(2)}
          </p>
        </div>
      );
    } catch (err) {
      return <div></div>;
    }
  };

  setNewEventTimeStamp = (e) => {
    let { addEventForm } = this.state;
    if (!addEventForm) return;

    try {
      this.setState({ newEventTimeStamp: e.activeLabel });
    } catch {
      return;
    }
  };

  render() {
    const {
      data,
      left,
      right,
      refAreaLeft,
      refAreaRight,
      events,
      eventTypes,
      addEventForm,
      newEventTimeStamp,
    } = this.state;

    console.log(eventTypes);
    return (
      <>
        {data && (
          <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
            <div style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginLeft: "2rem",
                }}
              >
                {this.props.data.kpi.toUpperCase()}
              </p>
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  marginLeft: "2rem",
                  marginBottom: "1rem",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  className="download-csv-button"
                  onClick={() => {
                    DownloadChartData(data);
                  }}
                >
                  Download as CSV
                </Button>
                {addEventForm ? (
                  <div style={{ width: "95%" }}>
                    {this.AddEventForm(eventTypes, newEventTimeStamp)}
                  </div>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    className="event-form-opener"
                    onClick={() => this.setState({ addEventForm: true })}
                  >
                    Add an Event
                  </Button>
                )}
              </div>
            </div>
            {left !== "dataMin" && (
              <div style={{ width: "20%", margin: "auto" }}>
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
            <ResponsiveContainer width="95%" height={400}>
              <LineChart
                data={data}
                onMouseDown={(e) => this.handleMouseDown(e)}
                onMouseMove={(e) => this.handleMouseMove(e)}
                onClick={(e) => this.setNewEventTimeStamp(e)}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseUp={this.zoom.bind(this)}
                margin={{ top: 0, right: 0, bottom: 5, left: -60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  height={100}
                  tickMargin={20}
                  padding={{ left: 50, right: 50 }}
                  allowDataOverflow
                  domain={[left, right]}
                  dataKey="timestamp_unix"
                  type="number"
                  tick={<CustomizedAxisTick />}
                />
                <YAxis
                  allowDataOverflow
                  tickCount={5}
                  domain={[
                    (dataMin) => Math.floor(dataMin / 10) * 10,
                    (dataMax) => Math.ceil(dataMax / 10) * 10,
                  ]}
                  padding={{ top: 10, bottom: 10 }}
                  type="number"
                  yAxisId="1"
                  width={120}
                />
                <Tooltip content={this.renderTooltip} />
                <Line
                  dot={false}
                  strokeWidth={2}
                  yAxisId="1"
                  type="natural"
                  dataKey="data1"
                  stroke="#002884"
                  animationDuration={300}
                />
                <Line
                  yAxisId="1"
                  dot={false}
                  strokeWidth={2}
                  type="natural"
                  dataKey="data2"
                  label={false}
                  stroke="#AB003C"
                  animationDuration={300}
                />
                <Legend formatter={this.legendFormatter} />
                {/* Events  */}
                {events.map((e, idx) => {
                  return (
                    <ReferenceLine
                      key={idx}
                      x={e.timestamp / 1000}
                      xAxisId="0"
                      yAxisId="1"
                      label={<CustomEventLabel event={e} eventTypes={eventTypes} />}
                      strokeWidth={3}
                      stroke="gray"
                      strokeDasharray="5 5"
                    />
                  );
                })}
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
