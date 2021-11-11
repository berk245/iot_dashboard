import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import CircularLoadingIcon from '../../CircularLoadingIcon'
import MultipleZoomChart from "../../Charts/MultipleZoomChart";
import SingleZoomChart from "../../Charts/SingleZoomChart";
import SensorsTable from "../../Tables/SensorTable";
import SensorAndDateFilter from "../../Charts/SensorAndDateFilter";
import { requestDataFromAPI } from "../../../utils";

const useStyles = makeStyles((theme) => ({
  chartsContainer: {
    marginTop: "1rem",
  },
  textField: {
    width: "45%",
    marginLeft: "1rem",
  },
}));

function MeasurementsTab({
  dryingGroup,
  sensors,
  measurementTypes,
  measurementUnits,
}) {
  const [selectedDates, setSelectedDates] = useState();
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(sensors[0]);
  const [dryingGroupHasNoSensors, setDryingGroupHasNoSensors] = useState(false);

  const [fetchError, setFetchError] = useState(false);
  //Initialize the default values
  useEffect(() => {
    let isMounted = true
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
    if(isMounted) setDefaultStartEndDates();

    return() => {isMounted = false}
  }, []);

  const getMeasurements = async (agg, sensor_id, start, end) => {
    
    let isMounted = true
    
    if(isMounted) setFetchError(false);
    if (!start || !end) return true;

    let url =
      "https://api.smartdrying.io/measurement/aggregated/charts/get/drying_group/" +
      dryingGroup.id;
    url += `?aggregation_minutes=${agg}`;
    url += `&sensor_id=${sensor_id}`;
    url += `&start_datetime=${start}`;
    url += `&end_datetime=${end}`;
    
    let data = await requestDataFromAPI(url)
    if(isMounted){
      console.log(data)
      if(data) setMeasurements(data)
      else setFetchError(true)
    }


  };

  useEffect(() => {
    const measurementsInitializer = async () => {
      if (!selectedSensor) {
        console.log("No Sensor");
        setDryingGroupHasNoSensors(true);
        return;
      }
      try {
        await getMeasurements(
          60,
          selectedSensor.id,
          selectedDates.start_datetime,
          selectedDates.end_datetime
        ); //Returns a boolean

        setLoading(false);
      } catch (err) {
        console.log("Dates not set");
      }
    };
    measurementsInitializer();
  }, [today]);

  const requestNewCharts = async (agg, id, start, end) => {
    setLoading(true);
    try {
      setLoading(await getMeasurements(agg, id, start, end));
    } catch (err) {
      console.log(err);
      setFetchError(true);
    }
  };


  const classes = useStyles();
  return (
    <>
      {dryingGroupHasNoSensors ? (
        <p>This project does not have any sensors</p>
      ) : 
      
      //Main Page Content
      (
        <div style={{paddingTop:'2rem'}}>
          {loading && (
            <div style={{ margin: "auto", marginTop: "5rem" }}>
              <CircularLoadingIcon text={'Fetching sensors and measurements'}/>
            </div>
          )}

          {!loading && (
            <>
              {sensors.length && <SensorsTable sensors={sensors} />}
              <SensorAndDateFilter
                sensors={sensors}
                selectedSensor={selectedSensor}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                setSelectedSensor={setSelectedSensor}
                requestNewCharts={requestNewCharts}
              />
              {!fetchError && (
                <div className={classes.chartsContainer}>         
                  {measurements.length ? (
                    <>
                      {measurements.map((m, idx) => {
                        if (m.labels.data2) {
                          return <MultipleZoomChart key={idx} data={m} />;
                        } else {
                          return <SingleZoomChart key={idx} data={m} />;
                        }
                      })}
                    </>
                  ) : (
                    <div style={{ textAlign: "center", paddingBottom: "5rem" }}>
                      <CircularLoadingIcon text={'Drawing charts'}/>
                    </div>
                  )}{" "}
                </div>
              )}
              {fetchError && (
                <p style={{textAlign: 'center'}}>
                  An error occured while fetching data. Please make sure that
                  the search parameters (eg, dates) are in correct format and
                  try again.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </>
    //
  );
}

export default MeasurementsTab;
