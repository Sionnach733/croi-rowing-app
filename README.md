# croi-rowing-app
app to display live info of rowing 1 million metres for charity. will display current distance of each rower, as well as total. also will show map of ireland and virtual rowing progress along the river shannon. if the target is achieved, we will need to row the full length of the shannon almost 3 times!

# Running UI
to use google maps api you need to get a key here: https://developers.google.com/maps/documentation/javascript/get-api-key
then create a file ui/src/app/config.ts and add the following:

  export const config = {
    MAPS_KEY : 'YOUR_API_KEY',
  };

This file should be in your .gitignore and never pushed!

in ui/ folder
ng serve --open

