import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { requestDataFromAPI } from "../../utils";
import CircularLoadingIcon from "../CircularLoadingIcon";
import DryingGroupOverviewHeader from "./DryingGroupOverviewHeader";
import Tabs from './tabs/TabContainer'

const useStyles = makeStyles(() => ({
  mainContainer: {
    marginTop: "1rem",
    marginBottom: '2rem',
    border: "1px solid #dedede",
    
  },
}));

function DryingGroupOverview({ 
    selectedDryingGroup,
    measurementUnits,
    measurementTypes,
    operators,
    dryingTypes}) {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState([])
  const [fetchError, setFetchError] = useState(false)

  const classes = useStyles();

  useEffect(() => {
    let isMounted = true;
    const {id} = selectedDryingGroup;
    const getSensors = async() => {
      setLoading(true)
      let s = await requestDataFromAPI(`https://api.smartdrying.io/sensor/get/drying_group/${id}`)
      if(s&&isMounted) setSensors(s)
      else if(isMounted) setFetchError()  
      setLoading(false)
    }
    getSensors()
    return () => {
      isMounted = false;
    };
  }, [selectedDryingGroup]);


  return (
    <div className={classes.mainContainer}>
      {loading ? (
        <CircularLoadingIcon text={"Accessing drying group data"} />
      ) : (
        <>
          {!fetchError ?
          <>
          <DryingGroupOverviewHeader dryingGroup={selectedDryingGroup}/>
          <Tabs dryingGroup={selectedDryingGroup} sensors={sensors} measurementUnits={measurementUnits} measurementTypes={measurementTypes} operators={operators} dryingTypes={dryingTypes} />
          </>
          :
          <p>Error while accessing data</p>

        }
          
        </>
      )}
    </div>
  );
}

export default DryingGroupOverview;
