import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles(() => ({
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

function AlarmsTab({
  dryingGroup,
  startStopCriteria,
  sensors,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  operatorNameAndIdPairs,
}) {
  const [alarms, setAlarms] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const getAlarms = async () => {
      let url = `https://api.smartdrying.io/alarm/get/drying_group/${dryingGroup.id}`;
      let res = await fetch(url);
      res = await res.json();
      setAlarms(JSON.parse(res));
    };

    getAlarms();
  }, []);

  return (
    <div>
      {alarms && (
        <table className={classes.sensorTable}>
          <tr >
            <th style={{borderBottom:'1px solid silver'}}>Sensor</th>
            <th style={{borderBottom:'1px solid silver'}}>Measurement Type</th>
            <th style={{borderBottom:'1px solid silver'}}>Min Threshold</th>
            <th style={{borderBottom:'1px solid silver'}}>Max Threshold</th>
            <th style={{borderBottom:'1px solid silver'}}>Measurement Unit</th>
          </tr>
          {alarms.map((alarm, index) => {
            return (
              <>
                <tr key={index}>
                  <td>
                    {sensorNameAndIdPairs[alarm.sensor_id]} / {alarm.sensor_id}
                  </td>
                  <td>{typeNameAndIdPairs[alarm.measurement_type_id]}</td>
                  <td>{alarm.min_allowed_threshold}</td>
                  <td>{alarm.max_allowed_threshold}</td>
                  <td>{unitNameAndIdPairs[alarm.measurement_type_id]}</td>
                </tr>
              </>
            );
          })}
        </table>
      )}
    </div>
  );
}

export default AlarmsTab;
