#!/usr/bin/env node

const data = require('./psx_games_table.json');

data.forEach(o => {
  if ( (o.releasedJAP === 'Unreleased') &&
       (o.releasedPAL === 'Unreleased')
     ) {
    console.log(o.titles);
  }
})
