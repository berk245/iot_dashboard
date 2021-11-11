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
  useEffect(() => {
    let isMounted = true
    const getAlarms = async () => {
      setLoading(true)
      let date = await requestDataFromAPI(`https://api.smartdrying.io/alarm/get/drying_group/${dryingGroup.id}`);
      if(isMounted) setAlarms(date);
      setLoading(false)
    };

    getAlarms();
    return()=>{isMounted = false}
  }, []);

  console.log(alarms, alarms == true)


  return (
    <div>
        {loading ? 
        <CircularLoadingIcon text={'Creating alarms table'}/>
        :
         <>
        {alarms ? 
        <div style={{padding: '3rem 2rem'}}>
            <AlarmsTable alarms={alarms} sensorNameAndIdPairs={sensorNameAndIdPairs} typeNameAndIdPairs={typeNameAndIdPairs} unitNameAndIdPairs={unitNameAndIdPairs} /> 

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
