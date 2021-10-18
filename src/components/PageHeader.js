import React from "react";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#f2f2f2",
    color: '#3F50B5',
  },
}));

function PageHeader() {
  const classes = useStyles();

  return (
      <AppBar>
        <Toolbar className={classes.mainContainer}>
          <Typography variant="h5" component="h1">
            Smarte Trocknungstechnik Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
  );
}

export default PageHeader;
