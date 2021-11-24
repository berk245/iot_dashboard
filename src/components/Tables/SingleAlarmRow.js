import React from "react";
import { makeStyles,Button } from "@material-ui/core";
import { requestDataFromAPI } from "../../utils";

const useStyles = makeStyles(() => ({
  rowContainer: {
    width: "95%",
    margin: "0.75rem auto",
    display: "flex",
    justifyContent: "space-between",
    textAlign:'left',
    borderBottom: '1px solid silver'
  },
  rowCell: {
      width: '19%',
      textAlign:'left'
  },
}));

function SingleAlarmRow({
  getAlarms,
  alarm,
  index,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
}) {


  const removeAlarm = async(id) =>{
    let confirmed = window.confirm('Are you sure you want to remove this alarm?')
    if(!confirmed) return
    try{
        let response = await fetch(`https://api.smartdrying.io/alarm/remove/${id}`)
        if(response.ok){
            getAlarms()
        }
    }catch(err){
        console.log(err)
    }

  }  

  const classes = useStyles();
  return (
    <div className={classes.rowContainer}>
      <div className={classes.rowCell}>
        {sensorNameAndIdPairs[alarm.sensor_id]}
      </div>
      <div className={classes.rowCell}>
        {typeNameAndIdPairs[alarm.measurement_type_id]}
      </div>
      <div className={classes.rowCell}>{alarm.min_allowed_threshold}</div>
      <div className={classes.rowCell}>{alarm.max_allowed_threshold}</div>
      <div className={classes.rowCell}>
        {unitNameAndIdPairs[alarm.measurement_type_id]}
      </div>
      <div style={{width: '5%'}}>
          <Button
           variant='outlined'
           size='small'
           onClick={()=> removeAlarm(alarm.id)}
          > Remove </Button>
      </div>
    </div>
  );
}

export default SingleAlarmRow;
