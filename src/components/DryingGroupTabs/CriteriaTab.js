import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";



const useStyles = makeStyles(() => ({
  orGroup: {
    outline: "1px solid #002884",
    borderRadius: "5px",
    padding: "0.5rem 1rem",
    width: "90%",
    margin: "1rem auto",
  },
  thresholdValue: {
    margin: "1rem 0.5rem",
    width: "25%",
  },
  completeAndCondition: {
    border: "1px solid silver",
    padding: "0.25rem 0.5rem",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    display: "flex",
    flexWrap: 'wrap',
    justifyContent: "space-between",
    alignItems: "center",
  
  },
  
  cellTitle:{
    fontWeight: 600,
  },
  removeButton: {
    textTransform: "none",
    padding: "0.15rem 0.5rem",
    fontSize: "0.8rem",
    "&:hover": {
      background: "gray",
      color: "white",
    },
  },
  addNewAndConditionButton: {
    textTransform: "none",
    margin: "1rem 0 ",
    padding: "0.25rem 1rem",
    background: "#002884c7",
    color: "white",
  },
}));

function CriteriaTab({
  dryingGroup,
  startStopCriteria,
  sensors,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  operatorNameAndIdPairs
}) {
  const [noCriteria, setNoCriteria] = useState(false);
  const [criterion, setCriterion] = useState([]);

  useEffect(() => {
    const extractAndSetCriteriaArray = () => {
      try {
        let cond = JSON.parse(startStopCriteria[0].condition);
        setCriterion(cond.or);
      } catch {
        console.log("Error while extracting stop/start conditions");
      }
    };
    extractAndSetCriteriaArray();
  }, [dryingGroup]); // eslint-disable-line react-hooks/exhaustive-deps


  const classes = useStyles();
  return (
    <div>
      <div style={{ margin: "1rem 2rem" }}>
        <h4>Stop/Start Criterion</h4>
        <hr />
      </div>
      {criterion.length ?
        criterion.map((group, index) => {
          return (
            <>
              <div key={index} className={classes.orGroup}>
                {group.and.map((andCondition, andIndex) => {
                  return (
                    <>
                      <div
                        key={andIndex}
                        className={classes.completeAndCondition}
                      >
                        <div>
                          <p style={{ fontWeight: "600" }}> Sensor Id</p>
                          <p>{andCondition.sensor_id}</p>
                        </div>
                        <div>
                          <p style={{ fontWeight: "600" }}> Sensor Name</p>
                          <p>{sensorNameAndIdPairs[andCondition.sensor_id]}</p>
                        </div>
                        <div>
                          <p style={{ fontWeight: "600" }}> Measurement Type</p>
                          <p>
                            {
                              typeNameAndIdPairs[
                                andCondition.measurement_type_id
                              ]
                            }
                          </p>
                        </div>
                        <div>
                          <p style={{ fontWeight: "600" }}> Condition</p>
                          <p>{operatorNameAndIdPairs[andCondition.operator_id]} {andCondition.threshold} </p>
                        </div>
                        <div>
                          <p style={{ fontWeight: "600" }}> Unit</p>
                          <p>{unitNameAndIdPairs[andCondition.measurement_unit_id]}</p>
                        </div>
                        <div>
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.removeButton}
                            //   onClick={() => removeCondition(index, andIndex)}
                          >
                            Remove
                          </Button>

                        </div>
                        
                      </div>

                      {andIndex !== group.and.length - 1 && (
                        <h5
                          style={{ margin: "0.75rem auto", color: "#AB003C" }}
                        >
                          AND
                        </h5>
                      )}
                    </>
                  );
                })}
                <Button
                  variant="contained"
                  className={classes.addNewAndConditionButton}
                  // onClick={() => openForm(group, index)}
                >
                  Add New And Condition
                </Button>
                {!group.and.length && (
                  <Button
                    variant="outlined"
                    style={{
                      margin: "1rem 0 ",
                      float: "right",
                      borderColor: "red",
                    }}
                    //   onClick={() => removeOrBlock(index)}
                  >
                    Remove Or Block
                  </Button>
                )}
              </div>
              {index !== criterion.length - 1 && (
                <h4 style={{ margin: "1.5rem 2rem", color: "#002884" }}>OR</h4>
              )}
            </>
          );
        }):
        <p style={{padding:'1rem 2rem'}}>This project does not have any stop/start crtierion</p>
        }
    </div>
  );
}

export default CriteriaTab;
