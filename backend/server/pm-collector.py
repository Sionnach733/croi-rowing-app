#!/usr/bin/env python

# This is an example file to show how to make use of pyrow
# Have the rowing machine on and plugged into the computer before starting the program.

from flask import Flask, jsonify
from pyrow import pyrow
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


cur_row_1 = 0
prev_row_1 = 0
total_row_1 = 0
total_row_before_rst_1 = 0
row_id_1 = 1

cur_row_2 = 0
prev_row_2 = 0
total_row_2 = 0
total_row_before_rst_2 = 0
row_id_2 = 2

cur_row_3 = 0
prev_row_3 = 0
total_row_3 = 0
total_row_before_rst_3 = 0
row_id_3 = 3

cur_row_4= 0
prev_row_4 = 0
total_row_4 = 0
total_row_before_rst_4 = 0
row_id_4 = 4

cur_row_5 = 0
prev_row_5 = 0
total_row_5 = 0
total_row_before_rst_5 = 0
row_id_5 = 5


@app.route('/')
@app.route('/rowers')
def index():

    global cur_row_5, cur_row_4, cur_row_3, cur_row_2, cur_row_1
    global prev_row_1, prev_row_2, prev_row_3, prev_row_4, prev_row_5
    global row_id_5, row_id_4, row_id_3, row_id_2, row_id_1
    global total_row_1, total_row_2, total_row_3, total_row_4, total_row_5
    global total_row_before_rst_1, total_row_before_rst_2, total_row_before_rst_3, total_row_before_rst_4, total_row_before_rst_5

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
        workoutdata = str('{ rower: ' + str(pmInfo['mfgid']) + ", distance: " + str(monitor['zdistance']) + '},')
        write_file.write(workoutdata + '\n')
        if pmInfo['mfgid'] == row_id_1:
            cur_row_1 = monitor['distance']
            if cur_row_1 < prev_row_1:
                print("---Rower1 was reset---")
                total_row_before_rst_1 = total_row_1
                total_row_1 = total_row_before_rst_1 + cur_row_1
            elif cur_row_1 == prev_row_1 and cur_row_1 < total_row_1:
                print("--rower1 continue after reset---")
                total_row_1 = total_row_before_rst_1 + cur_row_1
            else:
                print("---rower1 normal operation---")
                total_row_before_rst_1 = cur_row_1
                total_row_1 = cur_row_1
            prev_row_1 = cur_row_1

        elif pmInfo['mfgid'] == row_id_2:
            cur_row_2 = monitor['distance']
            if cur_row_2 < prev_row_2:
                print("---Rower2 was reset---")
                total_row_before_rst_2 = total_row_2
                total_row_2 = total_row_before_rst_2 + cur_row_2
            elif cur_row_2 == prev_row_2 and cur_row_2 < total_row_2:
                print("--rower2 continue after reset---")
                total_row_2 = total_row_before_rst_2 + cur_row_2
                total_row_before_rst_2 = cur_row_2
                total_row_2 = cur_row_2
            else:
                print("---rower2 normal operation---")
                total_row_before_rst_2 = cur_row_2
                total_row_2 = cur_row_2
            prev_row_2 = cur_row_2

        elif pmInfo['mfgid'] == row_id_3:
            cur_row_3 = monitor['distance']
            if cur_row_3 < prev_row_3:
                print("---Rower3 was reset---")
                total_row_before_rst_3 = total_row_3
                total_row_3 = total_row_before_rst_3 + cur_row_3
            elif cur_row_3 == prev_row_1 and cur_row_3 < total_row_3:
                print("--rower3 continue after reset---")
                total_row_3 = total_row_before_rst_3 + cur_row_3
            else:
                print("---rower3 normal operation---")
                total_row_before_rst_3 = cur_row_3
                total_row_3 = cur_row_3
            prev_row_3 = cur_row_3

        elif pmInfo['mfgid'] == row_id_4:
            cur_row_4 = monitor['distance']
            if cur_row_4 < prev_row_4:
                print("---Rower4 was reset---")
                total_row_before_rst_4 = total_row_4
                total_row_4 = total_row_before_rst_4 + cur_row_4
            elif cur_row_4 == prev_row_4 and cur_row_4 < total_row_4:
                print("--rower4 continue after reset---")
                total_row_4 = total_row_before_rst_4 + cur_row_4
            else:
                print("---rower4 normal operation---")
                total_row_before_rst_4 = cur_row_4
                total_row_4 = cur_row_4
            prev_row_4 = cur_row_4

        elif pmInfo['mfgid'] == row_id_5:
            cur_row_5 = monitor['distance']
            if cur_row_5 < prev_row_5:
                print("---Rower5 was reset---")
                total_row_before_rst_5 = total_row_5
                total_row_5 = total_row_before_rst_5 + cur_row_5
            elif cur_row_5 == prev_row_5 and cur_row_5 < total_row_5:
                print("--rower5 continue after reset---")
                total_row_5 = total_row_before_rst_5 + cur_row_5
            else:
                print("---rower5 normal operation---")
                total_row_before_rst_5 = cur_row_5
                total_row_5 = cur_row_5
            prev_row_5 = cur_row_5

    write_file.close()

    # with open('workout.json') as f:
    #     data = json.load(f)
    rowers = [
        {'rower': row_id_1, 'distance': total_row_1},
        {'rower': row_id_2, 'distance': total_row_2},
        {'rower': row_id_3, 'distance': total_row_3},
        {'rower': row_id_4, 'distance': total_row_4},
        {'rower': row_id_5, 'distance': total_row_5}
    ]

    return jsonify(rowers)


if __name__ == '__main__':
    app.run(debug=True)

