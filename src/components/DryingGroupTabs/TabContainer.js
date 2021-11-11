import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoTab from "./InfoTab";
import MeasurementsTab from "./MeasurementsTab";
import CriteriaTab from "./CriteriaTab";
import AlarmsTab from "./AlarmsTab";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    margin: "2rem 0",
    borderWidth: "0 0.5px 0.5px 0.5px",
    border: "solid silver",
    overflow: "hidden",
  },
  tabBar: {
    display: "flex",
  },
  singleTab: {
    padding: "1rem",
    borderWidth: "1px 0 1px 1px",
    border: "solid #3F50B5",
    flexBasis: "20%",
    background: "#f0f0f0",
    cursor: "pointer",
    "&:hover": {
      background: "#e2e2e2",
    },
    textAlign: "center",
  },
  selectedTab: {
    padding: "1rem",
    borderWidth: "1px 0 1px 1px",
    border: "solid #3F50B5",
    flexBasis: "20%",
    background: "white",
    borderBottom: "none",
    fontWeight: 600,
    textAlign: "center",
    cursor: "default",
  },
  tabContent: {},
}));

function TabContainer({
  dryingGroup,
  sensors,
  dryingTypes,
  measurementTypes,
  measurementUnits,
  measurementOperators
}) {
  const [selectedTab, setSelectedTab] = useState("info");
  const [sensorNameAndIdPairs, setSensorNameAndIdPairs] = useState()
  const [typeNameAndIdPairs, setTypeNameAndIdPairs] = useState()
  const [unitNameAndIdPairs, setUnitNameAndIdPairs] = useState()
  const [operatorNameAndIdPairs, setOperatorNameAndIdPairs] = useState()


  useEffect(() => {
    const createSensorIdAndNamePairs = () => {
        let result = {}
        sensors.map((sensor)=> {
            result[sensor.id] = sensor.internal_name
        })
        setSensorNameAndIdPairs(result)
    }
    const createTypeNameAndIdPairs = () => {
        let result = {}
        measurementTypes.map((measurementType)=> {
            result[measurementType.id] = measurementType.name
        })
        setTypeNameAndIdPairs(result)
    }
    const createUnitNameAndIdPairs = () => {
        let result = {}
        measurementUnits.map((unit)=> {
            result[unit.measurement_type_id] = unit.name
        })
        setUnitNameAndIdPairs(result)
    }
    const createOperatorNameAndIdPairs = () => {
        let result = {}
        measurementOperators.map((operator)=> {
            result[operator.id] = operator.operator
        })
        setOperatorNameAndIdPairs(result)
    }
    createSensorIdAndNamePairs();
    createTypeNameAndIdPairs();
    createUnitNameAndIdPairs();
    createOperatorNameAndIdPairs();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.tabBar}>
        <div
          className={
            selectedTab == "info" ? classes.selectedTab : classes.singleTab
          }
          onClick={() => {
            setSelectedTab("info");
          }}
        >
          Information
        </div>
        <div
          className={
            selectedTab == "measurements"
              ? classes.selectedTab
              : classes.singleTab
          }
          style={{ flexBasis: "30%" }}
          onClick={() => {
            setSelectedTab("measurements");
          }}
        >
          Sensors & Measurements
        </div>
        <div
          className={
            selectedTab == "criterion" ? classes.selectedTab : classes.singleTab
          }
          style={{ flexBasis: "30%" }}
          onClick={() => {
            setSelectedTab("criterion");
          }}
        >
          Stop/Start Criterion
        </div>
        <div
          className={
            selectedTab == "alarms" ? classes.selectedTab : classes.singleTab
          }
          onClick={() => {
            setSelectedTab("alarms");
          }}
        >
          Alarms
        </div>
      </div>
      <div className={classes.tabContent}>
        {selectedTab === "info" && (
          <InfoTab
            dryingGroup={dryingGroup}
            dryingTypes={dryingTypes}
          ></InfoTab>
        )}
        {selectedTab === "measurements" && (
          <MeasurementsTab
            dryingGroup={dryingGroup}
            sensors={sensors}
            measurementTypes={measurementTypes}
            measurementUnits={measurementUnits}
          ></MeasurementsTab>
        )}
        {selectedTab === "criterion" && (
          <CriteriaTab
            dryingGroup={dryingGroup}
            sensors={sensors}
            sensorNameAndIdPairs= {sensorNameAndIdPairs}
            typeNameAndIdPairs= {typeNameAndIdPairs}
            unitNameAndIdPairs= {unitNameAndIdPairs}
            operatorNameAndIdPairs= {operatorNameAndIdPairs}
            
          ></CriteriaTab>
        )}
        {selectedTab === "alarms" && (
          <AlarmsTab
            dryingGroup={dryingGroup}
            startStopCriteria={startStopCriteria}
            sensors={sensors}
            sensorNameAndIdPairs= {sensorNameAndIdPairs}
            typeNameAndIdPairs= {typeNameAndIdPairs}
            unitNameAndIdPairs= {unitNameAndIdPairs}
            operatorNameAndIdPairs= {operatorNameAndIdPairs}
          ></AlarmsTab>
        )}
      </div>
    </div>
  );
}

export default TabContainer;
