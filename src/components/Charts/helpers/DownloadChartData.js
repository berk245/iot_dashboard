function DownloadChartData(data) {

    let rows = []

    rows.push(['Name', 'Title2'])

    data.map((measurement) => {
        rows.push([measurement.name, measurement.cost])
    })

    console.log(rows)

    let csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".

}

export default DownloadChartData
