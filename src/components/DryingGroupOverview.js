import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles'
import { Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme)=>({
    mainContainer:{
        margin: 'auto',
        marginTop:'4.5rem',
        width: '90%',
        textAlign: 'left',
        padding: '1rem 2rem',
        border: '1px solid silver',
        height: '85%'
    },
    overviewHeader:{
    },
    mainTitle:{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#002884'
    },
    coloredText:{
        color: '#3F50B5'
    },
    headerInfoLine:{
        marginTop: '1.2rem',
        display:'flex',
        justifyContent: 'space-between'
    },
    startStopButton:{
        borderColor: '#AB003C',
        color: '#AB003C',
        '&:hover':{
            background: '#AB003C',
            color: 'white'
        }
    }

}))


export default function DryingGroupOverview({ baseURL, dryingGroup }) {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const classes = useStyles()


  //Get Sensors
  const getSensors = async () => {
    const url = baseURL + "/sensor/get/drying_group/" + dryingGroup.id;
    try {
      let response = await fetch(url);
      response = await response.json();
      setSensors(JSON.parse(response));
    } catch (err) {
      console.log(
        "Error while fetching sensor data of drying group id:" + dryingGroup.id
      );
      console.log(err);
    }
  };

  const getMeasurements = async () => {
    setMeasurements([]);
    let a = [];
    let datePairs = [
      // Start Time           //End Time
      ["2021-09-28 00:00:00", "2021-09-28 23:59:59"],
      ["2021-09-29 00:00:00", "2021-09-29 23:59:59"],
      ["2021-09-30 00:00:00", "2021-09-30 23:59:00"],
      ["2021-10-01 00:00:00", "2021-10-01 23:59:59"],
      ["2021-10-02 00:00:00", "2021-10-02 23:59:59"],
      ["2021-10-03 00:00:00", "2021-10-03 23:59:59"],
      ["2021-10-04 00:00:00", "2021-10-04 23:59:59"],
      ["2021-10-05 00:00:00", "2021-10-05 23:59:59"],
      ["2021-10-06 00:00:00", "2021-10-06 23:59:59"],
      ["2021-10-07 00:00:00", "2021-10-07 23:59:59"],
      ["2021-10-08 00:00:00", "2021-10-08 23:59:59"],
      ["2021-10-09 00:00:00", "2021-10-09 23:59:59"],
      ["2021-10-10 00:00:00", "2021-10-10 23:59:59"],
      ["2021-10-11 00:00:00", "2021-10-11 23:59:59"],
      ["2021-10-12 00:00:00", "2021-10-12 23:59:59"],
      ["2021-10-13 00:00:00", "2021-10-13 23:59:59"],
      ["2021-10-14 00:00:00", "2021-10-14 23:59:59"],
      ["2021-10-15 00:00:00", "2021-10-15 23:59:59"],
      ["2021-10-16 00:00:00", "2021-10-16 23:59:59"],
      ["2021-10-17 00:00:00", "2021-10-17 23:59:59"],
      ["2021-10-18 00:00:00", "2021-10-18 23:59:59"],
      ["2021-10-19 00:00:00", "2021-10-19 23:59:59"],
    ];
    datePairs.map(async (pair, index) => {
      let measurement = await makeMeasurementRequest(pair[0], pair[1]);
      a.push(...measurement);
    });

    setTimeout(() => {
      setMeasurements(a);
      setLoading(false);
    }, 5000);
  };

  const makeMeasurementRequest = async (start_datetime, end_datetime) => {
    let url = baseURL + "/measurement/get/drying_group/" + dryingGroup.id;
    url += `?&start_datetime="${start_datetime}"`;
    url += `&end_datetime="${end_datetime}"`;

    try {
      let response = await fetch(url);
      response = await response.json();
      return JSON.parse(response);
    } catch (err) {
      console.log("failed: ", url);
      console.log(
        "Error while fetching measurements of drying group id:" + dryingGroup.id
      );
      console.log(err);
    }
  };

  const groupMeasurementsByMeasurementType = () => {
    console.log("Gotta group em");
  };

  useEffect(() => {
    setLoading(false);
    // setMeasurements([]);
    // getSensors();
    // getMeasurements();
  }, [dryingGroup]);

  useEffect(() => {
    if (measurements.length) groupMeasurementsByMeasurementType();
  }, [measurements]);

  //Display Data
  //Get Measurements

  return (
    <>
      {loading &&
       <div style={{marginTop: '10rem'}}>
        <p>Fetching data...</p>
        <CircularProgress disableShrink></CircularProgress>

       </div>
       }
      {!loading && (
        <div className={classes.mainContainer}>
          <div className={classes.overviewHeader}>
              <span className={classes.mainTitle}>Drying Group Name</span>
              <div className={classes.headerInfoLine}>
                  <span style={{margin:'auto 0'}}>Expected Completion: <span className={classes.coloredText}>11/11/2011 - 11/11/2021</span> </span>
                  <span style={{margin:'auto 0'}}>Status <span className={classes.coloredText}>Active</span></span>
                  <Button variant='outlined' className={classes.startStopButton}>
                      Start/Stop
                    </Button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
