//path to data csv file
const data_path = "./data/data.csv";

// Do everything here
async function start() {
  //gets the csv file
  const response = await fetch(data_path);
  let text = await response.text();

  //see functions.js to see how this works
  //converts cvs file to array of objects - felxible
  let data = convert(text);

  //program starts here
  upload_data(data);
}

//call driver function
start();
