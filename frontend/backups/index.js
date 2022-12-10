const { response } = require('express');
const express = require('express');
const fetch = require('node-fetch'); //fetch is client side, this is server side.
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const api_url = `https://lichess.org/api/games/user/fathergoat?vs=ughman&?perfType=rapid`

const myHeaders = { Accepted : 'application/json'}

const requestOptions = { //set params
  method: 'GET',
  headers: myHeaders,
};


app.get('/game_record', async(request, response) => {
    try {
        console.log('get function active');
        let response_get = await fetch(api_url,requestOptions);
        console.log('response is' + response_get);
        
    }
    catch (error) {
        console.error(error);
    }
});


// fetch( api_url , requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));