import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, CircularProgress } from "@material-ui/core";
import TabContainer from "./DryingGroupTabs/TabContainer";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    margin: "auto",
    marginTop: "4.5rem",
    width: "90%",
    textAlign: "left",
    padding: "1rem 2rem",
    border: "1px solid silver",
    borderRadius: "5px",
    minHeight: "85%",
  },
  overviewHeader: {},
  mainTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#002884",
  },
  coloredText: {
    color: "#3F50B5",
  },
  headerInfoLine: {
    marginTop: "1.2rem",
    display: "flex",
    justifyContent: "space-between",
  },
  startStopButton: {
    borderColor: "#AB003C",
    color: "#AB003C",
    "&:hover": {
      background: "#AB003C",
      color: "white",
    },
  },
}));

export default function DryingGroupOverview({ baseURL, dryingGroup }) {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState([]);
  const [dryingTypes, setDryingTypes] = useState([])

  const classes = useStyles();


  useEffect(async() => {
    //Get Sensors
    const getSensors = async () => {
      const url = baseURL + "/sensor/get/drying_group/" + dryingGroup.id;
      try {
        let response = await fetch(url);
        response = await response.json();
        setSensors(JSON.parse(response));
        setLoading(false);
      } catch (err) {
        console.log(
          "Error while fetching sensor data of drying group id:" +
            dryingGroup.id
        );
        console.log(err);
      }
    };
    const getDryingTypes = async() =>{
      try{
        let url = 'https://api.smartdrying.io/drying_type/get_all'
        let res = await fetch(url)
        res = await res.json()
        setDryingTypes(JSON.parse(res))
        }
        catch(err){
          console.log(
            "Error while fetching measurement types "
          );
          console.log(err)
          return
        }
  }
  

    setLoading(true);
    await getDryingTypes()
    getSensors();

  }, [dryingGroup]);

  //Display Data
  //Get Measurements

  return (
    <>
      {loading && (
        <div style={{ marginTop: "10rem" }}>
          <p>Fetching data...</p>
          <CircularProgress disableShrink></CircularProgress>
        </div>
      )}
      {!loading && (
        <div className={classes.mainContainer}>
          <div className={classes.overviewHeader}>
            <span className={classes.mainTitle}>Drying Group Name</span>
            <div className={classes.headerInfoLine}>
              <span style={{ margin: "auto 0" }}>
                Expected Completion:{" "}
                <span className={classes.coloredText}>
                  11/11/2011 - 11/11/2021
                </span>{" "}
              </span>
              <span style={{ margin: "auto 0" }}>
                Status <span className={classes.coloredText}>Active</span>
              </span>
              <Button variant="outlined" className={classes.startStopButton}>
                Start/Stop
              </Button>
            </div>
          </div>
          <TabContainer
            dryingGroup={dryingGroup}
            sensors={sensors}
            dryingTypes={dryingTypes}
          ></TabContainer>
        </div>
      )}
    </>
  );
}
