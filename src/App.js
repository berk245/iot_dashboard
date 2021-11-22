import PageHeader from "./components/PageHeader";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { requestDataFromAPI } from "./utils";

//Components
import ProjectList from "./components/ProjectList/ProjectList";
import DryingGroupsList from "./components/DryingGroupsList/DryingGroupsContainer";
import CircularLoadingIcon from "./components/CircularLoadingIcon";

const useStyles = makeStyles(() => ({
  pageContent: {
    position: "absolute",
    top: "3.5%",
    width: "100%",
    margin: "auto",
  },
}));

function App({ urls }) {
  const [fetchingInitialData, setFetchingInitialData] = useState(true);
  const [fetchingError, setFetchingError] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [measurementOperators, setMeasurementOperators] = useState([]);
  const [dryingTypes, setDryingTypes] = useState([]);
  


  const classes = useStyles();
  useEffect(() => {
    
    let isMounted = true;
    requestDataFromAPI("https://api.smartdrying.io/project/get_all")
      .then((projects) => {
        if (isMounted){
          setProjects(projects);
          setFetchingInitialData(false)
        } 

      })
      .catch((err) => {
        console.log(err);
        if (isMounted) {
          setFetchingInitialData(false)
          setFetchingError(true)
        };
      });
    

    return () => {
      isMounted = false;
    }; //clenup
  }, []);


  return (
    <div className="App">
      <PageHeader className={classes.header}></PageHeader>
      <div className={classes.pageContent}>
        {!fetchingError ? (
          <div style={{ marginTop: "1rem" }}>
            {fetchingInitialData ? (
              <CircularLoadingIcon text={"Creating Project List"} />
            ) : (
              <>
                {!selectedProject ? (
                  <ProjectList
                    className={classes.sidebar}
                    projects={projects}
                    setSelectedProject={setSelectedProject}
                  />
                ) : (
                  <DryingGroupsList
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <p
            data-testid="error-text"
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "1.1rem",
            }}
          >
            An error occured while fetching data. Please refresh the page.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
