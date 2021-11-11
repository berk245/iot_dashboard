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
        } else setFetchError(true);
      }
      setLoading(false);
    };
    getCriteria();
    return () => {
      isMounted = false;
    };
  }, [dryingGroup]); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = useStyles();
  return (
    <div style={{paddingTop:'2rem'}}>
     
      {criterion ? (
        criterion.map((group, index) => {
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
                />
                {index !== criterion.length - 1 && (
                  <h4 style={{ margin: "1.5rem 2rem", color: "#002884" }}>
                    OR
                  </h4>
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
          //   onClick={() => removeOrBlock(index)}
        >
          Add a New Condition Block
        </Button>
    </div>
  );
}

export default CriteriaTab;
