import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  sensorTable: {
    width: "90%",
    margin: "0rem auto",
    outline: "1px solid silver",
    borderRadius: "5px",
    padding: "1rem",
    fontSize: "0.9rem",
    lineHeight: "2rem",
    "@media (max-width: 1150px)": {
      width: "100%",
    },
  },
  tableHeader:{ 
    borderBottom: "2px solid silver", 
    textAlign:'left',
    width: 'auto',
    "@media (max-width: 1150px)": {
      fontSize: "0.9rem",
    },
  }

}));

function SensorsTable({
  alarms,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
}) {
  const classes = useStyles();
  return (
    <div>
      {alarms.length ?
      <table className={classes.sensorTable}>
        <tr>
          <th className={classes.tableHeader}>Sensor</th>
          <th className={classes.tableHeader}>Measurement Type</th>
          <th className={classes.tableHeader}>Min Threshold</th>
          <th className={classes.tableHeader}>Max Threshold</th>
          <th className={classes.tableHeader}>Measurement Unit</th>
        </tr>
        {alarms.map((alarm, index) => {
          return (
            <>
              <tr key={index}>
                <td
                  style={{
                    borderBottom: "1px solid silver",
                    padding: "0.25rem",
                  }}
                >
                  {sensorNameAndIdPairs[alarm.sensor_id]} / {alarm.sensor_id}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid silver",
                    padding: "0.25rem",
                  }}
                >
                  {typeNameAndIdPairs[alarm.measurement_type_id]}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid silver",
                    padding: "0.25rem",
                  }}
                >
                  {alarm.min_allowed_threshold}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid silver",
                    padding: "0.25rem",
                  }}
                >
                  {alarm.max_allowed_threshold}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid silver",
                    padding: "0.25rem",
                  }}
                >
                  {unitNameAndIdPairs[alarm.measurement_type_id]}
                </td>
              </tr>
            </>
          );
        })}
      </table> : 
      <p style={{textAlign:'center', padding:'2rem', fontSize:'1.1rem'}}>This project does not have any alarms</p>
      }
    </div>
  );
}

export default SensorsTable;
