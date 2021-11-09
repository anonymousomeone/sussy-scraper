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

async function scrape(startFrom=1, endAt){
    for (var i = startFrom; i < reps + 1; i++) {
      var url = ('https://seraphoftheendmanga.com/manga/seraph-of-the-end-vampire-reign-chapter-' + i)
      console.log('[INFO] Downloading: ' + url)
      var dir = './scraped/chapter' + i
      if (!fs.existsSync(dir)) {
        console.log('[WARN] Directory doesnt exist! making new directory...')
        fs.mkdirSync(dir);
    }
      got(url, options).then(response => {
        const dom = new JSDOM(response.body);
        var document = dom.window.document;
        var img = document.getElementsByTagName('img')
        var srcs = []
        for (var z = 0; z < img.length; z++) {
          if (img[z].src.startsWith('https://cdn.hatsub.com/')) {
            srcs.push(img[z].src)
          }
        }
        console.log(srcs)
        var x = 0
        srcs.forEach(image => {
            downloadImage(image, './scraped/chapter' + i + '/image'+ x + '.jpg')
            x++;
        })
      }).catch(err => {
        console.log(err);
      });
      console.log('[INFO] ' + i + ' Chapters scraped')
      var wait = 5000 // adjust to your network speeds 
      await sleep(wait)
    }
  }

scrape(108, 108)
