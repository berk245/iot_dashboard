import React, { useState } from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  rowContainer: {
    width: "95%",
    margin: "0.75rem auto",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "left",
    borderBottom: "1px solid silver",
  },
  rowCell: {
    width: "15%",
    textAlign: "left",
  },
}));

function AddAlarmForm({
    dryingGroup,
    getAlarms,
  setNewAlarmForm,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
}) {
  
  const [newAlarm, setNewAlarm] = useState({
    project_id: dryingGroup.project_id || null,
    location_id: dryingGroup.location_id || 1,
    drying_group_id: dryingGroup.id || null,
    sensor_id: null,
    measurement_type_id: null,
    min_allowed_threshold: null,
    max_allowed_threshold: null,
  });

  const handleInputChange = (e, type) => {
    let obj = {...newAlarm};
    obj[type] = Number(e.target.value);
    setNewAlarm(obj)
  };

  const validateBeforeSubmit = (obj) =>{
      Object.entries(obj).map(([key, val]) => {
          if(!val){
              alert('Please fill in all the input fields.')
              return false
          }
      })
      return true
  }

  const submitNewAlarm = async(newAlarm) => {
    let validate = validateBeforeSubmit(newAlarm)
    if(!validate) return
    try{
        let response = await fetch(
            "https://api.smartdrying.io/alarm/add",
            {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newAlarm),
            }
          );
        if(response.ok){
            getAlarms()
        }else{
          response = await response.json()
        }
    }catch(err){
        console.log(err)
    }
   
  }

  const classes = useStyles();
  return (
    <div className={classes.rowContainer}>
      <div className={classes.rowCell}>
        <select
          style={{}}
          onChange={(e) => handleInputChange(e, "sensor_id")}
          name=""
          id=""
        >
          <option disabled selected>
            Choose a sensor
          </option>
          {Object.entries(sensorNameAndIdPairs).map(([id, name], index) => {
            return (
              <option key={index} value={id}>
                ID: {id} -- Name: {name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={classes.rowCell}>
        <select
          style={{}}
          onChange={(e) => handleInputChange(e, "measurement_type_id")}
          name=""
          id=""
        >
          <option disabled selected>
            Choose a measurement type
          </option>
          {Object.values(typeNameAndIdPairs).map((value, index) => {
            return (
              <option key={index} value={index + 1}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
      <div className={classes.rowCell}>
        <input type="text"
          onChange={(e) => handleInputChange(e, "min_allowed_threshold")}
        
        />
      </div>
      <div className={classes.rowCell}>
        <input type="text"
          onChange={(e) => handleInputChange(e, "max_allowed_threshold")}
        
        />
      </div>
      
      <div style={{ width: "24%" }}>
        <Button variant="outlined" size="small" onClick={()=>{submitNewAlarm(newAlarm)}}>
          {" "}
          Add{" "}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setNewAlarmForm(false);
          }}
        >
          {" "}
          Cancel{" "}
        </Button>
      </div>
    </div>
  );
}

export default AddAlarmForm;
