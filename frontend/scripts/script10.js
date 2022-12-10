

//create a chart with 2 distribution graphs


// create slider using this doc: https://plotly.com/javascript/gapminder-example/



//my data

let frames = []
let steps = []

async function sendData() {
  const user_name = document.getElementById("user_name").value;
  const vs = document.getElementById("vs").value;
  response = await fetch("http://localhost:6969/users", {
  method : "POST",
  body: JSON.stringify({
    user_name : user_name,
    vs: vs
    }),
  headers: {
    "Content-Type" : "application/json;charset=UTF-8"
    }
  }).then(response => response.json());

  console.log(response);
  console.log('data recoeved..')

  // we have our response, update chart

  //create frames for user and vs: 
  //frames[i] = { data:[{x: , y: }] , name: }
  for (i = 0; i < response["user_dist"].length; i++) {
    console.log(typeof(frames))
    // create slider steps and assign them to respetive frames using args
    steps.push({
      label: `${i+1}`,
      method: 'animate',
      args: [[`${i+1}`], {
        mode: 'immediate',
        frame: {redraw: false, duration: 50},
        transition: {duration: 50}
      }]
    })
    
    console.log(`creating frame...${i+1}`)

    //create frames that will be moved to using the sliders, the name will be used to match with args from slider.
    frames.push({ //[game][data/name][user/player][x/y]
      name: `${i+1}`,
      data: [
        { //user_data [0]
        y: response.user_dist[i][1],
        x: response.user_dist[i][0],
        'line.color': 'blue'
      },
      {  //vs_data [1]
        y: response.vs_dist[i][1],
        x: response.vs_dist[i][0],
        'line.color': 'red'
      }]
    })


  //plot graph
  
  Plotly.newPlot('graph', {
    data: [{
      y: frames[0]['data'][0]['y'],
      x: frames[0]['data'][0]['x'],
      line: {
        color: 'blue',
        smoothing: 1.3,
      }
    },{
      y: frames[0]['data'][0]['y'],
      x: frames[0]['data'][0]['x'],
      line: {
        color: 'red',
        smoothing: 1.3,
      }
    }],
    layout: {
      'yaxis': {
        "showgrid": false,
        "zeroline": false
    },
      sliders: [{
        pad: {t: 30},
        x: 0.05,
        len: 0.95,
        currentvalue: {
          xanchor: 'right',
          font: {
            color: '#888',
            size: 10
          }
        },
        transition: {duration: 50},

        steps: steps
    
    }],

      updatemenus: [{
        type: 'buttons',
        showactive: false,
        x: 0.05,
        y: 0,
        xanchor: 'right',
        yanchor: 'top',
        direction: 'left',
        pad: {t: 60, r: 20},
        buttons: [{
          label: 'Play',
          method: 'animate',
          args: [null, {
            fromcurrent: true,
            frame: {redraw: false, duration: 1000},
            transition: {duration: 500}
          }]
        }, {
          label: 'Pause',
          method: 'animate',
          args: [[null], {
            mode: 'immediate',
            frame: {redraw: false, duration: 0}
          }]
        }]
      }]
    },
    // The slider itself does not contain any notion of timing, so animating a slider must be accomplished through a sequence of frames.

    frames: frames
   
   }, {showSendToCloud: true});

  };
};
