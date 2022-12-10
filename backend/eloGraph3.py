
# from pprint import pprint
# import matplotlib.pyplot as plt
import numpy as np
import math
import json
import ndjson
import requests
e = math.e


class player:
    def __init__(self, user_name):  # user_name:string
        self.user_name = user_name
        self.elo = 0

    def updateElo(self, x):
        self.elo = x

    def resetRating(self):
        self.elo = 0


def getExports(user, vs):   # token:string, user:player, vs:player
    url = f"https://lichess.org/api/games/user/{user}?vs={vs}&perfType=rapid"
    payload = {}
    headers = {'Accept': 'application/x-ndjson'}

    response = requests.request("GET", url, headers=headers, data=payload)
    items = response.json(cls=ndjson.Decoder)
    games_txt = json.dumps(items)
    games = json.loads(games_txt)
    return games


def dictFilter(games, variant, perf):
    i = 0
    for game in games:
        game_perf = game['perf']
        game_variant = game['variant']
        if not game_variant == variant and game_perf == perf:
            games.pop(i)
            i += 1
        else:
            i += 1
    return games


def assignColor(i, score_sheet, white, user):
    if white == user:
        score_sheet[i, 0] = 1
    return score_sheet


def winLoss(i, score_sheet, games):
    if 'winner' in games[i]:
        if score_sheet[i, 0] == 1 and games[i]['winner'] == 'white':
            score_sheet[i, 1] = 1

        if score_sheet[i, 0] == 0 and games[i]['winner'] == 'black':
            score_sheet[i, 1] = 1

    else:
        score_sheet[i, 1] = 0.5

    return np.round(score_sheet, decimals=2)


def createScoreSheet(games, user):
    variant = 'standard'
    perf = 'rapid'
    filtered_games = dictFilter(games=games, variant=variant, perf=perf)

    num_games = len(filtered_games)
    score_sheet = np.zeros((num_games, 3))

    for i in range(num_games):
        white = filtered_games[i]['players']['white']['user']['id']
        score_sheet = assignColor(
            i=i, score_sheet=score_sheet, white=white, user=user)
        score_sheet = winLoss(
            i=i, score_sheet=score_sheet, games=filtered_games)
    flipped_score_sheet = np.flip(score_sheet)
    return flipped_score_sheet


def invertScoreSheet(array):
    inv = array.copy()
    for i in range(inv.shape[0]):
        inv[i, 2] = 1 - inv[i, 2]
        inv[i, 1] = 1 - inv[i, 1]
    return inv


def calcElo(score_sheet, player_a, player_b):  # score_sheet:np.array [n,3]
    a = score_sheet.copy()
    b = invertScoreSheet(score_sheet)
    k = 32
    a_dists = []
    b_dists = []
    for i in range(score_sheet.shape[0]):
        ra = player_a.elo
        rb = player_b.elo
        Ra = 10**(ra / 400)
        Rb = 10**(rb / 400)
        Ea = (Ra / (Ra + Rb))
        Eb = (Rb / (Rb + Ra))
        Sa = a[i, 1]
        Sb = b[i, 1]
        ra_ = ra + (k * (Sa - Ea))
        rb_ = rb + (k * (Sb - Eb))
        a[i, 0] = ra_
        b[i, 0] = rb_
        player_a.updateElo(ra_)
        player_b.updateElo(rb_)
        a_dist = makeDistribution(ra_)
        b_dist = makeDistribution(rb_)
        a_dists.append(a_dist)
        b_dists.append(b_dist)
    return a, b, a_dists, b_dists


def splitToLists(array):
    color = []
    score = []
    elo = []
    # [
    # color : list[0],
    # score: list[1],
    # elo: list[2]
    # ]
    for i in array[:, 2]:  # color
        color.append(i)
    for i in array[:, 1]:  # score
        score.append(i)
    for i in array[:, 0]:  # elo
        elo.append(i)

    return [color, score, elo]


def makeDistribution(u):
    d = 20
    ys = []
    xs = []
    x_array = np.arange(u-100, u+100, 2)
    for i in x_array:
        y = ((1)/((d)*(math.sqrt(2*math.pi))))*(e**((-(i-u)**2)/(2*(d**2))))
        ys.append(y)
        xs.append(i)
    return xs, ys
