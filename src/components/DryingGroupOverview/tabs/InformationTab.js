import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import PredictionChart from "../../Charts/Predictionchart";
import { requestDataFromAPI } from "../../../utils";
const useStyles = makeStyles(() => ({
  container: {
      paddingTop: '3rem'
  },
  summaryTable: {
    width: "90%",
    margin: 'auto',
    marginBottom: '2rem',
    outline: '1px solid #dedede',
    borderRadius: '5px'
  },
  infoLine: {
    width: "90%%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-around",
    padding: "0.75rem",
    borderBottom: "1px solid silver",
    fontSize: "0.9rem",
  },
}));

function InformationTab({ dryingGroup, dryingTypes }) {
  const [dryingType, setDryingType] = useState("");
  const [predictionData, setPredictionData] = useState([])
  useEffect(() => {
    let isMounted = true  
    const setReadableDryingType = () => {
      if(dryingTypes){dryingTypes.map((type) => {
        if (type.id === dryingGroup.drying_type_id) {
          setDryingType(type.drying_type.toUpperCase());
        }
      });}
    };
    setReadableDryingType();
    return() =>{
        isMounted = false
    }
  }, []);
  const getPredictionData = async() => {
    let url =
    `https://api.smartdrying.io/dry_prediction/get/drying_group/${dryingGroup.id}`

    let result = await requestDataFromAPI(url)
    console.log(result)
    // setPredictionData(result)
  }
  useEffect(()=>{
    let isMounted = true
    if(isMounted) getPredictionData()

    return() => {isMounted = false}
  }, [dryingGroup])
  

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.summaryTable}>
        <div className={classes.infoLine}>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ Description:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingGroup.description}
            </span>
          </span>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ Start Date:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingGroup.start_date}
            </span>
          </span>
        </div>
        <div className={classes.infoLine}>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ ID:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingGroup.id}
            </span>
          </span>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ Drying Type:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingType}
            </span>
          </span>
        </div>
        <div className={classes.infoLine}>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ Location:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingGroup.location_id}
            </span>
          </span>
          <span style={{ fontWeight: "600", flexBasis: "45%" }}>
            ∘ Difficulty Score:
            <span style={{ fontWeight: "400", paddingLeft: "0.5rem" }}>
              {dryingGroup.difficulty_score}
            </span>
          </span>
        </div>
      </div>
      <div style={{width:'60%', margin: 'auto'}}>
        {predictionData ?
        <PredictionChart predictionData={predictionData}/>:
        <p>No predictions available for this drying group at the moment.</p>
        
      }
      </div>
    </div>
  );
}

export default InformationTab;
