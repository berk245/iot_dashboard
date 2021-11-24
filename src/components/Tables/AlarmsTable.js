import { makeStyles, Button } from "@material-ui/core";
import React, { useState } from "react";
import AddAlarmForm from "./AddAlarmForm";
import SingleAlarmRow from "./SingleAlarmRow";
const useStyles = makeStyles(() => ({
  sensorTable: {
    width: "95%",
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
  headersRow: {
    width: "95%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid gray",
  },
  tableHeader: {
    textAlign: "left",
    width: "19%",
    fontWeight: 600,
    "@media (max-width: 1150px)": {
      fontSize: "0.9rem",
    },
  },
}));

function AlarmsTable({
  dryingGroup,
  alarms,
  getAlarms,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
}) {
  const [newAlarmForm, setNewAlarmForm] = useState();

  console.log(newAlarmForm);
  const classes = useStyles();
  return (
    <div>
      {alarms.length || newAlarmForm ? (
        <div className={classes.sensorTable}>
          <div className={classes.headersRow}>
            <span className={classes.tableHeader}>Sensor</span>
            <span className={classes.tableHeader}>Measurement Type</span>
            <span className={classes.tableHeader}>Min threshold</span>
            <span className={classes.tableHeader}>Max threshold</span>
            {newAlarmForm?
            <span className={classes.tableHeader}></span>
            :
            <span className={classes.tableHeader}>Measurement Unit</span>
            }
            <span style={{ width: "5%" }}></span>
          </div>
          {alarms.map((alarm, index) => {
            return (
              <SingleAlarmRow
                key={index}
                alarm={alarm}
                ixdex={index}
                sensorNameAndIdPairs={sensorNameAndIdPairs}
                typeNameAndIdPairs={typeNameAndIdPairs}
                unitNameAndIdPairs={unitNameAndIdPairs}
                getAlarms={getAlarms}
              />
            );
          })}
          {newAlarmForm && (
            <AddAlarmForm
              dryingGroup={dryingGroup}
              setNewAlarmForm={setNewAlarmForm}
              getAlarms={getAlarms}
              sensorNameAndIdPairs={sensorNameAndIdPairs}
              typeNameAndIdPairs={typeNameAndIdPairs}
              unitNameAndIdPairs={unitNameAndIdPairs}
            />
          )}
        </div>
      ) : (
        <p>This project does not have any alarms</p>
      )}
      {!newAlarmForm && (
        <Button
          variant="outlined"
          onClick={() => {
            setNewAlarmForm(true);
          }}
        >
          Add a new alarm
        </Button>
      )}
    </div>
  );
}

export default AlarmsTable;
