# Croi-rowing-app
App to display live info of rowing 1 million metres for charity. Will display current distance of each rower, as well as total. Also will show map of Ireland and virtual rowing progress along the river Shannon. If the target is achieved, we will need to row the full length of the shannon almost 3 times!

# Running UI
To use google maps api you need to get a key here: https://developers.google.com/maps/documentation/javascript/get-api-key \
Then create a file ui/src/app/config.ts and add the following:

`export const config = {`\
`    MAPS_KEY : 'YOUR_API_KEY'`\
`};`

This file should be in your .gitignore and never pushed!

in ui/ folder
ng serve --open
