

//create a chart with 2 distribution graphs
Plotly.newPlot('graph', {
  data: [{
    x: [1, 2, 3],
    y: [2, 1, 3],
    line: {
      color: 'red',
      simplify: false,
    }
  }],
  layout: {
    sliders: [{
      pad: {t: 30},
      x: 0.05,
      len: 0.95,
      currentvalue: {
        xanchor: 'right',
        prefix: 'color: ',
        font: {
          color: '#888',
          size: 20
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
    }]
  }, {
    name: 'green',
    data: [{
      y: [3, 2, 1],
      'line.color': 'green'}]
  }, {
    name: 'blue',
    data: [{
      y: [1, 3, 2],
      'line.color': 'blue'}]
  }]
 }, {showSendToCloud: true});

// create slider using this doc: https://plotly.com/javascript/gapminder-example/



//my data
let elo_data = null
let frame_user = []
let frame_vs = []
let frames = []

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
  for (i = 0; i < response["user_dist"].length; i++) {
    console.log(`creating frame_user...${i}`)
    frame_user.push({
      name: response.user_score[i],
      data: [{
        y: response.user_dist[i][1],
        x: response.user_dist[i][0]
      }]
    })
    console.log(`creating frame_vs...${i}`)
    frame_vs.push({
      name: response.vs_score[i],
      data: [{
        y: response.vs_dist[i][1],
        x: response.vs_dist[i][0]
      }]
    })
  }
  
  console.log(frame_user)
  console.log(frame_vs)
};
