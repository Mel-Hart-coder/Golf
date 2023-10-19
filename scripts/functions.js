//translates csv file into raw text
function translate_data(text) {
  //converts text object to string
  text = JSON.stringify(text);

  //data palceholder
  let data = "";

  //used to build text
  let check = false;

  //used to count number of rows in csv file
  let row = 0;

  //builds text
  for (let i = 1; i < text.length - 1; i++) {
    if ((text[i] === "r" || text[i] === "n") && check) {
      if (text[i] === "n") {
        data += ",";
        row++;
      }
      continue;
    }
    if (text[i] === "\\") {
      check = true;
      continue;
    } else {
      check = false;
    }
    data += text[i];
  }

  //returns text - data
  //returns row count - row+1
  return [data, row + 1];
}

//converts raw text to 2D array
function convert_to_array(text, rows) {
  //splits text into arrays
  text = text.split(",");

  //calculate num of columns
  col = text.length / rows;

  //placeholder array
  array = [];

  //placeholder 2D array
  two_D_array = [];

  for (let i = 0; i < text.length; i++) {
    if ((i + 1) % col == 0) {
      //add data to the 1D array
      array.push(text[i]);

      //add the array to a 2D array
      two_D_array.push(array);

      //clear 1D array
      array = [];
    } else {
      //add data to the 1D array
      array.push(text[i]);
    }
  }

  //Returns the data as a 2D array
  return two_D_array;
}

//converts 2D array to array of objects
function convert_array_json(array) {
  //placeholder array
  data = [];

  //get keys
  key = array[0];

  //removes the key array
  array.shift();

  //let v be every 1D array in the 2D array (named array)
  array.forEach((v) => {
    //create an empty object
    let obj = {};

    //add the key and value to the object
    for (let i = 0; i < key.length; i++) obj[key[i]] = v[i];

    //push the object to the array
    data.push(obj);
  });

  //return the array of objects
  return data;
}

function sort_data(data) {
  data.sort(function (a, b) {
    const typeA = a.type.toUpperCase(); // ignore upper and lowercase
    const typeB = b.type.toUpperCase(); // ignore upper and lowercase

    // sort in an ascending order
    if (typeA < typeB) {
      return -1;
    }
    if (typeA > typeB) {
      return 1;
    }
  });

  return data;
}

function convert(data) {
  //data - contents of a csv file

  //translates csv file into raw text
  data = translate_data(data);

  //converts raw text to 2D array
  data = convert_to_array(data[0], data[1]);

  //converts 2D array to array of objects
  data = convert_array_json(data);

  //sort the data based on type
  data = sort_data(data);

  //return array of objects
  return data;
}

function openLab(evt, lab) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(lab).style.display = "block";
  evt.currentTarget.className += " active";
}

function get_column(author, index, link) {
  return (
    '<div class="col-4">' +
    '<div class="card bg-light text-dark">' +
    '<img class="card-img-top" src="' +
    "./images/" +
    (index + 1) +
    ".jpeg" +
    '" alt="Card image">' +
    "<p><a href = " +
    link +
    ">" +
    author +
    "'s Game" +
    "</a></p>" +
    "</div>" +
    "</div>"
  );
}

function upload_data(data) {
  let html = "";
  let t = "";
  let t_count = 0;
  let row = '<div class="row mt-3">';
  $(function () {
    $.each(data, function (index) {
      if (index == 0) {
        //starting element
        t = data[index].type;
        html += row + get_column(data[index].author, index, data[index].link);
        t_count++;
      } else if (t != data[index].type) {
        //go to next section
        t = data[index].type;
        html += "</div>";
        //finish previous section
        $("#" + data[index - 1].type).append(html);
        //start current section
        html = "";
        html += row + get_column(data[index].author, index, data[index].link);
        t_count = 1;
      } else {
        //add each column and row
        if (t_count % 3 == 0) {
          html += "</div>" + row;
        }
        html += get_column(data[index].author, index, data[index].link);
        t_count++;
      }
      if (index === data.length - 1) {
        //ending element
        $("#" + data[index].type).append(html);
      }
    });
  });
}
