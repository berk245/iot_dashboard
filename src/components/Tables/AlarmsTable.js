import { makeStyles } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles(()=>({
    sensorTable: {
        width: "95%",
        margin: "2rem auto",
        outline: "1px solid silver",
        borderRadius: "5px",
        padding: "1rem",
        fontSize: "0.9rem",
        lineHeight: "2rem",
      },
}))

function SensorsTable({alarms, sensorNameAndIdPairs,
    typeNameAndIdPairs,
    unitNameAndIdPairs,}) {

    const classes = useStyles()
    return (
        <div>
          <table className={classes.sensorTable}>
          <tr >
            <th style={{borderBottom:'2px solid silver'}}>Sensor</th>
            <th style={{borderBottom:'2px solid silver'}}>Measurement Type</th>
            <th style={{borderBottom:'2px solid silver'}}>Min Threshold</th>
            <th style={{borderBottom:'2px solid silver'}}>Max Threshold</th>
            <th style={{borderBottom:'2px solid silver'}}>Measurement Unit</th>
          </tr>
          {alarms.map((alarm, index) => {
            return (
              <>
                <tr key={index}>
                  <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>
                    {sensorNameAndIdPairs[alarm.sensor_id]} / {alarm.sensor_id}
                  </td>
                  <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{typeNameAndIdPairs[alarm.measurement_type_id]}</td>
                  <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{alarm.min_allowed_threshold}</td>
                  <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{alarm.max_allowed_threshold}</td>
                  <td style={{borderBottom:'1px solid silver', padding: '0.25rem'}}>{unitNameAndIdPairs[alarm.measurement_type_id]}</td>
                </tr>
              </>
            );
          })}
        </table>
        
      </div>
    )
}

export default SensorsTable
