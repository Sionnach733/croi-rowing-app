# Croi-rowing-app
App to display live info of rowing 1 million metres for charity. Will display current distance of each rower, as well as total. Also will show map of Ireland and virtual rowing progress along the river Shannon. If the target is achieved, we will need to row the full length of the shannon almost 3 times!

## Requirements
- Node.js 20.19+ (any current LTS) and npm
- Python 3.10+

## Backend
```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd server
python mock-collector.py   # simulated rowers, no hardware needed
# or
python pm-collector.py     # real Concept2 PM3/PM5 monitors over USB
```
Both serve `http://127.0.0.1:5000/rowers`.

Run the backend tests (from `backend/`):
```sh
pip install -r requirements-dev.txt
pytest
```

## UI
To use the Google Maps API you need a key: https://developers.google.com/maps/documentation/javascript/get-api-key
(enable the **Maps JavaScript API**, and restrict the key to `http://localhost:4200/*`).

```sh
cd ui
cp src/app/config.example.ts src/app/config.ts   # then put your key in config.ts
npm ci
npm start      # http://localhost:4200
npm test                 # unit tests (Vitest)
npm run test:coverage    # with coverage report
```
`config.ts` is gitignored and should never be pushed!
