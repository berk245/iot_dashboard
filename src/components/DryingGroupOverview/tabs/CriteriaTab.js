import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { requestDataFromAPI } from "../../../utils";
import { helpers } from "./TabHelpers";

import OrBlock from "./ConditionBlocks/OrBlock";
import CircularLoadingIcon from "../../CircularLoadingIcon";

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
  const [criterionId, setCriterionId] = useState([]);
  const [criterionToUpdate, setCriterionToUpdate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noStopCriteria, setNoStopCriteria] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const getCriteria = async () => {
    setLoading(true);
    let criteria = await requestDataFromAPI(
      `https://api.smartdrying.io/dry_threshold/get/drying_group/${dryingGroup.id}`
    );
    try {
      if (Array.isArray(criteria)) {
        let arr = helpers.extractAndSetCriteriaArray(criteria);
        setCriterion(arr);
        setCriterionId(criteria[0].id);
        setCriterionToUpdate(arr);
      } else setFetchError(true);
    } catch {
      setNoStopCriteria(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if(isMounted) getCriteria();

    return () => {
      isMounted = false;
    };
  }, [dryingGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNewOrBlock = () => {
    let arr = JSON.parse(JSON.stringify(criterionToUpdate));
    arr.push({ and: [] });
    setCriterionToUpdate(arr);
  };

  const removeOrBlock = (index) => {
    let arr = JSON.parse(JSON.stringify(criterionToUpdate));
    arr.splice(index, 1);
    setCriterionToUpdate(arr);
  };

  const addAndBlock = (orBlockIndex, newAndBlock) => {
    let arr = JSON.parse(JSON.stringify(criterionToUpdate));

    arr[orBlockIndex].and.push(newAndBlock);
    setCriterionToUpdate(arr);
  };

  const removeAndBlock = (orBlockIndex, andBlockIndex) => {
    let arr = JSON.parse(JSON.stringify(criterionToUpdate));

    arr[orBlockIndex].and.splice(andBlockIndex, 1);
    setCriterionToUpdate(arr);
  };

  const submitNewConditions = async () => {
    let { project_id, location_id, id } = dryingGroup;
    let requestBody = {
      project_id: Number(project_id),
      location_id: Number(location_id),
      drying_group_id: Number(id),
      condition: { or: criterionToUpdate },
    };
    try {
      if (noStopCriteria) {
        let response = await fetch(
          "https://api.smartdrying.io/dry_threshold/add",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        response = await response.json();
        console.log(response);
      } else {
        //Send update request
        let deleteConditionsFirst = await fetch(
          `https://api.smartdrying.io/dry_threshold/remove/${criterionId}`
        );
        if (!deleteConditionsFirst.ok) {
          alert("Problem with deletion");
          return;
        }
        let response = await fetch(
          "https://api.smartdrying.io/dry_threshold/add",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (response.ok) {
          console.log("Success");
          getCriteria()
        }
      }
    } catch (err) {
      console.log(err);
      setFetchError(true);
    }
  };

  const classes = useStyles();
  return (
    <div style={{ paddingTop: "2rem" }}>
      {loading ? (
        <CircularLoadingIcon text={"Getting conditions"} />
      ) : (
        <>
          {criterion ? (
            criterionToUpdate.map((group, index) => {
              return (
                <div key={index}>
                  <div>
                    <OrBlock
                      title={`Condition Block ${index + 1}`}
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
                      <h3
                        style={{
                          width: "92%",
                          fontWeight: 600,
                          margin: "1.5rem auto",
                          color: "#002884",
                        }}
                      >
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

          {JSON.stringify(criterion) !== JSON.stringify(criterionToUpdate) ? (
            <div className={classes.submitSection}>
              <Button variant="outlined" onClick={submitNewConditions}>
                Submit Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCriterionToUpdate(criterion)}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default CriteriaTab;
