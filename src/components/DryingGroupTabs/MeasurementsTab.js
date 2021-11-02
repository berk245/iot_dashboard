import React, { useState, useEffect } from "react";
import { CircularProgress,TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MultipleZoomChart from '../Charts/MultipleZoomChart'
import SingleZoomChart from "../Charts/SingleZoomChart";
import SensorsTable from "../Tables/SensorTable";


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
  
}));

function MeasurementsTab({ dryingGroup, sensors, measurementTypes, measurementUnits }) {
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(sensors[0]);
  const [selectedDates, setSelectedDates] = useState({});
  const [filteredMeasurements, setFilteredMeasurements] = useState({})
  const [measurementsFiltered, setMeasurementsFiltered] = useState(false)

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
      setMeasurements(JSON.parse(response))
    } catch (err) {
      console.log("failed: ", url);
      console.log(err);
      setFetchError(true)
    }
    return false
  };
 


  useEffect(() => {
    const measurementsInitializer = async() => {
      await getMeasurements(60, selectedDates.start_datetime, selectedDates.end_datetime) //Returns a boolean
      setLoading(false)
    }
    measurementsInitializer()
   
  }, [today]);

  useEffect(() => {
    let result = {}
    for(let type of measurementTypes){
      let filter = measurements.filter((m) => m.measurement_id === type.id)
      result[type.name] = filter
    }
    setFilteredMeasurements(result)

    if(measurements.length) setMeasurementsFiltered(true)
  }, [measurements]);




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
          <SensorsTable sensors={sensors} />
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
          {/* <MultipleZoomChart/> */}
          <br />
          <br />
          <br />
          {measurementsFiltered? 
              <>
              {Object.keys(filteredMeasurements).map((key,index) => {
                if(filteredMeasurements[key].length){
                  return(
                    <SingleZoomChart key={index} title={key} data={filteredMeasurements[key]}/>
                    )
                }
              })}
              </>
          :
          <div style={{textAlign: 'center', paddingBottom:'5rem'}}>
          <CircularProgress />
          </div>
          }


          {/* {filteredMeasurements ? 
          {Object.keys(filteredMeasurements).map((key, index) => {
              return(
                
                )
            })} :
              
                
          }
            
          })} */}
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
