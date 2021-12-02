import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, {useState, useEffect} from 'react'
import { requestDataFromAPI } from '../../utils'
const useStyles = makeStyles(()=>({
  cell:{
    padding: '1rem',
    lineHeight: '2rem'
  },
  coloredText: {
    color: "#3F50B5",
    display: 'inline-block',
    marginLeft:'0.25rem'
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

   const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [minDate, setMinDate] = useState('')
    const [maxDate, setMaxDate] = useState('')
  

  const getPredictions = async(dryingGroup) =>{
      const url = `https://api.smartdrying.io/dry_prediction/get/drying_group/${dryingGroup.id}`

      const predictions = await requestDataFromAPI(url)

      setPredictions(predictions)
      setLoading(false)
  }

  useEffect(() => {
      if(dryingGroup)  getPredictions(dryingGroup)
  }, [dryingGroup])

  useEffect(() => {
    try{
       setMinDate(predictions.min_dry_date.split('-').reverse().join('/'))
       setMaxDate(predictions.max_dry_date.split('-').reverse().join('/'))
    }catch{
      console.log("Couldn't parse prediction dates")
    }
  }, [predictions])




  const classes = useStyles()
    return (
      <div style={{margin:'1rem 0'}}>
        {!loading&&
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
                  {minDate}- {maxDate}
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
          }
          </div>
    )
}

export default DryingGroupOverviewHeader
