import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { requestDataFromAPI } from "../../../utils";
import { helpers } from "./TabHelpers";

import OrBlock from "./ConditionBlocks/OrBlock";

const useStyles = makeStyles(() => ({}));

function CriteriaTab({
  dryingGroup,
  sensors,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  operatorNameAndIdPairs,
}) {
  const [criterion, setCriterion] = useState([]);
  const [criterionToUpdate, setCriterionToUpdate] = useState([])
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getCriteria = async () => {
      setLoading(true);
      let criteria = await requestDataFromAPI(
        `https://api.smartdrying.io/dry_threshold/get/drying_group/${dryingGroup.id}`
      );
      if (isMounted) {
        if (Array.isArray(criteria)) {
          let arr = helpers.extractAndSetCriteriaArray(criteria);
          setCriterion(arr);
          setCriterionToUpdate(arr)
        } else setFetchError(true);
      }
      setLoading(false);
    };
    getCriteria();
    return () => {
      isMounted = false;
    };
  }, [dryingGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNewOrBlock = () => {
    let arr = [...criterionToUpdate]
    arr.push({and: []})
    setCriterionToUpdate(arr)
  }

  const removeOrBlock = (index) =>{
    let arr = [...criterionToUpdate]
    arr.splice(index,1)
    setCriterionToUpdate(arr)
  }

  const addAndBlock = (orBlockIndex) => {
    let arr = [...criterionToUpdate]
    console.log(arr)
    // arr[orBlockIndex].and
  }

  const removeAndBlock = (orBlockIndex, andBlockIndex) => {
    let arr = [...criterionToUpdate]
    arr[orBlockIndex].and.splice(andBlockIndex,1)
    setCriterionToUpdate(arr)
  }


  
  const classes = useStyles();
  return (
    <div style={{paddingTop:'2rem'}}>
     
      {criterion ? (
        criterionToUpdate.map((group, index) => {
          return (
            <div key={index}>
              <div>
                <OrBlock
                  title={`Condition Block ${index+1}`}  
                  conditions={group.and}
                  typeNameAndIdPairs={typeNameAndIdPairs}
                  unitNameAndIdPairs={unitNameAndIdPairs}
                  sensorNameAndIdPairs={sensorNameAndIdPairs}
                  operatorNameAndIdPairs={operatorNameAndIdPairs}
                  removeOrBlock={removeOrBlock}
                  orBlockIndex={index}
                  addAndBlock={addAndBlock}
                  removeAndBlock={removeAndBlock}
                />
                {index !== criterionToUpdate.length - 1 && (
                  <h3 style={{ width: '92%', fontWeight:600, margin: "1.5rem auto", color: "#002884" }}>
                    OR
                  </h3>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ padding: "1rem 2rem" }}>
          This project does not have any stop/start crtierion
        </p>
      )}
      <Button
          variant="outlined"
          style={{
            margin: "1rem auto 2rem 4%",
            borderColor: "rgb(171, 0, 60)",
          }}
          onClick={() => addNewOrBlock()}
        >
          Add a New Condition Block
        </Button>


        {JSON.stringify(criterion) !== JSON.stringify(criterionToUpdate) ? 
        <div className={classes.submitSection}>
        
        <Button  variant='outlined'>
          Submit Changes
        </Button>
        <Button variant='outlined' onClick={() => setCriterionToUpdate(criterion)}>
          Cancel
        </Button>
        </div>
        :
        null  
      }
    </div>
  );
}

export default CriteriaTab;
