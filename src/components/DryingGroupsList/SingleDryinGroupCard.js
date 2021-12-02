import { makeStyles, responsiveFontSizes } from '@material-ui/core'
import { mergeClasses } from '@material-ui/styles'
import React, {useState, useEffect} from 'react'

const useStyles = makeStyles(() =>( {
    selectedCard:{
      padding: '1rem',
        margin:'0.5rem 1rem 0.5rem 0',
        borderRadius:'5px',
        minWidth: '30%',
        background: '#002884',
        color: 'white',
        cursor:'pointer',
        fontSize: '0.9rem'
    },
    dryingGroupCard:{
        padding: '1rem',
        margin:'0.5rem 1rem 0.5rem 0',
        borderRadius:'5px',
        minWidth: '30%',
        border: '1px solid #dedede',
        cursor:'pointer',
        '&:hover':{
            background: '#ebebeb'
        },
        fontSize: '0.9rem'
    },
    singleLine: {
        marginLeft: "2rem",
      },
      predictionTextRed:{
        fontWeight: 600,
        color: '#AB003C',
        display: 'inline-block',
        marginBottom:'1rem'
      },
      predictionTextWhite:{
        fontWeight: 600,
        color: '#fffff',
        display: 'inline-block',
        marginBottom:'1rem'
      },
}))
function DryingGroupCard({dryingGroup, predictions, clicked, setSelectedDryingGroup }) {
    const classes = useStyles()
    const [minDate, setMinDate] = useState('')
    const [maxDate, setMaxDate] = useState('')

    useEffect(() => {
      try{
         setMinDate(predictions.min_dry_date.split('-').reverse().join('/'))
         setMaxDate(predictions.max_dry_date.split('-').reverse().join('/'))
      }catch{
        console.log("Couldn't parse prediction dates")
      }
    }, [])
    
    

    return (
        <div data-testid='drying-group-card'  className={clicked ? classes.selectedCard : classes.dryingGroupCard} onClick={()=> {setSelectedDryingGroup(dryingGroup)}}>
            <div className={classes.singleLine}>
              {dryingGroup.name ? (
                <p style={{ fontWeight: 600 }}>{dryingGroup.name}</p>
              ) : (
                <p style={{ fontWeight: 600 }}>{dryingGroup.description}</p>
              )}
            </div>
            <div className={classes.singleLine}>
              <span style={{marginRight: '0.5rem', marginBottom:'1rem', display: 'inline-block'}}>Expected completion:</span>
              <span className={clicked? classes.predictionTextWhite : classes.predictionTextRed}>
                {minDate} - {maxDate}
              </span>
              </div>
        </div>
    )
}

export default DryingGroupCard
