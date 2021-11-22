import React,{useState, useEffect} from "react";
import {helpers} from './TabHelpers'
import TabSelector from "./TabSelector";
import InformationTab from './InformationTab'
import AlarmsTab from './AlarmsTab'
import CriteriaTab from './CriteriaTab'
import MeasurementsTab from './MeasurementsTab'
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  tabContent:{
    width: '95%',
    margin: 'auto',
    borderWidth: "0 1px 1px 1px",
    border: "solid darkgray",
    marginBottom:'1rem',
    borderRadius: '0 0 5px 5px'
  }
}))

function Tabs({
  dryingGroup,  
  sensors,
  measurementUnits,
  measurementTypes,
  operators,
  dryingTypes,
}) {
    const [sensorNameAndIdPairs, setSensorNameAndIdPairs] = useState()
    const [typeNameAndIdPairs, setTypeNameAndIdPairs] = useState()
    const [unitNameAndIdPairs, setUnitNameAndIdPairs] = useState()
    const [operatorNameAndIdPairs, setOperatorNameAndIdPairs] = useState()
    const [selectedTab, setSelectedTab] = useState('Information')

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            setSensorNameAndIdPairs(helpers.createSensorIdAndNamePairs(sensors));
            setTypeNameAndIdPairs(helpers.createTypeNameAndIdPairs(measurementTypes));
            setUnitNameAndIdPairs(helpers.createUnitNameAndIdPairs(measurementUnits));
            setOperatorNameAndIdPairs(helpers.createOperatorNameAndIdPairs(operators));
        }
        return ()=> {isMounted = false}
      }, []);
  const classes = useStyles()
  return <div>
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <div className={classes.tabContent}>
        {selectedTab === "Information" && (
          <InformationTab
            dryingGroup={dryingGroup}
            dryingTypes={dryingTypes}
          ></InformationTab>
        )}
        {selectedTab === "Sensors and Measurements" && (
          <MeasurementsTab
            dryingGroup={dryingGroup}
            sensors={sensors}
            measurementTypes={measurementTypes}
            measurementUnits={measurementUnits}
          ></MeasurementsTab>
        )}
        {selectedTab === "Stop/Start Criterion" && (
          <CriteriaTab
            dryingGroup={dryingGroup}
            sensors={sensors}
            sensorNameAndIdPairs= {sensorNameAndIdPairs}
            typeNameAndIdPairs= {typeNameAndIdPairs}
            unitNameAndIdPairs= {unitNameAndIdPairs}
            operatorNameAndIdPairs= {operatorNameAndIdPairs}
            
          ></CriteriaTab>
        )}
        {selectedTab === "Alarms" && (
          <AlarmsTab
            dryingGroup={dryingGroup}
            sensors={sensors}
            sensorNameAndIdPairs= {sensorNameAndIdPairs}
            typeNameAndIdPairs= {typeNameAndIdPairs}
            unitNameAndIdPairs= {unitNameAndIdPairs}
            operatorNameAndIdPairs= {operatorNameAndIdPairs}
          ></AlarmsTab>
        )}
      </div>
  </div>
}

export default Tabs;
