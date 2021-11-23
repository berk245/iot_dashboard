import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import AndConditionBlock from "./AndConditionblock";

const useStyles = makeStyles(() => ({
  orBlockTitle: {
    margin: "1rem auto 1rem 4%",
    "@media (max-width: 1150px)": {
      margin: "0.1rem auto 1rem 4%",
      fontSize: "0.9rem",
    },
  },
  orGroup: {
    outline: "1px solid #002884",
    borderRadius: "5px",
    padding: "0.5rem 1rem",
    width: "90%",
    margin: "0rem auto",
  },
  addNewAndConditionButton: {
    textTransform: "none",
    margin: "1rem 0 ",
    padding: "0.25rem 1rem",
    background: "#002884c7",
    color: "white",
  },
}));

function OrBlock({
  title,
  conditions,
  operatorNameAndIdPairs,
  sensorNameAndIdPairs,
  typeNameAndIdPairs,
  unitNameAndIdPairs,
  removeOrBlock,
  orBlockIndex
}) {


  const classes = useStyles();
  return (
    <>
      <h4 className={classes.orBlockTitle}>{title}</h4>
      <div className={classes.orGroup}>
        {conditions.map((andCondition, andIndex) => {
          return (
            <div key={andIndex}>
              <AndConditionBlock
                typeNameAndIdPairs={typeNameAndIdPairs}
                unitNameAndIdPairs={unitNameAndIdPairs}
                sensorNameAndIdPairs={sensorNameAndIdPairs}
                operatorNameAndIdPairs={operatorNameAndIdPairs}
                andCondition={andCondition}
              />

              {andIndex !== conditions.length - 1 && (
                <h5 style={{ margin: "0.75rem auto", color: "#AB003C" }}>
                  AND
                </h5>
              )}
            </div>
          );
        })}
        <Button
          variant="contained"
          className={classes.addNewAndConditionButton}
          // onClick={() => openForm(group, index)}
        >
          Add New And Condition
        </Button>
        {conditions && (
          <Button
            variant="outlined"
            style={{
              margin: "1rem 0 ",
              float: "right",
              borderColor: "red",
            }}
            onClick={() => removeOrBlock(orBlockIndex)}
          >
            Remove {title}
          </Button>
        )}
      </div>
    </>
  );
}

export default OrBlock;
