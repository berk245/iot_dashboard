import { Button, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles(() => ({
  measurementParametersSection: {
    display: "flex",
    flexWrap: "wrap",
    width: "95%",
    margin: "auto",
    margin: "1.5rem auto",
    justifyContent: "space-around",
    
  },
  infoText: {
    "@media (max-width: 1500px) and (min-width: 1025px)": {
      width: "25%",
      fontSize: "0.9rem",
    },
    "@media (max-width: 1024px)": {
      width: "100%",
      fontSize: "0.9rem",
    },
  },
  sensorSelector: {
    padding: "1rem",
    width: '22.5%',
    height: "3.5rem",
    fontSize: "1rem",
    borderRadius: "5px",
    background: "white",
    borderColor: "silver",
    "@media (max-width: 1024px)": {
      width: "25%",
      padding: '0.25rem',
      margin: 'auto 0',
      fontSize: '0.9rem'
    },
  },
  textField: {
    width: '20%',
    "@media (max-width: 1024px)": {
      width: "25%",
    },
  },
  submitButton: {
    width: '100%',
    padding: "0.95rem",
    background: "#002884c7",
    color: "white",
    "@media (max-width: 1024px)": {
      width:'100%',
    },
  },
}));

function SensorAndDateFilter({
  sensors,
  selectedDates,
  setSelectedDates,
  selectedSensor,
  setSelectedSensor,
  requestNewCharts,
}) {
  const handleSensorChange = (e) => {
    let selectedSensorId = e.target.value;
    sensors.map((s) => {
      if (parseInt(s.id) === parseInt(selectedSensorId)) {
        setSelectedSensor(s);
      }
    });
  };
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let obj = { ...selectedDates };
    if (name == "start_datetime") obj[name] = value + " 00:00:00";
    else if (name == "end_datetime") obj[name] = value + " 23:59:59";
    setSelectedDates(obj);
  };
  const classes = useStyles();

  const formatDateValues = (datetime) => {
    let result = ""; //a date string in yyyy-mm-dd format
    try {
      let dateArray = datetime.split(" ")[0].split("-");
      dateArray.map((section, index) => {
        if (index != 0) {
          if (section.length === 1) dateArray[index] = "0" + section;
        }
      });
      result = dateArray.join("-");
      return result;
    } catch {
      console.log("Could not format date: ", datetime);
    }
  };

  return (
    <div className={classes.measurementParametersSection}>
      <p className={classes.infoText}>
        Request charts with different sensors or dates:
      </p>

      <select
        className={classes.sensorSelector}
        placeholder="Choose a sensor"
        onChange={handleSensorChange}
      >
        {sensors.map((sensor, index) => {
          return (
            <option value={sensor.id} id={sensor.internal_name} key={index}>
              {sensor.internal_name} / {sensor.id}
            </option>
          );
        })}
      </select>
      <TextField
        label="Start Date"
        name="start_datetime"
        variant="outlined"
        type="date"
        value={formatDateValues(selectedDates.start_datetime)}
        onChange={(e) => handleDateChange(e)}
        className={classes.textField}
      />
      <TextField
        label="End Date"
        name="end_datetime"
        variant="outlined"
        type="date"
        value={formatDateValues(selectedDates.end_datetime)}
        onChange={(e) => handleDateChange(e)}
        className={classes.textField}
      />
      <div className={classes.submitSection}>
        <Button
          variant="outlined"
          onClick={() => {
            requestNewCharts(
              60,
              selectedSensor.id,
              selectedDates.start_datetime,
              selectedDates.end_datetime
            );
          }}
          className={classes.submitButton}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default SensorAndDateFilter;
