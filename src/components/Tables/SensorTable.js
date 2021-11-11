import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  sensorTable: {
    width: "95%",
    margin: "auto",
    outline: "1px solid silver",
    borderRadius: "5px",
    padding: "1rem",
    fontSize: "0.9rem",
    lineHeight: "2rem",
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

function SensorsTable({ sensors }) {
  const classes = useStyles();
  return (
    <div>
      <table className={classes.sensorTable}>
        <thead>
          <tr>
            <th className={classes.tableHeader}>Sensor name</th>
            <th className={classes.tableHeader}> Sensor ID</th>
            <th className={classes.tableHeader}> DeveUI</th>
            <th className={classes.tableHeader}>Sensor Type</th>
            <th className={classes.tableHeader}>Description</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor, index) => {
            return (
              <>
                <tr key={index}>
                  <td
                    style={{
                      borderBottom: "1px solid silver",
                      padding: "0.25rem",
                    }}
                  >
                    {sensor.internal_name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid silver",
                      padding: "0.25rem",
                    }}
                  >
                    {sensor.id}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid silver",
                      padding: "0.25rem",
                    }}
                  >
                    {sensor.deveui}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid silver",
                      padding: "0.25rem",
                    }}
                  >
                    {sensor.type}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid silver",
                      padding: "0.25rem",
                    }}
                  >
                    {sensor.description}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SensorsTable;
