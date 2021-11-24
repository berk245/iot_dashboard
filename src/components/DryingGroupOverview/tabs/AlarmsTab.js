import React, { useState, useEffect } from "react";
import { requestDataFromAPI } from "../../../utils";
import CircularLoadingIcon from "../../CircularLoadingIcon";
import AlarmsTable from '../../Tables/AlarmsTable'



function AlarmsTab({
  dryingGroup,
  sensors,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
}) {
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false)
  
  const getAlarms = async () => {
    setLoading(true)
    let date = await requestDataFromAPI(`https://api.smartdrying.io/alarm/get/drying_group/${dryingGroup.id}`);
    setAlarms(date);
    setLoading(false)
  };

  
  useEffect(() => {
    let isMounted = true
    if(isMounted) getAlarms()
    return()=>{isMounted = false}
  }, []);



  return (
    <div>
        {loading ? 
        <CircularLoadingIcon text={'Creating alarms table'}/>
        :
         <>
        {alarms ? 
        <div style={{padding: '3rem 2rem'}}>
            <AlarmsTable alarms={alarms} getAlarms={getAlarms} sensorNameAndIdPairs={sensorNameAndIdPairs} typeNameAndIdPairs={typeNameAndIdPairs} unitNameAndIdPairs={unitNameAndIdPairs} /> 

        </div>
        :
        <p>This project does not have any alarms</p> 
}
        </>   
    }
        
    </div>
  );
}

export default AlarmsTab;
