import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(()=>({
    navbarCard:{
        width: '99%',
        borderBottom: '1px solid silver'

    }
}))

export default function DryingGroupsNavbar({
  baseURL,
  projectID,
  setNavbarState,
  setSelectedDryingGroup,
  setSelectedProject,
}) 
{

    const classes = useStyles()

  const [dryingGroups, setDryingGroups] = useState([]);

  const getDryingGroupsOfSelectedProject = async () => {
    const url = baseURL + "/drying_group/get/project/" + projectID;

    try {
      let res = await fetch(url);
      res = await res.json();
      setDryingGroups(JSON.parse(res));
    } catch (err) {
      console.log("Error fetching drying groups of project id:", projectID);
      console.log(err);
    }
  };

  const goBack = () => {
    setSelectedProject(null);
    setNavbarState("selectProject");
  };

  useEffect(() => {
    getDryingGroupsOfSelectedProject();
  }, []);

  return (
    <>
      <button onClick={goBack}>Go Back</button>
      
      {!dryingGroups.length && (
        <p>This projects does not have any drying groups</p>
      )}



      {dryingGroups.map((group, index) => {
        console.log(group)
        return (
          <div key={index} className={classes.navbarCard} onClick={()=> {setSelectedDryingGroup(group)}}>
            <p>
              {group.description} / {group.id}
            </p>
          </div>
        );
      })}
    </>
  );
}
