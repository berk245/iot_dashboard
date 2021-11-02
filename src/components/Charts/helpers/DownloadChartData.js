function DownloadChartData(data) {

  let headers = Object.keys(data[0])

  console.log(headers);


 let rows = [[...headers]]

 data.map((m) => {
     let singleRow = []
     headers.forEach(header =>{
        singleRow.push(m[header])
     })
     rows.push(singleRow)
 })




  let csvContent = "data:text/csv;charset=utf-8,"
  + rows.map(e => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
}

export default DownloadChartData;
