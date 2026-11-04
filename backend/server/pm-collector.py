#!/usr/bin/env python

# This is an example file to show how to make use of pyrow
# Have the rowing machine on and plugged into the computer before starting the program.

from flask import Flask, jsonify
from pyrow import pyrow
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


# Serial numbers of the monitors, in display order. 3-5 are placeholders until real ergs are added.
ROWER_IDS = ['430391865', '430331314', 3, 4, 5]


class RowerTotal:
    """Running total for one rower that survives the monitor being reset to 0.

    When the monitor's distance goes down, the previous reading is banked so the
    total never drops and new metres keep adding on top.
    """

    def __init__(self, rower_id):
        self.rower_id = rower_id
        self.banked = 0    # distance rowed before the most recent reset(s)
        self.previous = 0  # last reading from the monitor
        self.total = 0

    def update(self, reading):
        if reading < self.previous:
            print("---Rower %s was reset---" % self.rower_id)
            self.banked += self.previous
        self.previous = reading
        self.total = self.banked + reading


totals = {rower_id: RowerTotal(rower_id) for rower_id in ROWER_IDS}
rowers_list = []


@app.route('/')
@app.route('/rowers')
def index():
    for pm in rowers_list:
        monitor = pm.get_monitor()
        pm_info = pm.get_erg()
        rower = totals.get(pm_info['serial'])
        if rower is not None:
            rower.update(monitor['distance'])

    rowers = [{'rower': r.rower_id, 'distance': r.total} for r in totals.values()]

    # Keep a copy on disk in the same format as before
    with open('workout.json', 'w') as write_file:
        write_file.write('[\n')
        write_file.write(',\n'.join(
            '{ "rower": %s, "distance": %s}' % (r['rower'], r['distance']) for r in rowers))
        write_file.write(']\n')

    return jsonify(rowers)


def get_rowers():
    # Connecting to erg
    ergs = list(pyrow.find())
    if len(ergs) == 0:
        print("No ergs found.")
    else:
        print("number of ergs found: " + str(len(ergs)))

    pm_list = []
    for erg in ergs:
        pm = pyrow.PyErg(erg)
        pm_info = pm.get_erg()
        print("Connected to erg." + str(pm_info['serial']))
        pm_list.append(pm)

    return pm_list


if __name__ == '__main__':
    rowers_list = get_rowers()
    app.run(debug=True)

