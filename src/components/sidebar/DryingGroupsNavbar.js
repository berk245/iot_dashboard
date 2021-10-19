import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import BackIcon from '@material-ui/icons/ArrowBackIosRounded';

const useStyles = makeStyles(() => ({
  titleSection:{
    display: "flex",
    justifyContent: "flex-start",
    borderBottom: '1px solid #002884'
  },
  backIcon:{
    border: '2px solid silver',
    padding:'0.25rem',
    margin: 'auto 0.75rem',
    borderRadius: '20px',
    "&:hover": {
      backgroundColor: "#e0e0e0",
      cursor: "pointer",
    },

  },
  navbarCard: {
    width: "99%",
    borderBottom: "1px solid silver",
    padding: "1.25rem 0",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      cursor: "pointer",
    },
  },
  selectedCard: {
    width: "99%",
    borderBottom: "1px solid silver",
    padding: "1.25rem 0",
    backgroundColor: "#002884c7",
    color: 'white'
  },
  singleLine: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "2rem",
    lineHeight: "0.25rem",
  },
  predictionTextRed:{
    fontWeight: 600,
    color: '#AB003C'
  },
  predictionTextWhite:{
    fontWeight: 600,
    color: 'white'
  }
}));

export default function DryingGroupsNavbar({
  baseURL,
  projectName,
  projectID,
  setNavbarState,
  setSelectedDryingGroup,
  setSelectedProject,
}) {
  const classes = useStyles();

  const [dryingGroups, setDryingGroups] = useState([]);
  const [clickId, setClickId] = useState();

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

  const selectDryingGroup = (group) => {
    setSelectedDryingGroup(group);
    setClickId(group.id);
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
      

      

      <div className={classes.titleSection}>
        <BackIcon className={classes.backIcon} onClick={goBack}/>
        <h4>{projectName} Drying Groups</h4>
      </div>
      {!dryingGroups.length && (
        <p style={{padding: '1rem'}}>This projects does not have any drying groups.</p>
      )}
      {dryingGroups.map((group, index) => {
        return (
          <div
            key={index}
            id={group.id}
            className={
              clickId == group.id ? classes.selectedCard : classes.navbarCard
            }
            onClick={() => selectDryingGroup(group)}
          >
            <div className={classes.singleLine}>
              {group.name ? (
                <p style={{ fontWeight: 600 }}>{group.name}</p>
              ) : (
                <p style={{ fontWeight: 600 }}>{group.description}</p>
              )}
            </div>
            <div className={classes.singleLine}>
              <p style={{}}>Expected completion:</p>
            </div>
            <div className={classes.singleLine}>
              <p className={ clickId == group.id ? classes.predictionTextWhite : classes.predictionTextRed}>
                21/12/2021 - 25/12/2021
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}
