import React from "react";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  appBar:{
    borderBottom: '0.5px solid #3f50b56e',
    fontSize: '1.1rem',
    padding: '0.5rem 0',
    height: '3.5%',
    color: '#3F50B5' 
  },
}));

function PageHeader() {
  const classes = useStyles();

  return (
      <div className={classes.appBar}>
        <p style={{width:'90%', margin:'auto'}} data-testid='page-title' >
            Smarte Trocknungstechnik Dashboard
        </p>
      </div>
          
  );
}

export default PageHeader;
