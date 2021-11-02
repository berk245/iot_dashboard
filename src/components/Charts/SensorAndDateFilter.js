import { Button, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles(() => ({
  measurementParametersSection: {
    display: "flex",
    width:'95%',
    margin:'auto',
    justifyContent: "space-around",
  },
  sensorSelector: {
    flexBasis: "25%",
    padding: "1rem",
    height: '3.5rem',
    fontSize: '1rem',
    borderRadius: "5px",
    background: "white",
    borderColor:'silver'
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
    console.log(obj)
    if(name == 'start_datetime') obj[name] = value + ' 00:00:00';
    else if(name =='end_datetime') obj[name] = value + ' 23:59:59';
    console.log(obj)
    setSelectedDates(obj);
  };
  const classes = useStyles();

  const formatDateValues = (datetime) => {
    let result = '' //a date string in yyyy-mm-dd format
    try{
        let dateArray = datetime.split(' ')[0].split('-')
        dateArray.map((section, index) =>{
            if(index != 0){
                if(section.length === 1) dateArray[index] = '0'+section
            }
        })
        result = dateArray.join('-')
        return result
    }catch{
        console.log("Could not format date: ", datetime)
    }
}

  return (
    <div className={classes.measurementParametersSection}>
        
        <p style={{flexBasis:'17.5%'}}>
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
          type='date'
          value={formatDateValues(selectedDates.start_datetime)}
          onChange={(e) => handleDateChange(e)}
          className={classes.textField}
        />
        <TextField
          label="End Date"
          name="end_datetime"
          variant="outlined"
          type='date'
          value={formatDateValues(selectedDates.end_datetime)}
          onChange={(e) => handleDateChange(e)}
          className={classes.textField}
        />
      <div className={classes.submitSection}>
        <Button
          variant="outlined"
          onClick={()=> {requestNewCharts(60, selectedSensor.id, selectedDates.start_datetime, selectedDates.end_datetime)}}
        style={{ padding: "0.95rem", background: '#002884c7', color: 'white' }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default SensorAndDateFilter;
