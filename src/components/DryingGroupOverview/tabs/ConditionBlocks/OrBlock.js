import { Button, makeStyles } from "@material-ui/core";
import React, {useState} from "react";
import AndConditionBlock from "./AndConditionblock";
import AndConditionInput from './AndConditionInput'

const useStyles = makeStyles(() => ({
  orBlockTitle: {
    margin: "1rem auto 1rem 4%",
    "@media (max-width: 1150px)": {
      margin: "0.1rem auto 1rem 4%",
      fontSize: "0.9rem",
    },
  },
  orBlock: {
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
    border: "1px solid #002884c7",
    boxShadow:'none',
    color: "#002884c7",
    background: 'white',
    fontWeight: 600,
    '&:hover':{
      background: "#002884c7",
    color: 'white',
    }
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
  orBlockIndex,
  addAndBlock,
  removeAndBlock
}) {
  const [newAndConditionInput, setNewAndConditionInput] = useState(false)

  const classes = useStyles();
  return (
    <>
      <h4 className={classes.orBlockTitle}>{title}</h4>
      <div className={classes.orBlock}>
        {conditions.map((andCondition, andBlockIndex) => {
          return (
            <div key={andBlockIndex}>
              <AndConditionBlock
                typeNameAndIdPairs={typeNameAndIdPairs}
                unitNameAndIdPairs={unitNameAndIdPairs}
                sensorNameAndIdPairs={sensorNameAndIdPairs}
                operatorNameAndIdPairs={operatorNameAndIdPairs}
                orBlockIndex={orBlockIndex}
                andBlockIndex={andBlockIndex}
                andCondition={andCondition}
                addAndBlock={addAndBlock}
                removeAndBlock={removeAndBlock}
              />

              {andBlockIndex !== conditions.length - 1 && (
                <h5 style={{ margin: "0.75rem auto", color: "#AB003C" }}>
                  AND
                </h5>
              )}
            </div>
          );
        })}
        {newAndConditionInput &&
                <AndConditionInput
                typeNameAndIdPairs={typeNameAndIdPairs}
                unitNameAndIdPairs={unitNameAndIdPairs}
                sensorNameAndIdPairs={sensorNameAndIdPairs}
                operatorNameAndIdPairs={operatorNameAndIdPairs}
                orBlockIndex={orBlockIndex}
                addAndBlock={addAndBlock}
                setNewAndConditionInput={setNewAndConditionInput}
                />
              }
        <Button
          variant="contained"
          className={classes.addNewAndConditionButton}
          onClick={() => {
            if(!newAndConditionInput) setNewAndConditionInput(true)
          }}
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
