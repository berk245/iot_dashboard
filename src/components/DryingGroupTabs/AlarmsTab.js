import React, { useState, useEffect } from "react";
import AlarmsTable from '../Tables/AlarmsTable'



function AlarmsTab({
  dryingGroup,
  startStopCriteria,
  sensors,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  operatorNameAndIdPairs,
}) {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const getAlarms = async () => {
      let url = `https://api.smartdrying.io/alarm/get/drying_group/${dryingGroup.id}`;
      let res = await fetch(url);
      res = await res.json();
      setAlarms(JSON.parse(res));
    };

    getAlarms();
  }, []);

  console.log(alarms, alarms == true)


  return (
    <div>
        <AlarmsTable alarms={alarms} sensorNameAndIdPairs={sensorNameAndIdPairs} typeNameAndIdPairs={typeNameAndIdPairs} unitNameAndIdPairs={unitNameAndIdPairs} /> 
    </div>
  );
}

export default AlarmsTab;
