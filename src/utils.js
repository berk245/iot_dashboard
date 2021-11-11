
  const requestDataFromAPI = async (url) => {
    try {
      let res = await fetch(url);
      if(res.ok){
        let data = await res.json();
        return(JSON.parse(data));
      }else{
        return false
      }  
    } catch (err) {
      console.log("Error while fetching: ", url);
      console.log(err);
      return false;
    }
  }


export {requestDataFromAPI};
