

//create a chart with 2 distribution graphs


// create slider using this doc: https://plotly.com/javascript/gapminder-example/



//my data4r5e333333476yh4gdddddd876u nb 

let frame_user = []
let frame_vs = []
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
  //frames { data:[{x: , y: }] , name: }
  for (i = 0; i < response["user_dist"].length; i++) {
    steps.push({
      label: toString(i+1),
      method: 'animate',
      args: [[toString(i+1)], {
        mode: 'immediate',
        frame: {redraw: false, duration: 500},
        transition: {duration: 500}
      }]
    })


    console.log(`creating frame...${i+1}`)
    frame_user.push({
      name: i+1,
      data: [
        { //user_data
        y: response.user_dist[i][1],
        x: response.user_dist[i][0],
        'line.color': 'blue'
      },
      {  //vs_data
        y: response.vs_dist[i][1],
        x: response.vs_dist[i][0],
        'line.color': 'red'
      }]
    })
  console.log(frame_user);
  console.log(frame_vs);

  //join frame_user and frame_vs in frames

  //plot graph
  
  Plotly.newPlot('graph', {
    data: [{
      x: [1, 2, 3],
      y: [2, 1, 3],
      line: {
        color: 'red',
        smoothing: 1.3,
      }
    },{
      x: [1, 2, 3],
      y: [1, 4, 2],
      line: {
        color: 'blue',
        smoothing: 1.3,
      }
    }],
    layout: {
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
        transition: {duration: 500},
        // By default, animate commands are bound to the most recently animated frame:
        steps: [{
          label: 'red',
          method: 'animate',
          args: [['red'], {
            mode: 'immediate',
            frame: {redraw: false, duration: 500},
            transition: {duration: 500}
          }]
        }, {
          label: 'green',
          method: 'animate',
          args: [['green'], {
            mode: 'immediate',
            frame: {redraw: false, duration: 500},
            transition: {duration: 500}
          }]
        }, {
          label: 'blue',
          method: 'animate',
          args: [['blue'], {
            mode: 'immediate',
            frame: {redraw: false, duration: 500},
            transition: {duration: 500}
          }]
        }]
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
    // The slider itself does not contain any notion of timing, so animating a slider
    // must be accomplished through a sequence of frames. Here we'll change the color
    // and the data of a single trace:
    frames: [{
      name: 'red',
      data: [{
        y: [2, 1, 3],
        'line.color': 'red'
      },{
        y:[1,2,3]
      }]
    }, {
      name: 'green',
      data: [{
        y: [3, 2, 1],
        'line.color': 'green'},{
          y:[3,5,2]
        }]
    }, {
      name: 'blue',
      data: [{
        y: [1, 3, 2],
        'line.color': 'blue'},{
          y:[3,2,1]
        }]
    }]
   }, {showSendToCloud: true});

  };
};
