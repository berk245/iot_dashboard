import React, {useState, useEffect} from 'react'
// import { makeStyles } from '@material-ui/styles'

export default function DryingGroupOverview({baseURL, dryingGroup}){

    const [sensors, setSensors] = useState([])
    const [measurements, setMeasurements] = useState([])

    //Get Sensors
    const getSensors = async() =>{
        const url = baseURL + '/sensor/get/drying_group/'+dryingGroup.id
        try{
            let response = await fetch(url)
            response = await response.json()
           setSensors(JSON.parse(response))

        }catch(err){
            console.log('Error while fetching sensor data of drying group id:' + dryingGroup.id)
            console.log(err)
        }
    }

    const getMeasurements = async() => {
        const url = baseURL + '/measurement/get/drying_group/'+dryingGroup.id
        try{
            let response = await fetch(url)
            response = await response.json()
            setMeasurements(JSON.parse(response))
            console.log(measurements, 'Measurements')


        }catch(err){
            console.log('Error while fetching measurements of drying group id:' + dryingGroup.id)
            console.log(err)
        }
    }

    useEffect(() => {
        getSensors()
        getMeasurements()
    }, [dryingGroup]);

    //Display Data
    //Get Measurements


    return(
        <>
            <div className="">
                <h3>Drying Group Name:  {dryingGroup.name}</h3>
                <h3>Drying Group ID:  {dryingGroup.id}</h3>
                <h5>Sensors</h5>
                {sensors&&
                    sensors.map((sensor) => {
                        return(
                            <div key={sensor.id}>
                                <button value={sensor.id} onClick={()=> {console.log(sensor.id)}}>{sensor.internal_name} </button>
                                <br />
                                <br />
                            </div>
                            )
                    })
                    
                }
            </div>
        </>
    )
}