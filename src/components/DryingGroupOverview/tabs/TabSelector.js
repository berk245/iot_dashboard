import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles(() => ({
  mainBar: {
    width: "95%",
    margin: "auto",
    display: "flex",
  },
  singleTab: {
    padding: "1rem",
    outline: "1px solid darkgray",
    flexBasis: "25%",
    background: "#e2e2e2",
    cursor: "pointer",
    "&:hover": {
      background: "darkgray",
    },
    textAlign: "center",
    "@media (max-width: 1150px)": {
      fontSize:'0.9rem',
      padding:'0.5rem',
    },
  },
  selectedTab: {
    padding: "1rem",
    margin: '-1px -1px 0 -1px',
    borderWidth: "1px 1px 0 1px",
    border: "solid darkgray",
    flexBasis: "25%",
    background: "white",
    borderBottom: "none",
    fontWeight: 600,
    textAlign: "center",
    cursor: "default",
    "@media (max-width: 1150px)": {
      fontSize:'0.9rem',
    },
  },
}));

function TabSelector({ selectedTab, setSelectedTab }) {
  const tabNames = [
    "Information",
    "Sensors and Measurements",
    "Stop/Start Criterion",
    "Alarms",
  ];
  const classes = useStyles();
  return (
      <div className={classes.mainBar}>
        {tabNames.map((name, index) => {
          return (
            <div
              key={index}
              className={
                selectedTab == name ? classes.selectedTab : classes.singleTab
              }
              onClick={() => {
                setSelectedTab(name);
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
  );
}

export default TabSelector;
