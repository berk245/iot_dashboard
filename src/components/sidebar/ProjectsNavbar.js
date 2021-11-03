import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress, TextField } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  navbarCard: {
    width: "99%",
    borderBottom: "1px solid silver",
    padding: '1rem 0',
    "&:hover":{
        backgroundColor: '#f2f2f2',
        cursor: 'pointer'
    }
  },
  singleLine: {
    display: "flex",
    justifyContent: 'flex-start',
    marginLeft: '2rem',
    lineHeight: '0.75rem'
  },
}));



export default function ProjectsNavbar({
  baseURL,
  setNavbarState,
  setSelectedProject,
}) {
  const classes = useStyles();
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchKeyword, setSearchKeyword] = useState([])
  const [fetchingProjects, setFetchingProjects] = useState(true)

  

  const searchProject = () =>{
    let searchResults = allProjects.filter( project => {
        if(project.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||  String(project.id).includes(searchKeyword)) return true
        return false 
    })
    setFilteredProjects(searchResults)
  }

  const handleProjectChoice = (project) => {
    setSelectedProject(project);
    setNavbarState("selectDryingGroup");
  };

  const userSearch = (e) =>{
      setSearchKeyword(e.target.value)
  }

  useEffect(() => {
    const getProjects = async () => {
    setFetchingProjects(true)
    const url = baseURL + "/project/get_all";
    try {
      let res = await fetch(url);
      res = await res.json();
      setAllProjects(JSON.parse(res));
      setFilteredProjects(JSON.parse(res))
      setFetchingProjects(false)
    } catch (err) {
      console.log("Error while fetching projects");
      console.log(err);
    }
  };
    getProjects();
  }, []);

  useEffect(() => {
      searchProject()
  }, [searchKeyword]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    
    <>
    {fetchingProjects?
      <div style={{textAlign:'center'}}>
      
      <CircularProgress style={{marginTop:'3rem'}}/>
      <p>Creating Project List</p>
      </div>
      :
      <>    
      <TextField
         placeholder='Type to search'
         variant='outlined'
         onChange={(e) => userSearch(e)} 
         style={{padding:'0.5rem 1rem', width:'90%'}}    
      />
      {filteredProjects.map((project) => {
        return (
          <div
            className={classes.navbarCard}
            key={project.id}
            onClick={() => handleProjectChoice(project)}
          >
            <div className={classes.singleLine}>
              <p style={{fontWeight: 600}}>Project Name:</p> 
              <p style={{marginLeft: '0.75rem'}}>{project.name}</p>
            </div>
            <div className={classes.singleLine}>
              <p style={{fontWeight: 600}}>Project ID:</p> 
              <p style={{marginLeft: '0.75rem'}}>{project.id}</p>
            </div>
          </div>
        );
      })}
      </>
    }
      
    </>
  );
}
