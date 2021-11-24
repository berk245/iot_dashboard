import React from "react";
import { makeStyles,Button } from "@material-ui/core";

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

function AddAlarmForm({setNewAlarmForm}) {
  const classes = useStyles();
  return (
    <div className={classes.rowContainer}>
      <div className={classes.rowCell}>
      </div>
      <div className={classes.rowCell}>
      </div>
      <div className={classes.rowCell}>
      </div>
      <div style={{width: '5%'}}>
          <Button
           variant='outlined'
           size='small'
          > Add </Button>
          <Button
           variant='outlined'
           size='small'
           onClick={()=> {setNewAlarmForm(false)}}
          > Cancel </Button>
      </div>
    </div>
  );
}

export default AddAlarmForm;
