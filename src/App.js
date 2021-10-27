import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/styles";
// import { Typography, Button, Collapse, Grid } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import PageHeader from "./components/PageHeader";
import ProjectsNavbar from "./components/sidebar/ProjectsNavbar";
import DryingGroupsNavbar from "./components/sidebar/DryingGroupsNavbar";
import DryingGroupOverview from "./components/DryingGroupOverview";

const useStyles = makeStyles(() => ({
  navbarContainer: {
    marginTop: "8vh",
    height: "90vh",
    overflow: "auto",
    borderRight: "1px solid silver",
    "&::-webkit-scrollbar": {
      width: "0.5rem",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(63,80,181,0.25)",
      borderRadius: "5px",
    },
  },
}));

function App() {
  const baseURL = "https://api.smartdrying.io";
  const [navbarState, setNavbarState] = useState("selectProject");
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedDryingGroup, setSelectedDryingGroup] = useState(null);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [measurementOperators, setMeasurementOperators] = useState([])
  const [dryingTypes, setDryingTypes] = useState([]);

  const classes = useStyles();
  useEffect(() => {
    const getMeasurementTypes = async () => {
      let url = "https://api.smartdrying.io/measurement_type/get_all";
      let types = await fetch(url);
      types = await types.json();
      setMeasurementTypes(JSON.parse(types));
    };
    const getMeasurementUnits = async () => {
      let url = "https://api.smartdrying.io/measurement_unit/get_all";

      let units = await fetch(url);
      units = await units.json();
      setMeasurementUnits(JSON.parse(units));
    };
    const getDryingTypes = async () => {
      try {
        let url = "https://api.smartdrying.io/drying_type/get_all";
        let res = await fetch(url);
        res = await res.json();
        setDryingTypes(JSON.parse(res));
      } catch (err) {
        console.log("Error while fetching measurement types ");
        console.log(err);
        return;
      }
    };
    const getOperators = async () => {
      try {
        let url = "https://api.smartdrying.io/operator/get_all";
        let res = await fetch(url);
        res = await res.json();
        setMeasurementOperators(JSON.parse(res));
      } catch (err) {
        console.log("Error while fetching operators ");
        console.log(err);
        return;
      }
    }

    getMeasurementTypes();
    getMeasurementUnits();
    getDryingTypes();
    getOperators()
  }, []);

  return (
    <div className="App">
      <PageHeader />
      <Grid container>
        <Grid item sm={6} md={4} lg={3} className={classes.navbarContainer}>
          {navbarState === "selectProject" && (
            <ProjectsNavbar
              baseURL={baseURL}
              setNavbarState={setNavbarState}
              setSelectedProject={setSelectedProject}
            />
          )}
          {navbarState === "selectDryingGroup" && (
            <DryingGroupsNavbar
              baseURL={baseURL}
              projectID={selectedProject.id}
              projectName={selectedProject.name}
              setNavbarState={setNavbarState}
              setSelectedDryingGroup={setSelectedDryingGroup}
              setSelectedProject={setSelectedProject}
            />
          )}
        </Grid>
        {selectedDryingGroup && (
          <Grid item sm={6} md={8} lg={9} className={classes.dryingGroupData}>
            <DryingGroupOverview
              baseURL={baseURL}
              dryingGroup={selectedDryingGroup}
              measurementTypes={measurementTypes}
              measurementUnits={measurementUnits}
              dryingTypes={dryingTypes}
              measurementOperators={measurementOperators}
            ></DryingGroupOverview>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default App;
