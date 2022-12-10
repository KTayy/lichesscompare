from flask import Flask, request
import flask
import json
from flask_cors import CORS
import eloGraph3 as eloGraph
from scret import secrets
import requests
# py -m pip install requests
# activate venv : venv\Scripts\activate

li_token = secrets.get('li_token')

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route('/users', methods=["GET", "POST"])
def users():
    print("users endpoint reached...")
    if request.method == "GET":
        print('*no get method yet*')

    if request.method == "POST":
        received_data = request.get_json()
        print(f"received data: {received_data}",
              " data of typeL: ", type(received_data))
        # what to do with incoming data, check eloGraph docs for details...

        user_name = received_data['user_name']
        vs = received_data['vs']
        print('compare', user_name, vs, '...')

        # get data from lichess databse

        url = f"https://lichess.org/api/games/user/{user_name}?vs={vs}&perfType=rapid"
        payload = {}
        headers = {
            'Accept': 'application/x-ndjson'
        }
        response = requests.request("GET", url, headers=headers, data=payload)

        print(response.text)

        token = li_token
        user = eloGraph.player(user_name)
        vs = eloGraph.player(vs)

        games = eloGraph.getExports(
            user=user.user_name, vs=vs.user_name)

        score_sheet = eloGraph.createScoreSheet(
            games=games, user=user.user_name)

        user_score, vs_score, user_dist, vs_dist = eloGraph.calcElo(
            score_sheet, user, vs)

        # * convery user_score and vs_score from numpy arrays to 3 lists each.
        # [
        #     "user_color":
        #     "user_score":
        #     "user_elo":
        #     "vs_color":
        #     "vs_score":
        #     "vs_elo":
        #     "user_dist":
        #     "vs_dist":
        #  ]
        # * send to front end...

        user_lists = eloGraph.splitToLists(user_score)
        vs_lists = eloGraph.splitToLists(vs_score)
        print(user_score)
        return_data = {
            "status": "success",
            "message": f"received: {user_name, vs}",
            "user_color": user_lists[0],
            "user_score": user_lists[1],
            "user_elo": user_lists[2],
            "vs_color": vs_lists[0],
            "vs_score": vs_lists[1],
            "vs_elo": vs_lists[2],
            "user_dist": user_dist,
            "vs_dist": vs_dist
        }
        print(return_data["user_score"])

        return flask.Response(response=json.dumps(return_data), status=201)


if __name__ == "__main__":
    app.run("localhost", 6969)
