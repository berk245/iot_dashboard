import React, { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MultipleLineChartTemplate from "./MultipleLineChart";
import SingleLineChartTemplate from "./SingleLineChart";

const useStyles = makeStyles((theme)=>({
  chartsContainer:{
    marginTop: '5rem'
  }
}))

const datePairs = [
    // Start Time           //End Time
    ["2021-09-28 00:00:00", "2021-09-28 23:59:59"],
    ["2021-09-29 00:00:00", "2021-09-29 23:59:59"],
    ["2021-09-30 00:00:00", "2021-09-30 23:59:00"],
    ["2021-10-01 00:00:00", "2021-10-01 23:59:59"],
    ["2021-10-02 00:00:00", "2021-10-02 23:59:59"],
    ["2021-10-03 00:00:00", "2021-10-03 23:59:59"],
    ["2021-10-04 00:00:00", "2021-10-04 23:59:59"],
    ["2021-10-05 00:00:00", "2021-10-05 23:59:59"],
    ["2021-10-06 00:00:00", "2021-10-06 23:59:59"],
    ["2021-10-07 00:00:00", "2021-10-07 23:59:59"],
    ["2021-10-08 00:00:00", "2021-10-08 23:59:59"],
    ["2021-10-09 00:00:00", "2021-10-09 23:59:59"],
    ["2021-10-10 00:00:00", "2021-10-10 23:59:59"],
    ["2021-10-11 00:00:00", "2021-10-11 23:59:59"],
    ["2021-10-12 00:00:00", "2021-10-12 23:59:59"],
    ["2021-10-13 00:00:00", "2021-10-13 23:59:59"],
    ["2021-10-14 00:00:00", "2021-10-14 23:59:59"],
    ["2021-10-15 00:00:00", "2021-10-15 23:59:59"],
    ["2021-10-16 00:00:00", "2021-10-16 23:59:59"],
    ["2021-10-17 00:00:00", "2021-10-17 23:59:59"],
    ["2021-10-18 00:00:00", "2021-10-18 23:59:59"],
    ["2021-10-19 00:00:00", "2021-10-19 23:59:59"],
  ];


function MeasurementsTab({ dryingGroup }) {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState({
    1:[],
    2:[],
    3:[],
    4:[],
    5:[],
    6:[],
    7:[]
  });
  const [selectedType, setSelectedType] = useState();
  const [loading, setLoading] = useState(true);
  const [datesSelected, setDatesSelected] = useState() 
  const classes = useStyles()

  const getMeasurements = async () => {
    setMeasurements([]);
    let a = [];
    
    datePairs.map(async (pair, index) => {
      let measurement = await makeMeasurementRequest(pair[0], pair[1]);
      a.push(...measurement);
    });

    setTimeout(() => {
      a = diluteByFive(a)
      setMeasurements(a);
      setLoading(false);
    }, 5000);
  };
  const makeMeasurementRequest = async (start_datetime, end_datetime) => {
    let url =
      "https://api.smartdrying.io/measurement/get/drying_group/" +
      dryingGroup.id;
    url += `?&start_datetime="${start_datetime}"`;
    url += `&end_datetime="${end_datetime}"`;

    try {
      let response = await fetch(url);
      response = await response.json();
      return JSON.parse(response);
    } catch (err) {
      console.log("failed: ", url);
      console.log(
        "Error while fetching measurements of drying group id:" + dryingGroup.id
      );
      console.log(err);
    }
  };
  const filterAndSortMeasurementsByType = () => {
    if (measurements.length) {  
      let obj = {...filteredMeasurements}
      for(let i = 1; i < 8; i++){
        let newArr = measurements.filter((m) => m.measurement_type_id === i);
        newArr = formatData(newArr)
        obj[i] = [...newArr]
      }
        setFilteredMeasurements({...obj});

    }
  };

  const getReadableDates = (arr) =>{
      arr.forEach((e) => {
        let date = new Date(e.timestamp)  
        let formatted = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        e.date = formatted
      })
      return arr
  }

  const diluteByFive = (arr) =>{
      console.log('Before' ,arr.length)
      arr = arr.filter((val,index) => !(index%5))
      console.log('After' ,arr.length)
      return arr
  }

  const formatData = (arr) =>{
    arr = sortFilteredMeasurements(arr)
    arr = getReadableDates(arr)
    return arr
  }

  const sortFilteredMeasurements = (arr) => {
    let newArr = arr.sort(function (x, y) {
      return x.timestamp - y.timestamp;
    });
    return newArr;
  };

  useEffect(() => {
    getMeasurements()
  }, [datesSelected]);

  useEffect(() => {
    filterAndSortMeasurementsByType();
  }, [measurements]);

  return (
    <div>
      {loading && (
        <div style={{ margin: 'auto' ,marginTop: "5rem" }}>
          <p>Fetching data...</p>
          <CircularProgress disableShrink></CircularProgress>
        </div>
      )}

      {!loading && (
        <div className={classes.chartsContainer}>
            <MultipleLineChartTemplate data={{data1: filteredMeasurements[1], data2: filteredMeasurements[2]}} title={'Two Lines'}></MultipleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[1]} title={'Unit 1'}></SingleLineChartTemplate>
            <SingleLineChartTemplate data={filteredMeasurements[3]} title={'Unit 3'}></SingleLineChartTemplate>
            {/* <LineChartComponent data={filteredMeasurements[3]} title={3}></LineChartComponent>
            <LineChartComponent data={filteredMeasurements[4]} title={4}></LineChartComponent>
            <LineChartComponent data={filteredMeasurements[5]} title={5}></LineChartComponent>
            <LineChartComponent data={filteredMeasurements[6]} title={6}></LineChartComponent>
            <LineChartComponent data={filteredMeasurements[7]} title={7}></LineChartComponent> */}
        </div>
      )}
    </div>
  );
}

export default MeasurementsTab;
