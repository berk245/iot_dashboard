import React, {useEffect, useState} from 'react'
import CircularLoadingIcon from '../CircularLoadingIcon'
import { makeStyles } from '@material-ui/styles'
import DryingGroupCard from './SingleDryinGroupCard'
import { requestDataFromAPI } from '../../utils'

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
        border: '1px solid #dedede',
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

    const [predictions, setPredictions] = useState([])
    const [loading, setLoading] = useState(true)
    

    const getPredictions = async(groups) =>{
        let urls = []
        let predictions = {}
        groups.map((group)=>{
            let obj = {}
            obj[group.id] = `https://api.smartdrying.io/dry_prediction/get/drying_group/${group.id}`
            urls.push(obj)
            predictions[group.id] = []
        })

        

        for(const o of Object.values(urls)){
            for(const [id, url] of Object.entries(o)){
                let p = await requestDataFromAPI(url)
                predictions[id] = p
            }
            
        }

        console.log('P: ', predictions)
        setPredictions(predictions)
        setLoading(false)
    }

    useEffect(() => {
        if(dryingGroups)  getPredictions(dryingGroups)
    }, [dryingGroups])


    return (
        <div>
            {!loading ?
                <>
                {dryingGroups.length ?
                    <div className={classes.container}>
                        <div className={classes.cardBox}>
                        {dryingGroups.map((dryingGroup,idx) => {
                            return(
                                <DryingGroupCard key={idx} predictions={predictions[dryingGroup.id]} dryingGroup={dryingGroup} clicked={selectedDryingGroup === dryingGroup} setSelectedDryingGroup={setSelectedDryingGroup}/> 
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
