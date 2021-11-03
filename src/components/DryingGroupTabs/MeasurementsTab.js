import React, { useState, useEffect } from "react";
import { CircularProgress, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MultipleZoomChart from "../Charts/MultipleZoomChart";
import SingleZoomChart from "../Charts/SingleZoomChart";
import TemplateChart from "../Charts/TemplateChart";
import SensorsTable from "../Tables/SensorTable";
import SensorAndDateFilter from "../Charts/SensorAndDateFilter";
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
  const [groupedMeasurements, setGroupedMeasurements] = useState({});
  const [measurementsGrouped, setMeasurementsGrouped] = useState(false);
  const [seeExample, setSeeExample] = useState(false);
  const [dryingGroupHasNoSensors, setDryingGroupHasNoSensors] = useState(false);

  const [fetchError, setFetchError] = useState(false);
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

  const getMeasurements = async (agg, sensor_id, start, end) => {
    setFetchError(false);
    if (!start || !end) return true;

    let url =
      "https://api.smartdrying.io/measurement/aggregated/charts/get/drying_group/" +
      dryingGroup.id;
    url += `?aggregation_minutes=${agg}`;
    url += `&sensor_id=${sensor_id}`;
    url += `&start_datetime=${start}`;
    url += `&end_datetime=${end}`;
    try {
      let response = await fetch(url);
      console.log(response, typeof response);
      response = await response.json();
      console.log(response, typeof response);
      setMeasurements(JSON.parse(response));
    } catch (err) {
      console.log("failed: ", url);
      console.log(err);
      setFetchError(true);
    }
    return false;
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
        <div>
          {loading && (
            <div style={{ margin: "auto", marginTop: "5rem" }}>
              <p>Fetching data...</p>
              <CircularProgress disableShrink></CircularProgress>
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
                  {/* <h4>{measurements[0].sensor_name} Measurements</h4> */}
                  {/* <MultipleZoomChart/> */}
                  {!seeExample ? (
                    <Button
                      variant="outlined"
                      style={{ margin: "1rem" }}
                      onClick={() => setSeeExample(!seeExample)}
                    >
                      See zoom chart example
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        style={{ margin: "1rem" }}
                        onClick={() => setSeeExample(!seeExample)}
                      >
                        Close zoom chart example
                      </Button>
                      <TemplateChart></TemplateChart>
                    </>
                  )}
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
                      <CircularProgress />
                    </div>
                  )}{" "}
                </div>
              )}
              {fetchError && (
                <h5>
                  An error occured while fetching data. Please make sure that
                  the search parameters (eg, dates) are in correct format and
                  try again.
                </h5>
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
