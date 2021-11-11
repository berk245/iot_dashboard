import React, {useEffect} from 'react'
import CircularLoadingIcon from '../CircularLoadingIcon'
import { makeStyles } from '@material-ui/styles'
import DryingGroupCard from './SingleDryinGroupCard'


const useStyles = makeStyles(()=> ({
    container:{
        borderRadius: '5px',
        width: '100%',
        overflow: 'hidden',
    },
    cardBox:{
        width: 'auto',
        display: 'flex',
        justifyContent:'flex-start',
        overflow: 'auto',
        padding: '0.5rem 0.5rem',
        border: '1px solid silver',
        '&::-webkit-scrollbar': {
            height: '0.5rem',
          },
        '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#3F50B5',
        borderRadius: '5px',
        width: '10%'
      }
    }
}))
function HorizontalMenu({dryingGroups, selectedDryingGroup, setSelectedDryingGroup}) {
    const classes = useStyles()

    useEffect(() => {
    }, [selectedDryingGroup])

    return (
        <div>
            {dryingGroups ?
                <>
                {dryingGroups.length ?
                    <div className={classes.container}>
                        <div className={classes.cardBox}>
                        {dryingGroups.map((dryingGroup,idx) => {
                            return(
                                <DryingGroupCard key={idx} dryingGroup={dryingGroup} clicked={selectedDryingGroup === dryingGroup} setSelectedDryingGroup={setSelectedDryingGroup}/> 
                            )
                        })}
                        </div>
                    </div>
                    :
                    <p>This project does not have any drying groups.</p>
                }
                
                </>
            :  
                <CircularLoadingIcon text={'Creating drying groups list'}/>
            }
        </div>
    )
}

export default HorizontalMenu
