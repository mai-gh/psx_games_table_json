# PSX Games Table JSON

### converting the wikipeda list of all PSX games into JSON




https://en.wikipedia.org/wiki/List_of_PlayStation_games_(A-L)
https://en.wikipedia.org/wiki/List_of_PlayStation_games_(M-Z)

---

##### Setup:

```
$ chmod +x 0*
$ ./00_get_wiki_html_pages.sh
$ npm install
$ 01_extractJson.js

#### You can now sort this table to see region exclusives

$ ./02_printPalExclusives.js
$ ./02_printJapAndPalOnly.js
$ ./02_printJapExclusives.js
$ ./02_printUsaExclusives.js

```
