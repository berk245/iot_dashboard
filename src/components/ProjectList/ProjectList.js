import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import { searchProject } from "./ProjectListLogic";

const useStyles = makeStyles(() => ({
  mainContainer: {
    width: "90%",
    overflow: "auto",
    margin: "auto",
    marginBottom: '2rem'
  },
  cardsContainer: {
    width: "100%",
    overflow: "auto",
    borderRadius: "5px",
  },
  navbarCard: {
    width: "99%",
    background: 'white',
    fontSize: '0.9rem',
    border: "1px solid #ababab",
    margin: "0.5rem 1rem 0.5rem 0",
    borderRadius: "5px",
    padding: "1rem",
    "&:hover": {
      backgroundColor: "#f2f2f2",
      cursor: "pointer",
    },
  },
  singleLine: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "2rem",
    lineHeight: "0.75rem",
  },
}));

export default function ProjectsSidebar({ projects, setSelectedProject }) {
  const classes = useStyles();
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    setAllProjects(projects);
    setFilteredProjects(projects);
  }, [projects]);


  const handleProjectChoice = (project) => {
    setSelectedProject(project);
  };

  const userSearch = (e) => {
    setFilteredProjects(searchProject(allProjects, e.target.value));
  };

  return (
    <div className={classes.mainContainer}>
      {allProjects.length && (
        <>
          <TextField
            data-testid='searchBar'
            placeholder="Choose a project from the list or type to search"
            variant="outlined"
            onChange={(e) => userSearch(e)}
            style={{ marginBottom: "1rem", width: "99%" }}
          />
          <div className={classes.cardsContainer}>
            {!filteredProjects.length && (
              <p style={{ padding: "1rem", fontSize: "0.9rem" }}>
                Could not find projects with given keyword.
              </p>
            )}
            {filteredProjects.map((project) => {
              return (
                <button
                  className={classes.navbarCard}
                  key={project.id}
                  onClick={() => handleProjectChoice(project)}
                >
                  <div className={classes.singleLine}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#002884' }}>{project.name}</p>
                  </div>
                  <div className={classes.singleLine}>
                    <p style={{ fontSize: '0.95rem', marginBottom:'1rem' }}>Project ID: {project.id}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
