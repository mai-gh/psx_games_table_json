#!/usr/bin/env node

const tabletojson = require('tabletojson').Tabletojson;
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');


const htmlA = fs.readFileSync(path.resolve(__dirname, './WIKI_A-L.html'), {encoding: 'UTF-8'});
const convertedFormatted_A = tabletojson.convert(htmlA, {forceIndexAsNumber: true});
const convertedUnformatted_A = tabletojson.convert(htmlA, {forceIndexAsNumber: true, stripHtmlFromCells: false});

const htmlM = fs.readFileSync(path.resolve(__dirname, './WIKI_M-Z.html'), {encoding: 'UTF-8'});
const convertedFormatted_M = tabletojson.convert(htmlM, {forceIndexAsNumber: true});
const convertedUnformatted_M = tabletojson.convert(htmlM, {forceIndexAsNumber: true, stripHtmlFromCells: false});

const mergedFormatted = [ ...convertedFormatted_A[1], ...convertedFormatted_M[1] ];
const mergedUnformatted = [ ...convertedUnformatted_A[1], ...convertedUnformatted_M[1] ];

newArr = [];
const regionsSeen = [];
for (let i = 0; i < mergedFormatted.length; i++) {
  const oldObjFormatted = mergedFormatted[i];
  const oldObjUnformatted = mergedUnformatted[i];
  const titlesUnformated = oldObjUnformatted["0"];

  let wikiLink = '';
  if (titlesUnformated.includes("<a href=")) {
    if (titlesUnformated.split(`<a href="`).length > 2) { 
      [wikiLink] = titlesUnformated.split(`<a href="`)
        .filter(l => !l.includes('page does not exist'))
        .filter(l => l !== '<i>')
        .filter(l => !l.includes('mw-redirect'));
    } else {
      wikiLink = titlesUnformated.split(`<a href="`)[1].split(`"`)[0];
      if (wikiLink.includes('/w/index.php?title=')) {
        wikiLink = '';
      }
    }
  } 

  let titles = {"default": []};
  let firstTitle = '';
  if (titlesUnformated.includes('•')) {
    titlesUnformated.split('•').forEach(t => {
      const $ = cheerio.load(t);
      const tmpTitle = $('i').text();
      const tmpSup = $('sup').text();

      if (firstTitle === '') {
        // save the first one just incase we have no default
        firstTitle = tmpTitle;
      }

      if (tmpSup === '') {
        titles['default'].push(tmpTitle)
      } else if (tmpSup.length > 3) {
        // one title with multiple regions ('PAL,JP')
        const splitTmpSups = tmpSup.split(',');
        for (let sup of splitTmpSups) {
          if (sup === 'AUS') {
            sup = 'AU';
          }
          if (!titles[sup]) {
            titles[sup] = [];
          }
          titles[sup].push(tmpTitle);
        }
      } else {
        if (!titles[tmpSup]) {
          titles[tmpSup] = [];
        }
        titles[tmpSup].push(tmpTitle);
      }        
    })
    if (titles['default'].length === 0) {
      titles['default'].push(firstTitle);
    }
  } else {
    titles['default'].push(oldObjFormatted["0"])
  }

  const rowObj = {
    titles,
    developers: oldObjFormatted["1"],
    publishers: oldObjFormatted["2"],
    releasedJAP: oldObjFormatted["3"],
    releasedPAL: oldObjFormatted["4"],
    releasedUSA: oldObjFormatted["5"],
    wikiLink
  };


  const regionTitleArray = oldObjUnformatted["0"].split("<sup>").filter(a => a.includes("</sup>")).map(x => x.split("</sup>")[0]);

  regionTitleArray.forEach(r => {
    if (!regionsSeen.includes(r)) {
      regionsSeen.push(r);
    }
  })


  newArr.push(rowObj)
} 

//console.log(regionsSeen.sort())
//console.dir(newArr, {depth: null, maxArrayLength: null})

fs.writeFileSync("psx_games_table.json", JSON.stringify(newArr));
