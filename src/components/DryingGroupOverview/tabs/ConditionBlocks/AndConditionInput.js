import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  andCondition: {
    border: "1px solid silver",
    padding: "0.25rem 0.5rem",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallConditionCell: {
    flexBasis: "15%",
    // "@media (max-width: 1500px) and (min-width: 1025px)": {
    //   width: "25%",
    //   fontSize: "0.9rem",
    // },
    "@media (max-width: 1150px)": {
      flexBasis: "12%",
      fontSize: "0.8rem",
    },
  },
  largeConditionCell: {
    flexBasis: "25%",
    "@media (max-width: 1150px)": {
      flexBasis: "15%",
      fontSize: "0.8rem",
    },
  },
  extraLargeConditionCell: {
    flexBasis: "30%",
    "@media (max-width: 1150px)": {
      flexBasis: "20%",
      fontSize: "0.8rem",
    },
  },
  removeButtonCell: {
    flexBasis: "15%",
    display:'flex',
    justifyContent:'space-around',
    // "@media (max-width: 1500px) and (min-width: 1150px)": {
    //   width: "25%",
    //   fontSize: "0.9rem",
    // },
    "@media (max-width: 1150px)": {
      marginTop: "0.5rem",
      flexBasis: "100%",
      fontSize: "0.9rem",
    },
  },
  cancelButton: {
    textTransform: "none",
    borderColor:'crimson',
    padding: "0.15rem 0.5rem",
    fontSize: "0.8rem",
    "&:hover": {
      background: "gray",
      color: "white",
    },
    "@media (max-width: 1150px)": {
      width: "40%",
    },
  },
  addButton: {
    textTransform: "none",
    borderColor:'#002884',
    padding: "0.15rem 0.5rem",
    fontSize: "0.8rem",
    "&:hover": {
      background: "gray",
      color: "white",
    },
    "@media (max-width: 1150px)": {
      width: "40%",
    },
  },
  longText: {
    "@media (max-width: 1150px)": {
      display: "inline",
    },
  },
}));

function AndConditionInput({
  operatorNameAndIdPairs,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  orBlockIndex,
  setNewAndConditionInput,
  addAndBlock
}) {
  const [newAndBlock, setNewAndBlock] = useState({
    sensor_id: null,
    threshold: null,
    measurement_type_id: null,
    measurement_unit_id: null,
    operator_id: null,
  });

  const handleInputChange = (e, type) => {
    let obj = { ...newAndBlock };
    obj[type] = e.target.value;
    setNewAndBlock(obj);
  };

  const submitNewAndBlock = () =>{

    newAndBlock.measurement_unit_id = newAndBlock.measurement_type_id 
    for(let [k,v] of Object.entries(newAndBlock)){
        if(!v) {
            alert('Please fill in all the fields')
            return
        }
    }
    addAndBlock(orBlockIndex, newAndBlock)
    setNewAndConditionInput(false)
  }

  const classes = useStyles();
  return (
    <div className={classes.andCondition}>
      <div className={classes.largeConditionCell}>
        <p style={{ fontWeight: "600" }}> Sensor Id and Name</p>
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
      <div className={classes.smallConditionCell}>
        <p style={{ fontWeight: "600" }}> Measurement Type</p>
        <select
          onChange={(e) => handleInputChange(e, "measurement_type_id")}
          name=""
          id=""
        >
          <option disabled selected>
            Choose a type
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
      <div className={classes.extraLargeConditionCell}>
        <p style={{ fontWeight: "600" }}> Condition</p>
        <select
          style={{ display: "inline-block", width:'35%' }}
          onChange={(e) => handleInputChange(e, "operator_id")}
          name=""
          id=""
        >
            <option selected disabled> Choose Operator</option>
          {Object.values(operatorNameAndIdPairs).map((value, index) => {
            return (
              <option key={index} value={index + 1}>
                {value}
              </option>
            );
          })}
        </select>
        <input
          type="number"
          style={{ marginLeft: "2.5%", display: "inline-block", width:'55%'}}
          placeholder='Threshold value'
          onChange={(e) => handleInputChange(e, "threshold")}
        ></input>
      </div>
      <div className={classes.removeButtonCell}>
      <Button
          variant="outlined"
          size="small"
          className={classes.addButton}
          onClick={() => {
           submitNewAndBlock();
          }}
        >
          Add And Block
        </Button>
      <Button
          variant="outlined"
          size="small"
          className={classes.cancelButton}
          onClick={() => {
           setNewAndConditionInput(false);
          }}
        >
         Cancel
        </Button>
        
      </div>
    </div>
  );
}

export default AndConditionInput;
