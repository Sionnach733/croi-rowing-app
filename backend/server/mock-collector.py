#!/usr/bin/env python

# This is an example file to show how to make use of pyrow
# Have the rowing machine on and plugged into the computer before starting the program.

from flask import Flask, jsonify
from random import randint
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

rower1 = 1000
rower2 = 1000
rower3 = 1000
rower4 = 1000
rower5 = 1000


@app.route('/')
@app.route('/rowers')
def index():
    global rower1
    rower1 += randint(1, 100)
    global rower2
    rower2 += randint(1, 100)
    global rower3
    rower3 += randint(1, 100)
    global rower4
    rower4 += randint(1, 100)
    global rower5
    rower5 += randint(1, 100)

    rowers = [
        {'rower': 1, 'distance': rower1},
        {'rower': 2, 'distance': rower2},
        {'rower': 3, 'distance': rower3},
        {'rower': 4, 'distance': rower4},
        {'rower': 5, 'distance': rower5}
    ]
    return jsonify(rowers)


if __name__ == '__main__':
    app.run(debug=True)
