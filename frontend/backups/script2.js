//my data
let elo_data = null
var xhr = null;

getXmlHttpRequestObject = function () {
    if (!xhr) {
        // Create a new XMLHttpRequest object 
        xhr = new XMLHttpRequest();
    }
    return xhr;
};


// event listener.
function sendDataCallback() {
    if (xhr.readyState == 4 && xhr.status == 201) {
        console.log("Data creation response received!");
        const response_data = JSON.parse(xhr.responseText);
        elo_data = response_data
        chartit(elo_data);

    }
  };

//get response from http request
function sendData() {
  const user_name = document.getElementById("user_name").value;
  const vs = document.getElementById("vs").value;
  const my_data = [user_name,vs]
    if (!my_data) {
        console.log("Data is empty.");
        return;
    }
    console.log("Sending data: " + my_data);
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = sendDataCallback;
    // asynchronous requests
    xhr.open("POST", "http://localhost:6969/users", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Send the request over the network
    xhr.send(JSON.stringify({"data": my_data}));
}

//* graphing mechanisim
//* https://www.chartjs.org/docs/latest/getting-started/

function chartit(input_data){
const ctx = document.getElementById('myChart');
console.log('in chart it '+input_data['user_elo'])
new Chart(ctx, {
  type: 'line',
  data: {
    labels: input_data['user_elo'],
    datasets: [{
      label: 'elo',
      data: elo_data.user_elo,
      borderWidth: 1
    }]
  },
  options: {
  }
})};
