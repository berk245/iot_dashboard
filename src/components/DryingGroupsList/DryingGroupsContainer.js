import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
import { Button } from '@material-ui/core'
import HorizontalNavbar from './HorizontalMenu'
import DryingGroupOverview from '../DryingGroupOverview/DryingGroupOverview'
import { requestDataFromAPI } from '../../utils'
const useStyles = makeStyles(() => ({
    groupsContainer:{
        width: "90%",
        margin: "auto",
        "@media (max-width: 1150px)": {
          width:'95%'
        },
    },
    sliderHeader:{
        marginTop: '-0.5rem',
        display: 'flex',
    },
    goBackButton:{
        padding:'0.5rem',
        height: '100%',
        margin: 'auto 3rem auto 0',
        fontSize: '0.8rem',
        fontWeight:'600',
        textTransform: 'none',
        borderColor: '#dedede',
        color: 'gray'
    }
}))

function DryingGroupsContainer({selectedProject, setSelectedProject}) {

    const [dryingGroups, setDryingGroups] = useState(null)
    const [fetchError, setFetchError] = useState(false)
    const [selectedDryingGroup, setSelectedDryingGroup] = useState(null)

    const [dryingTypes, setDryingTypes] = useState();
    const [measurementTypes, setMeasurementTypes] = useState();
    const [measurementOperators, setMeasurementOperators] = useState();
    const [measurementUnits, setMeasurementUnits] = useState();


    useEffect(()=>{
        let isMounted = true;
        const {id} = selectedProject
        const getDryingGroupsOfSelectedProject = async () => {
            const url = "https://api.smartdrying.io/drying_group/get/project/" + id;
            try{
              let dryingGroups = await requestDataFromAPI(url)
              console.log(dryingGroups)
              if(dryingGroups && isMounted) setDryingGroups(dryingGroups)
              else if(!dryingGroups && isMounted) setFetchError(true)
            }catch (err) {
              console.log("Error fetching drying groups of project id:", id);
              console.log(err);
              if(isMounted) setFetchError(true)
            }
          };
        
        getDryingGroupsOfSelectedProject()
        return () => {isMounted = false}
    }, [])

    useEffect(() => {
      let isMounted = true
      
      const getMeasurementTypes = async () => {
        let data = await requestDataFromAPI("https://api.smartdrying.io/measurement_type/get_all");
        if(data&& isMounted) setMeasurementTypes(data);
        else if(isMounted) setFetchError(true)
      };
      const getMeasurementUnits = async () => {
        let data =await requestDataFromAPI("https://api.smartdrying.io/measurement_unit/get_all");
        if(data&&isMounted) setMeasurementUnits(data)
        else if(isMounted) setFetchError(true)
      };
      const getDryingTypes = async () => {
        let data = await requestDataFromAPI("https://api.smartdrying.io/drying_type/get_all")
        if(data&&isMounted) setDryingTypes(data)
        else if(isMounted) setFetchError(true)
      };
      const getOperators = async () => {
        let data = await requestDataFromAPI( "https://api.smartdrying.io/operator/get_all")
        if(data&&isMounted) setMeasurementOperators(data)
        else if(isMounted) setFetchError(true)
      }
  
      getMeasurementTypes();
      getMeasurementUnits();
      getDryingTypes();
      getOperators()


      return () => {
        isMounted = false
      }
    }, [])

    const classes = useStyles()
    return (
        <div className={classes.groupsContainer}>
            <div className={classes.sliderHeader}>
            <Button size='small' variant='outlined' className={classes.goBackButton} data-testid='go-back-button' onClick={()=>{setSelectedProject('')}}> &lt; Back to project selection </Button>
            <h4>{selectedProject.name} <>Drying Groups</></h4>
            </div>
            
            {fetchError ? 
                <p>An error occured while getting drying group information. Please refresh the page.</p>
                :
                <>
                <HorizontalNavbar dryingGroups={dryingGroups} selectedDryingGroup={selectedDryingGroup} setSelectedDryingGroup={setSelectedDryingGroup}/>
                {selectedDryingGroup &&
                <DryingGroupOverview 
                  selectedDryingGroup={selectedDryingGroup}
                  measurementUnits={measurementUnits}
                  measurementTypes={measurementTypes}
                  operators = {measurementOperators}
                  dryingTypes = {dryingTypes}
                  />
                }
                </>
            }
        </div>
    )
}

export default DryingGroupsContainer
