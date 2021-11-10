export const timeConverter = (unix_timestamp) => {

    var a = new Date(unix_timestamp * 1000);
    var year = a.getFullYear();
    var month = '0' + a.getMonth();
    var date = '0' + a.getDate();
    var hour = a.getHours();
    var min = '0' + a.getMinutes();
    var sec = '0' + a.getSeconds();
    var time = {date: date.substr(-2) + '/' + month.substr(-2) + '/' + year,
                time: hour + ':' + min.substr(-2) + ':' + sec.substr(-2) }
    return time;

}