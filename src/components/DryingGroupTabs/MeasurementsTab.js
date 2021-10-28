import React, { useState, useEffect } from "react";
import { CircularProgress,TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MultipleZoomChart from '../Charts/MultipleZoomChart'
import SingleZoomChart from "../Charts/SingleZoomChart";

const useStyles = makeStyles((theme) => ({
  chartsContainer: {
    marginTop: "5rem",
  },
  measurementParametersSection:{
    display: 'flex',
    justifyContent: 'space-around',
    margin: '2rem 0'
  },
  sensorSelector:{
    flexBasis: '25%',
    padding:'1rem',
    borderRadius: '5px',
    margin: '0.5rem 1rem',
    background: 'white'
  },
  textField:{
    width:'45%',
    marginLeft: '1rem'
  },
  sensorTable: {
    width: "95%",
    margin: "2rem auto",
    outline: "1px solid silver",
    borderRadius: "5px",
    padding: "1rem",
    fontSize: "0.9rem",
    lineHeight: "2rem",
  },
}));

function MeasurementsTab({ dryingGroup, sensors, measurementTypes, measurementUnits }) {
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(sensors[0]);
  const [selectedDates, setSelectedDates] = useState({});
  
  const [fetchError, setFetchError] = useState(false)
  //Initialize the default values
  useEffect(() => {
    const getToday = () => {
      const date = new Date();
      let formattedDate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      setToday(formattedDate);
      return formattedDate;
    };

    const setDefaultStartEndDates = () => {
      let result = {
        start_datetime: "",
        end_datetime: getToday(),
      };
      if (dryingGroup.start_date)
        result.start_datetime = dryingGroup.start_datetime;
      else result.start_datetime = "2021-09-28 00:00:00";
      setSelectedDates(result);
    };
    getToday();
    setDefaultStartEndDates();
    

  }, []);

  const getMeasurements = async (agg, start, end) => {
    setFetchError(false)
    if(!start || !end ) return true
    
    let url =
      "https://api.smartdrying.io/measurement/aggregated/get/drying_group/" +
      dryingGroup.id;
    url += `?aggregation_minutes=${agg}`;
    url += `&start_datetime=${start}`;
    url += `&end_datetime=${end}`;

    try {
      let response = await fetch(url);
      response = await response.json();
      console.log(response.length)
      setMeasurements(JSON.parse(response))

      return false;
    } catch (err) {
      console.log("failed: ", url);
      console.log(
        "Error while fetching measurements of drying group id:" + dryingGroup.id
      );
      console.log(err);
      setFetchError(true)
    }
    return false
  };
 
  useEffect(() => {
    const measurementsInitializer = async() => {
      let measurementsAreBeingFetched = await getMeasurements(60, selectedDates.start_datetime, selectedDates.end_datetime) //Returns a boolean
      setLoading(measurementsAreBeingFetched)
    }

    measurementsInitializer()
   
  }, [measurementUnits]);

  const handleSensorChange = (e) => {
    let selectedSensorId = (e.target.value)
    sensors.map((s) => {
      if(parseInt(s.id) === parseInt(selectedSensorId)){
        setSelectedSensor(s)
      }
    })
  }
  const handleDateChange = (e) => {
    const {name, value} = e.target
    let obj = {...selectedDates}
    obj[name] = value;
    setSelectedDates(obj)
  }
  
  const requestNewCharts = async() =>{
    setLoading(true)
    try{
      setLoading(await getMeasurements(60, selectedDates.start_datetime, selectedDates.end_datetime))
    }catch(err){
      console.log(err)
      setFetchError(true)
    }
  }

  useEffect(() => {
    console.log(selectedSensor.id, 'new sensor selected')
  }, [selectedSensor]);

  const classes = useStyles();
  return (
    <div>
      {loading && (
        <div style={{ margin: "auto", marginTop: "5rem" }}>
          <p>Fetching data...</p>
          <CircularProgress disableShrink></CircularProgress>
        </div>
      )}

      {!loading && (
        <>
        {sensors.length && 
        <div>
          <table className={classes.sensorTable}>
            <tr >
              <th style={{borderBottom:'2px solid silver'}}>Sensor name</th>
              <th style={{borderBottom:'2px solid silver'}}> Sensor ID</th>
              <th style={{borderBottom:'2px solid silver'}}> DeveUI</th>
              <th style={{borderBottom:'2px solid silver'}}>Sensor Type</th>
              <th style={{borderBottom:'2px solid silver'}}>Description</th>
            </tr>
            {sensors.map((sensor, index) => {
              console.log(sensor)
              return (
                <>
                  <tr key={index}>
                    <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>
                     {sensor.internal_name}
                    </td>
                    <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{sensor.id}</td>
                    <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{sensor.deveui}</td>
                    <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{sensor.type}</td>
                    <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{sensor.description}</td>
                  </tr>
                </>
              );
            })}
          </table>
        
      </div>
        }
        <div className={classes.measurementParametersSection}>
          <div className={classes.sensorSelectSection}>
        <span>Sensor:</span>
        <select className={classes.sensorSelector}  placeholder='Choose a sensor' onChange={handleSensorChange}>
          {sensors.map((sensor, index) => {
            return(
            <option value={sensor.id} id={sensor.internal_name} key={index}>{sensor.internal_name} / {sensor.id}</option>
            )
          })}
        </select>
        </div>
        <div className={classes.dateSelectSection}>
        <TextField
        label="Start Date"
        name="start_datetime"
        variant="outlined"
        defaultValue={selectedDates.start_datetime}
        onChange={(e) => handleDateChange(e)}
        className={classes.textField}
        helperText='Format: YYYY-MM-DD HH:MM:SS'
        />
        <TextField
        label="End Date"
        name="end_datetime"
        variant="outlined"
        defaultValue={selectedDates.end_datetime}
        onChange={(e) => handleDateChange(e)}
        className={classes.textField}
        />
        </div>
        <div className={classes.submitSection}>
          <Button
            variant='outlined'
            onClick={requestNewCharts}
            style={{padding: '0.95rem'}}
          >Submit</Button>
        </div>
        </div>
        {!fetchError&&
        <div className={classes.chartsContainer}>
          {/* <h4>{measurements[0].sensor_name} Measurements</h4> */}
          <MultipleZoomChart/>
          <br />
          <br />
          <br />
          <SingleZoomChart/>
          {/* <MultipleLineChartTemplate data1={filteredMeasurements[1]} data2={filteredMeasurements[2]} title={'Relative Humidity'} unit={measurementUnits[1]}></MultipleLineChartTemplate> */}
          {/* <MultipleLineChartTemplate data1={filteredMeasurements[3]} data2={filteredMeasurements[4]} title={'Absolute Humidity'} unit={measurementUnits[3]}></MultipleLineChartTemplate> */}
          {/* <MultipleLineChartTemplate data1={filteredMeasurements[5]} data2={filteredMeasurements[6]} title={'Temperature'} unit={measurementUnits[5]}></MultipleLineChartTemplate> */}
          {/* <SingleLineChartTemplate data={filteredMeasurements[7]} title={'Pressure'} unit={measurementUnits[7]}></SingleLineChartTemplate> */}{" "}
          
          {/* <SingleLineChartTemplate data={filteredMeasurements[1]} title={'Relative Humidity External'} unit={measurementUnits[1]}></SingleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[3]} title={'Absolute Humidty External'} unit={measurementUnits[3]}></SingleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[4]} title={'Absolute Humidty Pipe'} unit={measurementUnits[4]}></SingleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[5]} title={'Temperature External'} unit={measurementUnits[5]}></SingleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[6]} title={'Temperature Pipe'} unit={measurementUnits[6]}></SingleLineChartTemplate> */}
        </div>
        }
        {fetchError && 
          <h5>An error occured while fetching data. Please make sure that the search parameters (eg, dates) are in correct format and try again.</h5>
        }
        </>
      )}
    </div>
  );
}

export default MeasurementsTab;
