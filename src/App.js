import React, { useState } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/styles";
// import { Typography, Button, Collapse, Grid } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import PageHeader from "./components/PageHeader";
import ProjectsNavbar from "./components/sidebar/ProjectsNavbar";
import DryingGroupsNavbar from "./components/sidebar/DryingGroupsNavbar";
import DryingGroupOverview from './components/DryingGroupOverview'


const useStyles = makeStyles(() => ({
  navbarContainer: {
    marginTop: '8vh',
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
  const classes = useStyles();
  return (
    <div className="App">
      <PageHeader/>
      <Grid container>
        <Grid item sm={3} className={classes.navbarContainer}>
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
        {selectedDryingGroup&&
          <Grid item sm={9} className={classes.dryingGroupData}>
            <DryingGroupOverview baseURL={baseURL} dryingGroup={selectedDryingGroup}></DryingGroupOverview>
          </Grid>
        }
        
      </Grid>
    </div>
  );
}

export default App;