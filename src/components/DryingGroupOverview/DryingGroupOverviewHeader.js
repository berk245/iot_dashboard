import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles(()=>({
  cell:{
    padding: '1rem',
    lineHeight: '2rem'
  },
  coloredText: {
    color: "#3F50B5",
    display: 'inline-block',
  },
  headerInfoLine: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-evenly",
  },
  startStopButton: {
    borderColor: "#AB003C",
    color: "#AB003C",
    height: '50%',
    margin: 'auto 0.75rem',
    "&:hover": {
      background: "#AB003C",
      color: "white",
    },
  },
}))
function DryingGroupOverviewHeader({dryingGroup}) {
  const classes = useStyles()
    return (
      <div style={{margin:'1rem 0'}}>
        <div className={classes.overviewHeader}>
            <div className={classes.headerInfoLine}>
            <span className={classes.cell}>
                Drying Group Name: <span style={{fontWeight: '600'}}>
                {dryingGroup.name ? dryingGroup.name : 'No name available'}
                </span>{" "}
              </span>
              <div className={classes.cell}>
                <span>
                Expected Completion:
                </span>
                <span className={classes.coloredText}>
                  11/11/2011 - 11/11/2021
                </span>{" "}
              </div>
              <span className={classes.cell}>
                Status <span className={classes.coloredText}>Active</span>
              </span>
              <Button variant="outlined" className={classes.startStopButton}>
                Start/Stop
              </Button>
            </div>
          </div>
          </div>
    )
}

export default DryingGroupOverviewHeader
