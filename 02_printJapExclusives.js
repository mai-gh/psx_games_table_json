#!/usr/bin/env node

const data = require('./psx_games_table.json');

data.forEach(o => {
  if ( (o.releasedPAL === 'Unreleased') &&
       (o.releasedUSA === 'Unreleased')
     ) {
    console.log(o.titles);
  }
})
