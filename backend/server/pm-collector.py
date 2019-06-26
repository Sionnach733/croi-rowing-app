#!/usr/bin/env python

# This is an example file to show how to make use of pyrow
# Have the rowing machine on and plugged into the computer before starting the program.

from flask import Flask, jsonify
import json
from pyrow import pyrow
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/')
@app.route('/rowers')
def index():
    # Connecting to erg
    ergs = list(pyrow.find())
    if len(ergs) == 0:
        print("No ergs found.")
    else:
        print("number of ergs found: " + str(len(ergs)))

    # Open and prepare file
    write_file = open('workout.json', 'w')
    write_file.write('[\n')
    pmList = []
    for erg in ergs:
        pm = pyrow.PyErg(erg)
        pmInfo = pm.get_erg()
        print("Connected to erg." + pmInfo['mfgid'])
        pmList.append(pm)

    for pm in pmList:
        monitor = pm.get_monitor()
        pmInfo = pm.get_erg()
        # Write data to write_file
        workoutdata = str('{ rower: ' + str(pmInfo['mfgid']) + ", distance: " + str(monitor['distance']) + '},')
        write_file.write(workoutdata + '\n')

    write_file.close()

    with open('workout.json') as f:
        data = json.load(f)
    return jsonify([data])


if __name__ == '__main__':
    app.run(debug=True)

