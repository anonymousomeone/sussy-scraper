const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const download = require('image-downloader')
const { JSDOM } = jsdom;

const options = { headers: { 'User-Agent': 'Mozilla/5.0' } }

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const stringIsAValidUrl = (s) => {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
};

async function downloadImage(url, filepath) {
    if (!stringIsAValidUrl(url)) {return console.log('bad url')}
    try{
    return download.image({
         url,
         dest: filepath 
      });
    } catch(err){
      console.log('something went wrong (probably nothing)')
    }
}

async function scrape(reps){
    for (var i = 1; i < reps + 1; i++) {
      var url = ('https://seraphoftheendmanga.com/manga/seraph-of-the-end-vampire-reign-chapter-' + i)
      console.log('Downloading: ' + url)
      var dir = './scraped/chapter' + i
      if (!fs.existsSync(dir)) {
        console.log('Directory doesnt exist! making new directory...')
        fs.mkdirSync(dir);
    }
      await got(url, options).then(response => {
        const dom = new JSDOM(response.body);
        var document = dom.window.document;
        var p = document.getElementsByTagName('p')
        var srcs = []
        for (var z = 0; z < p.length; z++) {
            var h = p[z].lastChild
            var src = h.src
            if (!String(src).startsWith('https://seraph')) {
                srcs.push(src)
            }
        }
        var x = 0
        srcs.forEach(image => {
            downloadImage(image, './scraped/chapter' + i + '/image' + x + '.jpg')
            x++;
        })
      }).catch(err => {
        console.log(err);
      });
      console.log('[' + i + '] Chapters scraped')
      var wait = 20000 + Math.floor(Math.random() * 2000)
      await sleep(wait)
    }
  }
  
scrape(107)