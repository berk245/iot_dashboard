export const helpers = {
    createSensorIdAndNamePairs: (sensors) => {
        let result = {}
        try{sensors.map((sensor)=> {
            return result[sensor.id] = sensor.internal_name
        })}catch{

        }
        return(result)
    },
    createTypeNameAndIdPairs: (types) => {
        let result = {}
        try{types.map((type)=> {
            return result[type.id] = type.name
        })}catch{

        }
        return(result)
    },
    createUnitNameAndIdPairs : (units) => {
        let result = {}
        try{units.map((unit)=> {
            return result[unit.measurement_type_id] = unit.name
        })}catch{

        }
        return(result)
    },
    createOperatorNameAndIdPairs : (operators) => {
        let result = {}
        try{operators.map((operator)=> {
            return result[operator.id] = operator.operator
        })}catch{
            
        }
        return(result)
    },
    extractAndSetCriteriaArray: (arr) => {
        try {
          let cond = JSON.parse(arr[0].condition);
          return cond.or;
        } catch {
          console.log("Error while extracting stop/start conditions");
        }
    }
}


