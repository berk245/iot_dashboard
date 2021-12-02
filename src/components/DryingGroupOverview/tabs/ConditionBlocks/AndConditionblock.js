import React from "react";
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
    flexBasis: "5%",
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
    flexBasis: "15%",
    "@media (max-width: 1150px)": {
      flexBasis: "22.5%",
      fontSize: "0.8rem",
    },
  },
  removeButtonCell: {
    textAlign:'center',
    flexBasis: "20%",
    // "@media (max-width: 1500px) and (min-width: 1150px)": {
    //   width: "25%",
    //   fontSize: "0.9rem",
    // },
    "@media (max-width: 1150px)": {
      marginTop: '0.5rem',
      flexBasis: "100%",
      fontSize: "0.9rem",
    },
  },
  removeButton: {
    textTransform: "none",
    padding: "0.15rem 0.5rem",
    fontSize: "0.8rem",
    "&:hover": {
      background: "gray",
      color: "white",
    },
    "@media (max-width: 1150px)": {
      width: '100%'
    },
   
    
  },
  longText:{
    "@media (max-width: 1150px)": {
      display: 'inline'
    },
   } 
}));

function AndConditionBlock({
  andCondition,
  operatorNameAndIdPairs,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  orBlockIndex,
  andBlockIndex,
  removeAndBlock
}) {
  const classes = useStyles();
  return (
    <div className={classes.andCondition}>
      <div className={classes.smallConditionCell}>
        <p style={{ fontWeight: "600" }}> Sensor Id</p>
        <p>{andCondition.sensor_id}</p>
      </div>
      <div className={classes.largeConditionCell}>
        <p style={{ fontWeight: "600" }}> Sensor Name</p>
        <p>{sensorNameAndIdPairs[andCondition.sensor_id]}</p>
      </div>
      <div className={classes.largeConditionCell}>
        <p style={{ fontWeight: "600" }}> Measurement Type</p>
        <p >{typeNameAndIdPairs[andCondition.measurement_type_id]}</p>
      </div>
      <div className={classes.smallConditionCell}>
        <p style={{ fontWeight: "600" }}> Condition</p>
        <p>
          {operatorNameAndIdPairs[andCondition.operator_id]}{" "}
          {andCondition.threshold}{" "}
        </p>
      </div>
      <div className={classes.largeConditionCell}>
        <p style={{ fontWeight: "600" }}> Unit</p>
        <p className={classes.longText}>{unitNameAndIdPairs[andCondition.measurement_unit_id]}</p>
      </div>
      <div className={classes.removeButtonCell}>
        <Button
          variant="outlined"
          size="small"
          className={classes.removeButton}
          onClick={() => removeAndBlock(orBlockIndex, andBlockIndex)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default AndConditionBlock;
